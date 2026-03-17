from django.contrib import admin
from .models import Driver, Ride


class DriverAdmin(admin.ModelAdmin):

    list_display = ('id','name','phone','vehicle_type','is_available')
    list_filter = ('vehicle_type','is_available')
    search_fields = ('name','phone')


class RideAdmin(admin.ModelAdmin):

    list_display = ('id','user_name','pickup_location','drop_location','vehicle_type','driver','status','created_at')
    list_filter = ('vehicle_type','status')
    search_fields = ('user_name','pickup_location','drop_location')


admin.site.register(Driver, DriverAdmin)
admin.site.register(Ride, RideAdmin)