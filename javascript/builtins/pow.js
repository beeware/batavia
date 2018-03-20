import { pyAttributeError, pyTypeError, pyValueError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function pow(x, y, z) {
    if (z === undefined) {
        try {
            return x.__pow__(y)
        } catch (e) {
            if (types.isinstance(e, pyAttributeError)) {
                throw pyTypeError(`unsupported operand type(s) for ** or pow(): '${type_name(x)}' and '${type_name(y)}'`)
            } else {
                throw e
            }
        }
    } else {
        if (!types.isinstance(x, types.pyint) ||
            !types.isinstance(y, types.pyint) ||
            !types.isinstance(z, types.pyint)) {
            throw pyTypeError('pow() 3rd argument not allowed unless all arguments are integers')
        }
        if (y < 0) {
            throw pyValueError('pow() 2nd argument cannot be negative when 3rd argument specified')
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
        return types.pyint(result)
    }
}

pow.__name__ = 'pow'
pow.__doc__ = `pow(x, y[, z]) -> number

With two arguments, equivalent to x**y.  With three arguments,
equivalent to (x**y) % z, but may be more efficient (e.g. for ints).`
pow.$pyargs = {
    args: ['a', 'b'],
    default_args: ['z'],
    missing_args_error: (e) => `pow expected at least 2 arguments, got ${e.given}`
}
