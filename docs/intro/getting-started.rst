Getting Started
===============

Installing Batavia
------------------

The Batavia runtime is distributed using NPM. Ensure that you have NodeJS
installed, and execute:

.. code-block:: bash

    $ npm install batavia

That's it! You now have a copy of Batavia inside your ``node_modules/batavia``.

Hacking on Batavia
------------------

Want to fix bugs and add features to Batavia itself?

In this guide we will walk you through setting up your Batavia environment for
development and testing. We will assume that you have a working Python 3.4,
NodeJS, and use virtualenv.

Get a copy of Batavia
---------------------

The first step is to create a project directory, and clone Batavia:

.. code-block:: bash

    $ git clone https://github.com/pybee/batavia.git
    $ cd batavia
    $ npm install

Preparing a sandbox for development
-----------------------------------

In :doc:`the next section of the tutorial </tutorials/tutorial-0>`, we will be
installing the development tooling. Create and activate a virtual environment
for that first:

.. code-block:: bash

    $ virtualenv -p $(which python3) ./venv
    $ . ./venv/bin/activate

*On Windows*

.. code-block:: doscom

    > virtualenv --python=c:\python34\python.exe venv
    > cd venv\Scripts
    > activate

*For those using anaconda*:

.. code-block:: bash

    $ cd batavia
    $ conda create -n batavia
    $ source activate batavia


Next Steps
----------

You now have a working Batavia development environment, so you can :doc:`start the first
tutorial </tutorials/tutorial-0>`.
