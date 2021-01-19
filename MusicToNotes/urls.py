from . import views
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from . import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.empty, name='empty'),
    path('MusicToNotes/', views.main, name='main'),
    path('test', TemplateView.as_view(template_name="musicToNotes/test.html")),
    path('listener/', include('Listener.urls')),
    path('accounts/signup/', views.SignUpView.as_view(), name='signup'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('create_project/', views.create_project, name='create_project'),
    path('remove_project/', views.remove_project, name='remove_project'),
    path('save_project/', views.save_project, name='save_project'),
    path('open_project/<int:pr_id>/', views.open_project, name='open_project'),
]
if settings.DEBUG:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)