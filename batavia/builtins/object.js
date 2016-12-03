var exceptions = require('../core').exceptions;

function object(args, kwargs) {
    throw new exceptions.NotImplementedError("Builtin Batavia function 'object' not implemented");
}
object.__doc__ = "The most base type"; // Yes, that's the entire docstring.

module.exports = object;
