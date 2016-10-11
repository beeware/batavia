Installing Python 3.4 locally
=============================

Batavia relies on a very specific version of Python to operate. 

If you don't have Python 3.4, you can use `pyenv <https://github.com/yyuu/pyenv>`_
 to install it along any other version of python on your system. Once installed,
you will need to set 3.4.4 to be the version to use locally, and install virtualenv
 within this environment before continuing.

.. code-block:: bash

    $ pyenv local 3.4.4
    $ pip install virtualenv

From here, the processes described in the tutorials will be able to be followed. 
