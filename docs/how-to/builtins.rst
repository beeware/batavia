Implementing Python Built-ins in JavaScript
===========================================

General Structure
-----------------

JavaScript versions of Python built-in functions can be found inside the ``batavia/builtins``
directory in the Batavia code. Each built-in is placed inside its own file.

.. code-block:: javascript

    // Example: a function that accepts exactly one argument, and no keyword arguments

    var <fn> = function(<args>, <kwargs>) {
        // These builtins are designed to be used only inside Batavia, as such they need to ensure
        // they are being used in a compatible manner.

        // Batavia will only ever pass two arguments, args and kwargs. If more or fewer arguments
        // are passed, then Batavia is being used in an incompatible way.
        // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
        if (arguments.length !== 2) {
            throw new builtins.BataviaError.$pyclass("Batavia calling convention not used.");
        }

        // We are now checking if a kwargs object is passed. If it isn't, kwargs will be null. Like
        // obj.keys() in Python we can use Object.keys(obj) to get the keys of an object. If the
        // function doesn't need support any kwargs we throw an error.
        if (kwargs && Object.keys(kwargs).length > 0) {
            throw new builtins.TypeError.$pyclass("<fn>() doesn't accept keyword arguments.");
        }

        // Now we can check if the function has the supported number of arguments. In this case a
        // single required argument.
        if (!args || args.length !== 1) {
            throw new builtins.TypeError.$pyclass("<fn>() expected exactly 1 argument (" + args.length + " given)");
        }

        // If the function only works with a specific object type, add a test
        var obj = args[0];
        if (!types.isinstance(obj, types.<type>)) {
            throw new builtins.TypeError.$pyclass(
                "<fn>() expects a <type> (" + type_name(obj) + " given)");
        }

        // actual code goes here
        Javascript.Function.Stuff();
    }

    <fn>.__doc__ = 'docstring from Python 3.x goes here, for documentation'

    modules.export = <fn>

Building Blocks of Batavia
--------------------------

This section is a quick reference for things you'll see often in the codebase.

builtins.js
***********

This contains all of the native Python builtin functions, like ``str``, ``len``, and ``iter``.

When dealing with Python types, many of the native JavaScript operations have been overriden to
try to use these first. For instance, .toString() will often just call the object's __str__.

Note again that *args* and *kwargs* are required for most builtins, even if empty.

types.js
********

This contains all of the native Python types that have been implemented in Batavia. It also has some helper functions:

* ``types.js2py`` Converts a native JavaScript type to a corresponding Batavia type.
* ``types.isinstance`` checks to see if the object is a Python instance of the corresponding type.
* ``types.isbataviainstance`` checks to see if the object is an instance of any Batavia type.
* ``types.type_name`` get the name of the type.

Where possible, use Python types from types.js instead of native JavaScript objects and types.
This allows us to avoid things like comparing ``Object.prototype.constructor``. Instead, use these helpers!

core/callables.js
*****************

These methods ensure that all Python code is executed using the proper __call__ procedure, which could occasionally
have something special built in or be overriden or decorated by the programmer.

* ``callables.call_function`` Invokes a function using its __call__ method if possible. If not, just call it normally.
* ``callables.call_method`` Calls a class method using the call_function specification above.
* ``callables.iter_for_each`` Exhausts an iterable using the call_function specification above.

As a general rule, use the builtin where possible. If no builtin is available, use the appropriate version
of ``call_function`` instead of calling Python functions and methods directly. An example:

.. code-block:: javascript

    // Avoid this
    my_thing.__repr__()

    // Better
    const callables = require('./core/callables.js')
    callables.call_method(my_thing, '__repr__', [], {})

    // Best
    const repr = require('./builtins.js').repr
    repr(my_thing, [], {})

Note the use of the Batavia calling convention in the two cases above!