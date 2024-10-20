import factory
from factory.django import DjangoModelFactory
from django.utils import timezone
from faker import Faker
from django.contrib.auth.models import Group
from app.models import (
    User, UserRole, Notification, UserNotification, Company, Area, UserCompany,
    Freelancer, SkillType, Skill, FreelancerSkill, Status, Project, ProjectFreelancer, ProjectSkill
)

fake = Faker('es_CO')  # Datos realistas para Colombia

# Fábricas
class GroupFactory(DjangoModelFactory):
    class Meta:
        model = Group

    name = factory.Faker('word')

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.LazyAttribute(lambda obj: f'{obj.first_name.lower()}.{obj.last_name.lower()}@example.com')
    phone_number = factory.Faker('phone_number')
    profile_picture = factory.Faker('image_url')
    is_active = True

    @factory.post_generation
    def set_password(self, create, extracted, **kwargs):
        password = 'defaultpassword' if not extracted else extracted
        self.set_password(password)
        if create:
            self.save()

    @factory.post_generation
    def assign_group(self, create, extracted, **kwargs):
        if not create or not extracted:
            return
        group = Group.objects.get(name=extracted)
        self.groups.add(group)

class CompanyFactory(DjangoModelFactory):
    class Meta:
        model = Company

    tax_id = factory.Sequence(lambda n: f'COMPANY{n}')
    name = factory.Faker('company')
    country = factory.Faker('country')
    city = factory.Faker('city')
    address = factory.Faker('address')
    telephone = factory.Faker('phone_number')
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

    name = factory.Faker('word')
    is_predefined = True
    type = factory.SubFactory(SkillTypeFactory)

class FreelancerSkillFactory(DjangoModelFactory):
    class Meta:
        model = FreelancerSkill

    freelancer = factory.SubFactory(FreelancerFactory)
    skill = factory.SubFactory(SkillFactory)
    level = factory.LazyAttribute(lambda _: fake.random_int(min=50, max=100))

class ProjectFactory(DjangoModelFactory):
    class Meta:
        model = Project

    name = factory.Faker('sentence')
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

# Función para cargar datos
def cargar_datos():
    GroupFactory.create_batch(4, name=['Freelancer', 'Business Manager', 'Area Admin', 'Project Manager'])
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

    print("Datos cargados exitosamente.")

# Ejecutar la carga de datos
cargar_datos()
