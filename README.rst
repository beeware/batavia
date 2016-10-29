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

Quick Start
---------------

(For a more detailed setup, please see the `Getting Started tutorial <https://batavia.readthedocs.io/en/latest/tutorials/tutorial-0.html>`_

Batavia requires a Python 3.4 installation, a copy of `Ouroboros <https://github.com/pybee/ouroboros>`_, and a virtualenv to run it all in. 

Clone the code repos:: 

   $ mkdir pybee
   $ cd pybee
   $ git clone https://github.com/pybee/batavia
   $ git clone https://github.com/pybee/ouroboros

Setup a virtualenv (for other environments, see `Getting Started <https://batavia.readthedocs.io/en/latest/tutorials/tutorial-0.html>`_)::

   $ virtualenv venv
   $ . venv/bin/activate
   $ cd batavia
   $ pip install -e .

And finally, run the :code:`make` script to generate the combined Batavia JavaScript files::

   $ make

Your final setup should end up looking like this:: 

  _ pybee
    \_ batavia
    \_ ouroboros
    \_ venv

You now have a working Batavia environment!

Python in the Browser
----------------------

Once you've setup your environment, you can have some fun with `running Python in your browser <https://batavia.readthedocs.io/en/latest/tutorials/tutorial-1.html>`_

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
