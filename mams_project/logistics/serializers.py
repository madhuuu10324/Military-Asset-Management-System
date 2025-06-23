from rest_framework import serializers
from .models import TransferRecord, AssignmentRecord, ExpenditureRecord
from assets.models import EquipmentType
from assets.serializers import EquipmentTypeSerializer, BaseSerializer
from users.models import User
from users.models import Base

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'role']

class TransferRecordSerializer(serializers.ModelSerializer):
    equipment_type = EquipmentTypeSerializer(read_only=True)
    equipment_type_id = serializers.PrimaryKeyRelatedField(
        queryset=EquipmentType.objects.all(), source='equipment_type', write_only=True
    )
    from_base = BaseSerializer(read_only=True)
    from_base_id = serializers.PrimaryKeyRelatedField(
        queryset=Base.objects.all(), source='from_base', write_only=True
    )
    to_base = BaseSerializer(read_only=True)
    to_base_id = serializers.PrimaryKeyRelatedField(
        queryset=Base.objects.all(), source='to_base', write_only=True
    )
    initiated_by = UserSerializer(read_only=True)
    
    class Meta:
        model = TransferRecord
        fields = [
            'id', 'equipment_type', 'equipment_type_id', 'quantity', 
            'from_base', 'from_base_id', 'to_base', 'to_base_id', 
            'transfer_date', 'initiated_by', 'status'
        ]

class AssignmentRecordSerializer(serializers.ModelSerializer):
    equipment_type = EquipmentTypeSerializer(read_only=True)
    equipment_type_id = serializers.PrimaryKeyRelatedField(
        queryset=EquipmentType.objects.all(), source='equipment_type', write_only=True
    )
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='assigned_to', write_only=True
    )
    issuing_base = BaseSerializer(read_only=True)
    issuing_base_id = serializers.PrimaryKeyRelatedField(
        queryset=Base.objects.all(), source='issuing_base', write_only=True
    )
    
    class Meta:
        model = AssignmentRecord
        fields = [
            'id', 'equipment_type', 'equipment_type_id', 'assigned_to', 
            'assigned_to_id', 'quantity', 'assignment_date', 'issuing_base', 'issuing_base_id'
        ]

class ExpenditureRecordSerializer(serializers.ModelSerializer):
    equipment_type = EquipmentTypeSerializer(read_only=True)
    equipment_type_id = serializers.PrimaryKeyRelatedField(
        queryset=EquipmentType.objects.all(), source='equipment_type', write_only=True
    )
    base = BaseSerializer(read_only=True)
    base_id = serializers.PrimaryKeyRelatedField(
        queryset=Base.objects.all(), source='base', write_only=True
    )
    
    class Meta:
        model = ExpenditureRecord
        fields = [
            'id', 'equipment_type', 'equipment_type_id', 'base', 'base_id', 
            'quantity', 'expenditure_date', 'notes'
        ]