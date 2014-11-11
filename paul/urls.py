from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    #HOME AND ADMIN
    url(r'^$', 'paul.views.home', name='home'),
    url(r'^home/', 'paul.views.home', name='home'),
    url(r'^admin/', include(admin.site.urls)),
    
    #AUTHENTICATION
    (r'^login/$', 'paul.views.login'),
    (r'^auth/$', 'paul.views.auth_view'),
    (r'^logout/$', 'paul.views.logout'),
    (r'^logged_in/$', 'paul.views.logged_in'),
    (r'^invalid/$', 'paul.views.invalid_login'),
    
    #REGISTRATION
    (r'^register/$', 'paul.views.register_user'),
    (r'^register_success/$', 'paul.views.register_success'),

    #UPLOAD
    url(r'^upload/$', 'paul.views.upload', name="upload"),

    #IMAGES
    (r'^images/$', 'paul.views.images'),
    url(r'^files/(?P<id>.*)$', 'paul.views.files'),
    url(r'^images/cache/(?P<path>.*)$', 'paul.views.cache'),
    url(r'^view_image/(?P<id>.*)$', 'paul.views.view_image'),
    (r'^save_edited_file/$', 'paul.views.save_edited_file'),
)
