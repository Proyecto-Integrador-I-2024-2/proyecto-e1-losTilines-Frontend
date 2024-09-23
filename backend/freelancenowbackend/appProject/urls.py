from django.urls import path
from .views import ProjectCreateView, ProjectListForAdminView, ProjectListForFreelancersView, ProjectListForManagersView

urlpatterns = [
    path('creation', ProjectCreateView.as_view(), name='project-creation'),
    path('listing/businessmanager', ProjectListForManagersView.as_view(), name='listing-businessmanager'),
    path('listing/adminarea', ProjectListForAdminView.as_view(), name='listing-adminarea'),
    path('listing/freelancer', ProjectListForFreelancersView.as_view(), name='freelancer-listing'),
]