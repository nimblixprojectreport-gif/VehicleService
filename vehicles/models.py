from django.db import models
from accounts.models import User
from core.models import TimeStampedModel


class Vehicle(TimeStampedModel):

    FUEL_TYPE = (
        ("PETROL", "Petrol"),
        ("DIESEL", "Diesel"),
        ("ELECTRIC", "Electric"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="vehicles"
    )

    brand = models.CharField(max_length=100)

    model = models.CharField(max_length=100)

    registration_number = models.CharField(
        max_length=20,
        unique=True
    )

    fuel_type = models.CharField(
        max_length=20,
        choices=FUEL_TYPE
    )

    def __str__(self):
        return self.registration_number