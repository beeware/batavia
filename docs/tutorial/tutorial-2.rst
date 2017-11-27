Tutorial: Running Python code using Batavia from the command line
=================================================================

Batavia includes a simple command-line script that you can use to run your
Python code. To use this tool you need to have followed the instructions from
:doc:`tutorial-0`.

You can now run Python code from a code from the command line as follows:

.. code-block:: bash

    npm run python /path/to/python_file.py

This runs the ``run_in_batavia.js`` script which in turn runs the Python code.
This command will only work if you call it within the Batavia project directory
and provide it the absolute path to the Python file to run.

You can alternatively directly run the ``run_in_batavia.js`` in Node. If
you are not in the Batavia project directory you can still use this script as
follows:

.. code-block:: bash

    node /path/to/batavia/run_in_batavia.js /path/to/python_file.py

