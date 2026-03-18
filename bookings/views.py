from django.shortcuts import render
def get_queryset(self):
    user = self.request.user

    queryset = Booking.objects.select_related(
        "vehicle",
        "service",
        "partner"
    )

    if user.role == "CUSTOMER":
        queryset = queryset.filter(customer=user)
    elif user.role == "PARTNER":
        queryset = queryset.filter(partner=user)
    else:
        queryset = Booking.objects.none()

    status_param = self.request.query_params.get("status")
    if status_param:
        queryset = queryset.filter(status=status_param)

    return queryset

        
status_param = self.request.query_params.get("status")
if status_param:
queryset = queryset.filter(status=status_param)
