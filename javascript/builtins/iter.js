import { BataviaError, TypeError } from '../core/exceptions'
import { call_method } from '../core/callables'
import { type_name } from '../core/types'

import CallableIterator from '../types/CallableIterator'

export default function iter(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError.$pyclass("iter() doesn't accept keyword arguments")
    }
    if (!args || args.length === 0) {
        throw new TypeError.$pyclass('iter() expected at least 1 arguments, got 0')
    }
    if (args.length === 2) {
        return new CallableIterator(args[0], args[1])
    }
    if (args.length > 2) {
        throw new TypeError.$pyclass('iter() expected at most 2 arguments, got 3')
    }

    try {
        return call_method(args[0], '__iter__', [])
    } catch (e) {
        throw new TypeError.$pyclass("'" + type_name(args[0]) + "' object is not iterable")
    }
}

iter.__doc__ = 'iter(iterable) -> iterator\niter(callable, sentinel) -> iterator\n\nGet an iterator from an object.  In the first form, the argument must\nsupply its own iterator, or be a sequence.\nIn the second form, the callable is called until it returns the sentinel.'
iter.$pyargs = true
