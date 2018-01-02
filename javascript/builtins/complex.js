import { BataviaError, TypeError } from '../core/exceptions'
import * as types from '../types'

export default function complex(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError.$pyclass("complex() doesn't accept keyword arguments")
    }
    if (!args || args.length > 2) {
        throw new TypeError.$pyclass('complex() expected at most 2 arguments (' + args.length + ' given)')
    }
    if (types.isinstance(args[0], types.Complex) && !args[1]) {
        return args[0]
    }
    var re = new types.Float(0)
    if (args.length >= 1) {
        re = args[0]
    }
    var im = new types.Float(0)
    if (args.length === 2 && args[1]) {
        im = args[1]
    }
    return new types.Complex(re, im)
}

complex.__doc__ = 'complex(real[, imag]) -> complex number\n\nCreate a complex number from a real part and an optional imaginary part.\nThis is equivalent to (real + imag*1j) where imag defaults to 0.'
complex.$pyargs = true
