#!/usr/bin/env python3

"""
Convert ouroboros modules to JavaScripted pyc files that we can load.
"""

# TODO: we should just import ourboros and generate the pycs from there

import argparse
import base64
import glob
import os
import os.path
import py_compile
import sys
import tempfile

IGNORE_MODULES = set([
    '__builtins__',
    '__init__',
    'plat-aix4',
    'plat-darwin',
    'plat-freebsd4',
    'plat-freebsd5',
    'plat-freebsd6',
    'plat-freebsd7',
    'plat-freebsd8',
    'plat-generic',
    'plat-linux',
    'plat-netbsd1',
    'plat-next3',
    'plat-sunos5',
    'plat-unixware7',
    'site-packages',
    'tkinter',
    'turtle',
    'turtledemo',
])

def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('modules', metavar='module', nargs='*',
                        help='source modules to compile')
    parser.add_argument('--source', help='location of the ouroboros source files')

    args = parser.parse_args()

    # find the ouroboros directory
    if os.path.exists('./node_modules/@pybee/ouroboros'):
        ouroboros = './node_modules/@pybee/ouroboros'
    else:
        exit("Please install the development dependencies with `npm install`.")

    if args.modules:
        enabled_modules = args.modules
    else:
        native_modules = []
        native_path = os.path.join(os.path.dirname(__file__), 'batavia', 'modules')
        for name in os.listdir(native_path):
            module_name, ext = os.path.splitext(name)
            if ext == '.js':
                native_modules.append(module_name)

        enabled_modules = []
        for name in os.listdir(os.path.join(ouroboros, 'ouroboros')):
            module_name, ext = os.path.splitext(name)
            if (ext == '.py' or
                ext == '' and os.path.isdir(os.path.join(ouroboros, name))):
                if (module_name not in IGNORE_MODULES
                    and module_name not in native_modules):
                    enabled_modules.append(module_name)

    return ouroboros, enabled_modules

def convert_to_pyc(stdlibPath, module_path):
    if os.path.isfile(module_path):
        fp = tempfile.NamedTemporaryFile(delete=False)
        fp.close()
        try:
            py_compile.compile(module_path, cfile=fp.name)
            with open(fp.name, 'rb') as fin:
                pyc=fin.read()
        finally:
            os.unlink(fp.name)
        with open(stdlibPath, 'w') as fout:
            fout.write("module.exports = '" + base64.b64encode(pyc).decode('utf8') + "'\n")
    else:
        if not os.path.exists(stdlibPath):
            os.mkdir(stdlibPath)
        for content in os.listdir(module_path):
            contentPath = os.path.join(module_path, content)
            if os.path.isdir(contentPath):
                convert_to_pyc(os.path.join(stdlibPath, content), contentPath)
            else:
                convert_to_pyc(os.path.join(stdlibPath, os.path.splitext(content)[0] + '.js'), contentPath)

def compile_stdlib(ouroboros, enabled_modules):
    for module in enabled_modules:
        module_fname = os.path.join(ouroboros, 'ouroboros', module + '.py')
        module_dirname = os.path.join(ouroboros, 'ouroboros', module)
        fbool = os.path.isfile(module_fname)
        dirbool = os.path.isdir(module_dirname)
        if not (fbool or dirbool):
            exit("Could not find file or directory for module " + module)
        else:
            if fbool:
                convert_to_pyc(os.path.join('batavia', 'stdlib', module + '.js'), module_fname)
            else:
                convert_to_pyc(os.path.join('batavia', 'stdlib', module), module_dirname)

    outfile = os.path.join('batavia', 'stdlib.js')
    print("Compiling stdlib index %s" % outfile)
    with open(outfile, 'w') as fout:
        fout.write("module.exports = {\n    ")
        module_list = [
            "'" + module + "': require('./stdlib/" + module + "')"
            for module in enabled_modules
        ]
        fout.write(',\n    '.join(module_list))
        fout.write("\n}\n")

def main():
    ouroboros, enabled_modules = parse_args()
    compile_stdlib(ouroboros, enabled_modules)

if __name__ == '__main__':
    main()
