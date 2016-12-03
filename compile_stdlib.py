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


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('modules', metavar='module', nargs='*',
                        help='source modules to compile')
    parser.add_argument('--source', help='location of the ouroboros source files')

    args = parser.parse_args()

    enabled_modules = args.modules or [
        '_weakrefset',
        'abc',
        'bisect',
        'colorsys',
        'copyreg',
        'token',
        'operator',
        'stat',
        'this',
    ]

    # find the ouroboros directory
    if os.path.exists('./node_modules/ouroboros'):
        ouroboros = './node_modules/ouroboros'
    else:
        exit("Please install the development dependencies with `npm install`.")

    return ouroboros, enabled_modules


def compile_stdlib(ouroboros, enabled_modules):
    for module in enabled_modules:
        module_fname = os.path.join(ouroboros, 'ouroboros', module + '.py')
        if not os.path.exists(module_fname):
            exit("Could not find file for module " + module)
        outfile = os.path.join('batavia', 'stdlib', module + '.js')
        print("Compiling %s to %s" % (module_fname, outfile))
        fp = tempfile.NamedTemporaryFile(delete=False)
        fp.close()
        try:
            py_compile.compile(module_fname, cfile=fp.name)
            with open(fp.name, 'rb') as fin:
                pyc = fin.read()
        finally:
            # make sure we delete the file
            os.unlink(fp.name)

        with open(outfile, 'w') as fout:
            fout.write("module.exports = '" + base64.b64encode(pyc).decode('utf8') + "'\n")

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
