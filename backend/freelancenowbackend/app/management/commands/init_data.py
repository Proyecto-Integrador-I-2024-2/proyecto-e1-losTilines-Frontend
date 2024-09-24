from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from app.models import (
    User, UserRole, Notification, UserNotification, Company, Area, UserCompany,
    SkillType, Skill, FreelancerSkill, Experience, Portfolio, Comment,
    Project, ProjectFreelancer, ProjectSkill, Milestone, Deliverable, Payment,
    Country, City
)

class Command(BaseCommand):
    help = 'Carga datos de ejemplo en la base de datos.'

    def handle(self, *args, **options):
        try:
            # Crear grupos
            freelancer_group, _ = Group.objects.get_or_create(name='Freelancer')
            business_manager_group, _ = Group.objects.get_or_create(name='Business Manager')
            area_admin_group, _ = Group.objects.get_or_create(name='Area Admin')
            project_manager_group, _ = Group.objects.get_or_create(name='Project Manager')

            # Crear usuarios
            users = []
            for i in range(1, 4):
                user = User.objects.create_user(
                    email=f'manager{i}@example.com',
                    password='password123',
                    first_name=f'Manager{i}',
                    last_name='User',
                    phone_number=f'123456789{i}',
                    is_staff=True
                )
                user.groups.add(business_manager_group)
                users.append(user)

            for i in range(1, 4):
                user = User.objects.create_user(
                    email=f'freelancer{i}@example.com',
                    password='password123',
                    first_name=f'Freelancer{i}',
                    last_name='User',
                    phone_number=f'098765432{i}'
                )
                user.groups.add(freelancer_group)
                users.append(user)

            for i in range(1, 4):
                user = User.objects.create_user(
                    email=f'areaadmin{i}@example.com',
                    password='password123',
                    first_name=f'AreaAdmin{i}',
                    last_name='User',
                    phone_number=f'555555555{i}'
                )
                user.groups.add(area_admin_group)
                users.append(user)

            for i in range(1, 4):
                user = User.objects.create_user(
                    email=f'projectmanager{i}@example.com',
                    password='password123',
                    first_name=f'ProjectManager{i}',
                    last_name='User',
                    phone_number=f'444444444{i}'
                )
                user.groups.add(project_manager_group)
                users.append(user)

            # Crear roles de usuario
            for user in users:
                UserRole.objects.create(user=user, role=user.groups.first())

            # Crear notificaciones
            notifications = []
            for i in range(1, 4):
                notification = Notification.objects.create(
                    message=f'Notificación {i}',
                    created_at=timezone.now().date()
                )
                notifications.append(notification)

            # Crear notificaciones de usuario
            for notification in notifications:
                for user in users:
                    UserNotification.objects.create(notification=notification, user=user)

            # Crear países y ciudades
            country1 = Country.objects.create(name='Colombia')
            country2 = Country.objects.create(name='México')
            country3 = Country.objects.create(name='Argentina')

            city1 = City.objects.create(name='Bogotá', country=country1)
            city2 = City.objects.create(name='Ciudad de México', country=country2)
            city3 = City.objects.create(name='Buenos Aires', country=country3)

            # Crear empresas
            companies = []
            for i in range(1, 4):
                company = Company.objects.create(
                    tax_id=f'COMPANY00{i}',
                    name=f'Empresa {i}',
                    country=country1 if i == 1 else country2 if i == 2 else country3,
                    city=city1 if i == 1 else city2 if i == 2 else city3,
                    address=f'Dirección {i}',
                    telephone=f'+5712345678{i}',
                    email=f'empresa{i}@example.com',
                    user=User.objects.get(email=f'manager{i}@example.com'),
                    description=f'Descripción de la empresa {i}',
                    industry='Tecnología'
                )
                companies.append(company)

            # Crear áreas
            areas = []
            for i in range(1, 4):
                area = Area.objects.create(
                    name=f'Área {i}',
                    company=companies[i-1],
                    user=User.objects.get(email=f'areaadmin{i}@example.com')
                )
                areas.append(area)

            # Asociar usuarios a las empresas
            for i in range(1, 4):
                UserCompany.objects.create(
                    company=companies[i-1],
                    user=User.objects.get(email=f'areaadmin{i}@example.com'),
                    area=areas[i-1]
                )
                UserCompany.objects.create(
                    company=companies[i-1],
                    user=User.objects.get(email=f'projectmanager{i}@example.com'),
                    area=areas[i-1]
                )

            # Crear tipos de habilidades
            skill_types = []
            skill_type_names = ['Hard', 'Soft', 'Languaje']
            for i in range(3):
                skill_type = SkillType.objects.create(name=skill_type_names[i])
                skill_types.append(skill_type)

            # Crear habilidades
            skills = []
            skill_names = ['Python', 'Javascript', 'Django']
            for i in range(3):
                skill = Skill.objects.create(
                    name=skill_names[i],
                    is_predefined=True,
                    type=skill_types[i]
                )
                skills.append(skill)

            # Crear habilidades de freelancer
            for i in range(1, 4):
                FreelancerSkill.objects.create(
                    freelancer=User.objects.get(email=f'freelancer{i}@example.com'),
                    skill=skills[i-1],
                    level=70 + i*5  # Niveles 75, 80, 85
                )

            # Crear experiencias
            for i in range(1, 4):
                Experience.objects.create(
                    start_date=timezone.now().date() - timezone.timedelta(days=365*(i+1)),
                    final_date=timezone.now().date() - timezone.timedelta(days=365*i),
                    occupation=f'Ocupación {i}',
                    company=f'Empresa Anterior {i}',
                    freelancer=User.objects.get(email=f'freelancer{i}@example.com')
                )

            # Crear portafolios
            for i in range(1, 4):
                Portfolio.objects.create(
                    date=timezone.now().date() - timezone.timedelta(days=100*i),
                    project_name=f'Proyecto {i}',
                    description=f'Descripción del proyecto {i}',
                    url=f'http://example.com/proyecto{i}',
                    freelancer=User.objects.get(email=f'freelancer{i}@example.com')
                )

            # Crear comentarios
            for i in range(1, 4):
                stars = 4.0 + i*0.5
                if stars > 5.0:
                    stars = 5.0
                Comment.objects.create(
                    title=f'Comentario {i}',
                    description=f'Descripción del comentario {i}',
                    stars=stars,
                    freelancer=User.objects.get(email=f'freelancer{i}@example.com'),
                    writer=User.objects.get(email=f'manager{i}@example.com')
                )

            # Crear proyectos
            projects = []
            for i in range(1, 4):
                project = Project.objects.create(
                    name=f'Proyecto {i}',
                    description=f'Descripción del proyecto {i}',
                    start_date=timezone.now().date(),
                    user=User.objects.get(email=f'projectmanager{i}@example.com'),
                    budget=5000.00 * i,
                    area=areas[i-1],
                    status='pending',
                    company=companies[i-1]
                )
                projects.append(project)

            # Asignar freelancers a los proyectos
            for i in range(1, 4):
                ProjectFreelancer.objects.create(
                    project=projects[i-1],
                    freelancer=User.objects.get(email=f'freelancer{i}@example.com')
                )

            # Añadir habilidades requeridas a los proyectos
            for i in range(1, 4):
                ProjectSkill.objects.create(
                    project=projects[i-1],
                    skill=skills[i-1],
                    level=70 + i*5
                )

            # Crear hitos
            milestones = []
            for i in range(1, 4):
                milestone = Milestone.objects.create(
                    name=f'Hito {i}',
                    description=f'Descripción del hito {i}',
                    due_date=timezone.now().date() + timezone.timedelta(days=30*i),
                    freelancer=User.objects.get(email=f'freelancer{i}@example.com'),
                    project=projects[i-1]
                )
                milestones.append(milestone)

            # Crear entregables
            for i in range(1, 4):
                Deliverable.objects.create(
                    name=f'Entregable {i}',
                    description=f'Descripción del entregable {i}',
                    milestone=milestones[i-1]
                )

            # Crear pagos
            for i in range(1, 4):
                Payment.objects.create(
                    date=timezone.now().date(),
                    status='pending',
                    amount=1000.00 * i,
                    project=projects[i-1],
                    freelancer=User.objects.get(email=f'freelancer{i}@example.com')
                )

            self.stdout.write(self.style.SUCCESS('Datos de ejemplo cargados exitosamente.'))

        except IntegrityError as e:
            self.stderr.write(self.style.ERROR(f'Error de integridad: {e}'))
        except ValidationError as e:
            self.stderr.write(self.style.ERROR(f'Error de validación: {e}'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Ocurrió un error: {e}'))