""" Compiles Python file and returns its bytecode in base64 encoded format. """
import tempfile
import py_compile
import sys
import os
import base64
import importlib


def python_module_to_b64_pyc(module_path):
    module_file = importlib.util.find_spec(module_path).origin

    fp = tempfile.NamedTemporaryFile(delete=False)
    fp.close()

    try:
        py_compile.compile(module_file, cfile=fp.name)
        with open(fp.name, 'rb') as fin:
            pyc = fin.read()
    finally:
        os.unlink(fp.name)

    return base64.b64encode(pyc).decode('utf8')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(1)

    print(python_module_to_b64_pyc(module_path=sys.argv[1]))
