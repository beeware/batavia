var exceptions = require('../core').exceptions
var types = require('../types')

function callable(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("callable() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('callable() takes exactly one argument (' + args.length + ' given)')
    }
    if ((args[0] instanceof Function) || (args[0] instanceof types.Function) || (args[0] instanceof types.Type)) {
        return new types.Bool(true)
    } else {
        return new types.Bool(false)
    }
}
callable.__doc__ = 'callable(object) -> bool\n\nReturn whether the object is callable (i.e., some kind of function).\nNote that classes are callable, as are instances of classes with a\n__call__() method.'

module.exports = callable
