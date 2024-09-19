from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.forms import ValidationError
from django.db.models import CheckConstraint, Q
from django.core.validators import RegexValidator, EmailValidator, MinValueValidator, MaxValueValidator

# ---------------------- USERS ---------------------- #
class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
    
    def clean(self):
        super().clean()
        if len(self.password) < 8:
            raise ValidationError('Password must be at least 8 characters long.')
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    class Meta:
        constraints = [
            CheckConstraint(check=Q(phone_number__regex=r'^\+?\d{7,15}$'), name='valid_phone_number')
        ]
        
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