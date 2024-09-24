from django.urls import path
from .views import *

urlpatterns = [
    path('creation/', ProjectCreateView.as_view(), name='project-creation'),
    path('listing/businessmanager', ProjectListForManagersView.as_view(), name='listing-businessmanager'),
    path('listing/adminarea', ProjectListForAdminView.as_view(), name='listing-adminarea'),
    path('listing/freelancer', ProjectListForFreelancersView.as_view(), name='freelancer-listing'),
    path('listing/', ProjectListView.as_view(), name='project-listing'),
    path('listing/company/<int:company_id>/', ProjectByCompanyView.as_view(), name='project-listing-company'),
    path('listing/freelancer/<int:user_id>/', ProjectByFreelancerView.as_view(), name='project-listing-freelancer'),
]