from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import Http404
from django.db.models import Q, Sum, Count
from django.utils import timezone
from datetime import timedelta

from .models import Topic, Entry
from .forms import TopicForm, EntryForm


def index(request):
    return render(request, template_name='learning_logs/index.html')


@login_required
def topics(request):
    ts = Topic.objects.filter(owner=request.user).order_by('-date_added')
    context = {
        'topics': ts,
    }
    return render(request, template_name='learning_logs/topics.html', context=context)


@login_required
def topic(request, pk):
    t = get_object_or_404(Topic, pk=pk)
    if t.owner != request.user:
        raise Http404
    context = {
        'topic': t,
        'entries': t.entry_set.order_by('-date_added'),
    }
    return render(request, template_name='learning_logs/topic.html', context=context)


@login_required
def new_topic(request):
    if request.method == 'POST':
        form = TopicForm(data=request.POST)
        if form.is_valid():
            t = form.save(commit=False)
            t.owner = request.user
            t.save()
            messages.success(request, 'Topic created successfully.')
            return redirect('learning_logs:topics')
    else:
        form = TopicForm()

    context = {'form': form}
    return render(request, template_name='learning_logs/new_topic.html', context=context)


@login_required
def edit_topic(request, pk):
    t = get_object_or_404(Topic, pk=pk)
    if t.owner != request.user:
        raise Http404
    if request.method == 'POST':
        form = TopicForm(data=request.POST, instance=t)
        if form.is_valid():
            form.save()
            messages.success(request, 'Topic updated successfully.')
            return redirect('learning_logs:topic', pk=pk)
    else:
        form = TopicForm(instance=t)

    context = {'form': form, 'topic': t}
    return render(request, template_name='learning_logs/edit_topic.html', context=context)


@login_required
def delete_topic(request, pk):
    t = get_object_or_404(Topic, pk=pk)
    if t.owner != request.user:
        raise Http404
    if request.method == 'POST':
        t.delete()
        messages.success(request, 'Topic deleted successfully.')
        return redirect('learning_logs:topics')
    return render(request, template_name='learning_logs/delete_topic.html', context={'topic': t})


@login_required
def new_entry(request, pk):
    t = get_object_or_404(Topic, pk=pk)
    if t.owner != request.user:
        raise Http404
    if request.method == 'POST':
        form = EntryForm(data=request.POST)
        if form.is_valid():
            e = form.save(commit=False)
            e.topic = t
            e.save()
            messages.success(request, 'Entry created successfully.')
            return redirect('learning_logs:entry_detail', pk=e.pk)
    else:
        form = EntryForm()

    context = {'form': form, 'topic': t}
    return render(request, template_name='learning_logs/new_entry.html', context=context)


@login_required
def edit_entry(request, pk):
    e = get_object_or_404(Entry, pk=pk)
    t = e.topic
    if t.owner != request.user:
        raise Http404
    if request.method == 'POST':
        form = EntryForm(data=request.POST, instance=e)
        if form.is_valid():
            form.save()
            messages.success(request, 'Entry updated successfully.')
            return redirect('learning_logs:entry_detail', pk=pk)
    else:
        form = EntryForm(instance=e)

    context = {'form': form, 'topic': t, 'entry': e}
    return render(request, template_name='learning_logs/edit_entry.html', context=context)


@login_required
def delete_entry(request, pk):
    e = get_object_or_404(Entry, pk=pk)
    t = e.topic
    if t.owner != request.user:
        raise Http404
    if request.method == 'POST':
        e.delete()
        messages.success(request, 'Entry deleted successfully.')
        return redirect('learning_logs:topic', pk=t.pk)
    return render(request, template_name='learning_logs/delete_entry.html', context={'entry': e, 'topic': t})


@login_required
def entry_detail(request, pk):
    e = get_object_or_404(Entry, pk=pk)
    if e.topic.owner != request.user:
        raise Http404
    context = {'entry': e, 'topic': e.topic}
    return render(request, template_name='learning_logs/entry_detail.html', context=context)


@login_required
def search(request):
    q = request.GET.get('q', '').strip()
    results = []
    if q:
        topics = Topic.objects.filter(owner=request.user, text__icontains=q)
        entries = Entry.objects.filter(topic__owner=request.user, text__icontains=q)
        results = list(topics) + list(entries)

    context = {
        'query': q,
        'results': results,
    }
    return render(request, template_name='learning_logs/search.html', context=context)


@login_required
def dashboard(request):
    user = request.user
    now = timezone.now()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    recent_entries = Entry.objects.filter(topic__owner=user).order_by('-date_added')[:5]
    recent_topics = Topic.objects.filter(owner=user).order_by('-date_added')[:5]

    total_entries = Entry.objects.filter(topic__owner=user).count()
    total_topics = Topic.objects.filter(owner=user).count()
    total_words = Entry.objects.filter(topic__owner=user).aggregate(total=Sum('word_count'))['total'] or 0

    entries_this_week = Entry.objects.filter(topic__owner=user, date_added__gte=week_ago).count()
    entries_this_month = Entry.objects.filter(topic__owner=user, date_added__gte=month_ago).count()

    context = {
        'recent_entries': recent_entries,
        'recent_topics': recent_topics,
        'total_entries': total_entries,
        'total_topics': total_topics,
        'total_words': total_words,
        'entries_this_week': entries_this_week,
        'entries_this_month': entries_this_month,
    }
    return render(request, template_name='learning_logs/dashboard.html', context=context)


@login_required
def stats(request):
    user = request.user

    total_entries = Entry.objects.filter(topic__owner=user).count()
    total_topics = Topic.objects.filter(owner=user).count()
    total_words = Entry.objects.filter(topic__owner=user).aggregate(total=Sum('word_count'))['total'] or 0

    now = timezone.now()
    days = []
    for i in range(29, -1, -1):
        day = now - timedelta(days=i)
        count = Entry.objects.filter(topic__owner=user, date_added__date=day.date()).count()
        days.append({'date': day.date(), 'count': count})

    topic_stats = (
        Topic.objects.filter(owner=user)
        .annotate(entry_count=Count('entry'))
        .order_by('-entry_count')[:10]
    )

    recent_entries = Entry.objects.filter(topic__owner=user).order_by('-date_added')[:5]

    avg_words = Entry.objects.filter(topic__owner=user).aggregate(avg=Sum('word_count'))['avg'] or 0
    if total_entries:
        avg_words = round(avg_words / total_entries) if avg_words else 0

    context = {
        'total_entries': total_entries,
        'total_topics': total_topics,
        'total_words': total_words,
        'avg_words': avg_words,
        'days': days,
        'topic_stats': topic_stats,
        'recent_entries': recent_entries,
    }
    return render(request, template_name='learning_logs/stats.html', context=context)


def about(request):
    return render(request, template_name='learning_logs/about.html')


@login_required
def duplicate_entry(request, pk):
    e = get_object_or_404(Entry, pk=pk)
    if e.topic.owner != request.user:
        raise Http404
    if request.method == 'POST':
        new_entry = Entry.objects.create(
            title=f"{e.title} (copy)" if e.title else '',
            text=e.text,
            topic=e.topic,
            word_count=e.word_count,
        )
        messages.success(request, 'Entry duplicated successfully.')
        return redirect('learning_logs:entry_detail', pk=new_entry.pk)
    return render(request, template_name='learning_logs/duplicate_entry.html', context={'entry': e, 'topic': e.topic})


@login_required
def toggle_favorite(request, pk):
    e = get_object_or_404(Entry, pk=pk)
    if e.topic.owner != request.user:
        raise Http404
    if request.method == 'POST':
        e.favorited = not e.favorited
        e.save(update_fields=['favorited'])
    return redirect('learning_logs:entry_detail', pk=pk)


@login_required
def favorites(request):
    entries = Entry.objects.filter(topic__owner=request.user, favorited=True).order_by('-date_added')
    context = {'entries': entries}
    return render(request, template_name='learning_logs/favorites.html', context=context)
