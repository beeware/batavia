import os
import base64
import py_compile
import tempfile

from django.urls import path
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
            payload = base64.encodebytes(compiled.read()).decode()
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
            'sample': bytecode('sample.py'),
            'other': bytecode('other.py'),
            'pystone': bytecode(pystone.__file__),
            'submodule': {
                'init': bytecode('submodule/__init__.py'),
                'modulea': bytecode('submodule/modulea.py'),
                'moduleb': bytecode('submodule/moduleb.py'),
                'modulec': bytecode('submodule/modulec.py'),
                'moduled': {
                    'init': bytecode('submodule/moduled/__init__.py'),
                    'submoduled': bytecode('submodule/moduled/submoduled.py'),
                },
                'subsubmodule': {
                    'init': bytecode('submodule/subsubmodule/__init__.py'),
                    'submodulea': bytecode('submodule/subsubmodule/submodulea.py'),
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
    path('', home),
]
