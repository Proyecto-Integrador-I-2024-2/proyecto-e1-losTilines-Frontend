from rest_framework.permissions import SAFE_METHODS, BasePermission
from .models import UserCompany

class IsInGroup(BasePermission):
    group_name = None  

    def has_permission(self, request, view):
        if self.group_name is None:
            raise ValueError("group_name must be defined in the subclass")

        if request.method in SAFE_METHODS:
            return True

        return (
            request.user
            and request.user.groups.filter(name=self.group_name).exists()
        )

class IsFreelancer(IsInGroup):
    group_name = "Freelancer"

class IsBusinessManager(IsInGroup):
    group_name = "Business Manager"

class IsAreaAdmin(IsInGroup):
    group_name = "Area Admin"

class IsProjectManager(IsInGroup):
    group_name = "Project Manager"

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj == request.user

class IsBusinessManagerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated

        return request.user.groups.filter(name='Business Manager').exists()

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return UserCompany.objects.filter(user=request.user, company=obj).exists()