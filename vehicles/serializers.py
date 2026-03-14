from rest_framework import serializers
from .models import Vehicle, Driver, RideRequest

class VehicleSerializer(serializers.ModelSerializer):
        class Meta:
                model = Vehicle
                fields = "__all__"

class DriverSerializer(serializers.ModelSerializer):
        class Meta:
                model = Driver
                fields = "__all__"

class RideRequestSerializer(serializers.ModelSerializer):
        class Meta:
                model = RideRequest
                fields = "__all__"               


