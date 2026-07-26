from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect

from .models import Topic, Entry
from .forms import TopicForm, EntryForm


def index(request):
    # return HttpResponse("<h1>Hello, world. This is index.</h1>")
    return render(request, template_name='learning_logs/index.html')


def topics(request):
    ts = Topic.objects.order_by('date_added')
    context = {
        'topics': ts,
    }
    return render(request, template_name='learning_logs/topics.html', context=context)


def topic(request, pk):
    t = get_object_or_404(Topic, pk=pk)
    context = {
        'topic': t,
        'entries': t.entry_set.order_by('-date_added'),
    }
    return render(request, template_name='learning_logs/topic.html', context=context)


def new_topic(request):
    if request.method == 'POST':
        form = TopicForm(data=request.POST)
        if form.is_valid():
            form.save()
            return redirect('learning_logs:topics')
    else:
        form = TopicForm()

    context = {'form': form}
    return render(request, template_name='learning_logs/new_topic.html', context=context)


def new_entry(request, pk):
    t = get_object_or_404(Topic, pk=pk)
    if request.method == 'POST':
        form = EntryForm(data=request.POST)
        if form.is_valid():
             e = form.save(commit=False)
             e.topic = t
             e.save()
             return redirect('learning_logs:topic', pk=pk)
    else:
        form = EntryForm()

    context = {'form': form, 'topic': t}
    return render(request, template_name='learning_logs/new_entry.html', context=context)


def edit_entry(request, pk):
    e = get_object_or_404(Entry, pk=pk)
    t = e.topic
    if request.method == 'POST':
        form = EntryForm(data=request.POST, instance=e)
        if form.is_valid():
            form.save()
            return redirect('learning_logs:topic', pk=t.pk)
    else:
        form = EntryForm(instance=e)

    context = {'form': form, 'topic': t, 'entry': e}
    return render(request, template_name='learning_logs/edit_entry.html', context=context)