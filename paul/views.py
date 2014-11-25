import os
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseBadRequest
from django.shortcuts import *
from django.core.context_processors import csrf
from django.contrib import auth
from django.template import RequestContext
from django.utils.encoding import *
from django.core.exceptions import PermissionDenied

from paul.forms import *
from paul.models import *
from paul import settings

from sorl import thumbnail

from sendfile import sendfile
from django.core.files import File
import base64
import sys

def home(request):
    if request.user.is_authenticated():
        return render_to_response('home.html', context_instance=RequestContext(request))
    else:
        return HttpResponseRedirect('/login')


# AUTHENTICATION
def login(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/')
    c = {}
    c.update(csrf(request))
    return render_to_response('account/login.html', c)


def auth_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)

    if user is not None:
        auth.login(request, user)
        return HttpResponseRedirect('/logged_in')
    else:
        return HttpResponseRedirect('/invalid')


def logged_in(request):
    return HttpResponseRedirect('/home')


def invalid_login(request):
    return render_to_response('account/invalid_login.html')


def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/')


def register_user(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/logged_in')
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/register_success')

    args = {}
    args.update(csrf(request))

    args['form'] = UserCreationForm()

    return render_to_response('account/register_user.html', args)


def register_success(request):
    return render_to_response('account/register_success.html')


#Upload images
def upload(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES, request.user)
        if form.is_valid():
            new_file = UploadFile(file=request.FILES['file'], user=request.user)
            new_file.save()
            return HttpResponseRedirect('/')
    else:
        form = UploadFileForm()
    data = {'form': form}
    return render_to_response('upload.html', data, context_instance=RequestContext(request))


#View images
def images(request):
    if request.method == 'GET':
        args = {}
        args.update(csrf(request))
        args['images'] = UploadFile.objects.filter(user=request.user)
        return render_to_response("images.html", args, context_instance=RequestContext(request))
    return 'No images found'


#View single image
def view_image(request, id):
    if request.method == 'GET':
        args = {}
        args.update(csrf(request))
        args['image'] = UploadFile.objects.get(id=id)
        return render_to_response("image.html", args, context_instance=RequestContext(request))
    return 'Image not found'


#File requests
def files(request, id):
    requested_file = UploadFile.objects.get(id=id)
    if requested_file.user == request.user:
        return sendfile(request, requested_file.file.path)
    else:
        raise PermissionDenied()

MAX_FILE_SIZE = 20*1024*1024 #20MB
def save_edited_file(request, id):
    base64data = request.body.split(',', 1)[1]
    binary_image = base64.b64decode(base64data)
    #Check file size limit
    if sys.getsizeof(binary_image) > MAX_FILE_SIZE:
        return HttpResponseBadRequest()
    #Save file
    existing_file = UploadFile.objects.get(id=id).file
    file = open(existing_file.path, 'wb')
    file.write(binary_image)
    file = File(file)
    existing_file.source = file
    file.close()
    thumbnail.delete(existing_file, delete_file=False)
    return HttpResponse('')


#Caching is used for thumbnails
def cache(request, path):
    path = smart_str(os.path.join(settings.CACHE_DIR, path))
    return sendfile(request, path)