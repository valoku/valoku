Paul
===================

Paul is an web-based application for storing and editing images.


Setting up your development environment
-------------
#### Install Python and pip
Start by installing Python and pip. The recommended Python version is 2.7. Instructions for downloading pip can be found [here](http://pip.readthedocs.org/en/latest/installing.html).

#### Clone the project
Use git to clone the project:

    git clone git@github.com:nyholmniklas/paul.git

#### Install dependencies
The dependencies are listed in requirements.txt file, you can install them with:

    pip install -r requirements.txt

#### Generate database
Django can generate a database directly from the models. For the purposes of your development environment, SQLLite is used. You can generate the database using:

    python manage.py migrate

#### Run server
Finally, you can use Django's built-in server for running the application in your development environment. 

    python manage.py runserver
