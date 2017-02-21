var exceptions = require('../core').exceptions
var callables = require('../core').callables
var type_name = require('../core').type_name
var None = require('../core').None
var tuple = require('./tuple')

function min(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (!args || args.length === 0) {
        throw new exceptions.TypeError.$pyclass('min expected 1 arguments, got ' + args.length)
    }

    if (args.length > 1) {
        var iterobj = tuple([args], None).__iter__()
    } else {
        if (!args[0].__iter__) {
            throw new exceptions.TypeError.$pyclass("'" + type_name(args[0]) + "' object is not iterable")
        }
        var iterobj = args[0].__iter__()
    }

    // If iterator is empty returns arror or default value
    try {
        var min = iterobj.__next__()
    } catch (err) {
        if (err instanceof exceptions.StopIteration.$pyclass) {
            if ('default' in kwargs) {
                return kwargs['default']
            } else {
                throw new exceptions.ValueError.$pyclass('min() arg is an empty sequence')
            }
        } else {
            throw err
        }
    }

    try {
        while (true) {
            var next = iterobj.__next__()
            if (next.__lt__(min)) {
                min = next
            }
        }
    } catch (err) {
        if (!(err instanceof exceptions.StopIteration.$pyclass)) {
            throw err
        }
    }
    return min
}
min.__doc__ = 'min(iterable, *[, default=obj, key=func]) -> value\nmin(arg1, arg2, *args, *[, key=func]) -> value\n\nWith a single iterable argument, return its smallest item. The\ndefault keyword-only argument specifies an object to return if\nthe provided iterable is empty.\nWith two or more arguments, return the smallest argument.'

module.exports = min
