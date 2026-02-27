from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        booking = self.get_object()
        new_status = request.data.get("status")
        note = request.data.get("note", "")

        if new_status not in dict(Booking.STATUS_CHOICES):
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = new_status
        booking.save()

        BookingTimeline.objects.create(
            booking=booking,
            status=new_status,
            note=note
        )

        return Response({"message": "Status updated successfully"})


    @action(detail=True, methods=["get"])
    def timeline(self, request, pk=None):
        booking = self.get_object()
        timelines = BookingTimeline.objects.filter(booking=booking)

        data = [
            {
                "status": t.status,
                "note": t.note,
                "created_at": t.created_at
            }
            for t in timelines
        ]

        return Response(data)
