var types = require('../types')

var tuple = types.Tuple.prototype.__class__

tuple.__class__ = function(args, kwargs) {
    if (args.length === 0) {
        return new types.Tuple()
    }
    return new types.Tuple(args[0])
}

tuple.__doc__ = "tuple() -> empty tuple\ntuple(iterable) -> tuple initialized from iterable's items\n\nIf the argument is a tuple, the return value is the same object."

module.exports = tuple
