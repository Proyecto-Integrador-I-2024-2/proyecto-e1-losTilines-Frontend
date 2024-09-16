from django.urls import path, re_path
from . import views


urlpatterns = [
    path('api/public', views.public),
    path('api/private', views.private),
    path('api/private-scoped', views.private_scoped),
    re_path('login', views.login),
    re_path('register', views.register),
    re_path('profile', views.profile)
]