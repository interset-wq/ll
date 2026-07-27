from django.db import models
from django.contrib.auth.models import User
from mdeditor.fields import MDTextField


class Topic(models.Model):
    text = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['date_added', 'text']

    def __str__(self):
        return self.text


class Entry(models.Model):
    title = models.CharField(max_length=200, blank=True, default='')
    text = MDTextField()
    date_added = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    word_count = models.PositiveIntegerField(default=0)
    favorited = models.BooleanField(default=False)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-date_added']
        verbose_name_plural = 'entries'

    def __str__(self):
        return self.title or self.text[:50] if self.text else ''

    @property
    def display_title(self):
        if self.title:
            return self.title
        if self.text:
            first_line = self.text.strip().split('\n')[0]
            if first_line.startswith('#'):
                return first_line.lstrip('#').strip()
            return first_line[:80]
        return '(untitled)'

    def save(self, *args, **kwargs):
        if self.text:
            self.word_count = len(self.text.replace('\n', '').replace(' ', ''))
        super().save(*args, **kwargs)
