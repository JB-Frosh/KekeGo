from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Location


class LocationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        locations = Location.objects.all().order_by('name')
        data = [{'id': item.id, 'name': item.name} for item in locations]
        return Response(data, status=status.HTTP_200_OK)
