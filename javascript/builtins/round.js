import BigNumber from 'bignumber.js'

import * as types from '../types'

export default function round(number, ndigits = 0) {
    var result = 0
    if (types.isinstance(number, types.PyBool)) {
        result = number.__int__()
    } else {
        result = new BigNumber(number).round(ndigits)
    }

    if (ndigits === 0) {
        return new types.PyInt(result)
    }
    return types.PyFloat(result.valueOf())
}

round.__doc__ = `round(number[, ndigits]) -> number

Round a number to a given precision in decimal digits (default 0 digits).
This returns an int when called with one argument, otherwise the
same type as the number. ndigits may be negative.`
round.$pyargs = {
    args: ['number'],
    default_args: ['ndigits']
}
