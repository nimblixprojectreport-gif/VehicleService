from rest_framework import serializers
from .models import Rating
from accounts.models import User

class RatingSerializer(serializers.ModelSerializer):
    customer_mobile = serializers.CharField(write_only=True)
    partner_mobile = serializers.CharField(write_only=True)
    customer_mobile_display = serializers.CharField(source='customer.mobile', read_only=True)
    partner_mobile_display = serializers.CharField(source='partner.mobile', read_only=True)
    
    class Meta:
        model = Rating
        fields = [
            'id', 
            'rating', 
            'feedback', 
            'customer', 
            'partner',
            'customer_mobile',      
            'partner_mobile',      
            'customer_mobile_display', 
            'partner_mobile_display'    
        ]
        read_only_fields = ['customer', 'partner']
    
    def create(self, validated_data):
        customer_mobile = validated_data.pop('customer_mobile')
        partner_mobile = validated_data.pop('partner_mobile')
        
        try:
            customer = User.objects.get(mobile=customer_mobile)
            partner = User.objects.get(mobile=partner_mobile)
        except User.DoesNotExist as e:

            if 'customer' in str(e).lower():
                raise serializers.ValidationError({
                    "customer_mobile": f"User with mobile {customer_mobile} not found"
                })
            else:
                raise serializers.ValidationError({
                    "partner_mobile": f"User with mobile {partner_mobile} not found"
                })
        
        rating = Rating.objects.create(
            customer=customer,
            partner=partner,
            **validated_data
        )
        return rating
    
    def to_representation(self, instance):
        """Customize the output representation"""
        representation = super().to_representation(instance)
        representation.pop('customer_mobile', None)
        representation.pop('partner_mobile', None)
        return representation