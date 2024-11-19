from django.dispatch import Signal


project_notification = Signal(providing_args=["message", "instance"])
 
 
