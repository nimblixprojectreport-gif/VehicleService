from django.urls import path
from .views import nearby_drivers, create_ride, accept_ride

urlpatterns = [
    path('nearby-drivers/', nearby_drivers),
    path('create-ride/', create_ride),
    path('accept-ride/<int:ride_id>/', accept_ride),
]