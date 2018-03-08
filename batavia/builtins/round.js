var BigNumber = require('bignumber.js')

var exceptions = require('../core').exceptions
var types = require('../types')
var type_name = require('../core').type_name

function round(args, kwargs) {
    if (!args || args.length === 0) {
        throw new exceptions.TypeError.$pyclass("Required argument 'number' (pos 1) not found")
    }
    if (!(types.isinstance(args[0], [ types.Float, types.Int, types.Bool ]))) {
        throw new exceptions.TypeError.$pyclass('type ' + type_name(args[0]) + " doesn't define __round__ method")
    }
    var temp = args[0]
    var p = 0 // Precision
    if (args.length === 2) {
        if (!(types.isinstance(args[1], [ types.Float, types.Int, types.Bool ]))) {
            throw new exceptions.TypeError.$pyclass(type_name(args[0]) + ' object cannot be interpreted as an integer')
        }
        if (types.isinstance(args[1], types.Bool)) {
            p = args[1].__int__()
        } else {
            p = args[1]
        }
        if (args[1] < 0) {
            args[0] = (new BigNumber(args[0])).shift(p)
            p = 0
        }
    }
    var result = 0
    if (types.isinstance(args[0], types.Bool)) {
        result = args[0].__int__()
    } else {
        if (p === 0 || args[1] === 'False') {
            result = new BigNumber(args[0]).round().toFixed(1)
        }
        if (p === 0) {
            result = new BigNumber(args[0]).round()
        } else {
            result = new BigNumber(args[0]).round(p)
        }
    }
    if (args[1] < 0) {
        if ((new BigNumber(temp)).isInteger()) {
            result = (new BigNumber(result)).shift(args[1] * (-1))
        } else {
            result = ((new BigNumber(result)).shift(args[1] * (-1))).toFixed(1)
        }
    }
    return result
}
round.__doc__ = 'round(number[, ndigits]) -> number\n\nRound a number to a given precision in decimal digits (default 0 digits).\nThis returns an int when called with one argument, otherwise the\nsame type as the number. ndigits may be negative.'

module.exports = round
