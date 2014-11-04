-Install Python

-Install Django

-syncdb/migrate

-runserver

-install apache http://httpd.apache.org/

-install modwsgi by putting module in apache's installation's module directory 
(eg. C:\Program Files (x86)\Apache Software Foundation\Apache2.2\modules)

-Add this line to http.conf file in the apache conf folder: 
Include “F:/{path_to_paul_webapp}/apache/apache_django_wsgi.conf “
(eg. Include "C:/Users\Bob/MyPythonProjects/paul/apache/apache_django_wsgi.conf")