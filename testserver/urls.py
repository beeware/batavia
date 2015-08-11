import base64
import py_compile

from django.conf.urls import url
from django.shortcuts import render


def home(request):
    py_compile.compile('code.py')
    with open('__pycache__/code.cpython-34.pyc', 'rb') as compiled:
        bytecode = base64.encodebytes(compiled.read())
    return render(request, 'testbed.html', {
        'servercode': bytecode
    })


urlpatterns = [
    url(r'^$', home),
]
