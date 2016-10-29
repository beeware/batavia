.. image:: http://pybee.org/project/projects/bridges/batavia/batavia.png
    :width: 72px
    :target: https://pybee.org/batavia

Batavia
=======

.. image:: https://img.shields.io/pypi/pyversions/batavia.svg
    :target: https://pypi.python.org/pypi/batavia

.. image:: https://img.shields.io/pypi/v/batavia.svg
    :target: https://pypi.python.org/pypi/batavia

.. image:: https://img.shields.io/pypi/status/batavia.svg
    :target: https://pypi.python.org/pypi/batavia

.. image:: https://img.shields.io/pypi/l/batavia.svg
    :target: https://github.com/pybee/batavia/blob/master/LICENSE

.. image:: https://travis-ci.org/pybee/batavia.svg?branch=master
    :target: https://travis-ci.org/pybee/batavia

.. image:: https://badges.gitter.im/pybee/general.svg
    :target: https://gitter.im/pybee/general


**Batavia is an early alpha project. If it breaks, you get to keep all the shiny pieces.**

Batavia is an implementation of the Python virtual machine, written in
Javascript. With Batavia, you can run Python bytecode in your browser.

It honors Python 3.4.4+ syntax and conventions, and let's you
reference objects and classes defined natively in JavaScript.

Getting Started
---------------

Getting a working local copy of Batavia requires a few steps: getting a copy of
the Batavia code, and the ouroboros dependency within a virtual environment.

You'll need to have Pyhton 3.4 available for Batavia to work. Instructions on
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

   > virtualenv --python=c:\python34\python.exe env
   > cd env\Scripts
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
    \_ venv

You now have a working Batavia environment!

Tutorial
--------

Once you've setup your environment, you can have some fun with `the first
tutorial`_, and try out running Python in your browser.

.. _the first tutorial: https://batavia.readthedocs.io/en/latest/tutorials/tutorial-0.html

Documentation
-------------

Documentation for Batavia can be found on `Read The Docs`_, including:

 * `So, why is it called "Batavia"? <https://batavia.readthedocs.io/en/latest/intro/faq.html#why-batavia>`_
 * `More Frequently Asked Questions <https://batavia.readthedocs.io/en/latest/intro/faq.html>`_

Community
---------

Batavia is part of the `BeeWare suite`_. You can talk to the community through:

* `@pybeeware on Twitter`_

* The `pybee/general`_ channel on Gitter.

We foster a welcoming and respectful community as described in our
`BeeWare Community Code of Conduct`_.


Issues
------

If you experience problems with Batavia, `log them on GitHub`_.

Contributing
------------

If you'd like to contribute to Batavia development, our `guide for first time contributors`_ will help you get started.


.. _BeeWare suite: http://pybee.org
.. _Read The Docs: https://batavia.readthedocs.io
.. _@pybeeware on Twitter: https://twitter.com/pybeeware
.. _pybee/general: https://gitter.im/pybee/general
.. _BeeWare Community Code of Conduct: http://pybee.org/community/behavior/
.. _log them on Github: https://github.com/pybee/batavia/issues
.. _guide for first time contributors: http://batavia.readthedocs.io/en/latest/internals/contributing.html
