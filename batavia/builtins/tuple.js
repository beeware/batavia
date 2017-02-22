var types = require('../types')

function tuple(args, kwargs) {
    if (args.length === 0) {
        return new types.Tuple()
    }
    return new types.Tuple(args[0])
}
tuple.__doc__ = "tuple() -> empty tuple\ntuple(iterable) -> tuple initialized from iterable's items\n\nIf the argument is a tuple, the return value is the same object."

module.exports = tuple
