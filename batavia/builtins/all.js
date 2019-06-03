var exceptions = require('../core').exceptions
var type_name = require('../core').type_name

function all(args, kwargs) {
    if (args[0] === null) {
        throw new exceptions.TypeError.$pyclass("'NoneType' object is not iterable")
    }
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("all() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('all() takes exactly one argument (' + args.length + ' given)')
    }

    var builtins = require('../builtins')
    const iterobj = builtins.iter(args, {})
    try {
        while (builtins.bool.__call__([builtins.next([iterobj], {})], {})) {
        }
        return false
    } catch (err) {
        if (!(err instanceof exceptions.StopIteration.$pyclass)) {
            throw new exceptions.TypeError.$pyclass("'" + type_name(args[0]) + "' object is not iterable")
        }
    }

    return true
}

all.__doc__ = 'Return True if bool(x) is True for all values x in the iterable.\n\nIf the iterable is empty, return True.'

module.exports = all
