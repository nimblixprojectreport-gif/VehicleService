from django.db import models
from core.models import TimeStampedModel
from bookings.models import Booking
from accounts.models import User
from django.core.validators import MinValueValidator , MaxValueValidator


class Rating(TimeStampedModel):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    partner = models.ForeignKey(User, related_name="ratings", on_delete=models.CASCADE)

    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    feedback = models.TextField(null=True, blank=True)
    
    def __str__(self):
       customer_name = self.customer.full_name or self.customer.mobile
       partner_name = self.partner.full_name or self.partner.mobile
       return f"{customer_name} rated {partner_name} ({self.rating} stars)"