import { PyTypeError, PyValueError } from '../core/exceptions'
import { type_name } from '../core/types'
import * as types from '../types'

export default function float(args, kwargs) {
    if (args.length > 1) {
        throw new PyTypeError('float() takes at most 1 argument (' + args.length + ' given)')
    }
    if (args.length === 0) {
        return new types.PyFloat(0.0)
    }

    var value = args[0]

    if (types.isinstance(value, types.PyStr)) {
        if (value.length === 0) {
            throw new PyValueError('could not convert string to float: ')
        } else if (value.search(/[^0-9.]/g) === -1) {
            return new types.PyFloat(parseFloat(value))
        } else {
            if (value === 'nan' || value === '+nan' || value === '-nan') {
                return new types.PyFloat(NaN)
            } else if (value === 'inf' || value === '+inf') {
                return new types.PyFloat(Infinity)
            } else if (value === '-inf') {
                return new types.PyFloat(-Infinity)
            }
            throw new PyValueError("could not convert string to float: '" + args[0] + "'")
        }
    } else if (types.isinstance(value, [types.PyInt, types.PyBool, types.PyFloat])) {
        return args[0].__float__()
    } else {
        throw new PyTypeError(
            "float() argument must be a string, a bytes-like object or a number, not '" + type_name(args[0]) + "'")
    }
}

float.__doc__ = 'float([x]) -> Convert a string or a number to floating point.'
float.$pyargs = true
