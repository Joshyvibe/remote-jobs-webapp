# Generated by Django 5.1 on 2024-08-20 11:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='application_link',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
