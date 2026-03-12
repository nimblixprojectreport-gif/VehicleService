from rest_framework import serializers
from .models import Ride

class RideFairSerializer(serializers.ModelSerializer):
    class Meta:
        model=Ride
        fields='__all__'