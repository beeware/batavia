import { call_method } from '../core/callables'
import { PyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function ord(c) {
    if (types.isinstance(c, [types.PyStr, types.PyBytes, types.PyBytearray])) {
        var charLength = call_method(c, '__len__')
        if (call_method(charLength, '__eq__', [new types.PyInt(1)])) {
            if (types.isinstance(c, types.PyStr)) {
                return new types.PyInt(c.charCodeAt(0))
            } else {
                return call_method(c, '__getitem__', [new types.PyInt(0)])
            }
        } else {
            throw new PyTypeError('ord() expected a character, but string of length ' + charLength + ' found')
        }
    } else {
        throw new PyTypeError('ord() expected string of length 1, but ' + type_name(c) + ' found')
    }
}

ord.__name__ = 'ord'
ord.__doc__ = `ord(c) -> integer

Return the integer ordinal of a one-character string.`
ord.$pyargs = {
    args: ['c']
}
