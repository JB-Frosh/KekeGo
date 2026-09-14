from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class StudentManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The given email must be set.')
        email = self.normalize_email(email)
        if 'username' not in extra_fields or not extra_fields['username']:
            extra_fields['username'] = email
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


class Student(AbstractUser):
    id = models.CharField(primary_key=True, max_length=32, editable=False)
    name = models.CharField(max_length=120)
    department = models.CharField(max_length=120)
    faculty = models.CharField(max_length=120)
    level = models.CharField(max_length=40)
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)

    username = models.CharField(max_length=150, unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone', 'department', 'faculty', 'level']
    objects = StudentManager()

    def save(self, *args, **kwargs):
        if not self.id:
            prefix = 'stu-'
            last_student = Student.objects.order_by('-id').first()
            if last_student and last_student.id.startswith(prefix):
                try:
                    last_number = int(last_student.id.replace(prefix, ''))
                    self.id = f'{prefix}{last_number + 1}'
                except ValueError:
                    self.id = f'{prefix}1'
            else:
                self.id = f'{prefix}1'
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
