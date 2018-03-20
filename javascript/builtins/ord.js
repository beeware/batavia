import { pyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function ord(c) {
    if (types.isinstance(c, [types.pystr, types.pybytes, types.pybytearray])) {
        let charLength = c.__len__()
        if (charLength.__eq__(types.pyint(1))) {
            if (types.isinstance(c, types.pystr)) {
                return types.pyint(c.charCodeAt(0))
            } else {
                return c.__getitem__(types.pyint(0))
            }
        } else {
            throw pyTypeError(`ord() expected a character, but string of length ${charLength} found`)
        }
    } else {
        throw pyTypeError(`ord() expected string of length 1, but ${type_name(c)} found`)
    }
}

ord.__name__ = 'ord'
ord.__doc__ = `ord(c) -> integer

Return the integer ordinal of a one-character string.`
ord.$pyargs = {
    args: ['c']
}
