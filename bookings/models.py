from django.db import models
from core.models import TimeStampedModel
from accounts.models import User
from vehicles.models import Vehicle
from services.models import ServiceCategory


class Booking(TimeStampedModel):

    STATUS = (
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    service = models.ForeignKey(
        ServiceCategory,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    booking_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default="PENDING"
    )

    def __str__(self):
        return f"{self.vehicle} - {self.service}"


class BookingTimeline(TimeStampedModel):

    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="timeline"
    )

    status = models.CharField(max_length=20)

    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.booking} - {self.status}"