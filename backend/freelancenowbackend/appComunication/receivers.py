from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from app.models import Project, ProjectFreelancer, UserRole, User, UserCompany, Freelancer
from .custom_signals import *


@receiver(post_save, sender=Project)
def send_project_creation_notification(sender, instance, created, **kwargs):
    if created:
        recipients = instance.get_notification_recipient()
        channel_layer = get_channel_layer()

        for recipient in recipients:
            user = recipient["user"]
            message = recipient["message"]

            # send_mail(a
            #     "Project Creation Request",
            #     message,
            #     settings.DEFAULT_FROM_EMAIL,
            #     [user.email],
            #     fail_silently=False,
            # )
            print(f"User id for {user} and id {user.id}")

            async_to_sync(channel_layer.group_send)(
                f"notifications_{user.id}",
                {
                    "type": "send_notification",
                    "message": message,
                },
            )
            print(f"notifications_{user.id}")


@receiver(project_notification, sender=ProjectFreelancer)
def handle_project_status_update_notification(message, instance, **kwargs):

    recipients = instance.get_notification_recipient()

    channel_layer = get_channel_layer()

    for recipient in recipients:

        async_to_sync(channel_layer.group_send)(
            f"notifications_{recipient.id}",
            {
                "type": "send_notification",
                "message": message,
            },
        )


@receiver(project_interest_notification, sender=ProjectFreelancer)
def handle_project_interest_notification(message, instance, **kwargs):

    recipients = instance.get_notification_recipient()

    channel_layer = get_channel_layer()

    recipients_filter = recipients[1:]

    for recipient in recipients_filter:
        
        
        
        if type(recipient) is Freelancer:
            id = recipient.user.id
        else:
            id = recipient.id     
        

        async_to_sync(channel_layer.group_send)(
            f"notifications_{id}",
            {
                "type": "send_notification",
                "message": message,
            },
        )


@receiver(worker_update, sender=UserCompany)
def handle_user_role_update_notification(message, instance, business_manager, **kwargs):

    print("On user role update")

    channel_layer = get_channel_layer()

    message_bm = f"Worker {instance.first_name} {message}"

    message_worker = f"Your {message}"

    print(f"Sending to {business_manager.id}")
    print(f"Sending to {instance.id}")

    async_to_sync(channel_layer.group_send)(
        f"notifications_{business_manager.id}",
        {
            "type": "send_notification",
            "message": message_bm,
        },
    )

    async_to_sync(channel_layer.group_send)(
        f"notifications_{instance.id}",
        {
            "type": "send_notification",
            "message": message_worker,
        },
    )
    
@receiver(project_update, sender=Project)
def handle_project_update_notification(message, users, **kwargs):

    channel_layer = get_channel_layer()  
        
    for user in users:
        async_to_sync(channel_layer.group_send)(
            f"notifications_{user.id}",
            {
                "type": "send_notification",
                "message": message,
            },
        )
