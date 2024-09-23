from django.urls import path
from .views import (
    WorkingAreaCreationView
)

urlpatterns = [
    # Working area creation
    path('workingarea/creation', WorkingAreaCreationView.as_view(), name='Working_area_creation')
]