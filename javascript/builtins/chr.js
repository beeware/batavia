import { pyOverflowError, pyTypeError, pyValueError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function chr(i) {
    if (types.isinstance(i, types.pycomplex)) {
        throw pyTypeError('can\'t convert complex to int')
    } else if (types.isinstance(i, types.pyfloat)) {
        throw pyTypeError('integer argument expected, got float')
    } else if (types.isinstance(i, types.pybool)) {
        return types.pystr(String.fromCharCode(i.__int__()))
    } else if (!types.isinstance(i, types.pyint)) {
        throw pyTypeError('an integer is required (got type ' + type_name(i) + ')')
    }

    // We now know we have a PyInt, so we can deal directly
    // with PyInt internals for efficiency
    if (i.$val.lt(types.pyint.$pyclass.MIN_INT.$val)) {
        throw pyOverflowError('Python int too large to convert to C long')
    } else if (i.$val.lt(-0x7fffffff)) {
        throw pyOverflowError('signed integer is less than minimum')
    } else if (i.$val.lt(0)) {
        throw pyValueError('chr() arg not in range(0x110000)')
    } else if (i.$val.gt(types.pyint.$pyclass.MAX_INT.$val)) {
        throw pyOverflowError('Python int too large to convert to C long')
    } else if (i.$val.gt(0x7fffffff)) {
        throw pyOverflowError('signed integer is greater than maximum')
    } else if (i.$val.gt(0x10ffff)) {
        throw pyValueError('chr() arg not in range(0x110000)')
    }
    return types.pystr(String.fromCharCode(i))
}

chr.__name__ = 'chr'
chr.__doc__ = `chr(i) -> Unicode character

Return a Unicode string of one character with ordinal i; 0 <= i <= 0x10ffff.`
chr.$pyargs = {
    args: ['i'],
    missing_args_error: (e) => `chr() takes exactly one argument (${e.given} given)`
}
