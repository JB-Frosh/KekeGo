from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Student
from .models import Group, GroupMember


class GroupListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        groups = Group.objects.prefetch_related('members__student').all().order_by('-created_at')
        data = [self.serialize_group(group) for group in groups]
        return Response(data, status=status.HTTP_200_OK)

    def serialize_group(self, group):
        return {
            'id': group.id,
            'pickup': group.pickup,
            'destination': group.destination,
            'members': [
                {'id': member.id, 'studentId': member.student.id, 'name': member.student.name}
                for member in group.members.all()
            ],
            'status': group.status,
            'createdAt': group.created_at.isoformat(),
            'totalSeats': group.total_seats,
        }


class GroupCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        pickup = request.data.get('pickup')
        destination = request.data.get('destination')
        if not pickup or not destination:
            return Response({'detail': 'Both pickup and destination are required.'}, status=status.HTTP_400_BAD_REQUEST)

        group = Group.objects.create(id=f'G{Group.objects.count() + 1:03d}', pickup=pickup, destination=destination)
        member = GroupMember.objects.create(
            id=f'm-{group.id}-{request.user.id}',
            group=group,
            student=request.user,
            name=request.user.name,
        )
        group.status = Group.STATUS_WAITING
        if group.members.count() >= group.total_seats:
            group.status = Group.STATUS_FULL
        group.save()
        return Response(GroupListView().serialize_group(group), status=status.HTTP_201_CREATED)


class GroupJoinView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        group = Group.objects.filter(id=group_id).first()
        if not group:
            return Response({'detail': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)
        if group.members.filter(student=request.user).exists():
            return Response(GroupListView().serialize_group(group), status=status.HTTP_200_OK)
        if group.members.count() >= group.total_seats:
            return Response({'detail': 'Group is already full.'}, status=status.HTTP_400_BAD_REQUEST)

        GroupMember.objects.create(
            id=f'm-{group.id}-{request.user.id}',
            group=group,
            student=request.user,
            name=request.user.name,
        )

        if group.members.count() >= group.total_seats:
            group.status = Group.STATUS_FULL
        else:
            group.status = Group.STATUS_WAITING
        group.save()
        return Response(GroupListView().serialize_group(group), status=status.HTTP_200_OK)


class GroupDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        group = Group.objects.filter(id=group_id).prefetch_related('members__student').first()
        if not group:
            return Response({'detail': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)
        data = {
            'id': group.id,
            'pickup': group.pickup,
            'destination': group.destination,
            'members': [
                {'id': member.id, 'studentId': member.student.id, 'name': member.student.name}
                for member in group.members.all()
            ],
            'status': group.status,
            'createdAt': group.created_at.isoformat(),
            'totalSeats': group.total_seats,
        }
        return Response(data, status=status.HTTP_200_OK)


class MatchingGroupsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pickup = request.query_params.get('pickup')
        destination = request.query_params.get('destination')
        groups = Group.objects.filter(pickup=pickup, destination=destination).prefetch_related('members__student').order_by('-created_at')
        data = [
            {
                'id': group.id,
                'pickup': group.pickup,
                'destination': group.destination,
                'members': [
                    {'id': member.id, 'studentId': member.student.id, 'name': member.student.name }
                    for member in group.members.all()
                ],
                'status': group.status,
                'createdAt': group.created_at.isoformat(),
                'totalSeats': group.total_seats,
            }
            for group in groups
        ]
        return Response(data, status=status.HTTP_200_OK)
