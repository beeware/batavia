var exceptions = require('../core').exceptions
var types = require('../types')
var type_name = require('../core').type_name

function sum(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("sum() doesn't accept keyword arguments")
    }
    if (!args || args.length === 0) {
        throw new exceptions.TypeError.$pyclass('sum() expected at least 1 argument, got ' + args.length)
    }
    if (args.length > 2) {
        throw new exceptions.TypeError.$pyclass('sum() expected at most 2 argument, got ' + args.length)
    }
    if (!args[0].__iter__) {
        throw new exceptions.TypeError.$pyclass("'" + type_name(args[0]) + "' object is not iterable")
    }

    try {
        return args[0].reduce(function(a, b) {
            return a.__add__(b)
        }, new types.Int(0))
    } catch (err) {
        throw new exceptions.TypeError.$pyclass("bad operand type for sum(): 'NoneType'")
    }
}
sum.__doc__ = "sum(iterable[, start]) -> value\n\nReturn the sum of an iterable of numbers (NOT strings) plus the value\nof parameter 'start' (which defaults to 0).  When the iterable is\nempty, return start."

module.exports = sum
