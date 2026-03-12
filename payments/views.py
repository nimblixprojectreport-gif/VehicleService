from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentsSerializer
import uuid

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentsSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data["transaction_id"] = str(uuid.uuid4())
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            payment = serializer.save(payment_status="PENDING")
            return Response(PaymentsSerializer(payment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def confirm(self, request):
        txn_id = request.data.get("transaction_id")
        try:
            payment = Payment.objects.get(transaction_id=txn_id)
            payment.payment_status = "SUCCESS"
            payment.save()
            return Response({
                "transaction_id": txn_id,
                "status": payment.payment_status
            }, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response(
                {"error": "Transaction not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["post"])
    def refund(self, request):
        txn_id = request.data.get("transaction_id")
        try:
            payment = Payment.objects.get(transaction_id=txn_id)
            payment.payment_status = "REFUNDED"
            payment.save()
            return Response({
                "transaction_id": txn_id,
                "status": payment.payment_status
            }, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response(
                {"error": "Transaction not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["get"])
    def history(self, request):
        customer_id = request.query_params.get("customer_id")
        if not customer_id:
            return Response(
                {"error": "customer_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        payments = Payment.objects.filter(customer_id=customer_id)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)