var exceptions = require('../core').exceptions
var types = require('../types')

function reversed(args, kwargs) {
    var iterable = args[0]
    if (args.length === 0) {
        throw new exceptions.TypeError.$pyclass('reversed expected 1 arguments, got 0')
    }
    if (types.isinstance(iterable, [types.List, types.Tuple])) {
        var new_iterable = iterable.slice(0)
        new_iterable.reverse()
        return new types.List(new_iterable)
    }

    throw new exceptions.NotImplementedError.$pyclass("Builtin Batavia function 'reversed' not implemented for objects")
}
reversed.__doc__ = 'reversed(sequence) -> reverse iterator over values of the sequence\n\nReturn a reverse iterator'

module.exports = reversed
