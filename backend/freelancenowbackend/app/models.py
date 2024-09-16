from django.db import models
from django.contrib.auth.hashers import make_password


# Model for USER table
class User(models.Model):
    user_id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=255)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    def check_password(self, raw_password):
        return self.password == make_password(raw_password)


# Model for Company table
class Company(models.Model):
    company_id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    tax_id = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)
    email = models.EmailField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# Model for Area table
class Area(models.Model):
    area_id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=20)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# Model for Project table
class Project(models.Model):
    project_id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    area = models.ForeignKey(Area, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# Model for Freelancer table
class Freelancer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    portfolio_url = models.URLField(max_length=255)
    skills = models.TextField()

    def __str__(self):
        return self.user.name


# Model for Milestone table
class Milestone(models.Model):
    milestone_id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=200)
    due_date = models.DateField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# Model for Deliverable table
class Deliverable(models.Model):
    deliverable_id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=200)
    attachment = models.BinaryField(null=True, blank=True)
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# Model for Role table
class Role(models.Model):
    role_id = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=2000)

    def __str__(self):
        return self.name


# Model for Permission table
class Permission(models.Model):
    permission_id = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# Model for Notification table
class Notification(models.Model):
    notification_id = models.CharField(max_length=32, primary_key=True)
    message = models.CharField(max_length=2000)
    created_at = models.DateTimeField()

    def __str__(self):
        return self.message


# Model for UserRole table (Many-to-many relationship between User and Role)
class UserRole(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('role', 'user'),)

    def __str__(self):
        return f'{self.user.name} - {self.role.name}'


# Model for ProjectFreelancer table (Many-to-many relationship between Project and Freelancer)
class ProjectFreelancer(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('project', 'freelancer'),)

    def __str__(self):
        return f'{self.freelancer.user.name} in {self.project.name}'


# Model for UserNotification table (Many-to-many relationship between User and Notification)
class UserNotification(models.Model):
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('notification', 'user'),)

    def __str__(self):
        return f'{self.notification.message} for {self.user.name}'
