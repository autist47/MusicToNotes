# Generated by Django 3.1.3 on 2021-03-07 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MusicToNotes', '0004_auto_20210224_0147'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='using_file',
            field=models.BooleanField(blank=True, default=0),
        ),
        migrations.AddField(
            model_name='project',
            name='using_recording',
            field=models.BooleanField(blank=True, default=0),
        ),
    ]
