import django_filters
from app.models import User, Company

class WorkerFilter(django_filters.FilterSet):
    company = django_filters.NumberFilter(field_name='usercompany__company__id')
    area = django_filters.CharFilter(method='filter_by_area')

    class Meta:
        model = User
        fields = ['company', 'area']

    def filter_by_area(self, queryset, name, value):
        if value == 'none':
            # Si se pasa "none" como área en la URL, filtramos por usuarios sin área
            return queryset.filter(usercompany__area__isnull=True)
        else:
            # Filtramos por el ID de área si es un valor numérico
            try:
                area_id = int(value)
                return queryset.filter(usercompany__area__id=area_id)
            except ValueError:
                return queryset

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