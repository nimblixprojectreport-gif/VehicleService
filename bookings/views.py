from django.shortcuts import render

    def get_queryset(self):
        user = self.request.user

        queryset = Booking.objects.select_related(
            "vehicle",
            "service",
            "partner"
        )

        if user.role == "CUSTOMER":
            return queryset.filter(customer=user)

        if user.role == "PARTNER":
            return queryset.filter(partner=user)

        return Booking.objects.none()
