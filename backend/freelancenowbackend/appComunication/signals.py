from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from app.models import Project  # Importa el modelo de Project

@receiver(post_save, sender=Project)
def send_project_creation_email(sender, instance, created, **kwargs):
    if created:
        recipients = instance.get_notification_recipient()

        for recipient in recipients:
            subject = "Project Creation Request Notification"
            message = recipient["message"]

            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [recipient["email"]],
                fail_silently=False,
            )
            print(f"Email sent to {recipient['email']}")