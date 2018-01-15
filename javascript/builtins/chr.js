import { BataviaError, OverflowError, TypeError, ValueError } from '../core/exceptions'
import { type_name } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

export default function chr(i) {
    if (types.isinstance(i, types.PyComplex)) {
        throw new TypeError('can\'t convert complex to int')
    }
    if (types.isinstance(i, types.PyFloat)) {
        throw new TypeError('integer argument expected, got float')
    }
    if (types.isinstance(i, types.PyBool)) {
        return new types.PyStr(String.fromCharCode(i.__int__()))
    }
    if (!types.isinstance(i, types.PyInt)) {
        throw new TypeError('an integer is required (got type ' + type_name(i) + ')')
    }
    if (i.__ge__(new types.PyInt(0).MAX_INT.__add__(new types.PyInt(1))) || i.__le__(new types.PyInt(0).MIN_INT.__sub__(new types.PyInt(1)))) {
        throw new OverflowError('Python int too large to convert to C long')
    }
    if (i.__ge__(new types.PyInt(0).MAX_INT)) {
        throw new OverflowError('signed integer is greater than maximum')
    }
    if (i.__le__(new types.PyInt(0).MIN_INT.__add__(new types.PyInt(1)))) {
        throw new OverflowError('signed integer is less than minimum')
    }
    if (i.__lt__(new types.PyInt(0))) {
        throw new ValueError('chr() arg not in range(0xXXXXXXXX)')
    }
    return new types.PyStr(String.fromCharCode(new types.PyInt(i)))
    // After tests pass, let's try saving one object creation
    // return new types.PyStr.fromCharCode(i);
}

chr.__doc__ = 'chr(i) -> Unicode character\n\nReturn a Unicode string of one character with ordinal i; 0 <= i <= 0x10ffff.'
chr.$pyargs = {
    args: ['i']
}
