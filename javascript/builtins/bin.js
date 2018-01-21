import { TypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function bin(number) {
    if (!types.isinstance(number, types.PyInt) &&
        !types.isinstance(number, types.PyBool)) {
        throw new TypeError("'" + type_name(number) + "' object cannot be interpreted as an integer")
    }

    if (types.isinstance(number, types.PyBool)) {
        return new types.PyStr('0b' + number.__int__().toString(2))
    }
    var binaryDigits = number.val.toString(2)
    var sign = ''
    if (binaryDigits[0] === '-') {
        sign = '-'
        binaryDigits = binaryDigits.slice(1)
    }
    return new types.PyStr(sign + '0b' + binaryDigits)
}

bin.__name__ = 'bin'
bin.__doc__ = `bin(number) -> string

Return the binary representation of an integer.`
bin.$pyargs = {
    args: ['object']
}
