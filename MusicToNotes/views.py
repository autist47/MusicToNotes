from django.shortcuts import render
# Create your views here.
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.urls import reverse_lazy, reverse
from django.views import generic
from django.shortcuts import redirect
from .settings import MEDIA_URL

from django.contrib.auth.models import User
from .models import Project, UserProfile
from pydub import AudioSegment

import copy
import os
import json
from .classes import GlobalConst, AnalizAudio, AnalizData, AnalizNotes, ConvertNotes


def empty(request):
	return redirect('projects')

def projects(request):
	context = {
		'projects': []
	}
	if request.user.is_authenticated == True:
		projects = Project.objects.all().filter(author=request.user).order_by('id')
		context['projects'] = projects
		return render(request, 'musicToNotes/my_projects.html', context)
	else:
		return render(request, 'musicToNotes/my_projects.html', context)


class SignUpView(generic.CreateView):
	form_class = UserCreationForm
	success_url = reverse_lazy('login')
	template_name = 'registration/signup.html'


def analizator(slug_to_audio):
	consts = GlobalConst()
	consts.setAudioConst(file_path=slug_to_audio, sampling_rate=48000, n_fft=2**13, hop_length=730)

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
	return convert_notes.result_json


def create_project(request):
	name = request.POST.get('name')
	user = User.objects.get(username=request.POST.get('user'))
	suc = 'cess'
	project = Project.objects.create(author=user, title=name)
	if request.FILES.get('file', False):
		root_to_projects = MEDIA_URL[1:]+'users/'+str(user) + '/'
		name_audio = str(project.id) + '_start_audio.wav'
		slug_to_audio = root_to_projects + '/' + name_audio
		handle_uploaded_file(request.FILES['file'], root_to_projects, name_audio)

		result_json = analizator(slug_to_audio)
		project.save_data(result_json)
		project.using_file = True
		project.save()
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
			if project.using_recording:
				audio_url = '/'+project.music_xml.replace(str(project.id)+'.json', str(project.id)+'_recording_audio.wav')
			elif project.using_file:
				audio_url = '/'+project.music_xml.replace(str(project.id)+'.json', str(project.id)+'_start_audio.wav')
			else:
				audio_url = ''

			context = {
				"data": data,
				"id": pr_id,
				"audio": audio_url,
				}
			return render(request, 'musicToNotes/edit_project.html', context)
		else:
			return JsonResponse({'error': 'this project is not yours'})
	else:
		return redirect('login')

def handle_uploaded_file(f, root=MEDIA_URL[1:], name='audio.wav'):
	with open(root+name, 'wb+') as destination:
		for chunk in f.chunks():
			destination.write(chunk)

def WAVconvert(root=MEDIA_URL[1:], name_i='input.wav', name_o='out.wav'):
	name_i = root+name_i
	name_o = root+name_o
	os.system(f'ffmpeg -i {name_i} {name_o} -y')

def WAVconcat(root, last_name, output_name='_recording_audio.wav'):
	last_name = last_name.split('_')
	pr_id = last_name[0]
	last_ind = int(last_name[-1].replace('.wav', ''))
	all_files = [pr_id + '_part_' + str(i) + '.wav' for i in range(1, last_ind+1)]
	all_data_files = [AudioSegment.from_wav(root +i) for i in all_files]
	combined_sounds = sum(all_data_files)
	combined_sounds.export(root+pr_id+output_name, format="wav")
	for i in all_files:
		remove_media(root, i)

def remove_media(f_root=MEDIA_URL[1:], f_name='input.wav'):
	f_name = f_root + f_name
	os.remove(f_name)


def analizator_by_part(slug_to_audio, slug_to_save, first):

	if first:
		itog = []
		left = []
		offset = 0
	else:
		for_read = []
		with open(slug_to_save, 'r') as fr:
			for line in fr:
				for_read.append(eval(line[:-1]))
		itog, left, offset = for_read

	consts = GlobalConst()
	consts.setAudioConst(file_path=slug_to_audio, sampling_rate=48000, n_fft=2**13, hop_length=730)

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

	right, new_offset = analiz_data.from_the_end_for_parts(left, offset)
	right = copy.deepcopy(right)
	new_offset = copy.deepcopy(new_offset)
	same_found_notes = copy.deepcopy(consts.notes)

	for j_ind, j in enumerate(same_found_notes):
		z_ind = 0
		while z_ind < len(itog):
			z = itog[z_ind]
			if j["start_pos"] == z["start_pos"] and j["pos_y"]-4 <= z["pos_y"] <= j["pos_y"]+4:
				del itog[z_ind]
				z_ind -= 1
			z_ind += 1

	for j in same_found_notes:
		itog.append(j)


	for_save = [itog, right, new_offset]
	with open(slug_to_save, 'w') as fw:
		for listitem in for_save:
			fw.write('%s\n' % listitem)

	consts.notes = itog

	analiz_notes = AnalizNotes(consts)
	analiz_notes.deleteRepetitions()
	analiz_notes.alignmentLength()
	analiz_notes.splitLength()

	convert_notes = ConvertNotes(consts)
	convert_notes.convert()
	return convert_notes.result_json, itog


def send_recording(request):
	if request.FILES.get('data', False):
		pr_id = request.POST.get('pr_id')
		last = bool(int(request.POST.get('last')))
		first = bool(int(request.POST.get('first')))

		project = Project.objects.get(id=pr_id)
		root_to_projects = MEDIA_URL[1:] + 'users/' + str(project.author)+'/'
		name_i = str(pr_id) + request.POST.get('fname')
		handle_uploaded_file(request.FILES['data'], root_to_projects, name_i)
		name_o = name_i.replace('webm','wav')
		oper = WAVconvert(root_to_projects, name_i, name_o)
		remove_media(root_to_projects, name_i)
		audio_url = ''

		result_json, it = analizator_by_part(root_to_projects+name_o, root_to_projects+'file.txt', first)

		if last:
			remove_media(root_to_projects, 'file.txt')
			WAVconcat(root_to_projects, name_o)
			project.using_recording = True
			project.save()
			audio_url = '/'+project.music_xml.replace(str(project.id)+'.json', str(project.id)+'_recording_audio.wav')
			with open(MEDIA_URL[1:]+'itog.txt', 'w') as fw:
				for listitem in it:
					fw.write('%s\n' % listitem)

		return JsonResponse({'status': 'success', 'audio_url': audio_url, 'result_json': result_json})
	else:
		return JsonResponse({'status': 'error', 'audio_url': '', 'result_json': [], 'asd':'asd'})
