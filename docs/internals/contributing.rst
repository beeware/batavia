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
have Python 3.4, and have virtualenv available for use.

Start by forking Batavia into your own Github repository; then
check out your fork to your own computer into a development directory:

.. code-block:: bash

    $ mkdir batavia-dev
    $ cd batavia-dev
    $ git clone git@github.com:<your github username>/batavia.git

Batavia now requires a copy of Ouroboros (the Python standard library, written in Python) to build, so we also need to clone that.

.. code-block:: bash

    $ git clone https://github.com/pybee/ouroboros.git

Then create a virtual environment and install Batavia into it:

.. code-block:: bash

    $ virtualenv -p $(which python3) env
    $ . env/bin/activate
    $ cd batavia
    $ pip install -e .

*For those using anaconda*:

.. code-block:: bash
    $ cd batavia
    $ conda create -n batavia-dev
    $ source activate batavia-dev
    $ pip install -e .

You'll need to build the combined Batavia JS files:

.. code-block:: bash

    $ cd batavia
    $ make

Lastly, you'll need to obtain and install `PhantomJS`_. PhantomJS is a
headless browser that allows Batavia to test it's behavior in a "real"
browser. Installation instructions vary between platforms.

.. _PhantomJS: http://phantomjs.org

OS/X
~~~~

PhantomJS can be installed using `Homebrew`_. If you don't already have brew
installed, follow the brew installation instructions, then run::

    $ brew install phantomjs

Alternatively, you can download the PhantomJS tarball, and put the
``phantomjs`` executable somewhere in your path.

.. _Homebrew: http://brew.sh

Windows
~~~~

`Download PhantomJS <http://phantomjs.org/download.html>`__ and extract
the .exe file into your GitHub repository.

On Windows, Batavia also needs the GNU "make" utility, which you can
find `here <http://www.equation.com/servlet/equation.cmd?fa=make>`__.
This should likewise be extracted into your GitHub repository or
somewhere in your PATH.

Ubuntu
~~~~~~

Unfortunately, Ubuntu 14.04 ships with PhantomJS 1.8, which is quite old, and
has a number of significant bugs. You need to have PhantomJS >= 2.0 to run the
Batavia test suite.

A version of PhantomJS 2.0, precompiled for Ubuntu 14.04 can be `downloaded
here`_. This is the same binary that is used to run the `Batavia CI server`_,
so it should be reliable.

(Ubuntu 16.04, the new LTS, ships with PhantomJS 2.1.1 and Python 3.5.1.)

.. _downloaded here: https://s3.amazonaws.com/travis-phantomjs/phantomjs-2.0.0-ubuntu-14.04.tar.bz2
.. _Batavia CI server: https://travis-ci.org/pybee/batavia


Fedora
~~~~~~
Go to http://phantomjs.org/download.html and download the file for your architecuture
i.e. `64bit`_ or `32bit`_.

.. _64bit: https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
.. _32bit: https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-i686.tar.bz2
Unpack the file to your prefered location and add the bin directory to your PATH environment variable.

.. code-block:: bash

	$ export PATH=$PATH:/path-to-bin-directory



Build from sources on linux
~~~~~~
Building phantomjs takes 30min to several hours. Do this only if the other methods don't work.
Therefore, first have a look at http://phantomjs.org/download.html for prebuilds.
If no binary is available, check the instructions at http://phantomjs.org/build.html

Install the dependencies (on Fedora):

.. code-block:: bash

	$ sudo yum -y install gcc gcc-c++ make flex bison gperf ruby \
  	$ openssl-devel freetype-devel fontconfig-devel libicu-devel sqlite-devel \
  	$ libpng-devel libjpeg-devel



Then download and install phantomjs:

.. code-block:: bash

	$ git clone git://github.com/ariya/phantomjs.git
	$ cd phantomjs
	$ git checkout 2.1.1
	$ git submodule init
	$ git submodule update

Then compile and link phantomjs:

.. code-block:: bash

	$ python build.py

Raspbian/Raspberry Pi
~~~~~~~~~~~~~~~~~~~~~

This has been successfully tested on Raspbian GNU/Linux 7 (wheezy), based on
instructions from `Procrastinative Ninja`_ and `aeberhardo`_.

Raspbian for Raspberry Pi 1 does not come with Python 3.4.  (Ubuntu 16.04 for Raspberry
Pi is now available, and has new enough packages as described above.) To install Python
3.4, download the source code and then build it:

.. code-block:: bash

	$ cd /tmp
	$ wget https://www.python.org/ftp/python/3.4.4/Python-3.4.4.tgz
	$ tar xvzf Python-3.4.4.tgz
	$ cd Python-3.4.4/
	$ ./configure --prefix=/opt/python3.4
	$ make
	$ sudo make install

Once you have Python 3.4 installed, you can installing PhantomJS by
downloading and installing a version precompiled for Raspberry Pi:

.. code-block:: bash

    $ wget https://github.com/aeberhardo/phantomjs-linux-armv6l/archive/master.zip
    $ unzip master.zip
    $ cd phantomjs-linux-armv6l-master
    $ tar jxvf phantomjs-1.9.0-linux-armv6l.tar.bz2
    $ cp phantomjs /usr/local/bin/

To check that PhantomJS is working, run the following:

.. code-block:: bash

    $ phantomjs --version
    1.9.0

.. _Procrastinative Ninja: https://procrastinative.ninja/2014/07/20/install-python34-on-raspberry-pi
.. _aeberhardo: https://github.com/aeberhardo/phantomjs-linux-armv6l

Running the test suite
----------------------

You're now ready to run the test suite! From the batavia-dev/batavia directory Type:

.. code-block:: bash

    $ python setup.py test

This will take at least 20 minutes, and can take upwards of 1.5hrs, on most modern PCs/laptops,
and will generate around 10000 lines of console output - one line for each test that is executed.
Each line will tell you the pass/fail status of each test - e.g.,::

    test_abs_not_implemented (tests.builtins.test_abs.AbsTests) ... expected failure
    test_bool (tests.builtins.test_abs.BuiltinAbsFunctionTests) ... ok

This indicates that tests have passed (``ok``), or have failed in an expected
way (``expected failure``). These outcomes are what you expect to see. If you
see any lines that end ``FAIL``, ``ERROR``, or ``unexpected success``, then
you've found a problem. If this happens, at the end of the test run, you’ll
also see a summary of the cause of those problems.
 If you see "ERROR" press ctrl-c or cmd-c to quit the tests, and then start debugging.

However, this *shouldn't* happen - Batavia runs `continuous integration`_ to
make sure the test suite is always in a passing state. If you *do* get any
failures, errors, or unexpected successes, please check out the `troubleshooting section <#troubleshooting>`_ or get in touch, because you
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

External JS Dependencies
------------------------

In order to avoid reinventing the wheel, batavia makes use of external JavaScript libraries. While we manage the Python external dependencies using the Python Package Index and standard tools like `pip`, for JS we've decided to copy the code into our own repository. This practice of copying external source code is often known as 'vendoring'.


These vendored JS libraries live inside the `batavia/vendor/vendored.js` file, and can be used under the `batavia.vendored.<libraryname>` module hierarchy.

For instance, we vendored `Feross's Buffer library`_ so we can use `Node's Buffer API`_ to manipulate binary strings efficiently on any browser. It's available as `batavia.vendored.Buffer`.

.. _Feross's Buffer library: https://github.com/feross/buffer
.. _Node's Buffer API: https://nodejs.org/api/buffer.html

More details on how to add newer JS dependencies as you need them can be found in the file `batavia/vendor/VENDORING`.

Troubleshooting
---------------

- For Homebrew users, check that your installed version of phantomjs is 2.1.1
    + $ brew list phantomjs

- If you get an failure message saying `AssertionError: Unable to inject Batavia: false`, make sure there are contents in `batavia.min.js`. If the file is empty, run the following commands and run the test suite again:

  .. code-block:: bash

      $ pip install jsmin
      $ make clean
      $ make
      $ python setup.py test
