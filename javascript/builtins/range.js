import { BataviaError, PyTypeError } from '../core/exceptions'

import * as types from '../types'

export default function range(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError("range() doesn't accept keyword arguments")
    }
    if (!args || args.length === 0) {
        throw new PyTypeError('range() expected 1 arguments, got ' + args.length)
    }
    if (args.length > 3) {
        throw new PyTypeError('range() expected at most 3 arguments, got ' + args.length)
    }

    return new types.PyRange(args[0], args[1], args[2])
}

range.__doc__ = 'range(stop) -> range object\nrange(start, stop[, step]) -> range object\n\nReturn a virtual sequence of numbers from start to stop by step.'
range.$pyargs = true
