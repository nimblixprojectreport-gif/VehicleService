from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Driver, Ride
from .serializers import DriverSerializer, RideSerializer
from .utils import calculate_distance
from .serializers import RideSerializer
from .models import Driver
from .models import Ride
from .utils import get_nearby_drivers



@api_view(['GET'])
def nearby_drivers(request):

    user_lat = float(request.GET.get('latitude'))
    user_lon = float(request.GET.get('longitude'))

    drivers = Driver.objects.filter(is_available=True)

    nearby = []

    for driver in drivers:

        distance = calculate_distance(
            user_lat, user_lon,
            driver.latitude, driver.longitude
        )

        if distance <= 5:
            nearby.append(driver)

    serializer = DriverSerializer(nearby, many=True)

    return Response(serializer.data)
@api_view(['POST'])
def create_ride(request):

    serializer = RideSerializer(data=request.data)

    if serializer.is_valid():

        ride = serializer.save()

        user_lat = float(request.data.get("pickup_lat"))
        user_lon = float(request.data.get("pickup_lon"))

        drivers = Driver.objects.all()

        nearby_drivers = get_nearby_drivers(user_lat, user_lon, drivers)

        driver_list = [
            {"id": d.id, "name": d.name}
            for d in nearby_drivers
        ]

        return Response({
            "ride_id": ride.id,
            "nearby_drivers": driver_list
        })

    return Response(serializer.errors, status=400)
@api_view(['POST'])
def accept_ride(request, ride_id):

    driver_id = request.data.get("driver_id")

    try:
        ride = Ride.objects.get(id=ride_id)
    except Ride.DoesNotExist:
        return Response({"error": "Ride not found"}, status=404)

    try:
        driver = Driver.objects.get(id=driver_id)
    except Driver.DoesNotExist:
        return Response({"error": "Driver not found"}, status=404)

    ride.driver = driver
    ride.status = "accepted"
    ride.save()

    driver.is_available = False
    driver.save()

    return Response({
        "message": "Ride accepted",
        "ride_id": ride.id,
        "driver_id": driver.id
    })