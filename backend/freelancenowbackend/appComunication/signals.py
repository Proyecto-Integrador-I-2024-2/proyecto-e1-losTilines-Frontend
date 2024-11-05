from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from app.models import Project

@receiver(post_save, sender=Project)
def send_project_creation_notification(sender, instance, created, **kwargs):
    if created:
        recipients = instance.get_notification_recipient()
        channel_layer = get_channel_layer()

        for recipient in recipients:
            user = recipient["user"]
            message = recipient["message"]

            # send_mail(
            #     "Project Creation Request",
            #     message,
            #     settings.DEFAULT_FROM_EMAIL,
            #     [user.email],
            #     fail_silently=False,
            # )
            print(f"Email sent to {user.email}")

            async_to_sync(channel_layer.group_send)(
                f'notifications_{user.id}',
                {
                    'type': 'send_notification',
                    'message': message,
                }
            )
            print(f'notifications_{user.id}')
