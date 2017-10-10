# coding=utf-8
"""Compile Python module and returns its file name and base64-encoded bytecode
as JSON.
For use by 'run_in_batavia' script."""

import argparse
import json
import py_compile
import sys

import base64
import importlib
import os
import tempfile

sys.path.insert(0, os.getcwd())


def get_module_path(module):
    module_spec = importlib.util.find_spec(module)

    # TODO: handle importing namespace packages
    if module_spec is None or module_spec.origin == 'namespace':
        return

    return module_spec.origin


def python_module_to_b64_pyc(module):
    module_file = get_module_path(module)

    if module_file is None:
        return

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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('module', help='Python module')

    args = parser.parse_args()

    print(json.dumps(python_module_to_b64_pyc(args.module),
                     indent=4))


if __name__ == '__main__':
    main()
