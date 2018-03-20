import { pyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function bin(number) {
    if (!types.isinstance(number, types.pyint) &&
        !types.isinstance(number, types.pybool)) {
        throw pyTypeError("'" + type_name(number) + "' object cannot be interpreted as an integer")
    }

    if (types.isinstance(number, types.pybool)) {
        return types.pystr('0b' + number.__int__().toString(2))
    }
    var binaryDigits = number.$val.toString(2)
    var sign = ''
    if (binaryDigits[0] === '-') {
        sign = '-'
        binaryDigits = binaryDigits.slice(1)
    }
    return types.pystr(sign + '0b' + binaryDigits)
}

bin.__name__ = 'bin'
bin.__doc__ = `bin(number) -> string

Return the binary representation of an integer.`
bin.$pyargs = {
    args: ['object']
}
