# Generated by Django 5.1.1 on 2024-09-23 05:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_alter_project_status_delete_projectstatus'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='company',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='owner_project', to='app.company'),
            preserve_default=False,
        ),
    ]
