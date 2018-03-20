import { pyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function abs(x) {
    if (types.isinstance(x, types.pybool)) {
        return types.pyint(Math.abs(x.valueOf()))
    } else if (types.isinstance(x, [types.pyint, types.pyfloat, types.pycomplex])) {
        return x.__abs__()
    } else {
        throw pyTypeError(`bad operand type for abs(): '${type_name(x)}'`)
    }
}

abs.__name__ = 'abs'
abs.__doc__ = 'Return the absolute value of the argument.'
abs.$pyargs = {
    args: ['x']
}
