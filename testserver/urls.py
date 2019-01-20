import os
import base64
import py_compile
import tempfile

from django.conf.urls import url
from django.shortcuts import render
from test import pystone


def bytecode(sourcefile):
    fd, tempname = tempfile.mkstemp()
    # Immediately close the file so that we can write/move it etc implicitly
    # below without nasty permission errors
    os.close(fd)
    try:
        py_compile.compile(sourcefile, cfile=tempname, doraise=True)
        with open(os.path.join(
                    os.path.dirname(sourcefile),
                    tempname
                ), 'rb') as compiled:
            payload = base64.encodebytes(compiled.read())
        os.remove(tempname)
    except Exception as e:
        print(e)
        return {'error': str(e)}
    return {
        'compiled': payload,
        'filename': sourcefile
    }


def home(request):
    ctx = {
        'modules': {
            'sample': bytecode('testserver/sample.py'),
            'other': bytecode('testserver/other.py'),
            'pystone': bytecode(pystone.__file__),
            'submodule': {
                'init': bytecode('testserver/submodule/__init__.py'),
                'modulea': bytecode('testserver/submodule/modulea.py'),
                'moduleb': bytecode('testserver/submodule/moduleb.py'),
                'modulec': bytecode('testserver/submodule/modulec.py'),
                'moduled': {
                    'init': bytecode('testserver/submodule/moduled/__init__.py'),
                    'submoduled': bytecode('testserver/submodule/moduled/submoduled.py'),
                },
                'subsubmodule': {
                    'init': bytecode('testserver/submodule/subsubmodule/__init__.py'),
                    'submodulea': bytecode('testserver/submodule/subsubmodule/submodulea.py'),
                }
            }
        }
    }
    if request.method.lower() == 'post' and request.POST['code']:
        tempfd, tempname = tempfile.mkstemp()
        with os.fdopen(tempfd, 'w+b') as f:
            f.write(bytes(request.POST['code'], 'utf-8'))
            f.flush()

        customcode = {'code': request.POST['code']}
        customcode.update(bytecode(tempname))
        ctx['customcode'] = customcode

        os.remove(tempname)
    return render(request, 'testbed.html', ctx)


urlpatterns = [
    url(r'^$', home),
]
