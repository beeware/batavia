Tutorial: Preparing your Environment for Batavia Development
============================================================

Getting a working local copy of Batavia requires a few steps: getting a copy of
the Batavia code, and the ouroboros dependency within a virtual environment.

You'll need to have Python 3.5 available for Batavia to work. Instructions on
how to set this up are `on our Environment setup guide
<http://pybee.org/contributing/how/first-time/setup/>`_.

1. Setup a `pybee` folder to store everything::

   $ mkdir pybee
   $ cd pybee

2. Get a copy of the Batavia code by running a :code:`git clone`::

   $ git clone https://github.com/pybee/batavia

3. We'll need to create a virtual environment, and install Batavia into it.

.. tabs::

    .. group-tab:: Linux

        .. code-block:: bash

           $ python3.5 -m venv venv
           $ . venv/bin/activate
           $ cd batavia
           $ pip install -e .

    .. group-tab:: MacOS

        .. code-block:: bash

           $ python3.5 -m venv venv
           $ . venv/bin/activate
           $ cd batavia
           $ pip install -e .

     .. group-tab:: Windows

           > py -3.5 -m venv venv
           > venv\Scripts\activate
           > cd batavia
           > pip install -e .

     .. group-tab:: Windows (with only conda installed)

           > pip install virtualenvwrapper-win
           > mkvirtualenv venv
           > workon venv
           > cd batavia
           > pip install -e .

4. In addition, you need to install `Node.js <https://nodejs.org>`_. You need
   to have a recent version of Node; we test using v6.9.1. It's possible you
   might already have Node installed, so to check what version you have, run::

   $ node --version

   If you have an older version of Node.js, or a version from the 7.X or 8.X series,
   you will need to download and install a version from the "stable" 6.X series.

   Once you've installed node, you need to make sure you have a current version
   of npm. Batavia requires npm v4.0 or greater; you can determine what version
   of npm you have by running::

   $ npm --version

   If you have an older version of npm, you can upgrade by running::

   $ npm install -g npm

   Once you've got npm, you can use it to install Batavia's JavaScript
   dependencies::

   $ npm install


5. Lastly, compile the Batavia library and bundle its dependencies::

   $ npm run build

Your final setup should end up looking like this::

  _ pybee
    \_ batavia
    \_ venv (if using virtualenv)

You now have a working Batavia environment!

Next Steps
----------

Next, we can :doc:`setup the sandbox <tutorial-1>`, and try out running Python
in your browser. Or your can try running some Python code :doc:`from the
command line <tutorial-2>`.

Troubleshooting Tips
--------------------

After running "npm run build", if  you recieve the error::

   "Module not found: Error: Cannot resolve 'file' or 'directory' ./stdlib"

Run this command::

   $ python compile_stdlib.py

Then try compiling the Batavia library again::

   $ npm run build
