var callables = require('../core').callables
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name

function abs(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("abs() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('abs() takes exactly one argument (' + args.length + ' given)')
    }

    const value = args[0]

    if (value.__abs__) {
        return callables.call_method(value, '__abs__', [], {})
    }

    throw new exceptions.TypeError.$pyclass('bad operand type for abs(): \'' + type_name(value) + '\'')
}

abs.__doc__ = 'Return the absolute value of the argument.'

module.exports = abs
