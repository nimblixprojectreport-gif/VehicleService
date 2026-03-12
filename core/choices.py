from django.db import models

class StatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pending"
    COMPLETED = "COMPLETED" , "Completed"
    CANCELLED = "CANCELLED" , "Cancelled"