import { pyTypeError } from '../core/exceptions'
import * as types from '../types'

export default function oct(number) {
    if (types.isinstance(number, types.pyint)) {
        if (number.$val.isNeg()) {
            return '-0o' + number.$val.toString(8).substr(1)
        } else {
            return '0o' + number.$val.toString(8)
        }
    } else if (types.isinstance(number, types.pybool)) {
        return '0o' + number.__int__().toString(8)
    }

    if (!types.isinstance(number, types.pyint)) {
        if (number.__index__) {
            number = number.__index__()
        } else {
            throw pyTypeError('__index__ method needed for non-integer inputs')
        }
    }
    if (number < 0) {
        return '-0o' + (0 - number).toString(8)
    }

    return '0o' + number.toString(8)
}

oct.__name__ = 'oct'
oct.__doc__ = `oct(number) -> string

Return the octal representation of an integer.

   >>> oct(342391)
   '0o1234567'
`
oct.$pyargs = {
    args: ['number']
}
