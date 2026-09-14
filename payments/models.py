from django.db import models

from accounts.models import Student
from groups.models import Group


class Payment(models.Model):
    STATUS_PENDING = 'PENDING'
    STATUS_SUCCESS = 'SUCCESS'
    STATUS_FAILED = 'FAILED'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_SUCCESS, 'Success'),
        (STATUS_FAILED, 'Failed'),
    ]

    id = models.CharField(primary_key=True, max_length=40)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='payments')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='payments')
    route = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=10, default='NGN')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    method = models.CharField(max_length=30, default='Card')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.route} ({self.status})'
