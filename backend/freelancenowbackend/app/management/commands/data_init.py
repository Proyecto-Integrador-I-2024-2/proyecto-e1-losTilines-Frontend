import factory
from factory.django import DjangoModelFactory
from django.utils import timezone
from faker import Faker
from random import choice
from django.db import transaction
from django.contrib.auth.models import Group
import random
from app.models import (
    User, UserRole, Notification, UserNotification, Company, Area, UserCompany,
    Freelancer, SkillType, Skill, FreelancerSkill, Status, Project, ProjectFreelancer, ProjectSkill
)

project_paragraph_templates = [
    "El proyecto {project} tiene como objetivo {objective}.",
    "Se han utilizado tecnologías como {technology} y {technology2} para asegurar {feature}.",
    "El equipo de {team} ha trabajado en la implementación de {solution} para optimizar el rendimiento.",
    "El proyecto {project} busca mejorar {goal}, utilizando soluciones avanzadas como {solution} y {technology}.",
    "Este proyecto ha sido diseñado para {objective}, con un enfoque en {feature}.",
    "El despliegue en {platform} ha permitido escalar las operaciones del proyecto."
]

objectives = ['automatizar procesos empresariales', 'optimizar la gestión de recursos', 'mejorar la experiencia del usuario', 'facilitar la integración de servicios', 'aumentar la seguridad de los datos']
features = ['alta disponibilidad', 'escalabilidad', 'seguridad', 'rendimiento óptimo', 'integración continua']

notification_templates = [
    "El proyecto {project} ha sido actualizado con la nueva tecnología {technology}.",
    "Se ha completado la integración de {technology} en el proyecto {project}.",
    "El equipo {team} ha lanzado una nueva versión del {solution}.",
    "Se ha detectado una vulnerabilidad en el {solution} del proyecto {project}.",
    "La infraestructura del proyecto {project} ha sido migrada a {platform}.",
    "El despliegue de {technology} en el proyecto {project} ha sido exitoso.",
    "La auditoría de seguridad del proyecto {project} ha sido finalizada.",
    "El equipo {team} está trabajando en la optimización del {solution}.",
    "La implementación de {technology} ha mejorado el rendimiento del proyecto {project}.",
    "Se ha registrado un nuevo incidente en el {solution} del proyecto {project}."
]

projects = ['plataforma web', 'API', 'backend', 'sistema de gestión', 'aplicación móvil']
technologies = ['Docker', 'Kubernetes', 'Python', 'React', 'AWS', 'DevOps', 'CI/CD', 'machine learning']
teams = ['DevOps', 'Backend', 'Frontend', 'QA', 'Infraestructura']
solutions = ['API REST', 'arquitectura de microservicios', 'solución cloud', 'pipelines de CI/CD']
platforms = ['AWS', 'Azure', 'Google Cloud', 'infraestructura local']


freelancer_paragraph_templates = [
    "Soy un especialista en {skill1} y {skill2}, con experiencia en {years} años trabajando en proyectos relacionados con {field}.",
    "Me destaco por mi capacidad para {strength}, lo que me ha permitido participar en proyectos como {project}.",
    "Mi enfoque principal está en {skill1}, y siempre busco implementar {solution} en mis proyectos.",
    "He trabajado con tecnologías como {skill1} y {skill2}, mejorando {feature} en los sistemas que desarrollo.",
    "Con experiencia en {field}, me especializo en {skill1} y {skill2}, utilizando {technology} para lograr resultados óptimos."
]

fields = ['desarrollo web', 'desarrollo móvil', 'ciberseguridad', 'automatización de procesos', 'gestión de bases de datos']
strengths = ['solucionar problemas complejos', 'optimizar la arquitectura del sistema', 'mejorar la seguridad', 'desarrollar interfaces amigables']
years_experience = ['5', '7', '10', '3', '12']

fake = Faker('es_CO')

AREA_CHOICES = [
    'RRHH', 'Finanzas', 'Marketing', 'Ventas', 'Operaciones', 'Tecnología', 'Soporte', 'Producto', 'Calidad', 'Logística', 'Atención Cliente', 'Innovación', 'Legal', 'Admin', 'Proyectos'
    ]
SKILL_CHOICES = ['Python', 'Django', 'JavaScript', 'React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'SQL', 'NoSQL', 'Java', 'C++', 'C#', 'Go', 'Ruby', 'PHP', 'Node.js', 
                 'TypeScript', 'REST APIs', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'DevOps', 'Machine Learning', 'Data Science', 
                 'Artificial Intelligence', 'Blockchain', 'Cybersecurity', 'Scrum', 'Kanban', 'UI/UX Design', 'Mobile Development (iOS)', 'Mobile Development (Android)', 
                 'Git', 'Jenkins', 'CI/CD', 'Unit Testing', 'Integration Testing', 'TDD', 'Agile Methodologies', 'Project Management', 'Business Analysis', 'SEO', 'SEM', 
                 'Content Marketing', 'Social Media Marketing', 'Cloud Computing', 'IoT']

SKILL_TYPE_CHOICES = ['Programación', 'Desarrollo Web', 'Desarrollo Móvil', 'DevOps', 'Bases de Datos', 'Seguridad Informática', 'Inteligencia Artificial', 
                      'Data Science', 'Diseño Gráfico', 'Diseño UI/UX', 'Marketing Digital', 'Gestión de Proyectos', 'Gestión de Equipos', 'Metodologías Ágiles', 
                      'Cloud Computing', 'Redes y Telecomunicaciones', 'Soporte Técnico', 'Consultoría', 'Automatización', 'Control de Calidad']

PROJECT_CHOICES = ['Desarrollo Plataforma Web', 'Aplicación Móvil', 'API Backend', 'Sistema de Gestión', 'Sitio Web Corporativo', 'E-commerce', 'Sistema de Gestión de Inventarios', 
                   'Automatización de Procesos', 'CRM (Gestión de Relaciones con Clientes)', 'ERP (Planificación de Recursos Empresariales)', 'Sistema de Facturación', 
                   'Sistema de Reservas', 'Aplicación de Monitoreo', 'Dashboard Analítico', 'Plataforma de Educación en Línea']

tech_keywords = ['plataforma', 'API', 'backend', 'microservicios', 'DevOps', 'Docker', 'Kubernetes', 'cloud', 'seguridad', 'machine learning']

profile_images = [
    'https://i.pinimg.com/736x/a3/53/66/a3536654d44f08f16044ae301a8be184.jpg',
    'https://i.pinimg.com/564x/9e/47/79/9e47798a74eb85a391204f7f32c509d1.jpg',
    'https://i.pinimg.com/564x/c5/cc/82/c5cc82bec47291eb587de8d9a6c92bb7.jpg',
    'https://i.pinimg.com/control/564x/00/62/87/006287d3aa9c240f2ca4fdfe90d67a39.jpg',
    'https://i.pinimg.com/control/564x/b8/2c/5a/b82c5a7a7c122bcdd87dbe495edf7294.jpg',
    'https://i.pinimg.com/564x/7e/ac/b0/7eacb0cd582fb0d069281511adacdddd.jpg'
]

def generate_project_paragraph():
    paragraph = " ".join([
        random.choice(project_paragraph_templates).format(
            project=random.choice(projects),
            objective=random.choice(objectives),
            technology=random.choice(technologies),
            technology2=random.choice(technologies),
            feature=random.choice(features),
            team=random.choice(teams),
            solution=random.choice(solutions),
            goal=random.choice(objectives),
            platform=random.choice(platforms)
        )
        for _ in range(4)  
    ])
    return paragraph

def generate_freelancer_paragraph():
    paragraph = " ".join([
        random.choice(freelancer_paragraph_templates).format(
            skill1=random.choice(SKILL_CHOICES),  
            skill2=random.choice(SKILL_CHOICES),
            field=random.choice(fields),
            strength=random.choice(strengths),
            project=random.choice(projects),
            solution=random.choice(solutions), 
            feature=random.choice(features),
            technology=random.choice(technologies),
            years=random.choice(years_experience)
        )
    ])
    return paragraph

def generate_tech_notification():
    template = random.choice(notification_templates)
    notification = template.format(
        project=random.choice(projects),
        technology=random.choice(technologies),
        team=random.choice(teams),
        solution=random.choice(solutions),
        platform=random.choice(platforms)
    )
    return notification

def create_group_if_not_exists(group_name):
    group, created = Group.objects.get_or_create(name=group_name)
    if created:
        print(f'Grupo {group_name} creado.')
    else:
        print(f'Grupo {group_name} ya existe.')
    return group

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    first_name = factory.Faker('first_name', locale='es_CO')
    last_name = factory.Faker('last_name', locale='es_CO')
    email = factory.LazyAttribute(lambda obj: f'{obj.first_name.lower()}.{obj.last_name.lower()}@example.com')
    phone_number = factory.LazyAttribute(lambda _: fake.phone_number()[:15])
    profile_picture = factory.LazyAttribute(lambda _: choice(profile_images))  # Imagen aleatoria
    is_active = True

    @factory.post_generation
    def set_password(self, create, extracted, **kwargs):
        password = 'defaultpassword' if not extracted else extracted
        self.set_password(password)
        if create:
            self.save()

    @factory.post_generation
    def assign_group(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            try:
                group = Group.objects.get(name=extracted)
                self.groups.add(group)
            except Group.DoesNotExist:
                print(f"Error: El grupo '{extracted}' no existe. No se pudo asignar al usuario.")

class CompanyFactory(DjangoModelFactory):
    class Meta:
        model = Company

    tax_id = factory.Sequence(lambda n: f'COMPANY{n}')
    name = factory.Faker('company', locale='es')
    country = factory.Faker('country')
    city = factory.Faker('city')
    address = factory.Faker('address')
    telephone = factory.LazyAttribute(lambda _: fake.phone_number()[:15])
    email = factory.LazyAttribute(lambda obj: f'info@{obj.name.lower().replace(" ", "")}.com')
    user = factory.SubFactory(UserFactory, assign_group='Business Manager')

class AreaFactory(DjangoModelFactory):
    class Meta:
        model = Area

    name = factory.Iterator(AREA_CHOICES, cycle=False) 
    company = factory.SubFactory(CompanyFactory)
    user = factory.SubFactory(UserFactory, assign_group='Area Admin')

class FreelancerFactory(DjangoModelFactory):
    class Meta:
        model = Freelancer

    user = factory.SubFactory(UserFactory, assign_group='Freelancer')
    description = factory.LazyFunction(generate_freelancer_paragraph)  
    country = factory.Faker('country')
    city = factory.Faker('city')

class SkillTypeFactory(DjangoModelFactory):
    class Meta:
        model = SkillType

    name = factory.Iterator(SKILL_TYPE_CHOICES, cycle=False)  

class SkillFactory(DjangoModelFactory):
    class Meta:
        model = Skill

    name = factory.Iterator(SKILL_CHOICES, cycle=False)
    is_predefined = True
    type = factory.SubFactory(SkillTypeFactory)

class FreelancerSkillFactory(DjangoModelFactory):
    class Meta:
        model = FreelancerSkill

    freelancer = factory.SubFactory(FreelancerFactory)
    skill = factory.SubFactory(SkillFactory)
    level = factory.LazyAttribute(lambda _: fake.random_int(min=50, max=100))

class NotificationFactory(DjangoModelFactory):
    class Meta:
        model = Notification

    message = factory.LazyFunction(lambda: generate_tech_notification())  
    created_at = factory.LazyFunction(timezone.now)

class UserNotificationFactory(DjangoModelFactory):
    class Meta:
        model = UserNotification

    notification = factory.SubFactory(NotificationFactory)
    user = factory.SubFactory(UserFactory)

class ProjectFactory(DjangoModelFactory):
    class Meta:
        model = Project

    name = factory.LazyAttribute(lambda _: choice(PROJECT_CHOICES))
    description = factory.LazyFunction(generate_project_paragraph)  
    start_date = factory.LazyFunction(timezone.now)
    user = factory.SubFactory(UserFactory, assign_group='Project Manager')
    budget = factory.LazyAttribute(lambda _: fake.random_int(min=10000, max=50000))

class ProjectFreelancerFactory(DjangoModelFactory):
    class Meta:
        model = ProjectFreelancer

    project = factory.SubFactory(ProjectFactory)
    freelancer = factory.SubFactory(FreelancerFactory)

class ProjectSkillFactory(DjangoModelFactory):
    class Meta:
        model = ProjectSkill

    project = factory.SubFactory(ProjectFactory)
    skill = factory.SubFactory(SkillFactory)
    level = factory.LazyAttribute(lambda _: fake.random_int(min=50, max=100))

def cargar_datos():

    try:
        freelancer_group = create_group_if_not_exists('Freelancer')
        business_manager_group = create_group_if_not_exists('Business Manager')
        area_admin_group = create_group_if_not_exists('Area Admin')
        project_manager_group = create_group_if_not_exists('Project Manager')
        print("Grupos cargados correctamente.")
    except Exception as e:
        print(f"Error al crear grupos: {str(e)}")
        return
    
    try:
        companies = CompanyFactory.create_batch(6)
        for company in companies:
            print(f'Compañía creada: {company.name}')
    except Exception as e:
        print(f"Error al crear compañías: {str(e)}")
        return

    try:
        for company in companies:
            AreaFactory.create_batch(2, company=company)
            print(f'Áreas creadas para la compañía: {company.name}')
    except Exception as e:
        print(f"Error al crear áreas: {str(e)}")
        return

    try:
        freelancers = FreelancerFactory.create_batch(5)
        print(f"Freelancers creados.")
    except Exception as e:
        print(f"Error al crear freelancers: {str(e)}")
        return

    try:
        business_managers = UserFactory.create_batch(5, assign_group='Business Manager')
        print(f"Business Managers creados.")
    except Exception as e:
        print(f"Error al crear Business Managers: {str(e)}")
        return

    try:
        area_admins = UserFactory.create_batch(5, assign_group='Area Admin')
        print(f"Area Admins creados.")
    except Exception as e:
        print(f"Error al crear Area Admins: {str(e)}")
        return

    try:
        skills = SkillFactory.create_batch(6)
        for freelancer in freelancers:
            FreelancerSkillFactory.create(freelancer=freelancer, skill=skills[fake.random_int(0, 2)])
        print("Habilidades asignadas a freelancers.")
    except Exception as e:
        print(f"Error al asignar habilidades: {str(e)}")
        return

    try:
        projects = ProjectFactory.create_batch(6)
        for project in projects:
            ProjectFreelancerFactory.create(project=project, freelancer=freelancers[fake.random_int(0, 2)])
            ProjectSkillFactory.create_batch(2, project=project)
        print("Proyectos creados y freelancers asignados.")
    except Exception as e:
        print(f"Error al crear proyectos o asignar freelancers: {str(e)}")
        return

    try:
        notifications = NotificationFactory.create_batch(12)
        for notification in notifications:
            for freelancer in freelancers:
                UserNotificationFactory.create(notification=notification, user=freelancer.user)
            for user in business_managers + area_admins:
                UserNotificationFactory.create(notification=notification, user=user)
        print("Notificaciones creadas.")
    except Exception as e:
        print(f"Error al crear notificaciones: {str(e)}")
        return

    print("Datos cargados exitosamente.")
