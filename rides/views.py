from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Ride, Driver
from .serializers import RideSerializer


class BookRide(APIView):

    def post(self, request):

        vehicle_type = request.data.get("vehicle_type")

        driver = Driver.objects.filter(
            vehicle_type=vehicle_type,
            is_available=True
        ).first()

        if not driver:
            return Response({
                "message": "No Driver Available"
            })

        data = request.data
        data["driver"] = driver.id

        serializer = RideSerializer(data=data)

        if serializer.is_valid():
            serializer.save()

            driver.is_available = False
            driver.save()

            return Response({
                "message": "Ride Booked Successfully",
                "ride": serializer.data
            })

        return Response(serializer.errors)
    
