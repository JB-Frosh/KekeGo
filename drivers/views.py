from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Driver


class DriverListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        drivers = Driver.objects.all().order_by('name')
        data = [
            {
                'id': item.id,
                'name': item.name,
                'phone': item.phone,
                'plateNumber': item.plate_number,
                'rating': float(item.rating),
            }
            for item in drivers
        ]
        return Response(data, status=status.HTTP_200_OK)


class DriverDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, driver_id):
        driver = Driver.objects.filter(id=driver_id).first()
        if not driver:
            return Response({'detail': 'Driver not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(
            {
                'id': driver.id,
                'name': driver.name,
                'phone': driver.phone,
                'plateNumber': driver.plate_number,
                'rating': float(driver.rating),
            },
            status=status.HTTP_200_OK,
        )
