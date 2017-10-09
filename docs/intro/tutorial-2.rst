Tutorial: Running Python code using Batavia from the command line
=================================================================

Batavia includes a simple command-line script that you can use to run your
Python code. To use this tool you need to have followed the instructions from
:doc:`tutorial-0`.

You can now run Python code from a code from the command line as follows:

.. code-block:: bash

    node run_in_batavia.js /path/to/python_file.py

You can alternatively directly execute the file as ``./run_in_batavia.js``. If
you are not in the directory containing the Batavia sources you will need to
provide Node.js the full path to the ``run_in_batavia.js`` file in the source
directory.
