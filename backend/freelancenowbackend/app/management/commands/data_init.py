import factory
from factory.django import DjangoModelFactory
from django.utils import timezone
from faker import Faker
from random import choice
from django.db import transaction
from django.contrib.auth.models import Group
from app.models import (
    User, UserRole, Notification, UserNotification, Company, Area, UserCompany,
    Freelancer, SkillType, Skill, FreelancerSkill, Status, Project, ProjectFreelancer, ProjectSkill
)

fake = Faker('es_CO')

SKILL_CHOICES = ['Python', 'Django', 'JavaScript', 'React', 'HTML', 'CSS', 'SQL']
PROJECT_CHOICES = ['Desarrollo Plataforma Web', 'Aplicación Móvil', 'API Backend', 'Sistema de Gestión']

profile_images = [
    'https://i.pinimg.com/736x/a3/53/66/a3536654d44f08f16044ae301a8be184.jpg',
    'https://i.pinimg.com/564x/9e/47/79/9e47798a74eb85a391204f7f32c509d1.jpg',
    'https://i.pinimg.com/564x/c5/cc/82/c5cc82bec47291eb587de8d9a6c92bb7.jpg',
    'https://i.pinimg.com/control/564x/00/62/87/006287d3aa9c240f2ca4fdfe90d67a39.jpg',
    'https://i.pinimg.com/control/564x/b8/2c/5a/b82c5a7a7c122bcdd87dbe495edf7294.jpg',
    'https://i.pinimg.com/564x/7e/ac/b0/7eacb0cd582fb0d069281511adacdddd.jpg'
]

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

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
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
            # Verificar si el grupo existe antes de asignar
            try:
                group = Group.objects.get(name=extracted)
                self.groups.add(group)
            except Group.DoesNotExist:
                print(f"Error: El grupo '{extracted}' no existe. No se pudo asignar al usuario.")

class CompanyFactory(DjangoModelFactory):
    class Meta:
        model = Company

    tax_id = factory.Sequence(lambda n: f'COMPANY{n}')
    name = factory.Faker('company')
    country = factory.Faker('country')
    city = factory.Faker('city')
    address = factory.Faker('address')
    telephone = factory.LazyAttribute(lambda _: fake.phone_number()[:15])
    email = factory.LazyAttribute(lambda obj: f'info@{obj.name.lower().replace(" ", "")}.com')
    user = factory.SubFactory(UserFactory, assign_group='business_manager')

class AreaFactory(DjangoModelFactory):
    class Meta:
        model = Area

    name = factory.Faker('word')
    company = factory.SubFactory(CompanyFactory)
    user = factory.SubFactory(UserFactory, assign_group='area_admin')

class FreelancerFactory(DjangoModelFactory):
    class Meta:
        model = Freelancer

    user = factory.SubFactory(UserFactory, assign_group='freelancer')
    description = factory.Faker('sentence')
    country = factory.Faker('country')
    city = factory.Faker('city')

class SkillTypeFactory(DjangoModelFactory):
    class Meta:
        model = SkillType

    name = factory.Faker('word')

class SkillFactory(DjangoModelFactory):
    class Meta:
        model = Skill

    name = factory.LazyAttribute(lambda _: choice(SKILL_CHOICES))  
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

    message = factory.Faker('sentence')
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
    description = factory.Faker('paragraph')
    start_date = factory.LazyFunction(timezone.now)
    user = factory.SubFactory(UserFactory, assign_group='project_manager')
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
        with transaction.atomic():
            # Cargar grupos
            freelancer_group = create_group_if_not_exists('Freelancer')
            business_manager_group = create_group_if_not_exists('Business Manager')
            area_admin_group = create_group_if_not_exists('Area Admin')
            project_manager_group = create_group_if_not_exists('Project Manager')  

            # Verificar que los grupos han sido creados correctamente
            for group_name in ['Freelancer', 'Business Manager', 'Area Admin', 'Project Manager']:
                group = Group.objects.filter(name=group_name).first()
                if group:
                    print(f'Grupo {group_name} está en la base de datos.')
                else:
                    raise Exception(f'Error: El grupo {group_name} no se pudo crear o no existe.')

        # Crear usuarios, empresas y otros modelos
        freelancers = UserFactory.create_batch(3, assign_group='freelancer')
        business_managers = UserFactory.create_batch(3, assign_group='business_manager')
        area_admins = UserFactory.create_batch(3, assign_group='area_admin')
        project_managers = UserFactory.create_batch(3, assign_group='project_manager')

        companies = CompanyFactory.create_batch(3)
        for company in companies:
            AreaFactory.create_batch(2, company=company)

        freelancers_profiles = FreelancerFactory.create_batch(3)
        skills = SkillFactory.create_batch(3)  
        for freelancer in freelancers_profiles:
            FreelancerSkillFactory.create(freelancer=freelancer, skill=skills[fake.random_int(0, 2)])

        projects = ProjectFactory.create_batch(3)
        for project in projects:
            ProjectFreelancerFactory.create(project=project, freelancer=freelancers_profiles[fake.random_int(0, 2)])
            ProjectSkillFactory.create_batch(2, project=project)

        notifications = NotificationFactory.create_batch(3)
        for notification in notifications:
            for user in freelancers + business_managers + area_admins + project_managers:
                UserNotificationFactory.create(notification=notification, user=user)

        print("Datos cargados exitosamente.")
    except Exception as e:
        print(f"Ocurrió un error durante la carga de datos: {str(e)}")

# Ejecutar la carga de datos
cargar_datos()
