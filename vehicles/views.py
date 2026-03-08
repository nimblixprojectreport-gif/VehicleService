from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Vehicle
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