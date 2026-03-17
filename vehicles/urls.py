from django.urls import path
from .views import VehicleListCreateView

urlpatterns = [
    path('', VehicleListCreateView.as_view(), name='vehicle-list'),
]