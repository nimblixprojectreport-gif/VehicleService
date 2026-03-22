from django.db import models

class Partner(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    vehicle_number = models.CharField(max_length=20)
    vehicle_type = models.CharField(max_length=50)
    is_available = models.BooleanField(default=True)
    earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name
