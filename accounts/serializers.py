from rest_framework import serializers
from .models import User, Role


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'mobile', 'email', 'role', 'is_active', 'is_verified', 'created_at', 'updated_at']
        read_only_fields = ['id', 'mobile', 'is_active', 'is_verified', 'created_at', 'updated_at']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'email']


class LoginSerializer(serializers.Serializer):
    mobile = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        mobile = attrs.get('mobile')
        password = attrs.get('password')

        if not User.objects.filter(mobile=mobile).exists():
            raise serializers.ValidationError('User not found.')

        user = User.objects.get(mobile=mobile)
        if not user.check_password(password):
            raise serializers.ValidationError('Invalid password.')

        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')

        attrs['user'] = user
        return attrs
