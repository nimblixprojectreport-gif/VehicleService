from django.urls import path
from .views import vehicle_list, add_vehicle, delete_vehicle, driver_list, add_driver, delete_driver, update_driver

urlpatterns = [
    path('', vehicle_list,
name='vehicle_list'),
    path('add/', add_vehicle,
name='add_vehicle'),
    path('delete/<int:vehicle_id>/',
delete_vehicle, name='delete_vehicle'),

    path('drivers/', driver_list, 
name='driver_list'),
    path('drivers/add/', add_driver,
name='add_driver'),
    path('drivers/delete/<int:driver_id>/',
delete_driver, name='delete_driver'),   
    path('drivers/update/<int:driver_id>/',
update_driver, name='update_driver'),      
]