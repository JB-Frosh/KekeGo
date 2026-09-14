from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from drivers.models import Driver
from groups.models import Group
from .models import Trip


class TripListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        trips = Trip.objects.select_related('driver', 'group').all().order_by('-created_at')
        data = [self.serialize_trip(trip) for trip in trips]
        return Response(data, status=status.HTTP_200_OK)

    def serialize_trip(self, trip):
        return {
            'id': trip.id,
            'groupId': trip.group.id,
            'pickup': trip.pickup,
            'destination': trip.destination,
            'driver': {
                'id': trip.driver.id,
                'name': trip.driver.name,
                'phone': trip.driver.phone,
                'plateNumber': trip.driver.plate_number,
                'rating': float(trip.driver.rating),
            },
            'passengers': trip.passengers,
            'status': trip.status,
            'createdAt': trip.created_at.isoformat(),
        }


class TripByGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        trip = Trip.objects.filter(group__id=group_id).select_related('driver', 'group').first()
        if not trip:
            return Response({'detail': 'Trip not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(TripListView().serialize_trip(trip), status=status.HTTP_200_OK)


class TripCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        group = Group.objects.filter(id=group_id).prefetch_related('members').first()
        if not group:
            return Response({'detail': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)
        driver = Driver.objects.order_by('?').first()
        if not driver:
            return Response({'detail': 'No driver available.'}, status=status.HTTP_400_BAD_REQUEST)
        trip = Trip.objects.create(
            id=f'T{Trip.objects.count() + 1:03d}',
            group=group,
            pickup=group.pickup,
            destination=group.destination,
            driver=driver,
            passengers=group.members.count(),
        )
        group.status = Group.STATUS_SEARCHING_DRIVER
        group.save()
        return Response(TripListView().serialize_trip(trip), status=status.HTTP_201_CREATED)
