import { BataviaError, PyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function abs(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError("abs() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new PyTypeError('abs() takes exactly one argument (' + args.length + ' given)')
    }

    var value = args[0]
    if (types.isinstance(value, types.PyBool)) {
        return new types.PyInt(Math.abs(value.valueOf()))
    } else if (types.isinstance(value, [types.PyInt, types.PyFloat, types.PyComplex])) {
        return value.__abs__()
    } else {
        throw new PyTypeError("bad operand type for abs(): '" + type_name(value) + "'")
    }
}

abs.__doc__ = 'abs(number) -> number\n\nReturn the absolute value of the argument.'
abs.$pyargs = true
