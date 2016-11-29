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

import click


ENABLED_MODULES = (
    '_weakrefset',
    'abc',
    'bisect',
    'colorsys',
    'copyreg',
    'token',
    'operator',
    'stat',
    'this',
)


def compile_stdlib(ouroboros, enabled_modules=ENABLED_MODULES):
    for module in enabled_modules:
        module_fname = os.path.join(ouroboros, 'ouroboros', module + '.py')
        if not os.path.exists(module_fname):
            exit("Could not find file for module " + module)
        outfile = os.path.join('batavia', 'modules', 'stdlib', module + '.js')
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
            fout.write("batavia.stdlib['" + module + "'] = '")
            fout.write(base64.b64encode(pyc).decode('utf8'))
            fout.write("';\n")


def get_default_ouroboros_path():
    for path in 'ouroboros', os.path.join('..', 'ouroboros'):
        if os.path.exists(path):
            return path


@click.command(help=__doc__)
@click.option('--source', '-s',
              type=click.Path(exists=True), default=get_default_ouroboros_path(),
              help='location of the ouroboros source files')
@click.argument('modules', metavar='[MODULE1 MODULE2 ...]', nargs=-1)
def main(source, modules):
    enabled_modules = modules or ENABLED_MODULES
    compile_stdlib(source, enabled_modules)


if __name__ == '__main__':
    main()
