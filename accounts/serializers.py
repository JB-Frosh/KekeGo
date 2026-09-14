from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'department', 'faculty', 'level', 'phone', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = Student
        fields = ['fullName', 'department', 'faculty', 'level', 'phone', 'email', 'password', 'confirmPassword']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['confirmPassword']:
            raise serializers.ValidationError({'confirmPassword': 'Passwords do not match.'})
        if Student.objects.filter(email=attrs['email']).exists() or Student.objects.filter(phone=attrs['phone']).exists():
            raise serializers.ValidationError({'email': 'A student with that email or phone already exists.'})
        attrs['name'] = attrs.pop('fullName')
        attrs.pop('confirmPassword')
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        student = Student.objects.create_user(email=email, password=password, **validated_data)
        return student


class LoginSerializer(serializers.Serializer):
    emailOrPhone = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email_or_phone = attrs.get('emailOrPhone')
        password = attrs.get('password')
        user = Student.objects.filter(Q(email=email_or_phone) | Q(phone=email_or_phone)).first()
        if user is None or not user.check_password(password):
            raise serializers.ValidationError('Invalid email/phone or password.')

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': StudentSerializer(user).data,
        }


class StudentAuthTokenSerializer(serializers.Serializer):
    emailOrPhone = serializers.CharField()
    password = serializers.CharField(write_only=True)
