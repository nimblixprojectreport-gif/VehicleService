from django.urls import path
from .views import vehicle_list, add_vehicle, delete_vehicle

urlpatterns = [
    path('', vehicle_list,
name='vehicle_list'),
    path('add/', add_vehicle,
name='add_vehicle'),
    path('delete/<int:vehicle_id>/',
delete_vehicle, name='delete_vehicle'),
]