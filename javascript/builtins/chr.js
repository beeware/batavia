import { BataviaError, PyOverflowError, PyTypeError, PyValueError } from '../core/exceptions'
import { type_name } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

export default function chr(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError('chr() takes no keyword arguments')
    }
    if (!args || args.length !== 1) {
        if (version.later('3.4')) {
            throw new PyTypeError(
                'chr() takes exactly one argument (' + args.length + ' given)'
            )
        } else {
            throw new PyTypeError(
                'chr() takes exactly 1 argument (' + args.length + ' given)'
            )
        }
    }
    if (types.isinstance(args[0], types.PyComplex)) {
        throw new PyTypeError('can\'t convert complex to int')
    }
    if (types.isinstance(args[0], types.PyFloat)) {
        throw new PyTypeError('integer argument expected, got float')
    }
    if (types.isinstance(args[0], types.PyBool)) {
        return new types.PyStr(String.fromCharCode(args[0].__int__()))
    }
    if (!types.isinstance(args[0], types.PyInt)) {
        throw new PyTypeError('an integer is required (got type ' + type_name(args[0]) + ')')
    }
    if (args[0].__ge__(new types.PyInt(0).MAX_INT.__add__(new types.PyInt(1))) || args[0].__le__(new types.PyInt(0).MIN_INT.__sub__(new types.PyInt(1)))) {
        throw new PyOverflowError('Python int too large to convert to C long')
    }
    if (args[0].__ge__(new types.PyInt(0).MAX_INT)) {
        throw new PyOverflowError('signed integer is greater than maximum')
    }
    if (args[0].__le__(new types.PyInt(0).MIN_INT.__add__(new types.PyInt(1)))) {
        throw new PyOverflowError('signed integer is less than minimum')
    }
    if (args[0].__lt__(new types.PyInt(0))) {
        throw new PyValueError('chr() arg not in range(0xXXXXXXXX)')
    }
    return new types.PyStr(String.fromCharCode(new types.PyInt(args[0])))
    // After tests pass, let's try saving one object creation
    // return new types.PyStr.fromCharCode(args[0]);
}

chr.__doc__ = 'chr(i) -> Unicode character\n\nReturn a Unicode string of one character with ordinal i; 0 <= i <= 0x10ffff.'
chr.$pyargs = true
