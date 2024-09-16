from django.contrib import admin
from .models import User, Company, Area, Project, Freelancer, Milestone, Deliverable, Role, Permission, Notification, UserRole, ProjectFreelancer, UserNotification

admin.site.register(User)
admin.site.register(Company)
admin.site.register(Area)
admin.site.register(Project)
admin.site.register(Freelancer)
admin.site.register(Milestone)
admin.site.register(Deliverable)
admin.site.register(Role)
admin.site.register(Permission)
admin.site.register(Notification)
admin.site.register(UserRole)
admin.site.register(ProjectFreelancer)
admin.site.register(UserNotification)


