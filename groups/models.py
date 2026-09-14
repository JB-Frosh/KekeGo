from django.db import models

from accounts.models import Student


class Group(models.Model):
    STATUS_WAITING = 'WAITING'
    STATUS_FULL = 'FULL'
    STATUS_SEARCHING_DRIVER = 'SEARCHING_DRIVER'
    STATUS_DRIVER_ASSIGNED = 'DRIVER_ASSIGNED'
    STATUS_DRIVER_ACCEPTED = 'DRIVER_ACCEPTED'
    STATUS_IN_TRIP = 'IN_TRIP'
    STATUS_COMPLETED = 'COMPLETED'
    STATUS_CANCELLED = 'CANCELLED'

    STATUS_CHOICES = [
        (STATUS_WAITING, 'Waiting'),
        (STATUS_FULL, 'Full'),
        (STATUS_SEARCHING_DRIVER, 'Searching driver'),
        (STATUS_DRIVER_ASSIGNED, 'Driver assigned'),
        (STATUS_DRIVER_ACCEPTED, 'Driver accepted'),
        (STATUS_IN_TRIP, 'In trip'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    id = models.CharField(primary_key=True, max_length=20)
    pickup = models.CharField(max_length=120)
    destination = models.CharField(max_length=120)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_WAITING)
    total_seats = models.PositiveSmallIntegerField(default=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.id}: {self.pickup} → {self.destination}'


class GroupMember(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='members')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='group_memberships')
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['group', 'student'], name='unique_group_member'),
        ]

    def __str__(self):
        return f'{self.student.name} in {self.group.id}'
