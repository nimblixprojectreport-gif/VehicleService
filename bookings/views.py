from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.utils.crypto import get_random_string
from .models import Booking, BookingTimeline
from .serializers import BookingSerializer, BookingCreateSerializer


class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Customer can only view their own bookings
        return Booking.objects.filter(customer=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return BookingCreateSerializer
        return BookingSerializer

    def perform_create(self, serializer):
        booking = serializer.save(
            customer=self.request.user,
            booking_reference="BK" + get_random_string(8).upper(),
            status="PENDING"
        )

        BookingTimeline.objects.create(
            booking=booking,
            status="PENDING",
            note="Booking created"
        )
