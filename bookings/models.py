from django.db import models
from core.models import TimeStampedModel
from accounts.models import User
from vehicles.models import Vehicle
from services.models import ServiceCategory


class Booking(TimeStampedModel):

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("ASSIGNED", "Assigned"),
        ("ACCEPTED", "Accepted"),
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
        ("FAILED", "Failed"),
    )

    booking_reference = models.CharField(max_length=30, unique=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    partner = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT)
    service = models.ForeignKey(ServiceCategory, on_delete=models.PROTECT)

    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()

    service_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    service_longitude = models.DecimalField(max_digits=9, decimal_places=6)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, db_index=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
       return f"{self.booking_reference} - {self.customer} - {self.service}"


class BookingTimeline(TimeStampedModel):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)
    note = models.TextField(null=True, blank=True)