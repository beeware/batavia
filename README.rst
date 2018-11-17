.. image:: http://pybee.org/project/projects/bridges/batavia/batavia.png
    :width: 72px
    :target: https://pybee.org/batavia

=======
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
.. |build-status| image:: https://beekeeper.beeware.org/projects/pybee/batavia/shield
    :target: https://beekeeper.beeware.org/projects/pybee/batavia
.. |gitter| image:: https://badges.gitter.im/pybee/general.svg
    :target: https://gitter.im/pybee/general


**Batavia is an early alpha project. If it breaks, you get to keep all the shiny pieces.**

Batavia is an implementation of the Python virtual machine, written in
JavaScript. With Batavia, you can run Python bytecode in your browser.

It honors Python 3.4.4+ syntax and conventions, and allows you to
reference objects and classes defined natively in JavaScript.

Quick Start
---------------

Prerequisites
~~~~~~~~~~~~~~

Batavia requires a Python 3.4 or Python 3.5 installation, and a virtualenv to
run it all in.  Python 3.6 is not yet supported.

You also need to have a recent install of `Node.js <https://nodejs.org>`_
(from the “stable” 6.X series), and a current version of npm. If
your version of npm is outdated, you can update it using the command::

$ npm install npm@latest -g

Check the `Setting up your environment
<http://pybee.org/contributing/how/first-time/setup/>`_ for configuration help.


Downloading and Installing
~~~~~~~~~~~~~~~~~~~~~~~~~~

1. Clone the code repositories
::

 $ mkdir pybee
 $ cd pybee
 $ git clone https://github.com/pybee/batavia

2. Setup a virtualenv:

(for other environments, see `Getting Started <https://batavia.readthedocs.io/en/latest/tutorial/tutorial-0.html>`_).


Linux/Unix/Mac
--------------
Check your python3 version first.  If it's pointing to version 3.6, replace ``$(which python3)`` in the virtualenv command
below with the path to your Python 3.4 or 3.5 installation. ::

$ python3 --version
$ python3 -m venv venv
$ . venv/bin/activate
$ cd batavia
$ pip install -e .

Windows
-------

Type in the following commands in your terminal ::

    > py -3 -m venv venv
    > venv\Scripts\activate
    > cd batavia
    > pip install -e .

Windows (with only conda installed)
-----------------------------------

Type in the following commands in your terminal ::

   > pip install virtualenvwrapper-win
   > mkvirtualenv venv
   > workon venv
   > cd batavia
   > pip install -e .

3. Install `Node.js <https://nodejs.org>`_.

You must have a recent version of Node; we do our testing using v6.9.1. Once you've installed Node, you can use it to install the JavaScript dependencies and compile the Batavia library::

$ npm install


4. Compile the Batavia library and bundle its dependencies

Run the following command in the terminal ::

$ npm run build


For more detailed setup instructions, see the `Getting Started tutorial <https://batavia.readthedocs.io/en/latest/tutorial/tutorial-0.html>`_


Running Batavia in the browser
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

After you have setup the local installation of Batavia, you can now run Python in the browser: ::

$ cd testserver
$ pip install -r requirements.txt

On Linux/macOS:

$ ./manage.py runserver

On Windows:

> python manage.py runserver

then open a web browser at `http://localhost:8000 <http://localhost:8000>`_

For more detailed instructions, see the `Python In The Browser
<http://batavia.readthedocs.io/en/latest/tutorial/tutorial-1.html>`_ guide.


Running Batavia in the terminal
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you want to run some Python code from a file in the terminal, you can also run Batavia on Node: ::

$ npm run python /path/to/python/file.py

This will should run the Python file and show output on the terminal.

For more details see `Running Python code using Batavia from the command line
<http://batavia.readthedocs.io/en/latest/tutorial/tutorial-2.html>`_.


Documentation
-------------

`Documentation for Batavia <http://batavia.readthedocs.io/en/latest/>`_ can be found on `Read The Docs <https://readthedocs.org>`_, including:

* `Getting Started <https://batavia.readthedocs.io/en/latest/tutorial/index.html>`__
* `So, why is it called "Batavia"? <https://batavia.readthedocs.io/en/latest/background/faq.html#why-batavia>`_
* `More Frequently Asked Questions <https://batavia.readthedocs.io/en/latest/background/faq.html>`_


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
