var exceptions = require('../core').exceptions
var types = require('../types')

function isinstance(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass('isinstance() takes no keyword arguments')
    }

    if (!args || args.length !== 2) {
        throw new exceptions.TypeError.$pyclass('isinstance expected 2 arguments, got ' + args.length)
    }

    if (types.isinstance(args[1], types.Type)) {
        return new types.Bool(types.isinstance(args[0], args[1]))
    }

    if (types.isinstance(args[1], types.Tuple)) {
        if (args[1].every((element) => types.isinstance(element, types.Type))) {
            return new types.Bool(types.isinstance(args[0], [...args[1]]))
        }
    }

    throw new exceptions.TypeError.$pyclass('isinstance() arg 2 must be a type or tuple of types')
}

isinstance.__doc__ = 'isinstance(object, class-or-type-or-tuple) -> bool\n\nReturn whether an object is an instance of a class or of a subclass thereof.\nWith a type as second argument, return whether that is the object\'s type.\nThe form using a tuple, isinstance(x, (A, B, ...)), is a shortcut for\nisinstance(x, A) or isinstance(x, B) or ... (etc.).'

module.exports = isinstance
