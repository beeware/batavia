import { PyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function sum(iterable, start) {
    if (!iterable.__iter__) {
        throw new PyTypeError("'" + type_name(iterable) + "' object is not iterable")
    }

    try {
        return iterable.reduce(function(a, b) {
            return a.__add__(b)
        }, new types.PyInt(0))
    } catch (err) {
        // a and b could fail to add due to many possible type incompatibilities,
        // all of which would need to be reflected in this error message -
        // but we don't have to check for them here, because we've already
        // tested for them in __add__.
        throw new PyTypeError(err.msg)
    }
}

sum.__name__ = 'sum'
sum.__doc__ = `sum(iterable[, start]) -> value

Return the sum of an iterable of numbers (NOT strings) plus the value
of parameter 'start' (which defaults to 0).  When the iterable is
empty, return start.`
sum.$pyargs = {
    args: ['iterable'],
    default_args: ['start']
}
