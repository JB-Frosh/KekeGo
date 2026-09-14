from django.db import models


class Location(models.Model):
    id = models.CharField(primary_key=True, max_length=80)
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name
