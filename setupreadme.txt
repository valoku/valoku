IF YOU ARE ON 64BIT WINDOWS MAKE SURE *EVERYTHING* below is 64 bit

-Install Python 2.7
(if you already have 32 bit and on windows 64bit then remember to change path env)

-Install Django 1.7

-manage.py syncdb/migrate

-install apache 2.4 http://httpd.apache.org/
(https://www.apachelounge.com/download/win64/ if on windows 64 bit)

-install modwsgi by putting module in apache's installation's module directory 
(eg. C:\Program Files (x86)\Apache Software Foundation\Apache2.2\modules)

-Add this line to http.conf file in the apache conf folder:
LoadModule wsgi_module modules/mod_wsgi.so

-Add this line to http.conf file in the apache conf folder: 
Include “F:/{path_to_paul_webapp}/apache/apache_django_wsgi.conf “
(eg. Include "C:/Users/Bob/MyPythonProjects/paul/apache/apache_django_wsgi.conf")

-Create the file apache_django_wsgi.conf referenced above

-