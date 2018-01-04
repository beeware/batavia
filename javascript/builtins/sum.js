import { BataviaError, TypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function sum(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError("sum() doesn't accept keyword arguments")
    }
    if (!args || args.length === 0) {
        throw new TypeError('sum() expected at least 1 argument, got ' + args.length)
    }
    if (args.length > 2) {
        throw new TypeError('sum() expected at most 2 argument, got ' + args.length)
    }
    if (!args[0].__iter__) {
        throw new TypeError("'" + type_name(args[0]) + "' object is not iterable")
    }

    try {
        return args[0].reduce(function(a, b) {
            return a.__add__(b)
        }, new types.Int(0))
    } catch (err) {
        // a and b could fail to add due to many possible type incompatibilities,
        // all of which would need to be reflected in this error message -
        // but we don't have to check for them here, because we've already
        // tested for them in __add__.
        throw new TypeError(err.msg)
    }
}

sum.__doc__ = "sum(iterable[, start]) -> value\n\nReturn the sum of an iterable of numbers (NOT strings) plus the value\nof parameter 'start' (which defaults to 0).  When the iterable is\nempty, return start."
sum.$pyargs = true
