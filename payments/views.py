from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from groups.models import Group
from .models import Payment


class PaymentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        route = request.data.get('route')
        amount = request.data.get('amount')
        if not route or amount is None:
            return Response({'detail': 'Route and amount are required.'}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.create(
            id=f'PAY-{Payment.objects.count() + 1:03d}',
            student=request.user,
            group=Group.objects.filter(id=request.data.get('groupId')).first() or Group.objects.first(),
            route=route,
            amount=amount,
            currency='NGN',
            status=Payment.STATUS_SUCCESS,
            method='Card',
        )
        return Response(
            {
                'id': payment.id,
                'route': payment.route,
                'amount': float(payment.amount),
                'currency': payment.currency,
                'status': payment.status,
                'method': payment.method,
                'createdAt': payment.created_at.isoformat(),
            },
            status=status.HTTP_201_CREATED,
        )


class PaymentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, payment_id):
        payment = Payment.objects.filter(id=payment_id, student=request.user).first()
        if not payment:
            return Response({'detail': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(
            {
                'id': payment.id,
                'route': payment.route,
                'amount': float(payment.amount),
                'currency': payment.currency,
                'status': payment.status,
                'method': payment.method,
                'createdAt': payment.created_at.isoformat(),
            },
            status=status.HTTP_200_OK,
        )
