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

        // We are now checking if a kwargs object is passed. If it isn't kwargs will be null. Like
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

    <fn>.__doc__ = 'docstring from Python 3.4 goes here, for documentation'

    modules.export = <fn>


Adding Tests
------------

The tests corresponding to Batavia implementations of built-ins are available inside
``tests/builtins``. The Batavia test infrastructure includes a system to check the compatibility of
JavaScript implementation of Python with the reference CPython implementation.

It does this by running a test in the Python interpreter, and then running the same code using
Batavia in the Node.js JavaScript interpreter. It will compare the output in both cases to see if
they match. Furthermore the test suite will automatically test the builtin against values of all
data types to check if it gets the same response across both implementations.

In many cases these tests will not cover everything, so you can add your own. For an example look at
the ``test_bool.py`` file in ``tests/builtins``. You will see two classes with test cases,
``BoolTests`` and ``BuiltinBoolFunctionTests``. Both derive from ``TranspileTestCase`` which
handles running your code in both interpreters and comparing outputs.

Let's look at some test code that checks if a the Batavia implementation of ``bool`` can handle a
bool-like class that implements ``__bool__``.

.. code-block:: Python

    def test_bool_like(self):
        self.assertCodeExecution("""
            class BoolLike:
                def __init__(self, val):
                    self.val = val

                def __bool__(self):
                    return self.val == 1
            print(bool(BoolLike(0)))
            print(bool(BoolLike(1)))
            """)

The ``assertCodeExecution`` method will run the code provided to it in both implementations. This
code needs to generate some output so that the output can be compared, hence the need to print the
values.


Process
----------

For a given function, run `functionname.__doc__` in the Python 3.4 repl

Copy the docstring into the doc

Run the function in Python 3.4

Take a guess at the implementation structure based on the other functions.

Copy the style of the other implemented functions
