from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from .forms import UserEditForm


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            login(request, new_user)
            messages.success(request, 'Registration successful.')
            return redirect('learning_logs:index')
    else:
        form = UserCreationForm()
    context = {'form': form}
    return render(request, template_name='registration/register.html', context=context)


@login_required
def profile(request):
    context = {'user': request.user}
    return render(request, template_name='registration/profile.html', context=context)


@login_required
def edit_profile(request):
    if request.method == 'POST':
        form = UserEditForm(data=request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('accounts:profile')
    else:
        form = UserEditForm(instance=request.user)

    context = {'form': form}
    return render(request, template_name='registration/edit_profile.html', context=context)
