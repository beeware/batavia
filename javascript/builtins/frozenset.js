import { BataviaError, TypeError } from '../core/exceptions'

import * as types from '../types'

export default function frozenset(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError("frozenset() doesn't accept keyword arguments.")
    }
    if (args && args.length > 1) {
        throw new TypeError('set expected at most 1 arguments, got ' + args.length)
    }
    if (!args || args.length === 0) {
        return new types.PyFrozenSet()
    }
    return new types.PyFrozenSet(args[0])
}

frozenset.__doc__ = 'frozenset() -> empty frozenset object\nfrozenset(iterable) -> frozenset object\n\nBuild an immutable unordered collection of unique elements.'
frozenset.$pyargs = true
