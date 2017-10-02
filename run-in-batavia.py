#!/usr/bin/env python3

"""
Run the specified Python file using Batavia.
"""

import argparse
import py_compile
import subprocess

import base64
import importlib


def run_in_batavia(python_file):
    """Run a Python file using Batavia."""
    py_compile.compile(python_file)
    with open(importlib.util.cache_from_source(python_file), 'rb') as compiled:
        code = base64.encodebytes(compiled.read())

    name = python_file.split('.')[0]
    lines = code.decode('utf-8').split('\n')
    output = '"%s"' % '" +\n            "'.join(line for line in lines if line)

    payload = (
        '    "%s": {\n' % name +
        '        "__python__": true,\n' +
        '        "bytecode": %s,\n' % output +
        '        "filename": "%s"\n' % python_file +
        '    }'
    )

    js_filename = '{}.js'.format(python_file)

    with open(js_filename, 'w') as js_file:
        js_file.write("""
                    var batavia = require('./batavia/batavia.js');
                    const bataviaLoader = require('./batavia/loader.js');

                    var modules = {
                    %s
                    };

                    var vm = new batavia.VirtualMachine({
                        loader: bataviaLoader,
                        frame: null
                    });
                    vm.run('%s', []);
                    """ % (payload, name))
    subprocess.Popen(['node', js_filename])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('file', help='Python file to test using Batavia')

    args = parser.parse_args()

    run_in_batavia(args.file)
