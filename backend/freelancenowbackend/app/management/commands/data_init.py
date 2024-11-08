import factory
from factory.django import DjangoModelFactory
from django.utils import timezone
from faker import Faker
from random import choice
from django.db import transaction
from django.contrib.auth.models import Group
import random
from app.models import (
    User, UserRole, Company, Area, UserCompany,
    Freelancer, Skill, FreelancerSkill, Status, Project, ProjectFreelancer, ProjectSkill, 
    Experience, Comment, Payment, Deliverable, Milestone, Status
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

# SKILL_TYPE_CHOICES = ['Programación', 'Desarrollo Web', 'Desarrollo Móvil', 'DevOps', 'Bases de Datos', 'Seguridad Informática', 'Inteligencia Artificial', 
#                       'Data Science', 'Diseño Gráfico', 'Diseño UI/UX', 'Marketing Digital', 'Gestión de Proyectos', 'Gestión de Equipos', 'Metodologías Ágiles', 
#                       'Cloud Computing', 'Redes y Telecomunicaciones', 'Soporte Técnico', 'Consultoría', 'Automatización', 'Control de Calidad']

PROJECT_CHOICES = ['Desarrollo Plataforma Web', 'Aplicación Móvil', 'API Backend', 'Sistema de Gestión', 'Sitio Web Corporativo', 'E-commerce', 'Sistema de Gestión de Inventarios', 
                   'Automatización de Procesos', 'CRM (Gestión de Relaciones con Clientes)', 'ERP (Planificación de Recursos Empresariales)', 'Sistema de Facturación', 
                   'Sistema de Reservas', 'Aplicación de Monitoreo', 'Dashboard Analítico', 'Plataforma de Educación en Línea']

tech_keywords = ['plataforma', 'API', 'backend', 'microservicios', 'DevOps', 'Docker', 'Kubernetes', 'cloud', 'seguridad', 'machine learning']

positive_comment_templates = [
    "¡Gran trabajo de {freelancer} en {project}! Mostró excelentes habilidades en {skill}.",
    "{freelancer} fue un placer trabajar con él en {project}. La colaboración fue fluida y los resultados impresionantes.",
    "{freelancer} superó las expectativas en {project}, especialmente en el área de {skill}.",
    "Recomendaría a {freelancer} para futuros proyectos. Excelente desempeño en {project}.",
]

negative_comment_templates = [
    "El trabajo de {freelancer} en {project} fue decepcionante. Necesita mejorar sus habilidades en {skill}.",
    "{freelancer} tuvo dificultades para cumplir con los plazos en {project}.",
    "No quedé satisfecho con el trabajo de {freelancer} en {project}. El {skill} no estuvo a la altura.",
    "La comunicación con {freelancer} fue un desafío durante {project}. El desempeño en {skill} debe mejorar.",
]

milestone_templates = [
    "Desarrollar la arquitectura inicial del módulo {module} en el proyecto {project}, asegurando que cumpla con los estándares de diseño y esté preparado para futuras expansiones y optimizaciones.",
    "Implementar las funciones clave del módulo {module} en el proyecto {project}, en colaboración con {freelancer}, garantizando una base sólida para futuras integraciones.",
    "Completar el diseño y la estructura de datos del módulo {module} en {project}, permitiendo una gestión eficiente de la información y preparando el módulo para la fase de pruebas.",
    "Configurar el entorno de desarrollo y los recursos necesarios para el módulo {module} en {project}, facilitando un flujo de trabajo eficiente y reduciendo posibles problemas en fases posteriores.",
    "Realizar la fase inicial de pruebas de rendimiento en el módulo {module} del proyecto {project}, asegurando que el código cumpla con los parámetros de eficiencia definidos.",
    "Desarrollar una interfaz intuitiva para el módulo {module} en el proyecto {project}, con {freelancer} implementando elementos de usabilidad para mejorar la experiencia del usuario final.",
    "Integrar funcionalidades de seguridad en el módulo {module} para el proyecto {project}, reforzando los protocolos y asegurando que el módulo esté listo para auditorías de seguridad.",
    "Finalizar la creación del módulo {module} en {project}, con el objetivo de cumplir con los requisitos de funcionalidad y asegurar una experiencia de usuario fluida.",
    "Preparar la documentación técnica detallada para el módulo {module} en {project}, proporcionando a los equipos de soporte toda la información necesaria para futuras modificaciones.",
    "Optimizar el módulo {module} en el proyecto {project}, centrándose en mejorar el rendimiento y reducir el tiempo de carga, preparando el módulo para pruebas intensivas.",
    "Establecer los parámetros de control de calidad para el módulo {module} en {project}, con la participación de {freelancer}, definiendo métricas y criterios de aceptación para la fase de pruebas finales.",
    "Configurar la integración continua para el módulo {module} en el proyecto {project}, asegurando que cada nueva implementación sea probada y validada automáticamente para mantener la estabilidad del sistema."
    "Completar el desarrollo del módulo {module} para el proyecto {project}, asegurando la implementación de todas las funcionalidades requeridas y preparando el módulo para las pruebas de calidad e integración.",
    "Finalizar la entrega del módulo correspondiente al proyecto {project} con el apoyo de {freelancer}, incluyendo documentación y pruebas preliminares para garantizar que cumpla con los requisitos establecidos.",
    "Lograr el avance en el desarrollo del módulo {module} dentro del proyecto {project}, con {freelancer} enfocándose en la creación de funcionalidades clave y preparando el módulo para la fase de revisión.",
    "Realizar una revisión y validación inicial del módulo {module} en el proyecto {project} con {freelancer}, asegurando que el código esté optimizado y listo para la fase de pruebas detalladas."
]

deliverable_templates = [
    "Especificaciones detalladas del sistema para la milestone {milestone}.",
    "Resultados de pruebas y validación para la milestone {milestone}.",
    "Manual de usuario inicial correspondiente a la milestone {milestone}.",
    "Guía de instalación y configuración para la milestone {milestone}.",
    "Prototipo funcional preliminar de la milestone {milestone}.",
    "Plan de implementación para la milestone {milestone}.",
    "Resumen ejecutivo del avance en la milestone {milestone}.",
    "Presentación de resultados para la milestone {milestone}.",
    "Análisis de riesgos y mitigación para la milestone {milestone}.",
    "Esquemas de arquitectura para la milestone {milestone}.",
    "Resultados de pruebas de carga y estrés para la milestone {milestone}.",
    "Reporte de errores encontrados en la milestone {milestone}.",
    "Plan de capacitación relacionado con la milestone {milestone}.",
    "Evaluación de compatibilidad del sistema para la milestone {milestone}.",
    "Lista de control de calidad cumplida en la milestone {milestone}."
]

milestone_templates_names = [
    "Desarrollo inicial de {module} en {project}",
    "Configuración básica de {module} para {project}",
    "Optimización de {module} en el proyecto {project}",
    "Integración de {module} en {project}",
    "Documentación técnica de {module} para {project}",
    "Preparación de entorno para {module} en {project}",
    "Pruebas de funcionalidad del módulo {module} en {project}",
    "Validación de seguridad de {module} en {project}",
    "Revisión de interfaz de usuario para {module} en {project}",
    "Ajustes finales del módulo {module} en {project}",
    "Pruebas de rendimiento de {module} en {project}",
    "Entrega preliminar de {module} para el proyecto {project}",
    "Implementación de mejoras en {module} para {project}",
    "Configuración de parámetros para {module} en {project}",
    "Despliegue inicial de {module} en {project}",
    "Evaluación de calidad del módulo {module} en {project}"
]

profile_images = [
    'https://i.pinimg.com/736x/a3/53/66/a3536654d44f08f16044ae301a8be184.jpg',
    'https://i.pinimg.com/564x/9e/47/79/9e47798a74eb85a391204f7f32c509d1.jpg',
    'https://i.pinimg.com/564x/c5/cc/82/c5cc82bec47291eb587de8d9a6c92bb7.jpg',
    'https://i.pinimg.com/con   trol/564x/00/62/87/006287d3aa9c240f2ca4fdfe90d67a39.jpg',
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
        password = '123' if not extracted else extracted
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
    user = factory.LazyAttribute(lambda obj: obj.user)

class AreaFactory(DjangoModelFactory):
    class Meta:
        model = Area

    name = factory.Iterator(AREA_CHOICES, cycle=False) 
    company = factory.SubFactory(CompanyFactory)
    user = factory.LazyAttribute(lambda obj: obj.user)

class FreelancerFactory(DjangoModelFactory):
    class Meta:
        model = Freelancer

    user = factory.SubFactory(UserFactory, assign_group='Freelancer')
    description = factory.LazyFunction(generate_freelancer_paragraph)  
    country = factory.Faker('country')
    city = factory.Faker('city')

class SkillFactory(DjangoModelFactory):
    class Meta:
        model = Skill

    name = factory.Iterator(SKILL_CHOICES, cycle=False)
    is_predefined = True

class FreelancerSkillFactory(DjangoModelFactory):
    class Meta:
        model = FreelancerSkill

    freelancer = factory.SubFactory(FreelancerFactory)
    skill = factory.SubFactory(SkillFactory)
    level = factory.LazyAttribute(lambda _: fake.random_int(min=50, max=100))

# class NotificationFactory(DjangoModelFactory):
#     class Meta:
#         model = Notification

#     message = factory.LazyFunction(lambda: generate_tech_notification())  
#     created_at = factory.LazyFunction(timezone.now)

# class UserNotificationFactory(DjangoModelFactory):
#     class Meta:
#         model = UserNotification

#     notification = factory.SubFactory(NotificationFactory)
#     user = factory.SubFactory(UserFactory)

class ProjectFactory(DjangoModelFactory):
    class Meta:
        model = Project

    name = factory.LazyAttribute(lambda _: choice(PROJECT_CHOICES))
    description = factory.LazyFunction(generate_project_paragraph)  
    start_date = factory.LazyFunction(timezone.now)
    user = factory.LazyAttribute(lambda obj: obj.user)
    budget = factory.LazyAttribute(lambda _: fake.random_int(min=35000, max=125000))

class ProjectFreelancerFactory(DjangoModelFactory):
    class Meta:
        model = ProjectFreelancer

    project = factory.LazyAttribute(lambda obj: obj.project)
    freelancer = factory.LazyAttribute(lambda obj: obj.user)

class ProjectSkillFactory(DjangoModelFactory):
    class Meta:
        model = ProjectSkill

    project = factory.LazyAttribute(lambda obj: obj.project)
    skill = factory.LazyAttribute(lambda obj: obj.skill)  # Relacionar con skill existente
    level = factory.LazyAttribute(lambda _: fake.random_int(min=50, max=100))

class UserCompanyFactory(DjangoModelFactory):
    class Meta:
        model = UserCompany

    company = factory.LazyAttribute(lambda obj: obj.company)
    user = factory.LazyAttribute(lambda obj: obj.admin)
    area = factory.LazyAttribute(lambda obj: obj.area)

class UserRoleFactory(DjangoModelFactory):
    class Meta:
        model = UserRole

    role = factory.LazyAttribute(lambda obj: obj.user)
    user = factory.LazyAttribute(lambda obj: obj.role)

class ExperienceFactory(DjangoModelFactory):
    class Meta:
        model = Experience

    start_date = factory.Faker('date_between', start_date='-5y', end_date='today')
    final_date = factory.Faker('date_between', start_date='today', end_date='+1y')
    occupation = factory.Faker('job')
    description = factory.Faker('sentence')
    company = factory.Faker('company')
    freelancer = factory.LazyAttribute(lambda obj: obj.user)

class CommentFactory(DjangoModelFactory):
    class Meta:
        model = Comment
    
    description = factory.LazyAttribute(lambda obj: random.choice(
        positive_comment_templates if random.choice([True, False]) else negative_comment_templates
    ).format(
        freelancer=obj.freelancer.user.first_name,
        project=random.choice(projects),
        skill=random.choice(SKILL_CHOICES)
    ))
    
    stars = factory.LazyAttribute(lambda _: random.choice([i * 0.5 for i in range(11)]))
    
    freelancer = factory.LazyAttribute(lambda obj: obj.freelancer)
    writer = factory.LazyAttribute(lambda obj: obj.writer)

class MilestoneFactory(DjangoModelFactory):
    class Meta:
        model = Milestone

    name = factory.LazyAttribute(lambda obj: random.choice(milestone_templates_names).format(
        module=random.choice(["API", "dashboard", "frontend", "backend"]),
        project=obj.project.name,
    ))
    description = factory.LazyAttribute(lambda obj: random.choice(milestone_templates).format(
        module=random.choice(["API", "dashboard", "frontend", "backend"]),
        project=obj.project.name,
        freelancer=obj.freelancer.user.first_name
    ))
    due_date = factory.Faker('date_between', start_date='today', end_date='+1y')
    freelancer = factory.LazyAttribute(lambda obj: obj.freelancer)
    project = factory.LazyAttribute(lambda obj: obj.project)

class DeliverableFactory(DjangoModelFactory):
    class Meta:
        model = Deliverable

    name = factory.LazyAttribute(lambda obj: (random.choice(deliverable_templates).format(
        milestone=obj.milestone.name
    ))[:100])  

    description = factory.LazyAttribute(lambda obj: (random.choice(deliverable_templates).format(
        milestone=obj.milestone.name
    ))[:100]) 

    milestone = factory.SubFactory(MilestoneFactory)

class PaymentFactory(DjangoModelFactory):
    class Meta:
        model = Payment 

    date = factory.Faker('date_this_year')
    status = factory.Iterator(['pending', 'completed', 'failed'])
    amount = factory.LazyAttribute(lambda _: fake.random_int(min=3500, max=12000))
    project = factory.LazyAttribute(lambda obj: obj.project)
    freelancer = factory.LazyAttribute(lambda obj: obj.freelancer)

class StatusFactory(DjangoModelFactory):
    class Meta:
        model = Status

    name = factory.LazyAttribute(lambda obj: obj.name)  

def cargar_datos():

    roles = []
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
        freelancers = FreelancerFactory.create_batch(8)

        for freelancer in freelancers:
            uR = UserRoleFactory(user=freelancer.user, role=freelancer_group)  
            roles.append(uR)
        print(f"Freelancers creados y roles asignados.")
    except Exception as e:
        print(f"Error al crear freelancers o asignar roles: {str(e)}")
        return

    try:
        skills = SkillFactory.create_batch(20)
        for freelancer in freelancers:
            FreelancerSkillFactory.create(freelancer=freelancer, skill=skills[fake.random_int(0, len(skills) - 1)])
        print("Habilidades asignadas a freelancers.")
    except Exception as e:
        print(f"Error al asignar habilidades: {str(e)}")
        return

    try:
        business_managers = UserFactory.create_batch(2, assign_group='Business Manager')
        for manager in business_managers:
            # Asignar el rol "Business Manager"
            uR = UserRoleFactory(user=manager, role=business_manager_group)
            roles.append(uR)
        print(f"Business Managers creados y roles asignados.")
    except Exception as e:
        print(f"Error al crear Business Managers o asignar roles: {str(e)}")
        return

    try:
        area_admins = UserFactory.create_batch(4, assign_group='Area Admin')
        for admin in area_admins:
            # Asignar el rol "Area Admin"
            uR = UserRoleFactory(user=admin, role=area_admin_group)
            roles.append(uR)
        print(f"Area Admins creados y roles asignados.")
    except Exception as e:
        print(f"Error al crear Area Admins o asignar roles: {str(e)}")
        return

    try:
        project_managers = UserFactory.create_batch(4, assign_group='Project Manager')
        for pm in project_managers:
            # Asignar el rol "Project Manager"
            uR = UserRoleFactory(user=pm, role=project_manager_group)
            roles.append(uR)
        print(f"Project Managers creados y roles asignados.")
    except Exception as e:
        print(f"Error al crear Project Managers o asignar roles: {str(e)}")
        return

    try:
        companies = []  

        for bm in business_managers:
            company = CompanyFactory(user=bm)
            companies.append(company)  
            UserCompanyFactory(company=company, user=bm, area=None)

            print(f'Compañía creada: {company.name} asignada a {bm.email}')
    except Exception as e:
        print(f"Error al crear compañías: {str(e)}")
        return
    #Areas
    try:
        areas = []
        admin_index = 0  
        for company in companies:
            for _ in range(2):
                if admin_index >= len(area_admins):
                    print("Se alcanzó el número máximo de Area Admins disponibles.")
                    break

                admin = area_admins[admin_index]
                if not Area.objects.filter(user=admin).exists():
                    area = AreaFactory(company=company, user=admin)
                    areas.append(area)
                    UserCompanyFactory(company=company, user=admin, area=area)
                    pmanager = project_managers[admin_index]
                    UserCompanyFactory(company=company, user=pmanager, area=area)
                admin_index += 1
            print(f'Áreas creadas para la compañía: {company.name}')
            if admin_index >= len(area_admins):
                break
    except Exception as e:
        print(f"Error al crear áreas: {str(e)}")
        return
    #Proyectos
    try:
        projects = [] 
        free_index = 0
        for pm in project_managers:
            project = ProjectFactory.create(user=pm)
            projects.append(project)

        for project in projects:
            for _ in range(2):
                    if free_index >= len(freelancers):
                        print("Se alcanzó el número máximo de Freelancers disponibles.")
                        break

                    freelan = freelancers[free_index]
                    ProjectFreelancerFactory.create(project=project, freelancer=freelan)
                    free_index += 1

            project_skills = random.sample(skills, 2)  
            for skill in project_skills:
                ProjectSkillFactory.create(project=project, skill=skill)

        print("Proyectos creados, freelancers y skills asignados.")
    except Exception as e:
        print(f"Error al crear proyectos o asignar freelancers: {str(e)}")
        return
    #Notificaciones
    # try:
    #     for project in projects:

    #         notification_1 = NotificationFactory.create(message=f"Actualización importante del proyecto {project.name}")
    #         notification_2 = NotificationFactory.create(message=f"Nueva versión disponible para {project.name}")

    #         UserNotificationFactory.create(notification=notification_1, user=project.user)  # Project Manager es el 'user' del proyecto
    #         UserNotificationFactory.create(notification=notification_2, user=project.user)

    #         freelancers_in_project = ProjectFreelancer.objects.filter(project=project).select_related('freelancer')
            
    #         for project_freelancer in freelancers_in_project:
    #             freelancer_user = project_freelancer.freelancer.user  # Obtener el usuario del freelancer asignado a este proyecto
    #             UserNotificationFactory.create(notification=notification_1, user=freelancer_user)
    #             UserNotificationFactory.create(notification=notification_2, user=freelancer_user)
                    
    #     print("Notificaciones creadas y asignadas correctamente por proyecto.") 
    # except Exception as e:
    #     print(f"Error al crear notificaciones: {str(e)}")
    #     return
    #Experiencia
    try:
        for freelancer in freelancers:
            ExperienceFactory.create_batch(2, freelancer=freelancer)
        print("Experiencia asignada a los freelancers.")
    except Exception as e:
        print(f"Error al asignar experiencia: {str(e)}")
        return
    #Comentarios
    try:
        for freelancer in freelancers:
            for manager in business_managers:
                CommentFactory.create(freelancer=freelancer, writer=manager)
        print("Comentarios creados para los freelancers.")
    except Exception as e:
        print(f"Error al crear comentarios: {str(e)}")
        return
    #Milestones
    try:
        for project in projects:

            freelancers_in_project = ProjectFreelancer.objects.filter(project=project).select_related('freelancer')
            for freelancer in freelancers_in_project:
                try:
                    milestones = MilestoneFactory.create_batch(2, project=project, freelancer=freelancer.freelancer)
                except Exception as e:
                    print(f"Error al crear milestones para {project.name} y {freelancer.freelancer.user.first_name}: {str(e)}")
                    continue

                for milestone in milestones:
                    try:
                        DeliverableFactory.create_batch(2, milestone=milestone)
                    except Exception as e:
                        print(f"Error al crear deliverables para el milestone {milestone.name}: {str(e)}")
                        continue
    except Exception as e:
        print(f"Error general: {str(e)}")
    #Pagos
    try:
        for project in projects:
            freelancers_in_project = ProjectFreelancer.objects.filter(project=project).select_related('freelancer')

            for freelancer in freelancers_in_project:
                PaymentFactory.create(project=project, freelancer=freelancer.freelancer, status='pending')
        print("Pagos creados.")
    except Exception as e:
        print(f"Error al crear pagos: {str(e)}")
        return

    print("Datos cargados exitosamente.")
