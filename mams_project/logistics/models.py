from django.db import models
from django.conf import settings
from users.models import Base
from assets.models import EquipmentType

class TransferRecord(models.Model):
    """Logs the transfer of assets between two bases."""
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    from_base = models.ForeignKey(Base, related_name='transfers_out', on_delete=models.PROTECT)
    to_base = models.ForeignKey(Base, related_name='transfers_in', on_delete=models.PROTECT)
    transfer_date = models.DateTimeField(auto_now_add=True)
    initiated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    class Status(models.TextChoices):
        COMPLETED = 'COMPLETED', 'Completed'
        IN_TRANSIT = 'IN_TRANSIT', 'In Transit'
        PENDING = 'PENDING', 'Pending'
        
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.COMPLETED)

    def __str__(self):
        return f"Transferred {self.quantity} of {self.equipment_type.name} from {self.from_base} to {self.to_base}"


class AssignmentRecord(models.Model):
    """Logs assets assigned to personnel."""
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.PROTECT)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='assignments', on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    assignment_date = models.DateTimeField(auto_now_add=True)
    issuing_base = models.ForeignKey(Base, on_delete=models.PROTECT)

class ExpenditureRecord(models.Model):
    """Logs the consumption/expenditure of assets (e.g., ammunition)."""
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.PROTECT)
    base = models.ForeignKey(Base, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    expenditure_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, help_text="Reason for expenditure, e.g., 'Training Exercise Alpha'")