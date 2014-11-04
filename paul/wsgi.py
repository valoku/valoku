"""
WSGI config for paul project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os, sys
PATH_TO_MY_DJANGO_PROJECT = os.path.dirname(__file__)
print(PATH_TO_MY_DJANGO_PROJECT)
sys.path.append(PATH_TO_MY_DJANGO_PROJECT)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "paul.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
