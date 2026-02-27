from django.test import TestCase
    


   def test_update_status(self):
        booking = Booking.objects.create(
            booking_reference="BK999",
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

        url = reverse("booking-update-status", args=[booking.id])

        response = self.client.patch(url, {
            "status": "COMPLETED",
            "note": "Service completed"
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, "COMPLETED")

    def test_view_timeline(self):
        booking = Booking.objects.create(
            booking_reference="BK888",
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

        url = reverse("booking-timeline", args=[booking.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
