import { StopIteration, TypeError, ValueError } from '../core/exceptions'
import { type_name } from '../core/types'

import { tuple } from '../builtins'

export default function min(iterable, args, default_, key) {
    var iterobj
    if (args.length > 0) {
        iterobj = tuple(iterable, ...args).__iter__()
    } else {
        if (!iterable.__iter__) {
            throw new TypeError("'" + type_name(iterable) + "' object is not iterable")
        }
        iterobj = iterable.__iter__()
    }

    // If iterator is empty returns an error or default value
    try {
        var min = iterobj.__next__()
    } catch (err) {
        if (err instanceof StopIteration) {
            if (default_ !== undefined) {
                return default_
            } else {
                throw new ValueError('min() arg is an empty sequence')
            }
        } else {
            throw err
        }
    }

    try {
        while (true) {
            var next = iterobj.__next__()
            if (next.__lt__(min).valueOf()) {
                min = next
            }
        }
    } catch (err) {
        if (!(err instanceof StopIteration)) {
            throw err
        }
    }
    return min
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
