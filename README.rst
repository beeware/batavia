Batavia
=======

Tools to run Python bytecode in the browser.

This is experimental code. If it breaks, you get to keep all the shiny pieces.

What it does:

* Implements a Python 3.4 Bytecode machine that can handle function calls
  and basic class definitions.

* Unmarshals Base64 encoded bytecode into Code objects

* Implements most of the common Python VM opcodes

What it doesn't do:

* Make a good distinction between integer and floating point math

* Any attempt at unicode handling.

* Raise errors (especially TypeErrors during math operations) in exactly
  the same way as Python

* Support all Python's builtin functions

* Support the full Python standard library

* Allow for class inheritance

Quickstart
----------

The `testserver` directory contains a minimal Django project that will serve
Python bytecode to your browser and execute it. To run this project, you'll
need to be running Python 3.4. Install Django 1.8 into your virtual
environment; then, at a shell prompt::

    $ cd testserver
    $ ./manage.py runserver

You can then load http://127.0.0.1:8000 in your browser. When the page loads,
you will see a set of buttons corresponding to Python modules that
have been embedded in the page:

* The PyStone performance benchmark. The Python bytecode is embedded as a
  string in the HTML file.

* `sample.py`, a simple Python example demonstrating basic VM features.
   The PYC content that is dynamically generated on the server and served
   to the client. This file imports a second file, `other.py`, to
   demonstrate how imports work.

Click one of the buttons, and the code will run; stdout/stderr has been
redirected to the webpage, so if the script has any output, you'll see it.

To start tinkering, make changes to `testserver/sample.py`, reload the page,
and click the button.

Documentation
-------------

Documentation for Batavia can be found on `Read The Docs`_.

Community
---------

Batavia is part of the `BeeWare suite`_. You can talk to the community through:

* `@pybeeware on Twitter`_

* The `BeeWare Users Mailing list`_, for questions about how to use the BeeWare suite.

* The `BeeWare Developers Mailing list`_, for discussing the development of new features in the BeeWare suite, and ideas for new tools for the suite.

Contributing
------------

If you experience problems with Batavia, `log them on GitHub`_. If you
want to contribute code, please `fork the code`_ and `submit a pull request`_.

.. _BeeWare suite: http://pybee.org
.. _Read The Docs: http://batavia.readthedocs.org
.. _@pybeeware on Twitter: https://twitter.com/pybeeware
.. _BeeWare Users Mailing list: https://groups.google.com/forum/#!forum/beeware-users
.. _BeeWare Developers Mailing list: https://groups.google.com/forum/#!forum/beeware-developers
.. _log them on Github: https://github.com/pybee/batavia/issues
.. _fork the code: https://github.com/pybee/batavia
.. _submit a pull request: https://github.com/pybee/batavia/pulls

