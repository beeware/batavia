Implementing Tests in Batavia
=============================

Basic Test Structure
--------------------

Batavia's job is to run a browser-compatible Python compiler, which takes valid Python as input and runs it.
Therefore, tests should test that the output of the Batavia compiler matches the output of CPython::

    print('Hello')  # Code to test
    Hello               # CPython output
    Hello               # Batavia output
    # Outputs match. Test passes!

This test structure is simple and effective. It's used in almost every test we've written.

Adding Tests
------------

In many cases, existing tests will not cover everything. Feel free to add your own!

The tests corresponding to Batavia implementations of built-ins are available inside
``tests/builtins``. The Batavia test infrastructure includes a system to check the compatibility of
JavaScript implementation of Python with the reference CPython implementation.

These tests all derive from ``TranspileTestCase``, which handles running your code in both interpreters
and comparing outputs. For an example, look at the ``test_bool.py`` file in ``tests/builtins``. You
will see two classes with test cases, ``BoolTests`` and ``BuiltinBoolFunctionTests``. Both derive
from ``TranspileTestCase``.

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
values. **Code that is not being printed is not being tested.**

Finally, ``print()`` is an imperfect creature for tests. Some things in Python aren't guaranteed to
print out in the same order every time, like sets dictionaries. Tests should be structured to compensate,
for instance by converting to a sorted list. See also the output cleaners section below.

Template
--------

.. code-block:: python

    def test_<builtin>_<feature/case>(self):
        # Valid Python code to be tested.
        code = """
            print('>>> print(<code>)')
            print(<code>)
        """
        self.assertCodeExecution(code)

This code block provides a printout of the code being run as well as the output of the code,
which can be very useful for debugging in test cases where more than a few lines of code are being run.

Testing for Errors
------------------

Since we're testing the compiler, we need to ensure that errors for all of the builtins are thrown correctly.
We also want to ensure that we're not getting the wrong errors in our tests. Simply include a try/except
block in your test.

.. code-block:: python

    def test_some_error(self):
        code = """
            try:
                code_that_raises_a_ValueError()
            except ValueError as err:
                print(err)
            print("Test complete!")
        """
        self.assertCodeExecution(code)

Remember to catch the specific error you want, and then print the error. Then, print a success message to
validate that your except block didn't crash as well. **Code that is not being printed is not being tested.**

Output Cleaners
---------------

In some cases, the test output will vary. ``TranspileTestCase`` will automatically apply some common output
cleanup for you. Some cases will need more or less cleanup. If you run your Python code directly in the REPL,
and the output differs from the test case output, you may need to modify what cleanup steps are being run.

As such, ``assertCodeExecution`` accepts optional ``js_cleaner`` and ``py_cleaner`` objects. These can be provided by
the ``@transform`` decorator, located in ``tests/utils/output_cleaners.py``. Here's an example:

.. code-block:: python

    @transform(float_exp=False)
    def test_some_floats(self, js_cleaner, py_cleaner):        # + Cleaner objects as arguments
        code = ...
        self.assertCodeExecution(code, js_cleaner=js_cleaner, py_cleaner=py_cleaner) # + Cleaner objects again

This code means that the output of floating-point numbers will not be normalized using a regex. Refer to other
test cases and the docstring for ``@transform`` for more examples.

Node/Python Crashes
-------------------

If the CPython or JavaScript code crashes outright, UnitTest struggles. For instance,
``confused END_FINALLY`` in the middle of your test output tends to mean that the JavaScript code threw an
uncaught exception, causing Node to stop. It's hard for UnitTest to pull the details out of this type of thing
since that error occurred in Node, not Python.

These types of errors will often appear above the test case as a crash report instead of in the usual section for the
output of your test's print() statements. Look there for clues.
