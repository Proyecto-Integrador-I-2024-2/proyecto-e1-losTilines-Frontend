from django.urls import path
from .views import WorkingAreaListView, WorkingAreaDetailView, WorkingAreaCreationView, WorkingAreaUpdateView, WorkingAreaDeleteView, ListCompanyWorkersView

urlpatterns = [
    path('areas/', WorkingAreaListView.as_view(), name='working-area-list'),
    path('areas/<int:pk>/', WorkingAreaDetailView.as_view(), name='working-area-detail'),
    path('areas/create/', WorkingAreaCreationView.as_view(), name='working-area-create'),
    path('areas/update/<int:pk>/', WorkingAreaUpdateView.as_view(), name='working-area-update'),
    path('areas/delete/<int:pk>/', WorkingAreaDeleteView.as_view(), name='working-area-delete'),
    path('workers/', ListCompanyWorkersView.as_view(), name='workers-list')
]