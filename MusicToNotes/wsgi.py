"""
WSGI config for MusicToNotes project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

sys.path = ['venv/Scripts/'] + sys.path
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MusicToNotes.settings')

application = get_wsgi_application()