from django.db import models

from drivers.models import Driver
from groups.models import Group


class Trip(models.Model):
    STATUS_DRIVER_ASSIGNED = 'DRIVER_ASSIGNED'
    STATUS_DRIVER_ACCEPTED = 'DRIVER_ACCEPTED'
    STATUS_IN_TRIP = 'IN_TRIP'
    STATUS_COMPLETED = 'COMPLETED'
    STATUS_CANCELLED = 'CANCELLED'

    STATUS_CHOICES = [
        (STATUS_DRIVER_ASSIGNED, 'Driver assigned'),
        (STATUS_DRIVER_ACCEPTED, 'Driver accepted'),
        (STATUS_IN_TRIP, 'In trip'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    id = models.CharField(primary_key=True, max_length=20)
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name='trip')
    pickup = models.CharField(max_length=120)
    destination = models.CharField(max_length=120)
    driver = models.ForeignKey(Driver, on_delete=models.PROTECT, related_name='trips')
    passengers = models.PositiveSmallIntegerField(default=1)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default=STATUS_DRIVER_ASSIGNED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.id}: {self.pickup} → {self.destination}'
