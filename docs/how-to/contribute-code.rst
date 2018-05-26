Contributing to Batavia
=======================

If you experience problems with Batavia, `log them on GitHub`_. If you want to contribute code, please `fork the code`_ and `submit a pull request`_.

.. _log them on Github: https://github.com/pybee/batavia/issues
.. _forking Batavia:
.. _fork the code: https://github.com/pybee/batavia
.. _submit a pull request: https://github.com/pybee/batavia/pulls


Setting up your development environment
---------------------------------------

The process of setting up a development environment is very similar to
the :doc:`/tutorial/tutorial-0` process. The biggest difference is that
instead of using the official PyBee repository, you'll be using your own
Github fork.

As with the getting started guide, these instructions will assume that you
have Python 3 (currently supported versions are 3.4 to 3.6).

Batavia codebase
^^^^^^^^^^^^^^^^

Start by `forking Batavia`_ into your own Github repository; then
check out your fork to your own computer into a development directory:

.. code-block:: bash

    $ mkdir batavia-dev
    $ cd batavia-dev
    $ git clone https://github.com/<your github username>/batavia.git

Then create a virtual environment and install Batavia into it:

 * For Linux, MacOS::

   $ python3 -m venv venv
   $ . venv/bin/activate
   $ cd batavia
   $ pip install -e .

 * For Windows (assuming Python 3.4)::

   > py -3.4 -m venv venv
   > venv\Scripts\activate
   > cd batavia
   > pip install -e .

Install Node.JS
^^^^^^^^^^^^^^^

Lastly, you'll need to install `Node.js`_. You need to have a recent version
of Node; we test using v6.9.1. Once you've installed node, you can use it to
install Batavia's JavaScript dependencies, and compile the Batavia library:

.. code-block:: bash

    $ npm install -g npm
    $ npm install
    $ npm run build

.. _Node.js: https://nodejs.org


Raspbian/Raspberry Pi
"""""""""""""""""""""""

This has been successfully tested on Raspbian GNU/Linux 7 (wheezy), based on
instructions from `Procrastinative Ninja`_ and `aeberhardo`_.

Raspbian for Raspberry Pi 1 does not come with Python 3.4.  (Ubuntu 16.04 for Raspberry
Pi is now available, and has new enough packages as described above.) To install Python
3.4, download the source code and then build it:

.. code-block:: bash

	$ cd /tmp
	$ wget https://www.python.org/ftp/python/3.4.8/Python-3.4.8.tgz
	$ tar xvzf Python-3.4.8.tgz
	$ cd Python-3.4.8/
	$ ./configure --prefix=/opt/python3.4
	$ make
	$ sudo make install


.. _Procrastinative Ninja: https://procrastinative.ninja/2014/07/20/install-python34-on-raspberry-pi
.. _aeberhardo: https://github.com/aeberhardo/phantomjs-linux-armv6l

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

    $ cricket-unittest

This launches a test-running GUI, where you can easily and intuitively
run all tests or a subset of tests, see the progress of tests (which is
quite valuable when running over 10000 tests), and whenever failure is
encountered, immediately see the details.

If, for whatever reason, you want to run the tests without Cricket, you can
always use a text test runner by typing:

.. code-block:: bash

    $ python setup.py test

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

.. _continuous integration: https://travis-ci.org/pybee/batavia

If you just want to run a single test, or a single group of tests with the text runner, you can provide command-line arguments.

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
----------------------
.. code-block:: bash

    $ npm run lint

Troubleshooting
---------------

- If you copied the main Batavia code a while ago, please make sure your forked branch is up to date with the original branch. To do this:

  - set your upstream remote::

    $ git remote add upstream https://github.com/pybee/batavia.git

  - make sure you have the latest changes from upstream::

    $ git fetch upstream

  - rebase your **master** branch to **upstream** before pushing to GitHub and submitting a pull request::

    $ git rebase upstream/master
