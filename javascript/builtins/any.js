import { call_method } from '../core/callables'
import { StopIteration, TypeError } from '../core/exceptions'
import { type_name } from '../core/types'

export default function any(iterable) {
    if (!iterable.__iter__) {
        throw new TypeError("'" + type_name(iterable) + "' object is not iterable")
    }

    var iterobj = call_method(iterable, '__iter__', [])
    try {
        while (true) {
            var next = call_method(iterobj, '__next__', [])
            var bool_next = call_method(next, '__bool__', [])
            if (bool_next) {
                return true
            }
        }
    } catch (err) {
        if (!(err instanceof StopIteration)) {
            throw err
        }
    }
    return false
}

any.__name__ = 'name'
any.__doc__ = `any(iterable) -> bool

Return True if bool(x) is True for any x in the iterable.
If the iterable is empty, return False.`
any.$pyargs = {
    args: ['iterable']
}
