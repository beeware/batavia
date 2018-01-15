import { TypeError } from '../core/exceptions'
import * as types from '../types'

export default function oct(number) {
    if (types.isinstance(number, types.PyInt)) {
        if (number.val.isNeg()) {
            return '-0o' + number.val.toString(8).substr(1)
        } else {
            return '0o' + number.val.toString(8)
        }
    } else if (types.isinstance(number, types.PyBool)) {
        return '0o' + number.__int__().toString(8)
    }

    if (!types.isinstance(number, types.PyInt)) {
        if (number.__index__) {
            number = number.__index__()
        } else {
            throw new TypeError('__index__ method needed for non-integer inputs')
        }
    }
    if (number < 0) {
        return '-0o' + (0 - number).toString(8)
    }

    return '0o' + number.toString(8)
}

oct.__doc__ = "oct(number) -> string\n\nReturn the octal representation of an integer.\n\n   >>> oct(342391)\n   '0o1234567'\n"
oct.$pyargs = {
    args: ['number']
}
