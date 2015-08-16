Batavia
=======

Tools to run Python bytecode in the browser.

This is experimental code. If it breaks, you get to keep all the shiny pieces.

What it does:

* Implements a Python 3.4 Bytecode machine that can handle function calls
  and basic class definitions.

* Unmarshals Base64 encoded bytecode into Code objects

* Implements most of the common Python VM opcodes

* Allows access to the DOM using `import dom`,

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

Why "Batavia?"
--------------

On 27 October, 1628, *Commandeur* Francisco Pelsaert took command of the
*Batavia*, and with 340 passengers and crew, set sail from Texel. Their
destination? The Spice Islands - or more specifically, island of Java in the
Dutch East Indies (now part of Indonesia).

The Batavia was... a Java ship (rimshot!).

Interestingly, during the voyage, Ariaen Jacobsz and *onderkoopman* Jeronimus
Cornelisz incited a mutiny, because they didn't want to go to Java - they
wanted to escape to start a new life somewhere else. As a result of the
mutiny, on 4 June 1629, the Batavia ran aground on Morning Reef, part of the
Houtman Abrolhos, about 450km North of Perth, Western Australia, where this
project was conceived.

The `full story of the Batavia`_ is known to most Western Australian
schoolchildren, and is a harrowing tale of intrigue, savagery, and murder. It
serves as a reminder of what can happen when you force people to go to Java
:-)

The wreck of the Batavia was recovered in the 1970s, and now stands in the
`shipwrecks gallery of the Western Australian Maritime Museum`_.

.. _full story of the Batavia: https://en.wikipedia.org/wiki/Batavia_(ship)
.. _shipwrecks gallery of the Western Australian Maritime Museum: http://museum.wa.gov.au/museums/shipwrecks

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

