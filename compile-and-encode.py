# coding=utf-8
"""Compiles Python module and returns its file name and base64-encoded bytecode as JSON.
For use by Batavia Loader."""

import json
import py_compile
import argparse
import base64
import importlib
import os
import tempfile


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

    return {
        'filename': os.path.basename(module_file),
        'bytecode': base64.b64encode(pyc).decode('utf8'),
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('module', help='Python module')

    args = parser.parse_args()

    print(json.dumps(python_module_to_b64_pyc(args.module),
                     indent=4))
