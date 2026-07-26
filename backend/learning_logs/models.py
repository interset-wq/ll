from django.db import models


class Topic(models.Model):
    text = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date_added', 'text']

    def __str__(self):
        return self.text


class Entry(models.Model):
    text = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date_added', 'text']

    def __str__(self):
        return self.text
