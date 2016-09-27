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

Tutorial
--------

To take Batavia for a spin, run through the `Getting Started guide`_.

Then have some fun with `the first tutorial`_, and try out running Python in
your browser.

.. _Getting Started guide: https://batavia.readthedocs.io/en/latest/intro/getting-started.html
.. _the first tutorial: https://batavia.readthedocs.io/en/latest/tutorials/tutorial-0.html

Documentation
-------------

Documentation for Batavia can be found on `Read The Docs`_.

Community
---------

Batavia is part of the `BeeWare suite`_. You can talk to the community through:

* `@pybeeware on Twitter`_

* The `BeeWare Users Mailing list`_, for questions about how to use the BeeWare suite.

* The `BeeWare Developers Mailing list`_, for discussing the development of new features in the BeeWare suite, and ideas for new tools for the suite.

We foster a welcoming and respectful community as described in our
`BeeWare Community Code of Conduct`_.

Why "Batavia?"
--------------

On 27 October, 1628, *Commandeur* Francisco Pelsaert took command of the
*Batavia*, and with 340 passengers and crew, set sail from Texel.

Their destination? The Spice Islands - or more specifically, island of Java
in the Dutch East Indies (now part of Indonesia).

**The Batavia was... a Java ship (rimshot!).**

Interestingly, during the voyage, Ariaen Jacobsz and *onderkoopman* Jeronimus
Cornelisz incited a mutiny, because they didn't want to go to Java - they
wanted to escape to start a new life somewhere else. As a result of the
mutiny, on 4 June 1629, the Batavia ran aground on Morning Reef, part of the
Houtman Abrolhos, about 450km North of Perth, Western Australia, where this
project was conceived.

The `full story of the Batavia`_ is known to most Western Australian
schoolchildren, and is a harrowing tale of intrigue, savagery, and murder. *It
serves as a reminder of what can happen when you force people to go to Java*
:-)

The wreck of the Batavia was recovered in the 1970s, and now stands in the
`shipwrecks gallery of the Western Australian Maritime Museum`_.

.. _full story of the Batavia: https://en.wikipedia.org/wiki/Batavia_(ship)
.. _shipwrecks gallery of the Western Australian Maritime Museum: http://museum.wa.gov.au/museums/shipwrecks

Issues
------

If you experience problems with Batavia, `log them on GitHub`_.

Contributing
------------

If you'd like to contribute to Batavia development, our `guide for first time contributors`_ will help you get started.

If you want to contribute code, please `fork the code`_ and
`submit a pull request`_.

Before submitting a pull request, please make sure your forked branch is up
to date with the original branch. To do this:

- set your upstream remote::

    $ git remote add upstream https://github.com/pybee/batavia.git

- make sure you have the latest changes from upstream::

    $ git fetch upstream

- rebase your **master** branch to **upstream** before pushing to GitHub
  and submitting a pull request::

    $ git rebase upstream/master


.. _BeeWare suite: http://pybee.org
.. _Read The Docs: https://batavia.readthedocs.io
.. _@pybeeware on Twitter: https://twitter.com/pybeeware
.. _BeeWare Users Mailing list: https://groups.google.com/forum/#!forum/beeware-users
.. _BeeWare Developers Mailing list: https://groups.google.com/forum/#!forum/beeware-developers
.. _BeeWare Community Code of Conduct: http://pybee.org/contributing/#code-of-conduct
.. _log them on Github: https://github.com/pybee/batavia/issues
.. _fork the code: https://github.com/pybee/batavia
.. _submit a pull request: https://github.com/pybee/batavia/pulls
.. _guide for first time contributors: https://github.com/pybee/batavia/wiki/Your-first-Batavia-contribution
