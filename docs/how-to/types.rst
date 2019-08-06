Implementing Python Types in JavaScript
=======================================

Python's popularity is, in large part, due to the wonderful flexibility of its native types, like ``List`` and ``Dict``. In Batavia, Python native types are the building blocks for all of our other code.
This document will cover the structure of Batavia types and guide you on how to update the existing Batavia implementations.

Process
-------

The first thing to do when adding anything to Batavia is to play around a bit with it in the Python REPL.
Here's an example using ``int``::

    >>> int
    <class 'int'>
    >>> int(1)
    1
    >>> dir(int)
    ['__abs__', '__add__', '__and__', '__bool__', '__ceil__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__', '__floor__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getnewargs__', '__gt__', '__hash__', '__index__', '__init__', '__int__', '__invert__', '__le__', '__lshift__', '__lt__', '__mod__', '__mul__', '__ne__', '__neg__', '__new__', '__or__', '__pos__', '__pow__', '__radd__', '__rand__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rlshift__', '__rmod__', '__rmul__', '__ror__', '__round__', '__rpow__', '__rrshift__', '__rshift__', '__rsub__', '__rtruediv__', '__rxor__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', '__trunc__', '__xor__', 'bit_length', 'conjugate', 'denominator', 'from_bytes', 'imag', 'numerator', 'real', 'to_bytes']

Your goal is to find out how the type responds to various inputs and outputs. You may also
want to consult the offical documentation. Once you're a little familiar, you can start to add your
implementation to Batavia.

Anatomy of a Type
*****************

Each Python type should be implemented as a JavaScript class. JavaScript handles classes similarly to Python,
but the syntax is very different. Each JavaScript class creates a constructor (similar to Python's ``__init__``),
which is any function that includes the ``this`` keyword, and a prototype, stored in ``<class>.prototype``.
The prototype implements all of the methods for the class, including the constructor, and that's where we'll implement
the type's magic methods and other options. Let's take a look at ``List``.

.. code-block:: javascript

    // Declare the list class.
    function List() {
        var builtins = require('../builtins')

        if (arguments.length === 0) {
            this.push.apply(this)
        } else if (arguments.length === 1) {
            // Fast-path for native Array objects.
            if (Array.isArray(arguments[0])) {
                this.push.apply(this, arguments[0])
            } else {
                var iterobj = builtins.iter([arguments[0]], null)
                var self = this
                callables.iter_for_each(iterobj, function(val) {
                    self.push(val)
                })
            }
        } else {
            throw new exceptions.TypeError.$pyclass('list() takes at most 1 argument (' + arguments.length + ' given)')
        }
    }

    function Array_() {}

    Array_.prototype = []

    List.prototype = Object.create(Array_.prototype)     // Duplicates the prototype to avoid damaging the original
    List.prototype.length = 0
    create_pyclass(List, 'list', true)                   // Register the class with Batavia
    List.prototype.constructor = List

This is the constructor, which is called by Batavia when someone invokes ``list()`` or ``[]``. We includes some code to inherit
JavaScript's native array prototype, which has much of the same functionality as List and has lots of quick functions.
You can use JavaScript natives in your implementation; this is a significant speed boost.

Below that, you'll find all of the member methods added to the prototype. Note that each of these
should return a Python type from ``types.js``.

.. code-block:: javascript

    List.prototype.__iter__ = function() {
        return new ListIterator(this)
    }

    List.prototype.__len__ = function() {
        var types = require('../types')
        return new types.Int(this.length)
    }

List also implements ``.toString()``, a JavaScript function that is sometimes called automatically when a string
conversion is needed.

.. code-block:: javascript

    List.prototype.toString = function() {
        return this.__str__()
    }

Note also the format for errors: ``throw new exceptions.<Error>.$pyclass``.

Making Changes
**************

Make a Test
^^^^^^^^^^^

There is much work to be done in the types folder. When making changes, your goal is to match the output
of CPython and the output of the same call made in Batavia. Since we know the desired input and output,
we can use a test and then just fiddle.

Head over to ``/tests`` and find the ``test_<yourtype>`` file. Many types have a robust test suite, but
do not assume that it is complete.
Follow the format there to add a test for your issue or modify an existing test.
Run it using the following command to check for errors.

.. code-block:: bash

    $ python setup.py -s tests.path.to.your.test.TestClass.test_function

Note: ``@expectedFailure`` indicates a test that's not passing yet. Your issue may be tested in one of those cases already.

Pass the Test
^^^^^^^^^^^^^

If the test code runs and fails, you've identified the bug and should have some helpful output comparisons. Head over to
the type you want and start making edits, running your test until it passes. Occasionally, your bug will take you into
other Batavia types and builtins. That's fine too! There are a million places for small omissions all over the codebase.
Just keep in mind that the further you go down the rabbit hole, the more likely you are to have missed something simple.

Once the test passes, run all tests for the class and see what else broke. (There's always something)::

    $ python setup.py -s tests.path.to.your.test

After that, it's a good idea to pull the upstream master and check for merge conflicts.::

    $ git add .
    $ git commit -m "<message>"
    $ git fetch upstream
    $ git rebase origin/master

If you made major changes, then it may be a good idea to run the full test suite before submitting your pull request.::

    $ python setup.py -s tests

(Check out the sidebar for better/faster ways to run the full suite.) Finally, push your code to your fork and submit
your pull request on GitHub to run the CI. Fix any issues and push again until CI passes. The Batavia team will get back
to you with any additional notes and edits.

Tips
^^^^

Your goal is to mimic the CPython implementation as much as possible. If you do so, you'll often fix multiple issues at once. Here's some tips:

* The original implementation is documented in detail at https://docs.python.org/3/ -- reading up there will definitely improve your understanding.
* If you're inherting your class from JavaScript, which is very common, you get JavaScript's internal methods for free. Oftentimes, they can be left as is or lightly wrapped.
* Make sure your test properly covers the issue. For instance, if a member function accepts any iterable, make a generic iterable instead of using a list or tuple.
* Make sure method implementations accept args and kwargs, and throw appropriate errors if the input doesn't match.
* Keep your Python REPL open to the side and test your assumptions with lots of inputs and outputs.
