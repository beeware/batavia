Setting up your development environment
=======================================

The process of setting up a development environment is very similar to
the :doc:`/tutorial/tutorial-0` process. The biggest difference is that
instead of using the official BeeWare repository, you'll be using your own
GitHub fork.

As with the getting started guide, these instructions will assume that you
have Python 3 (currently supported versions are 3.5, 3.6, and 3.7).

Batavia codebase
----------------

Start by forking Batavia into your own GitHub repository; then
check out your fork to your own computer into a development directory:

.. code-block:: bash

    $ mkdir batavia-dev
    $ cd batavia-dev
    $ git clone https://github.com/<your github username>/batavia.git

Then create a virtual environment and install Batavia into it:

.. tabs::

  .. group-tab:: MacOS

    .. code-block:: bash

        $ python3 -m venv venv
        $ . venv/bin/activate
        (venv) $ cd batavia
        (venv) $ pip install -e .

  .. group-tab:: Linux

    .. code-block:: bash

        $ python3 -m venv venv
        $ . venv/bin/activate
        (venv) $ cd batavia
        (venv) $ pip install -e .

  .. group-tab:: Windows

    .. code-block:: doscon

        > py -3.6 -m venv venv
        > venv\Scripts\activate
        (venv) > cd batavia
        (venv) > pip install -e .

Install Node.js
---------------

Lastly, you'll need to install `Node.js`_. You need to have a recent version
of Node; we test using v10.x. Once you've installed node, you can use it to
install Batavia's JavaScript dependencies, and compile the Batavia library:

.. code-block:: bash

    (venv) $ npm install -g npm
    (venv) $ npm install
    (venv) $ npm run build

.. _Node.js: https://nodejs.org

Running the test suite
----------------------

You're now ready to run the test suite! This can be done the
immediately-available-but-tiresome way, or the takes-little-effort-but-then-fun
way, which is preferred (*assuming* your Python is configured for Tk; MacOS Python
often is *not*).

For the fun way, you need to install BeeWare's test-running tool,
Cricket_. Follow the installation instructions to install it into your
virtualenv; then, in the ``batavia-dev/batavia`` directory, type:

.. _Cricket: https://cricket.readthedocs.io/en/latest/

.. code-block:: bash

    (venv) $ cricket-unittest

This launches a test-running GUI, where you can easily and intuitively
run all tests or a subset of tests, see the progress of tests (which is
quite valuable when running over 10000 tests), and whenever failure is
encountered, immediately see the details.

If, for whatever reason, you want to run the tests without Cricket, you can
always use a text test runner by typing:

.. code-block:: bash

    (venv) $ python setup.py test

This will take at least several minutes, and can take upwards of 1.5hrs on most
modern PCs/laptops. It will also generate around 10000 lines of console output -
one line for each test that is executed.  Each line will tell you the pass/fail
status of each test - e.g.,::

    test_abs_not_implemented (tests.builtins.test_abs.AbsTests) ... expected failure
    test_bool (tests.builtins.test_abs.BuiltinAbsFunctionTests) ... ok

This indicates that tests have passed (``ok``), or have failed in an expected
way (``expected failure``). These outcomes are what you expect to see.

If you see any tests reported as ``FAIL``, ``ERROR``, or ``unexpected success``,
then you've found a problem. If this happens, at the end of the test run, you’ll
also see a summary of the cause of those problems.

As soon as you see problems, you can stop the tests and start debugging. Cricket
has a button for this; with the text test runner, hit Ctrl-C or Cmd-C to quit.

However, this *shouldn't* happen - Batavia runs `continuous integration`_ to
make sure the test suite is always in a passing state. If you *do* get any
failures, errors, or unexpected successes, please check out the
`troubleshooting section <#troubleshooting>`_ or get in touch, because you
may have found a problem.

.. _continuous integration: https://travis-ci.org/beeware/batavia

If you just want to run a single test, or a single group of tests with the text
runner, you can provide command-line arguments.

To run a single test, provide the full dotted-path to the test:

.. code-block:: bash

    $ python setup.py test -s tests.datatypes.test_str.BinaryStrOperationTests.test_add_bool

To run a full test case, do the same, but stop at the test case name:

.. code-block:: bash

    $ python setup.py test -s tests.datatypes.test_str.BinaryStrOperationTests

Or, to run all the Str datatype tests:

.. code-block:: bash

    $ python setup.py test -s tests.datatypes.test_str

Or, to run all the datatypes tests:

.. code-block:: bash

    $ python setup.py test -s tests.datatypes

Running the linter
------------------
.. code-block:: bash

    $ npm run lint
