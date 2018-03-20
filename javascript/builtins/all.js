import { pyStopIteration, pyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function all(iterable) {
    try {
        let iterobj = iterable.__iter__()

        let next, bool_next
        while (true) {
            next = iterobj.__next__()
            bool_next = next.__bool__()
            if (!bool_next) {
                return false
            }
        }
    } catch (err) {
        if (!(types.isinstance(err, pyStopIteration))) {
            throw pyTypeError(`'${type_name(iterable)}' object is not iterable`)
        }
    }

    return true
}

all.__name__ = 'all'
all.__doc__ = `all(iterable) -> bool

Return True if bool(x) is True for all values x in the iterable.
If the iterable is empty, return True.`
all.$pyargs = {
    args: ['iterable']
}
