import { pyStopIteration, pyTypeError, pyValueError } from '../core/exceptions'
import { type_name } from '../core/types'

import { getattr, tuple } from '../builtins'
import * as types from '../types'

export default function max(iterable, args, default_, key) {
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
                throw pyValueError('max() arg is an empty sequence')
            }
        } else {
            throw err
        }
    }

    try {
        while (true) {
            let next = iterobj.__next__()
            if (next.__gt__(result).valueOf()) {
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
