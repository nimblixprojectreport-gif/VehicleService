from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from accounts.models import User
from vehicles.models import Vehicle
from services.models import ServiceCategory
from .models import Booking


class BookingAPITest(APITestCase):

    def setUp(self):
        self.customer = User.objects.create_user(
            email="customer@test.com",
            password="password",
            role="CUSTOMER"
        )

        self.vehicle = Vehicle.objects.create(
            owner=self.customer,
            vehicle_number="CG10AB1234"
        )

        self.service = ServiceCategory.objects.create(
            name="General Service"
        )

        self.client.force_authenticate(user=self.customer)

    def test_create_booking(self):
        url = reverse("booking-list")

        data = {
            "vehicle": self.vehicle.id,
            "service": self.service.id,
            "scheduled_date": "2026-03-01",
            "scheduled_time": "10:00:00",
            "service_latitude": "23.259933",
            "service_longitude": "77.412613",
            "total_amount": "1200.00"
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)

    def test_list_bookings(self):
        Booking.objects.create(
            booking_reference="BK123",
            customer=self.customer,
            vehicle=self.vehicle,
            service=self.service,
            scheduled_date="2026-03-01",
            scheduled_time="10:00:00",
            service_latitude="23.259933",
            service_longitude="77.412613",
            status="PENDING",
            total_amount="1200.00"
        )

        url = reverse("booking-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
