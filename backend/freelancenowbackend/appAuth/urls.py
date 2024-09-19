from django.urls import path
from .views import (
    FreelancerRegisterView,
    BusinessManagerRegisterView,
    RegisterCompanyUsersView
)

urlpatterns = [
    # Registro de Freelancer
    path('register/freelancer/', FreelancerRegisterView.as_view(), name='register_freelancer'),

    # Registro de Business Manager
    path('register/business-manager/', BusinessManagerRegisterView.as_view(), name='register_business_manager'),

    # Registro de usuarios de la compañía (Area Admin, Project Manager) por el Business Manager
    path('register/company-users/', RegisterCompanyUsersView.as_view(), name='register_company_users'),
]