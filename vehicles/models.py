from django.db import models
from core.models import TimeStampedModel
from accounts.models import User


class Vehicle(TimeStampedModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="vehicles"
    )
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    registration_number = models.CharField(
        max_length=20,
        unique=True,
        db_index=True
    )
    fuel_type = models.CharField(max_length=50)

    def __str__(self):
        return self.registration_number
    
class Meta:
    ordering = ["-created_at"]    
    