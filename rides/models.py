from django.db import models


class Driver(models.Model):

    VEHICLE_TYPE = (
        ('2W', 'Two Wheeler'),
        ('4W', 'Four Wheeler'),
    )

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    vehicle_type = models.CharField(max_length=2, choices=VEHICLE_TYPE)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Ride(models.Model):

    VEHICLE_TYPE = (
        ('2W', 'Two Wheeler'),
        ('4W', 'Four Wheeler'),
    )

    user_name = models.CharField(max_length=100)

    pickup_location = models.CharField(max_length=200)
    drop_location = models.CharField(max_length=200)

    vehicle_type = models.CharField(max_length=2, choices=VEHICLE_TYPE)

    driver = models.ForeignKey(
        Driver,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        default='BOOKED'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_name