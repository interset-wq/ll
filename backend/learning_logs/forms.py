from django import forms
from mdeditor.widgets import MDEditorWidget

from .models import Topic, Entry


class TopicForm(forms.ModelForm):
    class Meta:
        model = Topic
        fields = ['text']
        labels = {'text': ''}


class EntryForm(forms.ModelForm):
    class Meta:
        model = Entry
        fields = ['title', 'text']
        labels = {'title': 'Title', 'text': 'Content'}
        widgets = {
            'text': MDEditorWidget(),
        }
