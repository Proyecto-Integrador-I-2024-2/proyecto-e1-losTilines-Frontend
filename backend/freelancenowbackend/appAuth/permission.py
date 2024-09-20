from rest_framework.permissions import BasePermission

class IsFreelancer(BasePermission):
    def has_permission(self, request, view):
        # Verifica si el usuario está autenticado y tiene el rol de 'Freelancer'
        print(request.user.is_authenticated)
        print(request.user.groups.filter(name="Business Manager").exists())
        return request.user.is_authenticated and request.user.groups.filter(name="Freelancer").exists()