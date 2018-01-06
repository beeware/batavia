import { BataviaError, PyStopIteration, PyTypeError, PyValueError } from '../core/exceptions'
import { type_name } from '../core/types'

import { PyNone } from '../builtins'
import tuple from './tuple'

export default function max(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (!args || args.length === 0) {
        throw new PyTypeError('max expected 1 arguments, got ' + args.length)
    }

    var iterobj
    if (args.length > 1) {
        iterobj = tuple([args], PyNone).__iter__()
    } else {
        if (!args[0].__iter__) {
            throw new PyTypeError("'" + type_name(args[0]) + "' object is not iterable")
        }
        iterobj = args[0].__iter__()
    }

    // If iterator is empty returns arror or default value
    try {
        var max = iterobj.__next__()
    } catch (err) {
        if (err instanceof PyStopIteration) {
            if ('default' in kwargs) {
                return kwargs['default']
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
        if (!(err instanceof PyStopIteration)) {
            throw err
        }
    }
    return max
}

max.__doc__ = 'max(iterable, *[, default=obj, key=func]) -> value\nmax(arg1, arg2, *args, *[, key=func]) -> value\n\nWith a single iterable argument, return its biggest item. The\ndefault keyword-only argument specifies an object to return if\nthe provided iterable is empty.\nWith two or more arguments, return the largest argument.'
max.$pyargs = true
