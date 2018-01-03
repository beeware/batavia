import { call_method } from '../core/callables'
import { BataviaError, StopIteration, TypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function all(args, kwargs) {
    if (args[0] === null) {
        throw new TypeError.$pyclass("'NoneType' object is not iterable")
    }
    if (arguments.length !== 2) {
        throw new BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError.$pyclass("all() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new TypeError.$pyclass('all() takes exactly one argument (' + args.length + ' given)')
    }

    try {
        var iterobj = call_method(args[0], '__iter__', [])

        while (true) {
            var next = call_method(iterobj, '__next__', [])
            var bool_next = call_method(next, '__bool__', [])
            if (!bool_next) {
                return false
            }
        }
    } catch (err) {
        if (!(err instanceof StopIteration.$pyclass)) {
            throw new TypeError.$pyclass("'" + type_name(args[0]) + "' object is not iterable")
        }
    }

    return new types.Bool(true)
}

all.__doc__ = 'all(iterable) -> bool\n\nReturn True if bool(x) is True for all values x in the iterable.\nIf the iterable is empty, return True.'
all.$pyargs = true
