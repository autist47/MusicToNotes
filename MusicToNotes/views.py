from django.shortcuts import render
# Create your views here.
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse_lazy
from django.views import generic
from django.shortcuts import redirect

from django.contrib.auth.models import User
from .models import Project, UserProfile

def empty(request):
	return redirect('main')

def main(request):
	context = {
		'projects': []
	}
	if request.user.is_authenticated == True:
		projects = Project.objects.all().filter(author=request.user).order_by('id')
		context['projects'] = projects
		return render(request, 'musicToNotes/test.html', context)
	else:
		return render(request, 'musicToNotes/test.html', context)


class SignUpView(generic.CreateView):
	form_class = UserCreationForm
	success_url = reverse_lazy('login')
	template_name = 'registration/signup.html'


def create_project(request):
	name = request.POST.get('name')
	user = User.objects.get(username=request.POST.get('user'))
	Project.objects.create(author=user, title=name)
	return JsonResponse({'suc': 'cess'})

def remove_project(request):
	project_id = request.POST.get('id')
	Project.objects.get(id=project_id).delete()
	return JsonResponse({'suc': 'cess'})