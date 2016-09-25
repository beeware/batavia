#!/usr/bin/env python3

"""
Convert ouroborous modules to JavaScripted pyc files that we can load.
"""

# TODO: we should just import ourborous and generate the pycs from there

import base64
import glob
import os
import os.path
import py_compile
import sys
import tempfile

enabled_modules = [
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
if os.path.exists('ouroboros'):
    ouroboros = 'ouroboros'
elif os.path.exists('../ouroboros'):
    ouroboros = '../ouroboros'
else:
    exit("'ouroboros' folder must be present here or in the parent directory to compile stdlib")

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
