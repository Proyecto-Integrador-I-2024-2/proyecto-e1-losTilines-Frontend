from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.forms import ValidationError
from django.db.models import CheckConstraint, Q
from django.core.validators import RegexValidator, EmailValidator, MinValueValidator, MaxValueValidator

# ---------------------- USERS ---------------------- #
# app/models.py

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es requerido')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']  # Campos que también son requeridos al crear un superusuario

    def __str__(self):
        return self.email

        
class Role(models.Model):
    name = models.CharField(max_length=100, validators=[RegexValidator(regex='^[\w\s]+$', message='Name can only contain alphanumeric characters and spaces.')])
    description = models.CharField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class UserRole(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user)

class Permission(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
class Notification(models.Model):
    message = models.CharField(max_length=2000)
    created_at = models.DateField()

    def __str__(self):
        return self.message

class UserNotification(models.Model):
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)

# ---------------------- COMPANIES ---------------------- #
class Company(models.Model):
    company_id = models.CharField(max_length=30, unique=True, validators=[RegexValidator(regex=r'^[A-Z0-9]{1,30}$', message='Company ID must be alphanumeric and up to 30 characters.')])
    name = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=50)
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=50)
    telephone = models.CharField(max_length=20, validators=[RegexValidator(regex=r'^\+?\d{7,15}$', message='Telephone number must be between 7 and 15 digits.')])
    email = models.EmailField(max_length=100, validators=[EmailValidator()])
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['email'], name='unique_company_email')
        ]

class Area(models.Model):
    name = models.CharField(max_length=20)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'company'], name='unique_area_name_per_company')
        ]

# ---------------------- FREELANCERS ---------------------- #
class Freelancer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

class Skill(models.Model):
    SOFT = 'soft'
    HARD = 'hard'
    LANGUAGE = 'language'

    SKILL_TYPE_CHOICES = [
        (SOFT, 'Soft'),
        (HARD, 'Hard'),
        (LANGUAGE, 'Language'),
    ]

    name = models.CharField(max_length=15, unique=True)
    is_predefined = models.BooleanField(default=False)
    type = models.CharField(max_length=15, choices=SKILL_TYPE_CHOICES, default=SOFT)

    def __str__(self):
        return self.name

class FreelancerSkill(models.Model):
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    
class Experience(models.Model):
    start_date = models.DateField()
    final_date = models.DateField(null=True, blank=True)
    occupation = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.occupation} at {self.company}'
    
class Portfolio(models.Model):
    date = models.DateField()
    project_name = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    url = models.URLField()
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)

class Comment(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    stars = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

# ---------------------- PROJECTS ---------------------- #
class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=2000)
    start_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    budget = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.00)])
    area = models.ForeignKey(Area, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class ProjectFreelancer(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.freelancer} working on {self.project}'
    
class ProjectSkill(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.skill} required for {self.project}'
    
class Milestone(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True)
    due_date = models.DateField()
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def clean(self):
        if self.due_date < self.project.start_date:
            raise ValidationError('The due date cannot be before the project start date.')

class Deliverable(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True)
    attachment = models.FileField(upload_to='deliverables/', blank=True, null=True)

    def __str__(self):
        return self.name

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    amount = models.DecimalField(max_digits=10, decimal_places=3, validators=[MinValueValidator(0.00)])
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)

    def __str__(self):
        return f'Payment {self.id} for Project {self.project.name}'