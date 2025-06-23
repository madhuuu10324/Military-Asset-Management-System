from rest_framework import serializers
from .models import EquipmentType, AssetInventory, PurchaseRecord
from users.models import Base

class BaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Base
        fields = '__all__'

class EquipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentType
        fields = '__all__'

class PurchaseRecordSerializer(serializers.ModelSerializer):
    # We can add nested serializers for better frontend display
    equipment_type = EquipmentTypeSerializer(read_only=True)
    equipment_type_id = serializers.PrimaryKeyRelatedField(
        queryset=EquipmentType.objects.all(), source='equipment_type', write_only=True
    )
    base = BaseSerializer(read_only=True)
    base_id = serializers.PrimaryKeyRelatedField(
        queryset=Base.objects.all(), source='base', write_only=True
    )
    
    class Meta:
        model = PurchaseRecord
        fields = ['id', 'equipment_type', 'equipment_type_id', 'base', 'base_id', 'quantity', 'purchase_date', 'vendor']