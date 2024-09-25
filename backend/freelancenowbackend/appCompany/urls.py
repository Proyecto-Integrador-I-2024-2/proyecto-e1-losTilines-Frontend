from django.urls import path
from .views import WorkingAreaListView, ListingAdminAreaAvailableView, WorkingAreaDetailView, WorkingAreaCreationView, WorkingAreaUpdateView, WorkingAreaDeleteView, ListCompanyWorkersView, RetrieveWorkerView, UpdateWorkerView, DeleteWorkerView, ListGroupsView, ListCompanyWorkersRoleAreaView

urlpatterns = [
    path('groups/', ListGroupsView.as_view(), name='list-groups'),
    path('areas/', WorkingAreaListView.as_view(), name='working-area-list'),
    path('areas/<int:pk>/', WorkingAreaDetailView.as_view(), name='working-area-detail'),
    path('areas/create/', WorkingAreaCreationView.as_view(), name='working-area-create'),
    path('areas/update/<int:pk>/', WorkingAreaUpdateView.as_view(), name='working-area-update'),
    path('areas/delete/<int:pk>/', WorkingAreaDeleteView.as_view(), name='working-area-delete'),
    path('workers/', ListCompanyWorkersView.as_view(), name='workers-list'),
    path('workers/rolesArealist/', ListCompanyWorkersRoleAreaView.as_view(), name='workers-role-area-list'),
    path('workers/<int:pk>/', RetrieveWorkerView.as_view(), name='retrieve-worker'),
    path('workers/update/<int:pk>/', UpdateWorkerView.as_view(), name='update-worker'),
    path('workers/delete/<int:pk>/', DeleteWorkerView.as_view(), name='delete-worker'),
    path('workers/admin/available/', ListingAdminAreaAvailableView.as_view(), name='admin-area-available'),
]