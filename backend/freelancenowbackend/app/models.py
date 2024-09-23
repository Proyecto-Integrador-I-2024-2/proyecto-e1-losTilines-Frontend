from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.forms import ValidationError
from django.core.validators import RegexValidator, EmailValidator, MinValueValidator, MaxValueValidator
from cities_light.models import Country, City
from django.utils import timezone

# ---------------------- USERS ---------------------- #
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
    REQUIRED_FIELDS = ['first_name', 'last_name'] 

    def __str__(self):
        return self.email
    
class UserRole(models.Model):
    role = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.user)

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
    tax_id = models.CharField(max_length=30, unique=True, validators=[RegexValidator(regex=r'^[A-Z0-9]{1,30}$', message='Company ID must be alphanumeric and up to 30 characters.')])
    name = models.CharField(max_length=100, unique=True)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)
    address = models.CharField(max_length=200)
    telephone = models.CharField(max_length=20, validators=[RegexValidator(regex=r'^\+?\d{7,15}$', message='Telephone number must be between 7 and 15 digits.')])
    email = models.EmailField(max_length=100, validators=[EmailValidator()])
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=300, null=True,blank=True)
    profile_picture = models.ImageField(upload_to='uploads/', blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['email'], name='unique_company_email')
        ]
    def save(self, *args, **kwargs):
        if not self.user.groups.filter(name="Business Manager").exists():
            raise ValueError("Only business manager can be in a company register")
        super().save(*args, **kwargs)

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
    def save(self, *args, **kwargs):
        #if not self.user.groups.filter(name="Area Admin").exists() or not self.user.groups.filter(name="Business Manager").exists():
            #raise ValueError("The user must be part of the company and not be project manager.")
        super().save(*args, **kwargs)

class UserCompany(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    area = models.ForeignKey(Area, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return str(self.user)
    
    def save(self, *args, **kwargs):
        if self.user.groups.filter(name="Freelancer").exists():
            raise ValueError("This user type cannot be in a company")
        super().save(*args, **kwargs)

# ---------------------- FREELANCERS ---------------------- #
class SkillType(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

class Skill(models.Model):
    name = models.CharField(max_length=30, unique=True)
    is_predefined = models.BooleanField(default=False)
    type = models.ForeignKey(SkillType, on_delete=models.CASCADE)   

    def __str__(self):
        return self.name

class FreelancerSkill(models.Model):
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    level = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])

    def __str__(self):
        return f'{self.freelancer.first_name} - {self.skill.name}'
    def save(self, *args, **kwargs):
        if not self.freelancer.groups.filter(name="Freelancer").exists():
            raise ValueError("The user must be part of the 'freelancer' group.")
        super().save(*args, **kwargs)
    
class Experience(models.Model):
    start_date = models.DateField()
    final_date = models.DateField(null=True, blank=True)
    occupation = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.occupation} at {self.company}'
    
    def save(self, *args, **kwargs):
        if not self.freelancer.groups.filter(name="Freelancer").exists():
            raise ValueError("The user must be part of the 'freelancer' group.")
        super().save(*args, **kwargs)
    
class Portfolio(models.Model):
    date = models.DateField()
    project_name = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    url = models.URLField()
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.project_name} by {self.freelancer.first_name}'

    def save(self, *args, **kwargs):
        if not self.freelancer.groups.filter(name="Freelancer").exists():
            raise ValueError("The user must be part of the 'freelancer' group.")
        super().save(*args, **kwargs)

class Comment(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    stars = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='freelancer_comments')
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='worker_comments', null=True)

    def __str__(self):
        return self.title
    def save(self, *args, **kwargs):
        if not self.freelancer.groups.filter(name="Freelancer").exists():
            raise ValueError("This user types dont allow comments")
        if self.writer.groups.filter(name="Freelancer").exists():
            raise ValueError("You cannot comment this")
        super().save(*args, **kwargs)

# ---------------------- PROJECTS ---------------------- #

class Project(models.Model):
    statusproject = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
        ('in course', 'In course'),
    ]

    name = models.CharField(max_length=100)
    description = models.CharField(max_length=2000)
    start_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    budget = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.00)])
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/', blank=True, null=True)
    status = models.CharField(choices=statusproject, default="pending")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="owner_project")

    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):
        if self.user.groups.filter(name="freelancer").exists():
            raise ValueError("This user type cannot contain a project")
        super().save(*args, **kwargs)
    
class ProjectFreelancer(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.freelancer} working on {self.project}'
    def save(self, *args, **kwargs):
        if not self.freelancer.groups.filter(name="freelancer").exists():
            raise ValueError("The user must be part of the 'freelancer' group.")
        super().save(*args, **kwargs)
    
class ProjectSkill(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    level = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])

    def __str__(self):
        return f'{self.skill} required for {self.project}'
    
class Milestone(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True)
    due_date = models.DateField()
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/', blank=True, null=True)

    def __str__(self):
        return self.name

    def clean(self):
        if self.due_date < self.project.start_date:
            raise ValidationError('The due date cannot be before the project start date.')
    def save(self, *args, **kwargs):
        if not self.freelancer.groups.filter(name="freelancer").exists():
            raise ValueError("The user must be part of the 'freelancer' group.")
        super().save(*args, **kwargs)

class Deliverable(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True)
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE)
    attachment = models.FileField(upload_to='uploads/', blank=True, null=True)

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
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'Payment {self.id} for Project {self.project.name}'
    def save(self, *args, **kwargs):
        if not self.freelancer.groups.filter(name="freelancer").exists():
            raise ValueError("The user must be part of the 'freelancer' group.")
        super().save(*args, **kwargs)