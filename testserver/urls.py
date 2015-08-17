import os
import base64
import py_compile
import tempfile

from django.conf.urls import url
from django.shortcuts import render


def bytecode(sourcefile):
    with tempfile.NamedTemporaryFile() as temp:
        py_compile.compile(sourcefile, cfile=temp.name)
        with open(os.path.join(
                    os.path.dirname(sourcefile),
                    temp.name
                ), 'rb') as compiled:
            payload = base64.encodebytes(compiled.read())
        return payload


def home(request):
    ctx = {
        'samplecode': bytecode('sample.py'),
        'othercode': bytecode('other.py')
    }
    if request.method.lower() == 'post' and request.POST['code']:
        with tempfile.NamedTemporaryFile() as temp:
            temp.write(bytes(request.POST['code'], 'utf-8'))
            temp.flush()
            ctx['customcode'] = {
                'code': request.POST['code'],
                'compiled': bytecode(temp.name)
            }
    return render(request, 'testbed.html', ctx)


urlpatterns = [
    url(r'^$', home),
]
