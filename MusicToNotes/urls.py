from . import views
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.main, name='main'),
    path('MusicToNotes/', views.main, name='main'),
    path('listener/', include('Listener.urls'))
]
