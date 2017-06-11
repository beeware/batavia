Implementing Python Built-ins in JavaScript
===========================================

General Structure
-----------------

.. code-block:: javascript

  // Example: a function that accepts exactly one argument, and no keyword arguments
  batavia.builtins.<fn> = function(<args>, <kwargs>) {
      if (arguments.length != 2) {
          throw new batavia.builtins.BataviaError("Batavia calling convention not used.");
      }
      if (kwargs && Object.keys(kwargs).length > 0) {
          throw new batavia.builtins.TypeError("<fn>() doesn't accept keyword arguments.");
      }
      if (!args || args.length != 1) {
          throw new batavia.builtins.TypeError("<fn>() expected exactly 1 argument (" + args.length + " given)");
      }

      // if the function only works with a specific object type, add a test
      var obj = args[0];

      if (!batavia.isinstance(obj, batavia.types.<type>)) {
          throw new batavia.builtins.TypeError(
              "<fn>() expects a <type> (" + batavia.type_name(obj) + " given)");
      }

      // actual code goes here
      JavaScript.Function.Stuff();
  }
  batavia.builtins.<fn>.__doc__ = 'docstring from Python 3.4 goes here, for documentation'


Process
----------

For a given function, run `functionname.__doc__` in the Python 3.4 repl

Copy the docstring into the doc

Run the function in Python 3.4

Take a guess at the implementation structure based on the other functions.

Copy the style of the other implemented functions
