import { BataviaError, PyTypeError } from '../core/exceptions'

import * as types from '../types'

export default function set(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError("set() doesn't accept keyword arguments.")
    }
    if (args && args.length > 1) {
        throw new PyTypeError('set expected at most 1 arguments, got ' + args.length)
    }
    if (!args || args.length === 0) {
        return new types.PySet()
    }
    return new types.PySet(args[0])
}

set.__doc__ = 'set() -> new empty set object\nset(iterable) -> new set object\n\nBuild an unordered collection of unique elements.'
set.$pyargs = true
