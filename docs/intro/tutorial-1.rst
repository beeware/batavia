Tutorial: Deploying a Hello World application in the Batavia Sandbox
====================================================================

In this tutorial, you'll get the Batavia sandbox running, and use it to run a
really simple "Hello, world!" program written in Python.

Prerequisites
--------------

This tutorial assumes you've read and followed the instructions in
:doc:`the previous tutorial <tutorial-0>`. If you've done this, you should have:

* A ``pybee`` directory with a Batavia checkout,
* An activated Python 3.5 virtual environment, and
* Batavia installed in that virtual environment

Starting the test server
------------------------

1. To start the test server, you'll need to be in the ``testserver`` directory under the batavia directory::

    $ cd testserver

2. Once you're in the ``testserver`` directory, you can install the requirements for the test server::

    $ pip install -r requirements.txt

3. Then you can start the test server

 *  On Linux/macOS::

    $ ./manage.py runserver

 * On Windows::

    > python manage.py runserver

4. Now open your browser and go to `http://localhost:8000 <http://localhost:8000>`_


You should now see a page titled "Batavia testbed" divided into three sections:

- a top section with text box for entering your Python code and a
  "Run your code!" button
- a middle section with buttons for running sample Python scripts
- a *Console output* section at the bottom of the page that displays
  the results from running either your own code or any of the samples.

It's alive!
-----------

At the top of the page is a text box. This is where you can enter your
Python code. Type the following into this text box:

.. code-block:: python

    print("Hello World!")

Then click on the "Run your code!" button. The page will reload, and below the area
on the page named "Console output", you'll see the output you'd
expect from this Python program::

    Hello World!

Congratulations! You've just run your first Python program under JavaScript
using Batavia! Now you can get a little more adventurous and try a loop. Replace
your existing code in the text box with the following:

.. code-block:: python

    for i in range(0, 10):
        print("Hello World %d!" % i)

Click "Run your code!" again, and you should see the following on the screen in the
console output section::

    Hello World 0!
    Hello World 1!
    Hello World 2!
    Hello World 3!
    Hello World 4!
    Hello World 5!
    Hello World 6!
    Hello World 7!
    Hello World 8!
    Hello World 9!


What just happened?
-------------------

What happened when you pressed the "Run your code!" button?

When you clicked "Run your code!", your browser submitted the content of the text
box as a HTTP ``POST`` request to the test server. The test server took that
content, and compiled it as if it were Python code. It didn't *run* the code --
it just compiled it to bytecode. It created the ``.pyc`` file that
would have been produced if you had written the same code into a ``test.py`` file and
ran ``python test.py``.

Having compiled the source code into bytecode form, it then encoded the
contents of the ``.pyc`` file into base64, and inserted that base64 string into the
returned HTML response. If you inspect the source code for the page, you
should see a block in the document ``<head>`` that looks something like:

.. code-block:: html

    <script id="batavia-customcode" type="application/python-bytecode">
        7gwNCkIUE1cWAAAA4wAAAAAAAAAAAAAAAAIAAABAAAAAcw4AAABlAABkAACDAQABZAEAUykCegtI
        ZWxsbyBXb3JsZE4pAdoFcHJpbnSpAHICAAAAcgIAAAD6PC92YXIvZm9sZGVycy85cC9uenY0MGxf
        OTc0ZGRocDFoZnJjY2JwdzgwMDAwZ24vVC90bXB4amMzZXJyddoIPG1vZHVsZT4BAAAAcwAAAAA=
    </script>

That string is the base64 encoded version of the bytecode for the Python
program you submitted. The browser then takes this base64 string, decodes it
back into a bytestring, and runs it through Batavia -- a JavaScript module
that does the same thing in a browser that CPython does on the desktop:
interprets Python bytecode as a running program.

Push the button...
------------------

You may also have noticed a set of buttons between the text box at the top
of the page and the Console output section.
These are some pre-canned example code, ready for testing. Try
clicking the "Run sample.py" button. Your browser should pop
up a new window and load the `BeeWare website`_. If you close that window and
go back to the Batavia testbed, you should see a lot of output in the console
section of the screen.

.. _BeeWare website: http://pybee.org

Inside the button
^^^^^^^^^^^^^^^^^

If you want to, you can `inspect the source code`_. One part of
``sample.py`` that is of particular interest is the part that opens the new
browser window:

.. code-block:: python

    import dom


    print('Open a new web page...')
    dom.window.open('http://pybee.org', '_blank')

    print('Set the page title')
    dom.document.title = 'Hello world'

    print('Find an element on the page...')
    div = dom.document.getElementById('pyconsole')

    print('... and set of that element.')
    div.innerHTML = div.innerHTML + '\n\nHello, World!\n\n'

What you should notice is that except for the ``dom`` prefix, this is the same
API that you would use in JavaScript to open a new browser window, set the
page title, and add some text to the end of an element. The entire browser DOM
is exposed in this way, so anything you can do in JavaScript, you can do in
Batavia.

You can even use this code in the sample code window: copy and paste this code into the "run code" text box, click "Run your code!", and you get a popup window.

.. _inspect the source code: https://github.com/pybee/batavia/blob/master/testserver/sample.py

Push the *other* button...
--------------------------

There are also a couple of "Run PyStone" buttons, each of which runs for a
number of iterations. PyStone is a performance benchmark. On an average modern
PC, the 5 loop version will be almost instantaneous; 500 loops will take less
than a second; 50000 loops will take about 15 seconds. You can compare this with
native performance by running the following in a Python shell::

    >>> from test import pystone
    >>> pystone.main()
    Pystone(1.2) time for 50000 passes = 0.521687
    This machine benchmarks at 95842.9 pystones/second

You'll probably notice that Batavia is significantly slower than native
CPython. This is to be expected -- Batavia is going through a very complex process
to run this code. It's not overly concerning, though, as the main
use case here is basic DOM manipulation and responding to button clicks, not
heavy computation.
