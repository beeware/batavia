import { TypeError, ValueError } from '../core/exceptions'
import { type_name } from '../core/types'
import * as types from '../types'

export default function float(args, kwargs) {
    if (args.length > 1) {
        throw new TypeError('float() takes at most 1 argument (' + args.length + ' given)')
    }
    if (args.length === 0) {
        return new types.Float(0.0)
    }

    var value = args[0]

    if (types.isinstance(value, types.Str)) {
        if (value.length === 0) {
            throw new ValueError('could not convert string to float: ')
        } else if (value.search(/[^0-9.]/g) === -1) {
            return new types.Float(parseFloat(value))
        } else {
            if (value === 'nan' || value === '+nan' || value === '-nan') {
                return new types.Float(NaN)
            } else if (value === 'inf' || value === '+inf') {
                return new types.Float(Infinity)
            } else if (value === '-inf') {
                return new types.Float(-Infinity)
            }
            throw new ValueError("could not convert string to float: '" + args[0] + "'")
        }
    } else if (types.isinstance(value, [types.Int, types.Bool, types.Float])) {
        return args[0].__float__()
    } else {
        throw new TypeError(
            "float() argument must be a string, a bytes-like object or a number, not '" + type_name(args[0]) + "'")
    }
}

float.__doc__ = 'float([x]) -> Convert a string or a number to floating point.'
float.$pyargs = true
