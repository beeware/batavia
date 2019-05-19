var exceptions = require('../core').exceptions
var types = require('../types')

var str = types.Str.prototype.__class__

str.__call__ = function(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("str() doesn't accept keyword arguments")
    }

    if (!args || args.length === 0) {
        return ''
    } else if (args.length > 1) {
        throw new exceptions.TypeError.$pyclass('str() takes at most 1 argument (' + args.length + ' given)')
    }

    if (args[0] === null) {
        return 'None'
    } else if (args[0].__str__) {
        return args[0].__str__()
    } else {
        return args[0].toString()
    }
}
str.__doc__ = 'str(object) -> string\n\nReturn the canonical string representation of the object.\nFor most object types, eval(repr(object)) === object.'

module.exports = str
