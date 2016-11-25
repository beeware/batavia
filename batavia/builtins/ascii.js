var exceptions = require('../core').exceptions;

var ascii = function() {
    throw new exceptions.NotImplementedError("Builtin Batavia function 'ascii' not implemented");
};
ascii.__doc__ = 'ascii(object) -> string\n\nAs repr(), return a string containing a printable representation of an\nobject, but escape the non-ASCII characters in the string returned by\nrepr() using \\x, \\u or \\U escapes.  This generates a string similar\nto that returned by repr() in Python 2.';

module.exports = ascii;
