import BigNumber from 'bignumber.js'

import { TypeError } from '../core/exceptions'
import * as types from '../types'

export default function round(args, kwargs) {
    var p = 0 // Precision
    if (!args) {
        throw new TypeError("Required argument 'number' (pos 1) not found")
    }
    if (args.length === 2) {
        p = args[1]
    }
    var result = 0
    if (types.isinstance(args[0], types.Bool)) {
        result = args[0].__int__()
    } else {
        result = new BigNumber(args[0]).round(p)
    }
    if (args.length === 1) {
        return new types.Int(result)
    }
    return types.Float(result.valueOf())
}

round.__doc__ = 'round(number[, ndigits]) -> number\n\nRound a number to a given precision in decimal digits (default 0 digits).\nThis returns an int when called with one argument, otherwise the\nsame type as the number. ndigits may be negative.'
round.$pyargs = true
