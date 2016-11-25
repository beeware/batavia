var exceptions = require('../core').exceptions;
var types = require('../types');

var pow = function(args) {
    var x, y, z;
    if (!args) {
      throw new exceptions.TypeError("pow expected at least 2 arguments, got 0");
    }
    if (args.length === 2) {
        x = args[0];
        y = args[1];
        return x.__pow__(y);
    } else if (args.length === 3) {
        x = args[0];
        y = args[1];
        z = args[2];

        if (!types.isinstance(x, types.Int) ||
            !types.isinstance(y, types.Int) ||
            !types.isinstance(y, types.Int)) {
            throw new exceptions.TypeError("pow() requires all arguments be integers when 3 arguments are present");
        }
        if (y < 0) {
          throw new exceptions.TypeError("Builtin Batavia does not support negative exponents");
        }
        if (y == 0) {
          return 1;
        }
        if (z == 1) {
          return 0;
        }

        // right-to-left exponentiation to reduce memory and time
        // See https://en.wikipedia.org/wiki/Modular_exponentiation#Right-to-left_binary_method
        var result = 1;
        var base = x % z;
        while (y > 0) {
          if ((y & 1) == 1) {
            result = (result * base) % z;
          }
          y >>= 1;
          base = (base * base) % z;
        }
        return result;
    } else {
        throw new exceptions.TypeError("pow expected at least 2 arguments, got " + args.length);
    }
};
pow.__doc__ = 'pow(x, y[, z]) -> number\n\nWith two arguments, equivalent to x**y.  With three arguments,\nequivalent to (x**y) % z, but may be more efficient (e.g. for ints).';

module.exports = pow;
