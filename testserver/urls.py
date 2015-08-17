import os
import base64
import py_compile

from django.conf.urls import url
from django.shortcuts import render


def bytecode(sourcefile):
    py_compile.compile(sourcefile)
    with open(os.path.join(
                os.path.dirname(sourcefile),
                '__pycache__/%s.cpython-34.pyc' % os.path.splitext(os.path.basename(sourcefile))[0]
            ), 'rb') as compiled:
        payload = base64.encodebytes(compiled.read())
    return payload


def home(request):
    return render(request, 'testbed.html', {
        'samplecode': bytecode('sample.py'),
        'othercode': bytecode('other.py')
    })


urlpatterns = [
    url(r'^$', home),
]
