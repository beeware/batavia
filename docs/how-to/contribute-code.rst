Contributing to Batavia's code
==============================

In the following instructions, we're going to assume you’re familiar with
Github and making pull requests. We're also going to assume some entry level
Python and JavaScript; if anything we describe here doesn’t make sense, don’t
worry - we're more than happy to fill in the gaps. At this point, we don’t know
what you don’t know!

This tutorial is also going to focus on code contributions. If your interests
and skills are in documentation, `we have a separate contributors guide
<:doc:`contribute-docs`>`__ just for you.

Do the tutorial first!
----------------------

Before you make your first contribution, take Batavia for a spin. The
instructions in the `getting started guide <:doc:`../tutorial/tutorial-0`>`__ *should*
be enough to get going. If you get stuck, that points to your first
contribution - work out what instructions would have made you *not* get stuck,
and contribute an update to the README.

Set up your development environment
-----------------------------------

Having run the tutorial, you need to `set up your environment for Batavia
development <:doc:`development-env`>`__. The Batavia development environment is very
similar to the tutorial environment, but you'll be using your own fork of
Batavia's source code, rather than the official repository.

Your first contribution
------------------------

In order to implement a full Python virtual machine, Batavia needs to implement
all the eccentricities of Python behaviour. For example, Python allows you to
multiply a string by an integer, resulting in a duplicated string (e.g., ``
“foo”* 3`` => ``“foofoofoo”``). Javascript behavior can be quite different,
depending on circumstances - so we need to provide a library that reproduces
the desired Python behavior in Javascript.

This includes:

 * all the basic operators for Python datatypes (e.g., add, multiply, etc)

 * all the basic methods that can be invoked on Python datatypes (e.g.,
   ``list.sort()``

 * all the pieces of the Python standard library that are written in C

As you might imagine, this means there's lots of work to be done! If you're
looking for something to implement for your first contribution, here's a
few places to look:

 * Compare the list of methods implemented in Javascript with the list
   of methods that are available at the Python prompt. If there's a method
   missing, try adding that method.

 * Look through the Javascript source code looking for ``NotImplementedError``.
   Any method with an existing prototype where the Javascript implementation
   raises ``NotImplementedError`` indicates the method is either partially or
   completely unimplemented. Try to fill in the gap!

 * Try writing some Python code and running it in Batavia. If the code doesn't
   run as you'd expect, work out why, and submit a pull request!

Getting Help
-------------

If you have any difficulties with this tutorial, or there's anything you don't
understand, don't forget - we're here to help you. `Get in touch
<https://beeware.org/community/getting-help/>`__ and we'll help you out,
whether it's giving a better explanation of what is required, helping to debug
a difficult problem, or pointing you towards tutorials for background that you
may require.
