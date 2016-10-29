Tutorial 0 - Getting Started
=============================

Getting a working local copy of Batavia requires a few steps: getting a copy of
the Batavia code, and the ouroboros dependency within a virtual environment.

You'll need to have Python 3.4 available for Batavia to work. Instructions on
how to set this up are `on our Environment setup guide
<http://pybee.org/contributing/first-time/setup/>`_. 

Setup a `pybee` folder to store everything::

   $ mkdir pybee
   $ cd pybee

Get a copy of the Batavia code by running a :code:`git clone`::

   $ git clone https://github.com/pybee/batavia

Batavia requires a copy of Ouroboros (the Python standard library, written in
Python) to build, so we also need to clone that::

   $ git clone https://github.com/pybee/ouroboros

Then, we need to create a virtual environment, and install Batavia into it.

 * For Linux, MacOS::

   $ virtualenv venv
   $ . venv/bin/activate
   $ cd batavia
   $ pip install -e .

 * For Windows::

   > virtualenv --python=c:\python34\python.exe venv
   > cd venv\Scripts
   > activate
   > pip install -e .

 * For Anaconda users::

   $ cd batavia
   $ conda create -n batavia
   $ source activate batavia
   $ pip install -e .

And finally, run the :code:`make` script to generate the combined Batavia JavaScript files::

   $ make

Your final setup should end up looking like this:: 

  _ pybee
    \_ batavia
    \_ ouroboros
    \_ venv (if using virtualenv)

You now have a working Batavia environment!

Next Steps
----------

Next, we can `setup the sandbox </tutorials/tutorial-1>`, and try out
running Python in your browser.
