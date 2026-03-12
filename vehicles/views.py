from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Vehicle, Driver
import json

def vehicle_list(request):
    vehicles = Vehicle.objects.all().values()
    return JsonResponse({"data":
list(vehicles)})

@csrf_exempt
def add_vehicle(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            vehicle = Vehicle.objects.create(
                brand=data.get("brand"),
                model=data.get("model"),

registration_number=data.get("registration_number"),
fuel_type=data.get("fuel_type"),
                user_id=data.get("user_id")
            )

            return JsonResponse({"message": "Vehicle added successfully"})
        except Exception as e:
            return JsonResponse({"error": str(e)})
        
    return JsonResponse({"error": "Only POST method allowed"})    
                            
@csrf_exempt
def delete_vehicle(request, vehicle_id):
    if request.method == "DELETE":
        try:
            vehicle = Vehicle.objects.get(id=vehicle_id)
            vehicle.delete()
            return JsonResponse({"message": "Vehicle deleted successfully"})
        except Vehicle.DoesNotExist:
            return JsonResponse({"error": "Vehicle not found"})  
        
def driver_list(requet):
    drivers = Driver.objects.all().values()
    return JsonResponse({"data":
list(drivers)})
        
@csrf_exempt
def add_driver(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            driver = Driver.objects.create(
                name=data.get("name"),
                phone=data.get("phone"),
                license_number=data.get("license_number"),
                user_id=data.get("user_id"),
                vehicle_id=data.get("vehicle_id")
            )

            return JsonResponse({"message":
"Driver added successfully"})
        except Exception as e:
            return JsonResponse({"error":
str(e)})
        
    return JsonResponse({"error": "Only POST method allowed"})

@csrf_exempt
def delete_driver(request, driver_id):
    if request.method == "DELETE":
        try:
            driver = Driver.objects.get(id=driver_id)
            driver.delete()
            return JsonResponse({"message": "Driver deleted successfully"})
        except Driver.DoesNotExist:
            return JsonResponse({"error": "Driver not found"}) 
        
@csrf_exempt
def update_driver(request, driver_id):
    if request.method == "PUT":
        try:
            driver = Driver.objects.get(id=driver_id)
            data = json.loads(request.body)
            driver.name = data.get("name")
            driver.phone = data.get("phone")
            driver.license_number = data.get("license_number")
            driver.vehicle_id = data.get("vehicle_id")
            driver.save()

            return JsonResponse({"message": "Driver updated successfully"})
        except Driver.DoesNotExist:
                return JsonResponse({"error": "Driver not found"})
                