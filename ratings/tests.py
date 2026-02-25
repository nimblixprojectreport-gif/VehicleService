from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone

from services.models import Service
from bookings.models import Booking
from ratings.models import Rating

User = get_user_model()


class RatingModelTest(TestCase):

    def setUp(self):
        self.customer = User.objects.create(
            full_name="Customer One",
            mobile="9999999991",
            role="CUSTOMER"
        )

        
        self.partner = User.objects.create(
            full_name="Partner One",
            mobile="9999999992",
            role="PARTNER"
        )


        self.service = Service.objects.create(
            name="Oil Change",
            price=500
        )

    
        self.booking = Booking.objects.create(
            customer=self.customer,
            partner=self.partner,
            service=self.service,   # 🔥 REQUIRED
            scheduled_date=timezone.now().date(),
            scheduled_time=timezone.now().time(),
            service_latitude=12.9716,
            service_longitude=77.5946,
            total_amount=500.00
        )

    def test_create_rating(self):

        rating = Rating.objects.create(
            booking=self.booking,
            customer=self.customer,
            partner=self.partner,
            rating=5,
            review="Excellent service"
        )

        self.assertEqual(rating.rating, 5)
        self.assertEqual(rating.review, "Excellent service")
        self.assertEqual(rating.booking, self.booking)
        self.assertEqual(rating.customer, self.customer)
        self.assertEqual(rating.partner, self.partner)