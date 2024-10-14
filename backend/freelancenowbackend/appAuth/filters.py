import django_filters
from app.models import User, Company

class WorkerFilter(django_filters.FilterSet):    
    company = django_filters.NumberFilter(field_name='usercompany__company__id')
    area = django_filters.NumberFilter(field_name='usercompany__area__id')

    class Meta:
        model = User
        fields = ['company', 'area']

class FreelancerFilter(django_filters.FilterSet):
    # Filtro por el nombre de la habilidad relacionada con el usuario
    skills = django_filters.CharFilter(field_name='freelancer.', label='Skills')

    class Meta:
        model = User
        fields = ['skills']

class CompanyFilter(django_filters.FilterSet):
    # Filtro por nombre de la compañía
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    
    # Filtro por industria, en caso de que el modelo tenga este campo
    industry = django_filters.CharFilter(field_name='industry', lookup_expr='icontains')

    class Meta:
        model = Company
        fields = ['name', 'industry']