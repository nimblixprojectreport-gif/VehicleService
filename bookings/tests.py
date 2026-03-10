from django.test import TestCase

    def test_role_based_access(self):
        partner = User.objects.create_user(
            email="partner@test.com",
            password="password",
            role="PARTNER"
        )

        booking = Booking.objects.create(
            booking_reference="BK777",
            customer=self.customer,
            partner=partner,
            vehicle=self.vehicle,
            service=self.service,
            scheduled_date="2026-03-01",
            scheduled_time="10:00:00",
            service_latitude="23.259933",
            service_longitude="77.412613",
            status="PENDING",
            total_amount="1200.00"
        )

        self.client.force_authenticate(user=partner)
        url = reverse("booking-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_booking_list_requires_authentication(self):
    self.client.logout()
    url = reverse("booking-list")
    response = self.client.get(url)

    self.assertEqual(response.status_code, 401)
