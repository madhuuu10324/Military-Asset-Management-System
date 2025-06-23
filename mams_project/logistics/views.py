from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import transaction
from .models import TransferRecord, AssignmentRecord, ExpenditureRecord
from .serializers import TransferRecordSerializer, AssignmentRecordSerializer, ExpenditureRecordSerializer
from assets.models import AssetInventory

class TransferRecordViewSet(viewsets.ModelViewSet):
    queryset = TransferRecord.objects.all().order_by('-transfer_date')
    serializer_class = TransferRecordSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from_base = serializer.validated_data['from_base']
        to_base = serializer.validated_data['to_base']
        equipment_type = serializer.validated_data['equipment_type']
        quantity = serializer.validated_data['quantity']
        
        with transaction.atomic():
            # 1. Check if source base has enough assets
            source_inventory = AssetInventory.objects.get(base=from_base, equipment_type=equipment_type)
            if source_inventory.quantity < quantity:
                return Response(
                    {"error": "Insufficient assets at source base."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 2. Decrement from source
            source_inventory.quantity -= quantity
            source_inventory.save()
            
            # 3. Increment at destination
            dest_inventory, created = AssetInventory.objects.get_or_create(
                base=to_base, equipment_type=equipment_type
            )
            dest_inventory.quantity += quantity
            dest_inventory.save()
            
            # 4. Save the transfer record
            serializer.save(initiated_by=request.user)
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AssignmentRecordViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Assignment Records to be viewed or edited.
    """
    queryset = AssignmentRecord.objects.all().order_by('-assignment_date')
    serializer_class = AssignmentRecordSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        issuing_base = serializer.validated_data['issuing_base']
        equipment_type = serializer.validated_data['equipment_type']
        quantity = serializer.validated_data['quantity']
        
        with transaction.atomic():
            # Check if base has enough assets to assign
            inventory = AssetInventory.objects.get(base=issuing_base, equipment_type=equipment_type)
            if inventory.quantity < quantity:
                return Response(
                    {"error": "Insufficient assets at issuing base for assignment."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Decrement from inventory
            inventory.quantity -= quantity
            inventory.save()
            
            # Save the assignment record
            serializer.save()
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ExpenditureRecordViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Expenditure Records to be viewed or edited.
    """
    queryset = ExpenditureRecord.objects.all().order_by('-expenditure_date')
    serializer_class = ExpenditureRecordSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        base = serializer.validated_data['base']
        equipment_type = serializer.validated_data['equipment_type']
        quantity = serializer.validated_data['quantity']
        
        with transaction.atomic():
            # Check if base has enough assets to expend
            inventory = AssetInventory.objects.get(base=base, equipment_type=equipment_type)
            if inventory.quantity < quantity:
                return Response(
                    {"error": "Insufficient assets at base for expenditure."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Decrement from inventory
            inventory.quantity -= quantity
            inventory.save()
            
            # Save the expenditure record
            serializer.save()
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)

