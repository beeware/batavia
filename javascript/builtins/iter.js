import { TypeError } from '../core/exceptions'
import { call_method } from '../core/callables'
import { type_name } from '../core/types'

export default function iter(iterable) {
    try {
        return call_method(iterable, '__iter__', [])
    } catch (e) {
        throw new TypeError("'" + type_name(iterable) + "' object is not iterable")
    }
}

iter.__doc__ = `iter(iterable) -> iterator
iter(callable, sentinel) -> iterator

Get an iterator from an object.  In the first form, the argument must
supply its own iterator, or be a sequence.
In the second form, the callable is called until it returns the sentinel.`
iter.$pyargs = {
    args: ['iterable']
}
