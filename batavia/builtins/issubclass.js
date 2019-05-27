var exceptions = require('../core').exceptions
var types = require('../types')

function issubclass(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass('issubclass() takes no keyword arguments')
    }

    if (!args || args.length !== 2) {
        throw new exceptions.TypeError.$pyclass('issubclass expected 2 arguments, got ' + args.length)
    }

    if (!types.isinstance(args[0], types.Type)) {
        throw new exceptions.TypeError.$pyclass('issubclass() arg 1 must be a class')
    }

    if (types.isinstance(args[1], types.Type)) {
        return new types.Bool(types.issubclass(args[0], args[1]))
    }

    if (types.isinstance(args[1], types.Tuple)) {
        if (args[1].every((element) => types.isinstance(element, types.Type))) {
            return new types.Bool(types.issubclass(args[0], [...args[1]]))
        }
    }

    throw new exceptions.TypeError.$pyclass('issubclass() arg 2 must be a class or tuple of classes')
}
issubclass.__doc__ = 'issubclass(C, B) -> bool\n\nReturn whether class C is a subclass (i.e., a derived class) of class B.\nWhen using a tuple as the second argument issubclass(X, (A, B, ...)),\nis a shortcut for issubclass(X, A) or issubclass(X, B) or ... (etc.).'

module.exports = issubclass
