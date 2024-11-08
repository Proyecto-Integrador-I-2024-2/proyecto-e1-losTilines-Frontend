from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.forms import ValidationError
from django.core.validators import RegexValidator, EmailValidator, MinValueValidator, MaxValueValidator
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
    profile_picture = models.URLField(blank=True, null=True)
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

# ---------------------- COMPANIES ---------------------- #
class Company(models.Model):
    tax_id = models.CharField(max_length=30, unique=True, validators=[RegexValidator(regex=r'^[A-Z0-9]{1,30}$', message='Company ID must be alphanumeric and up to 30 characters.')])
    name = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=200)
    telephone = models.CharField(max_length=20, validators=[RegexValidator(regex=r'^\+?\d{7,15}$', message='Telephone number must be between 7 and 15 digits.')])
    email = models.EmailField(max_length=100, validators=[EmailValidator()])
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=300, null=True, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='uploads/', blank=True, null=True)

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
class Freelancer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    description = models.CharField(max_length=2000, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    portfolio = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.user.email

    def save(self, *args, **kwargs):
        if not self.user.groups.filter(name="Freelancer").exists():
            raise ValueError("The user must be part of the 'freelancer' group.")
        super().save(*args, **kwargs)

class Skill(models.Model):
    name = models.CharField(max_length=30, unique=True)
    is_predefined = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class FreelancerSkill(models.Model):
    freelancer = models.ForeignKey(Freelancer, related_name='skills', on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    level = models.IntegerField()

    def __str__(self):
        return f'{self.freelancer.user.first_name} - {self.skill.name}'
    
class Experience(models.Model):
    start_date = models.DateField()
    final_date = models.DateField(null=True, blank=True)
    occupation = models.CharField(max_length=100)
    description = models.CharField(max_length=300, null=True, blank=True)
    company = models.CharField(max_length=100)
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.occupation} at {self.company}'

class Comment(models.Model):
    description = models.TextField(blank=True)
    stars = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name='comments')
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments', null=True)
    created_at = models.DateTimeField(default=timezone.now)
    response = models.TextField(blank=True, null=True)  # Campo para respuesta del freelancer

    def __str__(self):
        return f"Comment by {self.writer} on {self.freelancer}"

    def save(self, *args, **kwargs):
        if self.writer.groups.filter(name="Freelancer").exists():
            raise ValueError("Only clients can post comments")
        super().save(*args, **kwargs)

# ---------------------- PROJECTS ---------------------- #
class Status(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('open_to_apply', 'Open to apply'),
        ('in_progress', 'In Progress'),
        ('in_progress_and_open_to_apply', 'In Progress and open to apply'),
        ('finished', 'Finished'),
        ('rejected', 'Rejected'),
        ('canceled', 'Canceled'),
    ]

    name = models.CharField(max_length=100)
    description = models.CharField(max_length=2000)
    start_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    budget = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.00)])
    file = models.FileField(upload_to='uploads/', blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    image = models.ImageField(upload_to='uploads/', blank=True, null=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if self.user.groups.filter(name="freelancer").exists():
            raise ValueError("This user type cannot contain a project")
        super().save(*args, **kwargs)

    def get_notification_recipient(self):
        user_company = UserCompany.objects.filter(user=self.user).first()
        if not user_company:
            return []
        
        company = user_company.company
        area = user_company.area

        # Business Manager
        business_manager = User.objects.filter(
            usercompany__company=company,
            groups__name='Business Manager'
        ).first()

        # Area Admin
        admin_area = User.objects.filter(
            usercompany__area=area,
            groups__name='Area Admin'
        ).exclude(pk=business_manager.pk if business_manager else None).first()

        project_manager = self.user

        recipients = [
            {"user": project_manager, "message": "Your project creation request has been created successfully."},
            {"user": business_manager, "message": f"{project_manager.first_name} has submitted a request to create the project {self.name} in the {area.name} area of your company."},
            {"user": admin_area, "message": f"{project_manager.first_name} has submitted a request to create the project {self.name} in your area."}
        ]

        return recipients
   
class ProjectFreelancer(models.Model):
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
        ('freelancer_interested', 'Freelancer Interested'),
        ('company_interested', 'Company Interested'),
        ('rejected', 'Rejected'),
        ('undefined', 'Undefined'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='undefined')

    def __str__(self):
        return f'{self.freelancer} working on {self.project}'
    
    @classmethod
    def get_status_choices(cls):
        return cls.STATUS_CHOICES
    
class ProjectSkill(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    level = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])

    def __str__(self):
        return f'{self.skill} required for {self.project}'
    
class Milestone(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('to_do', 'To Do'),
        ('in_progress', 'In Progress'),
        ('review', 'Review'),
        ('done', 'Done')
    ]

    name = models.CharField(max_length=300)
    description = models.CharField(max_length=1200, blank=True)
    due_date = models.DateField()
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/', blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return self.name

    def clean(self):
        if self.due_date < self.project.start_date:
            raise ValidationError('The due date cannot be before the project start date.')

class Deliverable(models.Model):
    STATUS_CHOICES = [
        ('to_do', 'To Do'),
        ('in_progress', 'In Progress'),
        ('review', 'Review'),
        ('done', 'Done')
    ]

    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True)
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='to_do')
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
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)

    def __str__(self):
        return f'Payment {self.id} for Project {self.project.name}'