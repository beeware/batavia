Adding a module and testing it
==============================

Modules in Batavia can be implemented either natively, in JavaScript or in supported subset of Python.

To create a native module
-------------------------

Add the module path to ``module.exports`` in ``batavia/modules.js``.

To create a module in Python
----------------------------

Add module to ``compile_stdlib.py``.

To create a test
----------------

If the module doesn't exist yet, it must be created as a ``test_NAME-OF-THE-MODULE.py`` file.

If a test for the module already exists and you want to add functionalities to it, you must create a new function on the file.


To run the tests
----------------

On the Batavia directory::

    $ python setup.py test -s tests.modules.NAME_OF_MODULE

For instance, to test the base_64 module::

    $ python setup.py test -s tests.modules.test_base64
