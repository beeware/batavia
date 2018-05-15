const exceptions = require('../core').exceptions
const types = require('../types')

function pow(args, kwargs) {
    let x, y, z
    if (!args) {
        throw new exceptions.TypeError.$pyclass('pow expected at least 2 arguments, got 0')
    }
    if (args.length === 2) {
        x = args[0]
        y = args[1]
        return x.__pow__(y)
    } else if (args.length === 3) {
        x = args[0]
        y = args[1]
        z = args[2]

        if (!types.isinstance(x, types.Int) ||
            !types.isinstance(y, types.Int) ||
            !types.isinstance(z, types.Int)) {
            throw new exceptions.TypeError.$pyclass('pow() 3rd argument not allowed unless all arguments are integers')
        }
        if (y < 0) {
            const version = require('../core').version
            const error_message = 'pow() 2nd argument cannot be negative when 3rd argument specified'
            if (version.earlier('3.4')) {
                throw new exceptions.TypeError.$pyclass(error_message)
            } else {
                throw new exceptions.ValueError.$pyclass(error_message)
            }
        }

        // if z is 1 or -1 then answer is always 0
        if (parseInt(z) === 1 || parseInt(z) === -1) {
            return 0
        }

        // if y is 0 provided z is not 1 or -1, then answer is always 1
        if (parseInt(y) === 0) {
            return 1
        }

        // right-to-left exponentiation to reduce memory and time
        // See https://en.wikipedia.org/wiki/Modular_exponentiation#Right-to-left_binary_method
        let result = 1
        let base = x % z
        while (y > 0) {
            if ((y & 1) === 1) {
                result = (result * base) % z
            }
            y >>= 1
            base = (base * base) % z
        }
        return result
    } else {
        throw new exceptions.TypeError.$pyclass('pow expected at least 2 arguments, got ' + args.length)
    }
}
pow.__doc__ = 'pow(x, y[, z]) -> number\n\nWith two arguments, equivalent to x**y.  With three arguments,\nequivalent to (x**y) % z, but may be more efficient (e.g. for ints).'

module.exports = pow

