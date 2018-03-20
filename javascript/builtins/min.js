import { pyStopIteration, pyTypeError, pyValueError } from '../core/exceptions'
import { type_name } from '../core/types'

import { getattr, tuple } from '../builtins'
import * as types from '../types'

export default function min(iterable, args, default_, key) {
    let iterobj, result
    if (args.length > 0) {
        iterobj = tuple(iterable, ...args).__iter__()
    } else {
        if (!getattr(iterable, '__iter__', null)) {
            throw pyTypeError("'" + type_name(iterable) + "' object is not iterable")
        }
        iterobj = iterable.__iter__()
    }

    // If iterator is empty returns an error or default value
    try {
        result = iterobj.__next__()
    } catch (err) {
        if (types.isinstance(err, pyStopIteration)) {
            if (default_ !== undefined) {
                return default_
            } else {
                throw pyValueError('min() arg is an empty sequence')
            }
        } else {
            throw err
        }
    }

    try {
        while (true) {
            let next = iterobj.__next__()
            if (next.__lt__(result).valueOf()) {
                result = next
            }
        }
    } catch (err) {
        if (!(types.isinstance(err, pyStopIteration))) {
            throw err
        }
    }
    return result
}

min.__name__ = 'min'
min.__doc__ = `min(iterable, *[, default=obj, key=func]) -> value
min(arg1, arg2, *args, *[, key=func]) -> value

With a single iterable argument, return its smallest item. The
default keyword-only argument specifies an object to return if
the provided iterable is empty.
With two or more arguments, return the smallest argument.`
min.$pyargs = {
    args: ['iterable'],
    varargs: ['args'],
    kwonlyargs: ['default', 'key'],
    missing_args_error: (e) => `min expected 1 arguments, got ${e.given}`
}
