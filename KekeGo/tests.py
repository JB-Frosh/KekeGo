from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class KekeGoApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_student_registration_and_login(self):
        payload = {
            'fullName': 'Quadri Adebayo',
            'department': 'Computer Engineering',
            'faculty': 'Engineering',
            'level': '300 Level',
            'phone': '+2348012345678',
            'email': 'quadri@student.edu',
            'password': 'password123',
            'confirmPassword': 'password123',
        }

        register_response = self.client.post(reverse('auth-register'), payload, format='json')
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(register_response.data['name'], 'Quadri Adebayo')

        login_response = self.client.post(
            reverse('auth-login'),
            {'emailOrPhone': 'quadri@student.edu', 'password': 'password123'},
            format='json',
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.data)
        self.assertIn('refresh', login_response.data)

    def test_group_creation_and_join_limit(self):
        self.client.post(
            reverse('auth-register'),
            {
                'fullName': 'Student One',
                'department': 'Computer Engineering',
                'faculty': 'Engineering',
                'level': '300 Level',
                'phone': '+2348000000001',
                'email': 'student1@student.edu',
                'password': 'password123',
                'confirmPassword': 'password123',
            },
            format='json',
        )
        self.client.post(
            reverse('auth-register'),
            {
                'fullName': 'Student Two',
                'department': 'Computer Engineering',
                'faculty': 'Engineering',
                'level': '300 Level',
                'phone': '+2348000000002',
                'email': 'student2@student.edu',
                'password': 'password123',
                'confirmPassword': 'password123',
            },
            format='json',
        )

        auth_response = self.client.post(
            reverse('auth-login'),
            {'emailOrPhone': 'student1@student.edu', 'password': 'password123'},
            format='json',
        )
        token = auth_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        create_response = self.client.post(
            reverse('group-create'),
            {'pickup': 'Faculty of Engineering', 'destination': 'Main Gate'},
            format='json',
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        group_id = create_response.data['id']

        for index in range(2, 5):
            student = f'student{index}@student.edu'
            self.client.post(reverse('auth-register'), {
                'fullName': f'Student {index}',
                'department': 'Computer Engineering',
                'faculty': 'Engineering',
                'level': '300 Level',
                'phone': f'+234800000000{index}',
                'email': student,
                'password': 'password123',
                'confirmPassword': 'password123',
            }, format='json')
            login = self.client.post(reverse('auth-login'), {'emailOrPhone': student, 'password': 'password123'}, format='json')
            self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
            join_response = self.client.post(reverse('group-join', kwargs={'group_id': group_id}), format='json')
            self.assertEqual(join_response.status_code, status.HTTP_200_OK)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        group_response = self.client.get(reverse('group-detail', kwargs={'group_id': group_id}))
        self.assertEqual(group_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(group_response.data['members']), 4)
