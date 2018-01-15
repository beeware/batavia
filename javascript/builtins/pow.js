import { TypeError } from '../core/exceptions'

import * as types from '../types'

export default function pow(x, y, z) {
    if (z === undefined) {
        return x.__pow__(y)
    } else {
        if (!types.isinstance(x, types.PyInt) ||
            !types.isinstance(y, types.PyInt) ||
            !types.isinstance(z, types.PyInt)) {
            throw new TypeError('pow() 3rd argument not allowed unless all arguments are integers')
        }
        if (y < 0) {
            throw new TypeError('pow() 2nd argument cannot be negative when 3rd argument specified')
        }
        if (y === 0) {
            return 1
        }
        if (z === 1) {
            return 0
        }

        // right-to-left exponentiation to reduce memory and time
        // See https://en.wikipedia.org/wiki/Modular_exponentiation#Right-to-left_binary_method
        var result = 1
        var base = x % z
        while (y > 0) {
            if ((y & 1) === 1) {
                result = (result * base) % z
            }
            y >>= 1
            base = (base * base) % z
        }
        return result
    }
}

pow.__doc__ = 'pow(x, y[, z]) -> number\n\nWith two arguments, equivalent to x**y.  With three arguments,\nequivalent to (x**y) % z, but may be more efficient (e.g. for ints).'
pow.$pyargs = {
    args: ['a', 'b'],
    default_args: ['z']
}
