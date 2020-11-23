from django.shortcuts import render
from django.http import HttpResponse
from django.template.response import TemplateResponse

# Create your views here.


def empty(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def main(request):
	return render(request, 'listener/mainPage.html')
