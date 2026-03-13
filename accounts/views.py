from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        mobile = request.data.get("mobile")
        password = request.data.get("password")
        full_name = request.data.get("full_name")

        if User.objects.filter(mobile=mobile).exists():
            return Response({"error": "User already exists"}, status=400)

        user = User.objects.create(
            mobile=mobile,
            full_name=full_name,
            role = 'Customer'
        )
        user.set_password(password) 
        user.save()

        return Response({"message": "User created successfully!"}, status=201)

class LoginView(APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        mobile = request.data.get("mobile")
        password = request.data.get("password")

        if not mobile or not password:
            return Response(
                {"error": "Mobile and password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(mobile=mobile)

            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user_id": user.id,
                    "mobile": user.mobile
                }, status=status.HTTP_200_OK)

            return Response(
                {"error": "Invalid password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "mobile": user.mobile,
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        users = User.objects.all().values("id", "mobile")
        return Response(list(users))