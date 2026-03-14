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
    
class Driver(TimeStampedModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="drivers"
    )    
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    license_number = models.CharField(max_length=50, unique=True)

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="drivers"
    )    

    def __str__(self):
        return self.name
    
class RideRequest(TimeStampedModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="ride_requests"
    ) 

    driver = models.ForeignKey(
        Driver,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="rides"
    )

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="rides"
    )

    pickup_location = models.CharField(max_length=255)
    drop_location = models.CharField(max_length=255)

    status = models.CharField(
        max_length=50,
        default="requested"
    )
    
    def __str__(self):
        return f"{self.pickup_location} -> {self.drop_location}"