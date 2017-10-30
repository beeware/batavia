Frequently Asked Questions
==========================

Is Batavia a source code converter?
-----------------------------------

No. Batavia operates *at the bytecode level*, rather than the source code level.
It takes the CPython bytecode format (the `.pyc` files generated at runtime
by CPython when the code is imported for the first time), and runs that bytecode
in a virtual machine that is implemented in JavaScript. No intermediate JavaScript
source file is generated.

Isn't this the same thing as Brython/Skulpt/PyPy.js?
----------------------------------------------------

No. `Brython`_ and `Skulpt`_ are full implementations of the Python compiler and
interpreter, written in JavaScript. They provide a REPL (an interactive
prompt), and you run your Python code through Brython/Skuplt. Batavia doesn't
contain the compilation tools - you ship pre-compiled bytecode to the browser,
and that bytecode is executed in a browser-side virtual machine.

`PyPy.js`_ is a very similar idea, except that instead of being a clean
implementation of the Python virtual machine, it uses Emscripten to compile
PyPy source code into JavaScript (or the asm.js subset).

The biggest advantage of the Batavia approach is size. By only implementing
the virtual machine, Batavia weighs in at around 400kB; this can be trimmed
further by using tree-shaking to remove parts of Batavia that aren't used at
runtime. This compares with 5MB for PyPy.js.

The easiest way to demonstrate the difference between Brython/Skulpt/PyPy.js
and Batavia is to look at the `eval()` and `exec()` methods. In Brython et al,
these are key to how the process works, because they're just hooks into the
runtime process of parsing and evaluating Python code. In Batavia, these
methods would be difficult to implement because Batavia compiles all the class
files up front. To implement `eval()` and `exec()`, you'd need to run Batavia
through Batavia, and then expose an API that could be used at runtime to
generate new bytecode content.

.. _Brython: http://www.brython.info
.. _Skulpt: http://www.skulpt.org
.. _PyPy.js: http://pypyjs.org

How fast is Batavia?
--------------------

Faster than a slow thing; slower than a fast thing :-)

Programming language performance is always nebulous to quantify. As a
rough guide, it's about an order of magnitude slower than CPython on the
same machine.

This means it probably isn't fast enough for an application that is CPU
bound. However, if this is the case, you can always write your CPU bound
parts in *pure* JavaScript, and call those directly from Python, same as you
would for a CPython extension.

It should also be noted that Batavia is a very young project, and very little
time has been spent on performance optimization. There are many obvious
low hanging performance optimizations that could be explored as the project
matures.

What can I use Batavia for?
---------------------------

The main use of Batavia is for writing web applications. Batavia provides the
option for writing client-side logic in Python, rather than JavaScript.

What version of Python does Batavia require?
--------------------------------------------

Batavia runs under Python 3.4, and compiles Python 3.4 compatible bytecode.

Why "Batavia"?
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
