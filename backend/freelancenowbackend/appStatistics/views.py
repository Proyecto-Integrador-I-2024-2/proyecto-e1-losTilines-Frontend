from django.db.models import Count, Q
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import PermissionDenied
from app.models import Project, Milestone, Area, UserCompany, Company, ProjectFreelancer

class StatisticsView(ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        user_id = request.query_params.get('user')  # Usar user_id como parámetro
        area = request.query_params.get('area')
        company = request.query_params.get('company')

        if user_id:
            return self.get_project_manager_stats(user_id)
        elif area:
            return self.get_area_admin_stats(area)
        elif company:
            return self.get_business_manager_stats(company)
        else:
            raise PermissionDenied("Statistics not available.")

    def get_project_manager_stats(self, user_id):
        projects = Project.objects.filter(user_id=user_id)

        project_applications = ProjectFreelancer.objects.filter(project__in=projects).values('status').annotate(count=Count('id'))
        projects_by_status = projects.values('status').annotate(count=Count('id'))
        milestones_by_status = Milestone.objects.filter(project__in=projects).values('status').annotate(count=Count('id'))

        return Response({
            "applications_per_project": list(project_applications),
            "projects_by_status": list(projects_by_status),
            "milestones_by_status": list(milestones_by_status),
        })

    def get_area_admin_stats(self, area_id):
        # Filtrar proyectos y trabajadores dentro del área del administrador
        area = Area.objects.filter(id=area_id).first()
        if not area:
            raise PermissionDenied("Area not found.")

        projects = Project.objects.filter(user__usercompany__area=area)

        # Estadísticas específicas
        project_applications = ProjectFreelancer.objects.filter(project__in=projects).values('status').annotate(count=Count('id'))
        projects_by_status = projects.values('status').annotate(count=Count('id'))
        milestones_by_status = Milestone.objects.filter(project__in=projects).values('status').annotate(count=Count('id'))

        # Trabajadores con/sin proyectos
        area_workers = UserCompany.objects.filter(area=area)
        workers_with_project = area_workers.filter(user__project__isnull=False).distinct().count()
        workers_without_project = area_workers.filter(user__project__isnull=True).distinct().count()

        return Response({
            "applications_per_project": list(project_applications),
            "projects_by_status": list(projects_by_status),
            "milestones_by_status": list(milestones_by_status),
            "workers_with_project": workers_with_project,
            "workers_without_project": workers_without_project,
        })

    def get_business_manager_stats(self, company_id):
        # Filtrar proyectos y áreas dentro de la empresa del Business Manager
        company = Company.objects.filter(id=company_id).first()
        if not company:
            raise PermissionDenied("No perteneces a una compañía válida.")

        projects = Project.objects.filter(user__usercompany__company=company)
        if company_id:
            projects = projects.filter(user__usercompany__company_id=company_id)

        # Estadísticas específicas
        projects_by_area = projects.values('user__usercompany__area__name').annotate(count=Count('id'))
        project_applications = ProjectFreelancer.objects.filter(project__in=projects).values('status').annotate(count=Count('id'))
        projects_by_status = projects.values('status').annotate(count=Count('id'))
        milestones_by_status = Milestone.objects.filter(project__in=projects).values('status').annotate(count=Count('id'))

        # Trabajadores con/sin proyectos
        workers = UserCompany.objects.filter(company=company)
        workers_with_project = workers.filter(user__project__isnull=False).distinct().count()
        workers_without_project = workers.filter(user__project__isnull=True).distinct().count()

        return Response({
            "projects_by_area": list(projects_by_area),
            "applications_per_project": list(project_applications),
            "projects_by_status": list(projects_by_status),
            "milestones_by_status": list(milestones_by_status),
            "workers_with_project": workers_with_project,
            "workers_without_project": workers_without_project,
        })
