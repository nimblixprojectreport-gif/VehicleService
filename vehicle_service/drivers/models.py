from django.db import models
from django.contrib.auth.models import User


class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username


class Ride(models.Model):

    STATUS = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('completed', 'Completed')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    driver = models.ForeignKey(
        Driver,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    pickup_lat = models.FloatField()
    pickup_lon = models.FloatField()

    destination = models.CharField(max_length=255)

    status = models.CharField(max_length=20, choices=STATUS, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ride {self.id}"