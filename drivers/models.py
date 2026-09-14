from django.db import models


class Driver(models.Model):
    id = models.CharField(primary_key=True, max_length=40)
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20)
    plate_number = models.CharField(max_length=20)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.8)

    def __str__(self):
        return f'{self.name} ({self.plate_number})'
