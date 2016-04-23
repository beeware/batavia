Contributing to Batavia
=======================

If you experience problems with Batavia, `log them on GitHub`_. If you want to contribute code, please `fork the code`_ and `submit a pull request`_.

.. _log them on Github: https://github.com/pybee/batavia/issues
.. _fork the code: https://github.com/pybee/batavia
.. _submit a pull request: https://github.com/pybee/batavia/pulls


Setting up your development environment
---------------------------------------

The process of setting up a development environment is very similar to
the :doc:`/intro/getting-started` process. The biggest difference is that
instead of using the official PyBee repository, you'll be using your own
Github fork.

As with the getting started guide, these instructions will assume that you
have Python 3, and have virtualenv available for use.

Start by forking Batavia into your own Github repository; then
check out your fork to your own computer into a development directory:

.. code-block:: bash

    $ mkdir batavia-dev
    $ cd batavia-dev
    $ git clone git@github.com:<your github username>/batavia.git

Then create a virtual environment and install Batavia into it:

.. code-block:: bash

    $ virtualenv -p $(which python3) env
    $ . env/bin/activate
    $ pip install -e .

Lastly, you'll need to obtain and install `PhantomJS`_. PhantomJS is a
headless browser that allows Batavia to test it's behavior in a "real"
browser. Installation instructions

OS/X
~~~~

PhantomJS can be installed using `Homebrew`_. If you don't already have brew
installed, follow the brew installation instructions, then run::

    $ brew install phantomjs

Alternatively, you can download the PhantomJS tarball, and put the
``phantomjs`` executable somewhere in your path.

.. _Homebrew: http://brew.sh

Ubuntu
~~~~~~

Unfortunately, Ubuntu 14.04 ships with PhantomJS 1.8, which is quite old, and
has a number of significant bugs. You need to have PhantomJS >= 2.0 to run the
Batavia test suite.

A version of PhantomJS 2.0, precompiled for Ubuntu 14.04 can be `downloaded
here`_. This is the same binary that is used to run the `Batavia CI server`_,
so it should be reliable.

.. _downloaded here: https://s3.amazonaws.com/travis-phantomjs/phantomjs-2.0.0-ubuntu-14.04.tar.bz2
.. _Batavia CI server: https://travis-ci.org/pybee/batavia
.. _PhantomJS: http://phantomjs.org
Raspbian/Raspberry Pi
~~~~~~~~~~~~~~~~~~~~~

This has been successfully tested on Raspbian GNU/Linux 7 (wheezy)

Python 3.4
Source: `Procrastinative Ninja`_

.. _Procrastinative Ninja: https://procrastinative.ninja/2014/07/20/install-python34-on-raspberry-pi

Raspbian for Raspberry Pi 1 does not come with python 3.4.  To install python 3.4, you would need to first get the source and then build it:

Get the source:

.. code-block:: bash

	$ cd /tmp
	$ wget https://www.python.org/ftp/python/3.4.1/Python-3.4.1.tgz
	$ tar xvzf Python-3.4.1.tgz
	$ cd Python-3.4.1/

Configure and Install

.. code-block:: bash

	$ ./configure --prefix=/opt/python3.4
	$ make
	$ sudo make install


Installing Phantomjs
Source: `aeberhardo`_

.. _aeberhardo: https://github.com/aeberhardo/phantomjs-linux-armv6l

To install phantomjs:

.. code-block:: bash

    $ wget https://github.com/aeberhardo/phantomjs-linux-armv6l/archive/master.zip #downloads phantomjs source
    $ unzip master.zip
    $ cd phantomjs-linux-armv6l-master
    $ bunzip2 *.bz2 && tar xf *.tar
    $ ./phantomjs-1.9.0-linux-armv6l/bin/phantomjs --version

Copy phantomjs to /usr/local/bin:

.. code-block:: bash

    $ cp phantomjs /usr/local/bin/

Running the test suite
----------------------

You're now ready to run the test suite! Type:

.. code-block:: bash

    $ cd batavia
    $ python setup.py test

This will take about 5 minutes on most modern PCs/laptops, and will generate around 4000 lines of console output - one line for each test that is executed. Each line will tell you the pass/fail status of each test - e.g.,::

    test_abs_not_implemented (tests.builtins.test_abs.AbsTests) ... expected failure
    test_bool (tests.builtins.test_abs.BuiltinAbsFunctionTests) ... ok

This indicates that tests have passed (``ok``), or have failed in an expected
way (``expected failure``). These outcomes are what you expect to see. If you
see any lines that end ``FAIL``, ``ERROR``, or ``unexpected success``, then
you've found a problem. If this happens, at the end of the test run, you’ll
also see a summary of the cause of those problems.

However, this *shouldn't* happen - Batavia runs `continuous integration`_ to
make sure the test suite is always in a passing state. If you *do* get any
failures, errors, or unexpected successes, please get in touch, because you
may have found a problem.

.. _continuous integration: https://travis-ci.org/pybee/batavia

If you just want to run a single test, or a single group of tests, you can provide command-line arguments.

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

