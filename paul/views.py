from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import *
from django.core.context_processors import csrf
from django.contrib import auth
from django.template import RequestContext
from django.core.urlresolvers import reverse

from forms import UploadFileForm
from models import UploadFile

# HOME
def home(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/logged_in')
    else:
        return render_to_response('index.html', RequestContext(request))


#AUTHENTICATION
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
    return render_to_response('account/loggedin.html',
                              context_instance=RequestContext(request))


def invalid_login(request):
    return render_to_response('account/invalid_login.html')


def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/')


#REGISTER
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


#UPLOAD
def upload(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES, request.user)
        if form.is_valid():
            new_file = UploadFile(file=request.FILES['file'], user=request.user)
            new_file.save()

            return HttpResponseRedirect('home')
    else:
        form = UploadFileForm()

    data = {'form': form}
    return render_to_response('upload/upload.html', data, context_instance=RequestContext(request))
