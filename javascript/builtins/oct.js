import { TypeError } from '../core/exceptions'
import * as types from '../types'

export default function oct(args, kwargs) {
    if (!args) {
        throw new TypeError('oct() takes exactly one argument (0 given)')
    } else if (args.length !== 1) {
        throw new TypeError('oct() takes exactly one argument (' + args.length + ' given)')
    }
    var value = args[0]
    if (types.isinstance(value, types.Int)) {
        if (value.val.isNeg()) {
            return '-0o' + value.val.toString(8).substr(1)
        } else {
            return '0o' + value.val.toString(8)
        }
    } else if (types.isinstance(value, types.Bool)) {
        return '0o' + value.__int__().toString(8)
    }

    if (!types.isinstance(value, types.Int)) {
        if (value.__index__) {
            value = value.__index__()
        } else {
            throw new TypeError('__index__ method needed for non-integer inputs')
        }
    }
    if (value < 0) {
        return '-0o' + (0 - value).toString(8)
    }

    return '0o' + value.toString(8)
}

oct.__doc__ = "oct(number) -> string\n\nReturn the octal representation of an integer.\n\n   >>> oct(342391)\n   '0o1234567'\n"
oct.$pyargs = true
