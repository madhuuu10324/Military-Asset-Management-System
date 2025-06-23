from django.contrib.auth.models import AbstractUser
from django.db import models

class Base(models.Model):
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        BASE_COMMANDER = 'BASE_COMMANDER', 'Base Commander'
        LOGISTICS_OFFICER = 'LOGISTICS_OFFICER', 'Logistics Officer'

    role = models.CharField(max_length=50, choices=Role.choices, default=Role.LOGISTICS_OFFICER)
    base = models.ForeignKey(Base, on_delete=models.SET_NULL, null=True, blank=True, related_name='personnel')

    def __str__(self):
        return self.username