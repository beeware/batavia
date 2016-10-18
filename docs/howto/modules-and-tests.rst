Adding a module and testing it
==============================

To create a module
------------------

Add the module path, in alphabetic order, to: 
a) Makefile (on BASE_FILES and BASE_FILES_WIN);
b) testserver/testbed.html.

To create a test
----------------

If the module doesn't exist yet, it must be created as a test_NAME-OF-THE-MODULE.py file. 

If a test for the module already exists and you want to add funcionalities to it, you must create a new function on the file.


To run the tests
----------------

On the Batavia directory:
$ python setup.py test -s tests.modules.NAME_OF_MODULE

For instance, to test the base_64 module:
$ python setup.py test -s tests.modules.test_base64