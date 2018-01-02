import { BataviaError, TypeError } from '../core/exceptions'
import { type_name } from '../core/types/types'

import * as types from '../types'

export default function abs(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError.$pyclass("abs() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new TypeError.$pyclass('abs() takes exactly one argument (' + args.length + ' given)')
    }

    var value = args[0]
    if (types.isinstance(value, types.Bool)) {
        return new types.Int(Math.abs(value.valueOf()))
    } else if (types.isinstance(value, [types.Int,
        types.Float,
        types.Complex])) {
        return value.__abs__()
    } else {
        throw new TypeError.$pyclass(
            "bad operand type for abs(): '" + type_name(value) + "'")
    }
}

abs.__doc__ = 'abs(number) -> number\n\nReturn the absolute value of the argument.'
abs.$pyargs = true
