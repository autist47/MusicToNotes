from . import views
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.main, name='main'),
    path('MusicToNotes/', views.main, name='main'),
    path('test', TemplateView.as_view(template_name="musicToNotes/test.html")),
    path('listener/', include('Listener.urls'))
]
