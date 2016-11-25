var exceptions = require('../core').exceptions;

var object = function() {
    throw new exceptions.NotImplementedError("Builtin Batavia function 'object' not implemented");
};
object.__doc__ = "The most base type"; // Yes, that's the entire docstring.

module.exports = object;
