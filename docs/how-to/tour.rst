Tour of the Code
================

Before getting started, it's nice to know a bit about how the project is structured and where
to look for examples. This document aims to provide a brief tour of the
important features of the code. It's aimed at new contributors, but frequent flyers can
skip down to the bottom for a quick reference.

General Structure
-----------------

Core Code
*********

Batavia implements the Python native types, builtins, and standard library partially in JavaScript.
This ensures quick execution and less compiling of the compiler. These are orgainzed into the
``builtins``, ``core``, ``modules``, ``stdlib``, and ``types`` files of the main ``/batavia`` directory, with
corresponding subdirectories. Alongside the virtual machine and test suite, this code makes 
up the bulk of Batavia. New contributors should start with the ``types`` and ``builtins`` sections
for the best examples to review and copy from. These implementations are the foundation of Python as you know it and
should be immediately familiar to a Python developer.

Support
*******
You'll also notice folders for tests, docs, and a few other sections, like ``testserver``, which is
a sample deployment via Django that allows code execution in your browser. Contributions to the 
tests and documentation are always welcome and are great ways to familiarize yourself with the
code and meet the other contributors.

The Core Code
-------------

A Word on Args & Kwargs
***********************

Batavia's implementations of various builtin functions
often **require** ``args`` and ``kwargs`` as input. Here's an example of calling
the repr of a ``my_thing`` object: ``builtins.repr(my_thing, [], {})``

The empty [] and {} arguments represent empty argument and keyword argument parameters.
This mimics how Python handles function arguments behind the scenes, and it's important!

For instance, what happens when you pass a keyword argument into a list? You might say,
"list() doesn't take keyword arguments." In actuality, the list function does receive those 
arguments, and the result is that it throws ``TypeError: '<kwarg>' is an invalid keyword 
argument for this function``

Batavia needs those arguments explicitly specified in a standard format so that it can
check for that case and generate the correct error. The below code examples all use this calling
convention, and you'll be up to your knees in ``BataviaErrors`` if you're not aware of it.

Building Blocks of Batavia
**************************

This section is a quick reference for the most common code you'll see.

builtins.js
^^^^^^^^^^^

.. code-block:: javascript

    var builtins = require('./builtins.js')
    builtins.abs([-1], {})              // equivalent to abs(-1)

This contains all of the native Python builtin functions, like ``str``, ``len``, and ``iter``.

When dealing with Python types, many of the native JavaScript operations have been modified to
try to use builtins first. For instance, ``.toString()`` will often just call the object's ``__str__`` if
possible. Still, the best practice is to use the builtins and types wherever possible.

types.js
^^^^^^^^

.. code-block:: javascript

    var types = require('./types.js)
    var my_dict = new types.dict([], {})

This contains all of the native Python types that have been implemented in Batavia. It also has some helper functions:

* ``types.js2py`` Converts a native JavaScript type to a corresponding Batavia type.
* ``types.isinstance`` checks to see if the object is a Python instance of the corresponding type.
* ``types.isbataviainstance`` checks to see if the object is an instance of **any** Batavia type.
* ``types.Type.type_name`` get the name of the type.

This allows us to avoid ugly things like comparing ``Object.prototype.constructor``. Instead,
use ``types.isinstance`` or ``types.isbataviainstance``. Secondly, it's important that the inputs to Python
types are Pythonized themselves where needed. You should not be making a list() of JavaScript arrays, for
instance. That doesn't make sense! (It may even pass some tests, which is dangerous.)

core/callables.js
^^^^^^^^^^^^^^^^^

These methods ensure that all Python code is executed using the proper ``__call__`` procedure, which could be
overriden or decorated by the programmer.

* ``callables.call_function`` Invokes a function using its ``__call__`` method if possible. If not, just call it normally.
* ``callables.call_method`` Calls a class method using the call_function specification above.
* ``callables.iter_for_each`` Exhausts an iterable using the call_function specification above.

As a general rule, use the builtin where possible. If no builtin is available, use the appropriate version
of ``call_function`` instead of calling Python functions and methods directly. An example:

.. code-block:: javascript

    // Avoid this
    my_thing.__len__()

    // Better
    var callables = require('./core/callables.js')
    callables.call_method(my_thing, '__len__', [], {})

    // Best
    var len = require('./builtins.js').len
    len(my_thing, [], {})

Note the use of the Batavia calling convention in the two cases above!

/core/version.js
^^^^^^^^^^^^^^^^
Some helper functions for distinguishing the version of Python that's running. Outputs
vary from version to version, so it's nice to have this handy.