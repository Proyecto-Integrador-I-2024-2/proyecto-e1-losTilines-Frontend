"""
URL configuration for freelancenowbackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as auth_views
from appAuth.views import LoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', LoginView.as_view(), name='login'),  # Login y autenticación por token
    path('api/users/', include('appAuth.urls')),  # Incluir las URLs de la aplicación "app"
    path('api/company/', include('appCompany.urls')),
]