import { PyStopIteration, PyTypeError, PyValueError } from '../core/exceptions'
import { type_name } from '../core/types'

import { tuple } from '../builtins'
import * as types from '../types'

export default function max(iterable, args, default_, key) {
    var iterobj
    if (args.length > 0) {
        iterobj = tuple(iterable, ...args).__iter__()
    } else {
        if (!iterable.__iter__) {
            throw new PyTypeError("'" + type_name(iterable) + "' object is not iterable")
        }
        iterobj = iterable.__iter__()
    }

    // If iterator is empty returns an error or default value
    try {
        var max = iterobj.__next__()
    } catch (err) {
        if (types.isinstance(err, PyStopIteration)) {
            if (default_ !== undefined) {
                return default_
            } else {
                throw new PyValueError('max() arg is an empty sequence')
            }
        } else {
            throw err
        }
    }

    try {
        while (true) {
            var next = iterobj.__next__()
            if (next.__gt__(max).valueOf()) {
                max = next
            }
        }
    } catch (err) {
        if (!(types.isinstance(err, PyStopIteration))) {
            throw err
        }
    }
    return max
}

max.__name__ = 'max'
max.__doc__ = `max(iterable, *[, default=obj, key=func]) -> value
max(arg1, arg2, *args, *[, key=func]) -> value

With a single iterable argument, return its biggest item. The
default keyword-only argument specifies an object to return if
the provided iterable is empty.
With two or more arguments, return the largest argument.`
max.$pyargs = {
    args: ['iterable'],
    varargs: ['args'],
    kwonlyargs: ['default', 'key'],
    missing_args_error: (e) => `max expected 1 arguments, got ${e.given}`
}
