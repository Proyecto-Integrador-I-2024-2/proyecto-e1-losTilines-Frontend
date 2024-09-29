from rest_framework.permissions import SAFE_METHODS, BasePermission

# Verify if the user belongs to a specific group
class IsInGroup(BasePermission):
    group_name = None  

    def has_permission(self, request, view):
        # Verify if the group_name attribute is set
        if self.group_name is None:
            raise ValueError("group_name must be defined in the subclass")

        # Allows all authenticated users to perform safe methods (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            return True

        # For unsafe methods (POST, PUT, PATCH, DELETE), the user must be in the specified group
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