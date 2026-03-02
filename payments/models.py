from django.db import models
from core.models import TimeStampedModel
from bookings.models import Booking
from accounts.models import User


class Payment(TimeStampedModel):
    PAYMENT_STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
        ("REFUNDED", "Refunded"),
    )
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE,related_name="payments")
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments", null=True , blank=True)
    transaction_id = models.CharField(max_length=150, unique=True)
    payment_status = models.CharField(max_length=50 ,choices=PAYMENT_STATUS_CHOICES , default='PENDING')
    gateway_response = models.TextField(blank=True , null= True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.transaction_id} - {self.payment_status}"
    


class Commission(TimeStampedModel):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE , related_name="commission")
    platform_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    platform_amount = models.DecimalField(max_digits=10, decimal_places=2)
    partner_payout = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"Commission for {self.booking.booking_reference}"