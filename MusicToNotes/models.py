from django.db import models
from .settings import MEDIA_URL, MEDIA_ROOT
from django.db.models.signals import post_save, post_delete
from django.contrib.auth.models import User
from django.dispatch import receiver
from .empty import empty_project
import json
import os

class UserProfile(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	nickname = models.CharField(max_length=100, blank=True)
	email = models.EmailField(max_length=100, blank=True)
	date = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.user.username

@receiver(post_save, sender=User)
def create_profile_and_folder(sender, instance, created, **kwargs):
	if created:
		new_profile = UserProfile.objects.create(user=instance)
		root_to_projects = MEDIA_URL[1:]+'users/'+str(instance.username)
		os.makedirs(root_to_projects)

@receiver(post_delete, sender=User)
def remove_folder(sender, instance, *args, **kwards):
	root_to_projects = MEDIA_URL[1:]+'users/'+str(instance.username)
	os.rmdir(root_to_projects)


class Project(models.Model):
	title = models.CharField(max_length=100, blank=True)
	author = models.ForeignKey(User, on_delete=models.CASCADE)
	music_xml = models.SlugField(blank=True)
	using_file = models.BooleanField(default=0)
	using_recording = models.BooleanField(default=0)
	date_create = models.DateTimeField(auto_now_add=True)
	date_update = models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.author)+' '+str(self.id)+' '+self.title

	def get_data(self):
		with open(self.music_xml, "r") as read_file:
			data = json.load(read_file)
		return data

	def save_data(self, data):
		with open(self.music_xml, "w") as write_file:
			json.dump(data, write_file)

@receiver(post_save, sender=Project)
def create_xml(sender, instance, created, *args, **kwards):
	if created:
		root_to_projects = MEDIA_URL[1:]+'users/'+str(instance.author)
		slug_to_project = root_to_projects+'/'+str(instance.id)+'.json'

		data = empty_project
		with open(slug_to_project, "w+") as write_file:
			json.dump(data, write_file)

		instance.music_xml = slug_to_project
		instance.save()

@receiver(post_delete, sender=Project)
def remove_xml(sender, instance, *args, **kwards):
	os.remove(instance.music_xml)