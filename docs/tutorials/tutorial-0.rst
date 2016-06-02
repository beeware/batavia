Tutorial 0 - Sandbox
====================

In this tutorial, you'll get the Batavia sandbox running, and use it to run a
really simple "Hello, world!" program written in Python.

Setup
-----

This tutorial assumes you've read and followed the instructions in
:doc:`/intro/getting-started`. If you've done this, you should have:

* A ``tutorial`` directory with a Batavia checkout,
* A activated Python 3.4 virtual environment, and
* Batavia installed in that virtual environment

Starting the test server
------------------------

To start the test server, you'll need to be in the ``testserver`` directory under the batavia directory::

    $ cd testserver

Once we're in the ``testserver`` directory, we can install the requirements
for the test server::

    $ pip install -r requirements.txt

Then we can start the test server::

    $ ./manage.py runserver

on windows::
    >python manage.py runserver
    
Now point a browser at `http://127.0.0.1:8000`_

.. _http://127.0.0.1:8000: http://127.0.0.1:8000

This should show you a page titled "Batavia testbed".

It's alive!
-----------

On the right hand side of the screen is a text box. This is where you can put your
sample Python code. Into this text box, type:

.. code-block:: python

    print("Hello World!")

Then click on the "Run code" button. The page will reload, and below the line
on the page after the "Console output" label, you'll see the output you'd
expect from this Python program::

    Hello, World

Congratulations! You've just run your first Python program under Javascript
using Batavia! Let's get a little more adventurous, and add a loop. Replace
the code in the text box with the following:

.. code-block:: python

    for i in range(0, 10):
        print("Hello World %d!" % i)

Click "Run code" again, and you should see the following on the screen in the
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

So - what happened when you pressed the "Run Code" button?

When you clicked "Run code", your browser submitted the content of the text
box as a HTTP ``POST`` request to the test server. The test server took that
content, and compiled it as if it were Python code. It didn't *run* the code -
it just compiled it to bytecode. That is, it created the ``.pyc`` file that
would have been produced if you wrote the same code into a ``test.py`` file and
ran ``python test.py``.

Having compiled the source code into bytecode form, it then encoded the
contents of the pyc file into base64, and inserted that base64 string into the
returned HTML response. If you inspect the source code for the page, you
should see a block in the document ``<head>`` that look something like:

.. code-block:: html

    <script id="batavia-customcode" type="application/python-bytecode">
        7gwNCkIUE1cWAAAA4wAAAAAAAAAAAAAAAAIAAABAAAAAcw4AAABlAABkAACDAQABZAEAUykCegtI
        ZWxsbyBXb3JsZE4pAdoFcHJpbnSpAHICAAAAcgIAAAD6PC92YXIvZm9sZGVycy85cC9uenY0MGxf
        OTc0ZGRocDFoZnJjY2JwdzgwMDAwZ24vVC90bXB4amMzZXJyddoIPG1vZHVsZT4BAAAAcwAAAAA=
    </script>

That string is the base64 encoded version of the Python program you submitted.
The browser then takes this base64 string, decodes it back into a byte string,
and runs it through Batavia - a 15kb Javascript module that does the same thing
in a browser that CPython does on the desktop: iterprets Python bytecode as a
running program.

Push the button...
------------------

You may also have noticed a set of buttons on the left hand side of the
screen. These are some pre-canned example code, ready for testing. Try
clicking on the "Run sample.py" button. When you do, your browser should pop
up a new window, and load the `BeeWare website`_. If you close that window and
go back to the Batavia testbed, you should see a lot of output in the console
section of the screen.

.. _BeeWare website: http://pybee.org

If you want to see you can `inspect the source code`_. However, one part of
``sample.py`` that is of particular interest is the part that opens the new
browser window:

.. code-block:: python

    import dom


    print('Open a new web page...')
    dom.window.open('http://pybee.org', '_blank')

    print('Set the page title')
    dom.document.title = 'Hello world'

    print('Find an element on the page...')
    div = dom.document.getElementById('stdout')

    print('... and set of that element.')
    div.innerHTML = div.innerHTML + '\n\nHello, World!\n\n'

What you should notice is that except for the ``dom`` prefix, this is the same
API that you would use in Javascript to open a new browser window, set the
page title, and add some text to the end of an element. The entire browser DOM
is exposed in this way, so anything you can do in Javascript, you can do in
Batavia, too.

If you want, you can use this code in the sample code window - copy and paste this code into the "run code" text box, click "Run Code", and you get a popup window.

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
CPython. This is to be expected - we're going through a very complex process
to run this code. However, it's not overly concerning -- after all, the main
use case here is basic DOM manipulation and responding to button clicks, not
heavy computation.
