.. image:: http://pybee.org/project/projects/bridges/batavia/batavia.png
    :width: 72px
    :target: https://pybee.org/batavia

Batavia
=======

|py-version| |pypi-version| |pypi-status| |license| |build-status| |gitter|

.. |py-version| image:: https://img.shields.io/pypi/pyversions/batavia.svg
    :target: https://pypi.python.org/pypi/batavia
.. |pypi-version| image:: https://img.shields.io/pypi/v/batavia.svg
    :target: https://pypi.python.org/pypi/batavia
.. |pypi-status| image:: https://img.shields.io/pypi/status/batavia.svg
    :target: https://pypi.python.org/pypi/batavia
.. |license| image:: https://img.shields.io/pypi/l/batavia.svg
    :target: https://github.com/pybee/batavia/blob/master/LICENSE
.. |build-status| image:: https://circleci.com/gh/pybee/batavia.svg?style=shield&circle-token=:circle-token
    :target: https://circleci.com/gh/pybee/batavia
.. |gitter| image:: https://badges.gitter.im/pybee/general.svg
    :target: https://gitter.im/pybee/general


**Batavia is an early alpha project. If it breaks, you get to keep all the shiny pieces.**

Batavia is an implementation of the Python virtual machine, written in
Javascript. With Batavia, you can run Python bytecode in your browser.

It honors Python 3.4.4+ syntax and conventions, and allows you to
reference objects and classes defined natively in JavaScript.

Quick Start
---------------

Prerequisites
~~~~~~~~~~~~~~

Batavia requires a Python 3.4 or Python 3.5 installation, and a virtualenv to
run it all in.  Python 3.6 is not yet supported.

You also need to have a recent install of `Node.js <https://nodejs.org>`_. If
your version of Node is outdated, you can update it using the command::

   $ npm install npm@latest -g

Check the `Setting up your environment
<http://pybee.org/contributing/first-time/setup/>`_ for configuration help.


Downloading and Installing
~~~~~~~~~~~~~~~~~~~~~~~~~~

1. Clone the code repositories::

   $ mkdir pybee
   $ cd pybee
   $ git clone https://github.com/pybee/batavia

2. Setup a virtualenv (for other environments, see `Getting Started <https://batavia.readthedocs.io/en/latest/intro/tutorial-0.html>`_).

Linux/Unix/Mac::

   $ virtualenv --python=$(which python3) venv
   $ . venv/bin/activate
   $ cd batavia
   $ pip install -e .

If you don't have Python 3.4 activated then use::
   $ python3 -m venv myvenv
   $ . venv/bin/activate
   $ cd batavia
   $ pip install -e .

Windows::

   > virtualenv venv
   > venv\Scripts\activate
   > cd batavia
   > pip install -e .

3. Install `Node.js <https://nodejs.org>`_. You must have a recent version of
   Node; we do our testing using v6.9.1. Once you've installed Node, you can
   use it to install the Javascript dependencies and compile the Batavia
   library::

   $ npm install

4. Compile the Batavia library and bundle it’s dependencies::

   $ npm run build

For more detailed setup instructions, see the `Getting Started tutorial <https://batavia.readthedocs.io/en/latest/intro/tutorial-0.html>`_

Running Batavia in the browser
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

After you have setup the local installation of Batavia, you can now run Python in the browser::

    $ cd testserver
    $ pip install -r requirements.txt
    $ ./manage.py runserver

then open a web browser at `http://localhost:8000 <http://localhost:8000>`_

For more detailed instructions, see the `Python In The Browser
<http://batavia.readthedocs.io/en/latest/intro/tutorial-1.html>`_ guide.

Documentation
-------------

`Documentation for Batavia <http://batavia.readthedocs.io/en/latest/>`_ can be found on on `Read The Docs <https://readthedocs.org>`_, including:

* `Project Internals <http://batavia.readthedocs.io/en/latest/internals/index.html>`_
* `Getting Started <http://batavia.readthedocs.io/en/latest/intro/index.html>`_
* `So, why is it called "Batavia"? <https://batavia.readthedocs.io/en/latest/intro/faq.html#why-batavia>`_
* `More Frequently Asked Questions <https://batavia.readthedocs.io/en/latest/intro/faq.html>`_

Contributing
------------

If you'd like to contribute to Batavia development, our `guide for first time contributors <http://pybee.org/contributing/how/first-time/>`_ will help you get started.

If you experience problems with Batavia, `log them on GitHub <https://github.com/pybee/batavia/issues>`_.

Community
---------

Batavia is part of the `BeeWare suite <http://pybee.org>`_. You can talk to the community through:

* `@pybeeware on Twitter <https://twitter.com/pybeeware>`_

* The `pybee/general <https://gitter.im/pybee/general>`_ channel on Gitter.

We foster a welcoming and respectful community as described in our
`BeeWare Community Code of Conduct <http://pybee.org/community/behavior/>`_.
