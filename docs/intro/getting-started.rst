Getting Started
===============

In this guide we will walk you through setting up your Batavia environment for
development and testing. We will assume that you have a working Python 3.4,
and use virtualenv.

Get a copy of Batavia
---------------------

The first step is to create a project directory, and clone Batavia:

.. code-block:: bash

    $ mkdir tutorial
    $ cd tutorial
    $ git clone https://github.com/pybee/batavia.git

Then create a virtual environment and install Batavia into it:

.. code-block:: bash

    $ virtualenv -p $(which python3) env
    $ . env/bin/activate
    $ cd batavia
    $ pip install -e .
    
.. code-block:: doscom
    > virtualenv --python=c:\python34\python.exe env
    > cd env\Spripts
    > activate
    > pip install -e .
    

Next Steps
----------

You now have a working Batavia environment, so you can :doc:`start the first
tutorial </tutorials/tutorial-0>`.
