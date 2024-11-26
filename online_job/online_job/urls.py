
from django.contrib import admin
from django.urls import path, include
from api.views import * 
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from api.views import CompanyViewSet


router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('jobs/', JobListView.as_view(), name='job-list'),  # URL for viewing all jobs
    path('jobs/create/', JobListCreateView.as_view(), name='job-create'),  # URL for creating a job
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),  # URL for viewing, updating, or deleting a job by its ID
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('profiles-list/', ProfileListView.as_view(), name='profile-list'),  # URL for viewing all profiles
    path('profiles/', ProfileListCreateAPIView.as_view(), name='profile-list-create'),
    path('jobs/company/<str:company_name>/', JobListByCompanyView.as_view(), name='company-jobs'),
    path('profiles/<int:pk>/', ProfileRetrieveUpdateDestroyAPIView.as_view(), name='profile-detail'),
    path('profiles/me/', UserProfileView.as_view(), name='user-profile'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
