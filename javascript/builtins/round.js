import BigNumber from 'bignumber.js'

import * as types from '../types'

export default function round(number, ndigits = 0) {
    var result = 0
    if (types.isinstance(number, types.pybool)) {
        result = number.__int__()
    } else {
        result = new BigNumber(number).round(ndigits)
    }

    if (ndigits === 0) {
        return types.pyint(result)
    }
    return types.pyfloat(result.valueOf())
}

round.__name__ = 'round'
round.__doc__ = `round(number[, ndigits]) -> number

Round a number to a given precision in decimal digits (default 0 digits).
This returns an int when called with one argument, otherwise the
same type as the number. ndigits may be negative.`
round.$pyargs = {
    args: ['number'],
    default_args: ['ndigits']
}
