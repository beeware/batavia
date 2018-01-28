import { OverflowError, TypeError, ValueError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function chr(i) {
    if (types.isinstance(i, types.PyComplex)) {
        throw new TypeError('can\'t convert complex to int')
    } else if (types.isinstance(i, types.PyFloat)) {
        throw new TypeError('integer argument expected, got float')
    } else if (types.isinstance(i, types.PyBool)) {
        return new types.PyStr(String.fromCharCode(i.__int__()))
    } else if (!types.isinstance(i, types.PyInt)) {
        throw new TypeError('an integer is required (got type ' + type_name(i) + ')')
    }

    // We now know we have a PyInt, so we can deal directly
    // with PyInt internals for efficiency
    if (i.val.lt(types.PyInt.MIN_INT.val)) {
        throw new OverflowError('Python int too large to convert to C long')
    } else if (i.val.lt(-0x7fffffff)) {
        throw new OverflowError('signed integer is less than minimum')
    } else if (i.val.lt(0)) {
        throw new ValueError('chr() arg not in range(0x110000)')
    } else if (i.val.gt(types.PyInt.MAX_INT.val)) {
        throw new OverflowError('Python int too large to convert to C long')
    } else if (i.val.gt(0x7fffffff)) {
        throw new OverflowError('signed integer is greater than maximum')
    } else if (i.val.gt(0x10ffff)) {
        throw new ValueError('chr() arg not in range(0x110000)')
    }
    return new types.PyStr(String.fromCharCode(new types.PyInt(i)))
}

chr.__name__ = 'chr'
chr.__doc__ = `chr(i) -> Unicode character

Return a Unicode string of one character with ordinal i; 0 <= i <= 0x10ffff.`
chr.$pyargs = {
    args: ['i'],
    missing_args_error: (e) => `chr() takes exactly 1 argument (${e.given} given)`
}
