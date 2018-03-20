import { pyStopIteration, pyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function any(iterable) {
    try {
        let iterobj = iterable.__iter__()

        let next, bool_next
        while (true) {
            next = iterobj.__next__()
            bool_next = next.__bool__()
            if (bool_next) {
                return true
            }
        }
    } catch (err) {
        if (!(types.isinstance(err, pyStopIteration))) {
            throw pyTypeError(`'${type_name(iterable)}' object is not iterable`)
        }
    }
    return false
}

any.__name__ = 'any'
any.__doc__ = `any(iterable) -> bool

Return True if bool(x) is True for any x in the iterable.
If the iterable is empty, return False.`
any.$pyargs = {
    args: ['iterable']
}
