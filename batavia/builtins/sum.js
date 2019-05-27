var callables = require('../core').callables
var exceptions = require('../core').exceptions
var operators = require('../operators')
var types = require('../types')
var type_name = require('../core').type_name

const ADD_OPERATOR = operators['__add__']

function sum(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass('sum() takes no keyword arguments')
    }
    if (!args || args.length === 0) {
        throw new exceptions.TypeError.$pyclass('sum expected at least 1 arguments, got ' + args.length)
    }
    if (args.length > 2) {
        throw new exceptions.TypeError.$pyclass('sum expected at most 2 arguments, got ' + args.length)
    }

    const builtins = require('../builtins')
    const iterator = builtins.iter([args[0]], {})

    let sum
    if (args.length === 2) {
        if (types.isinstance(args[1], [types.Str])) {
            throw new exceptions.TypeError.$pyclass('sum() can\'t sum strings [use \'\'.join(seq) instead]')
        }
        if (types.isinstance(args[1], [types.Bytes, types.Bytearray])) {
            throw new exceptions.TypeError.$pyclass(
                'sum() can\'t sum ' + type_name(args[1]) + ' [use b\'\'.join(seq) instead]')
        }
        sum = args[1]
    } else {
        sum = new types.Int(0)
    }

    callables.iter_for_each(iterator, (value) => {
        sum = ADD_OPERATOR.apply(sum, value)
    })

    return sum
}

sum.__doc__ = 'sum(iterable[, start]) -> value\n\nReturn the sum of an iterable of numbers (NOT strings) plus the value\nof parameter \'start\' (which defaults to 0).  When the iterable is\nempty, return start.'

module.exports = sum
