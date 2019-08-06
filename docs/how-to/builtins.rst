Implementing Python Built-ins in JavaScript
===========================================

Python's builtins give Python its trademark magical feel. If you're new to Python, read up on `them here.
<https://docs.python.org/3/library/functions.html>`_

Most builtins have already been added to the project, but many are do not quite match the original
implementation exactly. Some may not handle certain types of inputs correctly. In addition, new builtins
may arrive with the latest and greatest Python version. This guide should serve as your field manual for
adding, updating, and navigating our implementations.

Process
-------

The first thing to do when adding anything to Batavia is to play around a bit with it in the Python REPL.
Here's an example using ``list()``::

    >> list()
    []
    >> list((1, 2, 3, 4))
    [1, 2, 3, 4]
    >> list(4)
    Traceback (most recent call last):
    File "<stdin>", line 1, in <module>
    TypeError: 'int' object is not iterable

Your goal is to find out how the function responds to various inputs and outputs. You may also
want to consult the offical documentation. Once you're a little familiar, you can start to add your
implementation to Batavia.

General Structure
*****************

JavaScript versions of Python built-in functions can be found inside the ``batavia/builtins``
directory in the Batavia code. Each built-in is placed inside its own file. These builtins are
designed to be used only inside Batavia, as such they need to ensure they are being used in
a compatible manner.

Each builtin function will receive arguments and keyword arguments and needs to handle them,
even if the result is throwing an error. Args should be an array, and kwargs should be a
JavaScript object. The first thing to do is check that both were passed in.

Let's take a look at an example using the ``list()`` builtin

.. code-block:: javascript

    // List accepts exactly one argument and no keyword arguments

    var list = function(args, kwargs) {
        // Always add this code.
        if (arguments.length !== 2) {
            throw new builtins.BataviaError.$pyclass("Batavia calling convention not used.");
        }

This code ensures that the function can handle keyword arguments. Next, we need to validate the arguments are
correct. We can use JavaScript's ``Object.keys()`` to get the keys of an object. If we can't accept certain
args or kwargs, we will check the Python REPL to see what kind of error should be thrown and throw it.

.. tabs::

    .. group-tab:: Python REPL

        .. code-block::

            >> list(a=1)
            TypeError: list() doesn't accept keyword arguments.
            >> list(1, 2, 3)
            TypeError: list() expected exactly 1 argument (3 given)

    .. group-tab:: Batavia Code

        .. code-block:: javascript

                if (kwargs && Object.keys(kwargs).length > 0) {
                    throw new exceptions.TypeError.$pyclass("<fn>() doesn't accept keyword arguments.");
                }

                if (!args || args.length !== 1) {
                    throw new exceptions.TypeError.$pyclass("<fn>() expected exactly 1 argument (" + args.length + " given)");
                }

                // If the function only works with a specific object type, add a test
                var obj = args[0];
                if (!types.isinstance(obj, types.<type>)) {
                    throw new exceptions.TypeError.$pyclass(
                        "<fn>() expects a <type> (" + type_name(obj) + " given)");
                }

        Useful functions are ``types.isinstance``, which checks for a match against a Batavia type or list,
        of Batavia types, ``types.isbataviainstance``, which checks for a match against any Batavia instance,
        ``Object.keys(kwargs)`` for dealing with kwargs, and JavaScript's ``for in``, ``for of``, and
        ``Array.forEach`` loops for iterating over the JavaScript arrays and objects.

        Note also the format for errors: ``throw new exceptions.<Error>.$pyclass``.

Returning a value
*****************

Builtins implement Python functions and should return a Python object.
Batavia implementations of all Python types are located in ``/batavia/types.js``.
JavaScript imports use the ``require`` keyword and can be imported inline or at
the top of the file. Inline imports can be preferable in some cases.

.. code-block:: javascript

    ...

    Tuple = require('../types.js').Tuple
    return new Tuple(my, results, here)
    }

Documentation
*************

Finally, add the docstring to the function object. In JavaScript, like in Python, functions
are first-class objects and can have additional properties.

.. code-block:: javascript

    list.__doc__ = 'docstring from Python 3.x goes here, for documentation'

    module.exports = list

Tests
*****

No implemenation for a project like this is complete without tests. Check out the other sections for
more details on test structure. Tests are located in ``/tests`` in a similar folder structure to the
core code, and most test files have already been created. Some things that should almost always be
tested:

* Write a test or three to ensure your function returns the correct output with some normal inputs.
* Think of a few weird inputs that could throw off your code (or future code). Test them.
* If you are throwing an error (excluding ``BataviaError``) anywhere, write a test that tries to throw it.
* If you accounted for an edge case (look for an ``if`` statement), test it.
* Check out the `official documentation <https://docs.python.org/3/>`_ for more edge cases.
