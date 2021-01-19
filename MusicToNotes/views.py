from django.shortcuts import render
# Create your views here.
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse_lazy, reverse
from django.views import generic
from django.shortcuts import redirect
from .settings import MEDIA_URL

from django.contrib.auth.models import User
from .models import Project, UserProfile


from .classes import GlobalConst, AnalizAudio, AnalizData, AnalizNotes, ConvertNotes


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
	suc = 'cess'
	project = Project.objects.create(author=user, title=name)
	if request.FILES.get('file', False):
		handle_uploaded_file(request.FILES['file'])

		consts = GlobalConst()
		consts.setAudioConst(file_path=MEDIA_URL[1:]+'audio.wav', sampling_rate=48000, n_fft=2**13)

		analiz_audio = AnalizAudio(consts)
		analiz_audio.addAudio()

		consts.setBpm(90)
		consts.setMin(note_min=1/4, pause_min=1/4)
		consts.setNoteConstData()
		consts.setNoteConstProperties()
		consts.changeStart(4)

		analiz_audio.cutFrames(start_frame=0, end_frame=-1)
		analiz_audio.setData()

		analiz_data = AnalizData(consts)
		analiz_data.clearData()
		analiz_data.plotData()
		analiz_data.fromTheEnd()

		analiz_notes = AnalizNotes(consts)
		analiz_notes.deleteRepetitions()
		analiz_notes.alignmentLength()
		analiz_notes.splitLength()

		convert_notes = ConvertNotes(consts)
		convert_notes.convert()

		project.save_data(convert_notes.result_json)
		suc = 'asd'
	return JsonResponse({'suc': suc})

def remove_project(request):
	project_id = request.POST.get('id')
	Project.objects.get(id=project_id).delete()
	return JsonResponse({'suc': 'cess'})

def save_project(request):
	project_id = request.POST.get('id')
	data = request.POST.get('data')
	project = Project.objects.get(id=project_id)
	project.save_data(data)
	return JsonResponse({'suc': data})

def open_project(request, pr_id):
	if request.user.is_authenticated == True:
		project = Project.objects.get(id=pr_id)
		if project.author == request.user:
			data = project.get_data()
			context = {
				"data": data,
				"id": pr_id
				}
			return render(request, 'musicToNotes/project.html', context)
		else:
			return JsonResponse({'error': 'this project is not yours'})
	else:
		return redirect('login')

def handle_uploaded_file(f):
    with open(MEDIA_URL[1:]+'audio.wav', 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)