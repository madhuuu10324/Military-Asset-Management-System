from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import AssetInventory, PurchaseRecord, EquipmentType
from .serializers import PurchaseRecordSerializer, EquipmentTypeSerializer
from logistics.models import TransferRecord, ExpenditureRecord
from rest_framework.permissions import IsAuthenticated
from django.utils.dateparse import parse_date
from django.db import transaction
from rest_framework.views import APIView
from django.db.models import Sum, Q


class PurchaseRecordViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRecord.objects.all().order_by('-purchase_date')
    serializer_class = PurchaseRecordSerializer
    # permission_classes = [IsAuthenticated, IsAdminOrLogisticsOfficer] # We'll add permissions later

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Use a database transaction to ensure atomicity
        with transaction.atomic():
            # Save the purchase record
            purchase = serializer.save()
            
            # Update the AssetInventory
            inventory, created = AssetInventory.objects.get_or_create(
                base=purchase.base,
                equipment_type=purchase.equipment_type
            )
            inventory.quantity += purchase.quantity
            inventory.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class EquipmentTypeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Equipment Types to be viewed or edited.
    """
    queryset = EquipmentType.objects.all().order_by('name')
    serializer_class = EquipmentTypeSerializer
    # permission_classes = [IsAuthenticated] # Add permissions later if needed

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # --- 1. Get and Parse Filters ---
            base_id = request.query_params.get('base')
            equipment_type_id = request.query_params.get('equipment_type')
            start_date_str = request.query_params.get('start_date', '')
            end_date_str = request.query_params.get('end_date', '')
            
            # Parse dates safely
            start_date = parse_date(start_date_str) if start_date_str else None
            end_date = parse_date(end_date_str) if end_date_str else None

            # --- 2. Apply Role-Based Access Control (RBAC) Filters ---
            user = request.user
            base_filter = Q()
            
            if user.role == 'BASE_COMMANDER':
                if not hasattr(user, 'base') or not user.base:
                    return Response({"error": "User is not assigned to a base."}, status=400)
                # Force filter to the commander's base
                base_filter = Q(base_id=user.base.id)
            elif base_id:
                # Admin can filter by any base
                base_filter = Q(base_id=base_id)

            equipment_filter = Q()
            if equipment_type_id:
                equipment_filter = Q(equipment_type_id=equipment_type_id)

            # --- 3. Calculate Closing Balance (Current State) ---
            closing_balance = AssetInventory.objects.filter(
                base_filter & equipment_filter
            ).aggregate(total=Sum('quantity'))['total'] or 0

            # --- 4. Calculate Movements within the Date Range ---
            # Purchases
            purchases_query = PurchaseRecord.objects.filter(base_filter & equipment_filter)
            if start_date:
                purchases_query = purchases_query.filter(purchase_date__gte=start_date)
            if end_date:
                purchases_query = purchases_query.filter(purchase_date__lte=end_date)
            purchases = purchases_query.aggregate(total=Sum('quantity'))['total'] or 0
            
            # Transfers In
            transfers_in_query = TransferRecord.objects.filter(equipment_filter)
            if base_id:
                transfers_in_query = transfers_in_query.filter(to_base_id=base_id)
            elif user.role == 'BASE_COMMANDER' and hasattr(user, 'base') and user.base:
                transfers_in_query = transfers_in_query.filter(to_base_id=user.base.id)
            else:
                # For admin with no base filter, get all transfers in
                transfers_in_query = transfers_in_query.all()
                
            if start_date:
                transfers_in_query = transfers_in_query.filter(transfer_date__gte=start_date)
            if end_date:
                transfers_in_query = transfers_in_query.filter(transfer_date__lte=end_date)
            transfers_in = transfers_in_query.aggregate(total=Sum('quantity'))['total'] or 0
            
            # Transfers Out
            transfers_out_query = TransferRecord.objects.filter(equipment_filter)
            if base_id:
                transfers_out_query = transfers_out_query.filter(from_base_id=base_id)
            elif user.role == 'BASE_COMMANDER' and hasattr(user, 'base') and user.base:
                transfers_out_query = transfers_out_query.filter(from_base_id=user.base.id)
            else:
                # For admin with no base filter, get all transfers out
                transfers_out_query = transfers_out_query.all()
                
            if start_date:
                transfers_out_query = transfers_out_query.filter(transfer_date__gte=start_date)
            if end_date:
                transfers_out_query = transfers_out_query.filter(transfer_date__lte=end_date)
            transfers_out = transfers_out_query.aggregate(total=Sum('quantity'))['total'] or 0
            
            # Expenditures
            expenditures_query = ExpenditureRecord.objects.filter(base_filter & equipment_filter)
            if start_date:
                expenditures_query = expenditures_query.filter(expenditure_date__gte=start_date)
            if end_date:
                expenditures_query = expenditures_query.filter(expenditure_date__lte=end_date)
            expended = expenditures_query.aggregate(total=Sum('quantity'))['total'] or 0

            # --- 5. Calculate Net Movement and Opening Balance ---
            # Net Movement = All inflows minus all outflows within the period
            net_movement = (purchases + transfers_in) - (transfers_out + expended)
            
            # Opening Balance = Closing Balance - Net Movement
            opening_balance = closing_balance - net_movement

            # --- 6. Assemble the Response ---
            filters_applied = {
                "base": int(base_id) if base_id else (user.base.id if user.role == 'BASE_COMMANDER' and hasattr(user, 'base') and user.base else 'all'),
                "equipment_type": int(equipment_type_id) if equipment_type_id else 'all',
                "start_date": start_date.isoformat() if start_date else None,
                "end_date": end_date.isoformat() if end_date else None,
            }
            
            data = {
                "filters_applied": filters_applied,
                "opening_balance": opening_balance,
                "closing_balance": closing_balance,
                "assigned": 0, # Placeholder - requires AssignmentRecord query
                "expended": expended,
                "net_movement": {
                    "total": net_movement,
                    "details": {
                        "purchases": purchases,
                        "transfers_in": transfers_in,
                        "transfers_out": transfers_out,
                    }
                }
            }
            return Response(data)
            
        except Exception as e:
            # Log the error for debugging
            import traceback
            print(f"Dashboard Summary Error: {e}")
            print(traceback.format_exc())
            return Response(
                {"error": "An error occurred while calculating the dashboard summary."}, 
                status=500
            )