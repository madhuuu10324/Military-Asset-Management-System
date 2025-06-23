from django.db import models
from users.models import Base

class EquipmentType(models.Model):
    name = models.CharField(max_length=100) # e.g., "M4 Rifle", "5.56mm Rounds", "Humvee"
    category = models.CharField(max_length=50) # e.g., "Weapon", "Ammunition", "Vehicle"
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.category})"

class AssetInventory(models.Model):
    """Tracks the quantity of a specific equipment type at a base."""
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE)
    base = models.ForeignKey(Base, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('equipment_type', 'base') # Ensure one entry per equipment per base
        verbose_name_plural = "Asset Inventories"

    def __str__(self):
        return f"{self.quantity} x {self.equipment_type.name} at {self.base.name}"

class PurchaseRecord(models.Model):
    """Logs the procurement of new assets for a specific base."""
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.PROTECT)
    base = models.ForeignKey(Base, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    purchase_date = models.DateTimeField(auto_now_add=True)
    vendor = models.CharField(max_length=100, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Purchased {self.quantity} of {self.equipment_type.name} for {self.base.name}"