from rest_framework.routers import DefaultRouter
from .views import MessageViewset, UserViewSet, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path


router = DefaultRouter()

router.register(r'chat', MessageViewset, basename='message_view')
router.register(r'users', UserViewSet, basename='user_view')




urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
] + router.urls