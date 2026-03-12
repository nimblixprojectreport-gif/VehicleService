from django.db import models

# Create your models here.
class Ride(models.Model):
    source=models.CharField(max_length=100)
    destination=models.CharField(max_length=100)
    distance_km=models.FloatField()
    fare_amount=models.FloatField()
    created_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.source} to {self.destination}"
    