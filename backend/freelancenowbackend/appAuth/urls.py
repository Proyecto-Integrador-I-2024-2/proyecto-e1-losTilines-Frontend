from django.urls import path
from .views import (
    FreelancerRegisterView,
    BusinessManagerRegisterView,
    CreateCompanyView,
    RegisterAreaAdminView,
    RegisterProjectManagerView
)

urlpatterns = [
    # Registro de Freelancer
    path('register/freelancer/', FreelancerRegisterView.as_view(), name='register_freelancer'),

    # Registro de Business Manager
    path('register/business-manager/', BusinessManagerRegisterView.as_view(), name='register_business_manager'),

    # Registro de usuarios de la compañía (Area Admin, Project Manager) por el Business Manager
    path('register/projectmanager/', RegisterProjectManagerView.as_view(), name='register_project_manager'),

    # Registro de usuarios de la compañía (Area Admin, Project Manager) por el Business Manager
    path('register/adminarea/', RegisterAreaAdminView.as_view(), name='register_area_admin'),

     # Registro de compañias
    path('create/company/', CreateCompanyView.as_view(), name='creation_company'),
]