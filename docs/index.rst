.. raw:: html

    <style>
        .row {clear: both}

        .column img {border: 1px solid black;}

        @media only screen and (min-width: 1000px),
               only screen and (min-width: 500px) and (max-width: 768px){

            .column {
                padding-left: 5px;
                padding-right: 5px;
                float: left;
            }

            .column3  {
                width: 33.3%;
            }

            .column2  {
                width: 50%;
            }
        }
    </style>


=======
Batavia
=======

**Batavia is an early alpha project. If it breaks, you get to keep all the shiny pieces.**

Batavia is an implementation of the Python virtual machine, written in
JavaScript. It enables you to run Python bytecode in the browser.

It honors Python 3.4 syntax and conventions, but also provides the ability to
reference objects and classes defined natively in JavaScript.



.. rst-class::  row

Table of contents
=================

.. rst-class:: clearfix row

.. rst-class:: column column2

:ref:`Tutorial <tutorial>`
--------------------------

Get started with a hands-on introduction for beginners


.. rst-class:: column column2

:ref:`How-to guides <how-to>`
-----------------------------

Guides and recipes for common problems and tasks, including how to contribute


.. rst-class:: column column2

:ref:`Background <background>`
------------------------------

Explanation and discussion of key topics and concepts


.. rst-class:: column column2

:ref:`Reference <reference>`
----------------------------

Technical reference - commands, modules, classes, methods


.. rst-class:: clearfix row

Community
=========

Batavia is part of the `BeeWare suite`_. You can talk to the community through:

 * `@pybeeware on Twitter`_

 * `pybee/general on Gitter`_

.. _BeeWare suite: http://pybee.org
.. _Read The Docs: https://batavia.readthedocs.io
.. _@pybeeware on Twitter: https://twitter.com/pybeeware
.. _pybee/general on Gitter: https://gitter.im/pybee/general


.. toctree::
   :maxdepth: 2
   :hidden:
   :titlesonly:

   tutorial/index
   how-to/index
   reference/index
   background/index
