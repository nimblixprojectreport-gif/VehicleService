from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Ride
from .serializers import RideFairSerializer


class RideFairAPIView(APIView):

    def post(self, request):

        source = request.data.get('source')
        destination = request.data.get('destination')
        distance = request.data.get('distance_km')

        if not source or not destination or not distance:
            return Response(
                {"error": "source, destination and distance_km are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        distance = float(distance)

        base_fare = 50
        price_per_km = 10

        fare = base_fare + (price_per_km * distance)

        ride = Ride.objects.create(
            source=source,
            destination=destination,
            distance_km=distance,
            fare_amount=fare
        )

        serializer = RideFairSerializer(ride)

        return Response(serializer.data, status=status.HTTP_201_CREATED)