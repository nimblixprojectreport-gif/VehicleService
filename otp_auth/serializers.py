from rest_framework import serializers


class SendOTPSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=15)


class VerifyOTPSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6, min_length=4)
    role = serializers.CharField(required=False, allow_blank=False)
    device_token = serializers.CharField(required=False, allow_blank=False, max_length=255)
    device_id = serializers.CharField(required=False, allow_blank=True, max_length=128)
    platform = serializers.CharField(required=False, allow_blank=True, max_length=32)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
