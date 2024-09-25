from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.contrib.auth import get_user_model

from app.models import (
    UserRole, Notification, UserNotification, Company, Area, UserCompany,
    Freelancer, SkillType, Skill, FreelancerSkill, Experience, Portfolio, Comment,
    ProjectStatus, Project, ProjectFreelancer, ProjectSkill, Milestone, Deliverable, Payment,
    Country, City
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Carga datos iniciales para pruebas.'

    def handle(self, *args, **options):
        # Crear grupos
        groups = ['Freelancer', 'Business Manager', 'Area Admin', 'Project Manager']
        for group_name in groups:
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Grupo "{group_name}" creado'))
            else:
                self.stdout.write(self.style.WARNING(f'Grupo "{group_name}" ya existe'))

        # Obtener grupos
        freelancer_group = Group.objects.get(name='Freelancer')
        business_manager_group = Group.objects.get(name='Business Manager')
        area_admin_group = Group.objects.get(name='Area Admin')
        project_manager_group = Group.objects.get(name='Project Manager')

        # Crear usuarios y asignarles grupos
        # Freelancers
        freelancers = []
        for i in range(1, 4):
            email = f'freelancer{i}@example.com'
            user, created = User.objects.get_or_create(email=email)
            if created:
                user.set_password('password123')
                user.first_name = f'Freelancer{i}'
                user.last_name = f'Apellido{i}'
                user.save()
                user.groups.add(freelancer_group)
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Usuario Freelancer "{email}" creado'))
            else:
                self.stdout.write(self.style.WARNING(f'Usuario Freelancer "{email}" ya existe'))
            freelancers.append(user)

        # Business Managers
        business_managers = []
        for i in range(1, 4):
            email = f'business_manager{i}@example.com'
            user, created = User.objects.get_or_create(email=email)
            if created:
                user.set_password('password123')
                user.first_name = f'BusinessManager{i}'
                user.last_name = f'Apellido{i}'
                user.save()
                user.groups.add(business_manager_group)
                user.groups.add(area_admin_group)

                user.save()
                self.stdout.write(self.style.SUCCESS(f'Usuario Business Manager "{email}" creado'))
            else:
                self.stdout.write(self.style.WARNING(f'Usuario Business Manager "{email}" ya existe'))
            business_managers.append(user)

        # Area Admins
        area_admins = []
        for i in range(1, 4):
            email = f'area_admin{i}@example.com'
            user, created = User.objects.get_or_create(email=email)
            if created:
                user.set_password('password123')
                user.first_name = f'AreaAdmin{i}'
                user.last_name = f'Apellido{i}'
                user.save()
                user.groups.add(area_admin_group)
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Usuario Area Admin "{email}" creado'))
            else:
                self.stdout.write(self.style.WARNING(f'Usuario Area Admin "{email}" ya existe'))
            area_admins.append(user)

        # Project Managers
        project_managers = []
        for i in range(1, 4):
            email = f'project_manager{i}@example.com'
            user, created = User.objects.get_or_create(email=email)
            if created:
                user.set_password('password123')
                user.first_name = f'ProjectManager{i}'
                user.last_name = f'Apellido{i}'
                user.save()
                user.groups.add(project_manager_group)
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Usuario Project Manager "{email}" creado'))
            else:
                self.stdout.write(self.style.WARNING(f'Usuario Project Manager "{email}" ya existe'))
            project_managers.append(user)

        # Crear notificaciones
        notifications = []
        for i in range(1, 4):
            notification, created = Notification.objects.get_or_create(
                message=f'Mensaje de notificación {i}',
                created_at=timezone.now().date()
            )
            notifications.append(notification)
            self.stdout.write(self.style.SUCCESS(f'Notificación "{notification.message}" creada'))

        # Crear UserNotifications
        user_notifications = []
        users = freelancers + business_managers + area_admins + project_managers
        for i, notification in enumerate(notifications):
            user = users[i % len(users)]
            user_notification, created = UserNotification.objects.get_or_create(
                notification=notification,
                user=user
            )
            user_notifications.append(user_notification)
            self.stdout.write(self.style.SUCCESS(f'UserNotification para usuario "{user.email}" creada'))

        # Crear compañías
        companies = []
        for i in range(1, 4):
            tax_id = f'TAXID{i}'
            name = f'Empresa {i}'
            email = f'empresa{i}@example.com'
            user = business_managers[i - 1]
            try:
                company, created = Company.objects.get_or_create(
                    tax_id=tax_id,
                    defaults={
                        'name': name,
                        'address': f'Calle {i} #123',
                        'telephone': f'+1234567890{i}',
                        'email': email,
                        'user': user,
                        'description': f'Descripción de la empresa {i}',
                        'industry': f'Industria {i}'
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Compañía "{company.name}" creada'))
                else:
                    self.stdout.write(self.style.WARNING(f'Compañía "{company.name}" ya existe'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al crear la compañía "{name}": {str(e)}'))
                continue
            companies.append(company)

        # Crear áreas
        areas = []
        for i, company in enumerate(companies):
            name = f'Área {i+1}'
            user = area_admins[i]
            try:
                area, created = Area.objects.get_or_create(
                    name=name,
                    company=company,
                    defaults={
                        'user': user
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Área "{area.name}" creada para la compañía "{company.name}"'))
                else:
                    self.stdout.write(self.style.WARNING(f'Área "{area.name}" ya existe'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al crear el área "{name}": {str(e)}'))
                continue
            areas.append(area)

        # Crear UserCompany
        user_companies = []
        for i, company in enumerate(companies):
            user = business_managers[i]
            area = areas[i]
            admin = area_admins[i]
            manager = project_managers[i]
            try:
                user_company, created = UserCompany.objects.get_or_create(
                    company=company,
                    user=user,
                    defaults={
                        'area': area
                    }
                )
                user_company2, created = UserCompany.objects.get_or_create(
                    company=company,
                    user=admin,
                    defaults={
                        'area': area
                    }
                )
                user_company3, created = UserCompany.objects.get_or_create(
                    company=company,
                    user=manager,
                    defaults={
                        'area': area
                    }
                )
             
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f'UserCompany para usuario "{user.email}" y compañía "{company.name}" creada'))
                else:
                    self.stdout.write(self.style.WARNING(f'UserCompany para usuario "{user.email}" ya existe'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al crear UserCompany: {str(e)}'))
                continue
            user_companies.append(user_company )
            user_companies.append(user_company2)
            user_companies.append(user_company3)
            
            
            
        
            
        

        # Crear perfiles de freelancers
        freelancers_instances = []
        for user in freelancers:
            try:
                freelancer, created = Freelancer.objects.get_or_create(
                    user=user,
                    defaults={
                        'description': f'Descripción para {user.first_name}',
                        'country': 'País',
                        'city': 'Ciudad'
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Perfil de Freelancer para usuario "{user.email}" creado'))
                else:
                    self.stdout.write(self.style.WARNING(f'Perfil de Freelancer para usuario "{user.email}" ya existe'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al crear Freelancer para usuario "{user.email}": {str(e)}'))
                continue
            freelancers_instances.append(freelancer)

        # Crear tipos de habilidades (SkillType)
        skill_types = []
        for i in range(1, 4):
            name = f'TipoHabilidad {i}'
            skill_type, created = SkillType.objects.get_or_create(name=name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Tipo de Habilidad "{name}" creado'))
            else:
                self.stdout.write(self.style.WARNING(f'Tipo de Habilidad "{name}" ya existe'))
            skill_types.append(skill_type)

        # Crear habilidades (Skill)
        skills = []
        for i, skill_type in enumerate(skill_types):
            name = f'Habilidad {i+1}'
            skill, created = Skill.objects.get_or_create(
                name=name,
                defaults={
                    'is_predefined': True,
                    'type': skill_type
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Habilidad "{name}" creada'))
            else:
                self.stdout.write(self.style.WARNING(f'Habilidad "{name}" ya existe'))
            skills.append(skill)

        # Crear habilidades de freelancers (FreelancerSkill)
        freelancer_skills = []
        for i, freelancer in enumerate(freelancers):
            skill = skills[i % len(skills)]
            level = 50 + i * 10
            try:
                freelancer_skill, created = FreelancerSkill.objects.get_or_create(
                    freelancer=freelancer,
                    skill=skill,
                    defaults={
                        'level': level
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Habilidad "{skill.name}" asignada a "{freelancer.email}"'))
                else:
                    self.stdout.write(self.style.WARNING(f'Habilidad "{skill.name}" ya asignada a "{freelancer.email}"'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al asignar habilidad: {str(e)}'))
                continue
            freelancer_skills.append(freelancer_skill)

        # Crear experiencias
        experiences = []
        for i, freelancer in enumerate(freelancers):
            try:
                experience, created = Experience.objects.get_or_create(
                    freelancer=freelancer,
                    start_date=timezone.now().date(),
                    occupation=f'Ocupación {i+1}',
                    company=f'Compañía {i+1}',
                    description=f'Descripción de la experiencia {i+1}'
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Experiencia "{experience.occupation}" para "{freelancer.email}" creada'))
                else:
                    self.stdout.write(self.style.WARNING(f'Experiencia "{experience.occupation}" ya existe para "{freelancer.email}"'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al crear experiencia: {str(e)}'))
                continue
            experiences.append(experience)

        # Crear portafolios
        portfolios = []
        for i, freelancer in enumerate(freelancers):
            try:
                portfolio, created = Portfolio.objects.get_or_create(
                    freelancer=freelancer,
                    date=timezone.now().date(),
                    project_name=f'Proyecto {i+1}',
                    url=f'http://example.com/portafolio/{i+1}',
                    description=f'Descripción del portafolio {i+1}'
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Portafolio "{portfolio.project_name}" para "{freelancer.email}" creado'))
                else:
                    self.stdout.write(self.style.WARNING(f'Portafolio "{portfolio.project_name}" ya existe para "{freelancer.email}"'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al crear portafolio: {str(e)}'))
                continue
            portfolios.append(portfolio)

        # Crear comentarios
        comments = []
        for i, freelancer in enumerate(freelancers):
            writer = project_managers[i % len(project_managers)]
            try:
                comment, created = Comment.objects.get_or_create(
                    freelancer=freelancer,
                    writer=writer,
                    defaults={
                        'title': f'Título del comentario {i+1}',
                        'description': f'Descripción del comentario {i+1}',
                        'stars': 4.5 - i
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Comentario para "{freelancer.email}" creado por "{writer.email}"'))
                else:
                    self.stdout.write(self.style.WARNING(f'Comentario ya existe para "{freelancer.email}"'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al crear comentario: {str(e)}'))
                continue
            comments.append(comment)

        # Crear estados de proyecto (ProjectStatus)
        project_statuses = []
        for i in range(1, 4):
            name = f'Estado {i}'
            project_status, created = ProjectStatus.objects.get_or_create(name=name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Estado de Proyecto "{name}" creado'))
            else:
                self.stdout.write(self.style.WARNING(f'Estado de Proyecto "{name}" ya existe'))
            project_statuses.append(project_status)

        # Crear proyectos
        projects = []
        for i in range(1, 4):
            name = f'Proyecto {i}'
            description = f'Descripción del proyecto {i}'
            start_date = timezone.now().date()
            user = project_managers[i - 1]
            budget = 10000.00 + i * 1000
            area = areas[i - 1]
            company = companies[i - 1]
            try:
                project, created = Project.objects.get_or_create(
                    name=name,
                    defaults={
                        'description': description,
                        'start_date': start_date,
                        'user': user,
                        'budget': budget,
                        'area': area,
                        'company': company,
                        'status': project_statuses[i - 1].name
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Proyecto "{project.name}" creado'))
                else:
                    self.stdout.write(self.style.WARNING(f'Proyecto "{project.name}" ya existe'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al crear proyecto: {str(e)}'))
                continue
            projects.append(project)

        # Crear ProjectFreelancer
        project_freelancers = []
        for i, project in enumerate(projects):
            freelancer = freelancers[i]
            try:
                project_freelancer, created = ProjectFreelancer.objects.get_or_create(
                    project=project,
                    freelancer=freelancer
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Freelancer "{freelancer.email}" asignado al proyecto "{project.name}"'))
                else:
                    self.stdout.write(self.style.WARNING(f'Freelancer "{freelancer.email}" ya asignado al proyecto "{project.name}"'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al asignar freelancer al proyecto: {str(e)}'))
                continue
            project_freelancers.append(project_freelancer)

        # Crear habilidades requeridas para proyectos (ProjectSkill)
        project_skills = []
        for i, project in enumerate(projects):
            skill = skills[i % len(skills)]
            level = 50 + i * 10
            project_skill, created = ProjectSkill.objects.get_or_create(
                project=project,
                skill=skill,
                defaults={
                    'level': level
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Habilidad "{skill.name}" requerida para el proyecto "{project.name}" creada'))
            else:
                self.stdout.write(self.style.WARNING(f'Habilidad "{skill.name}" ya requerida para el proyecto "{project.name}"'))
            project_skills.append(project_skill)

        # Crear hitos (Milestone)
        """     
        milestones = []
        for i, project in enumerate(projects):
            name = f'Hito {i+1}'
            description = f'Descripción del hito {i+1}'
            due_date = timezone.now().date() + timezone.timedelta(days=30)
            freelancer = freelancers[i]
            try:
                milestone, created = Milestone.objects.get_or_create(
                    name=name,
                    project=project,
                    freelancer=freelancer,
                    defaults={
                        'description': description,
                        'due_date': due_date
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Hito "{milestone.name}" para el proyecto "{project.name}" creado'))
                else:
                    self.stdout.write(self.style.WARNING(f'Hito "{milestone.name}" ya existe para el proyecto "{project.name}"'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al crear hito: {str(e)}'))
                continue
            milestones.append(milestone)

        # Crear entregables (Deliverable)
        deliverables = []
        for i, milestone in enumerate(milestones):
            name = f'Entregable {i+1}'
            description = f'Descripción del entregable {i+1}'
            deliverable, created = Deliverable.objects.get_or_create(
                name=name,
                milestone=milestone,
                defaults={
                    'description': description
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Entregable "{deliverable.name}" para el hito "{milestone.name}" creado'))
            else:
                self.stdout.write(self.style.WARNING(f'Entregable "{deliverable.name}" ya existe para el hito "{milestone.name}"'))
            deliverables.append(deliverable)

        # Crear pagos (Payment)
        payments = []
        for i, project in enumerate(projects):
            freelancer = freelancers[i]
            payment_date = timezone.now().date()
            status = 'pending'
            amount = 1000.00 + i * 500
            try:
                payment, created = Payment.objects.get_or_create(
                    project=project,
                    freelancer=freelancer,
                    defaults={
                        'date': payment_date,
                        'status': status,
                        'amount': amount
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Pago "{payment.id}" para el proyecto "{project.name}" creado'))
                else:
                    self.stdout.write(self.style.WARNING(f'Pago "{payment.id}" ya existe para el proyecto "{project.name}"'))
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f'Error al crear pago: {str(e)}'))
                continue
            payments.append(payment)
        """