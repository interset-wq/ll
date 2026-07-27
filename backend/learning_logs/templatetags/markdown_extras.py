from django import template
from django.utils.safestring import mark_safe
import markdown
import re

register = template.Library()


@register.filter(name='markdown')
def markdown_format(text):
    html = markdown.markdown(text, extensions=['extra', 'codehilite', 'fenced_code'])
    # Demote headings: h1 -> h2, h2 -> h3, etc. to avoid conflict with page title
    html = re.sub(r'<h1(.?)>(.*?)</h1>', r'<h2\1>\2</h2>', html)
    html = re.sub(r'<h2(.?)>(.*?)</h2>', r'<h3\1>\2</h3>', html)
    html = re.sub(r'<h3(.?)>(.*?)</h3>', r'<h4\1>\2</h4>', html)
    return mark_safe(html)
