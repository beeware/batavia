#!/usr/bin/env python3
# coding=utf-8

"""Run the specified Python file using Batavia. This will compile the Python file to bytecode
and use Node.js to execute the bytecode using the Batavia."""

import argparse
import subprocess
import textwrap


def run_in_batavia(python_file):
    """Run a Python file using Batavia."""

    name = python_file.split('.')[0]

    js_filename = '{}.js'.format(python_file)

    with open(js_filename, 'w') as js_file:
        js_file.write(textwrap.dedent("""
            var batavia = require('./batavia/batavia.js');
            const bataviaLoader = require('./batavia/loader.js');

            var vm = new batavia.VirtualMachine({
                loader: bataviaLoader,
                frame: null
            });
            
            vm.run('%s', []);
            """ % name).lstrip())
    subprocess.Popen(['node', js_filename])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('file', help='Python file to test using Batavia')

    args = parser.parse_args()

    run_in_batavia(args.file)
