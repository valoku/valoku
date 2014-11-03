from django import forms
 
from models import UploadFile
 
 
class UploadFileForm(forms.ModelForm):
     
    class Meta:
        model = UploadFile
        fields = ('file',)

    def save(self, user='', commit=True):
        upload_file = super(UploadFileForm, self).save(commit=False)
        upload_file.user = user

        if commit:
            upload_file.save()
        return upload_file