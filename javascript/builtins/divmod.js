import { BataviaError, PyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function divmod(args, kwargs) {
    var notAllowedTypes = [types.PyBytearray, types.PyBytes, types.PyDict, types.PyFrozenSet, types.PyList, types.PyNoneType, types.PyNotImplementedType, types.PyRange, types.PySet, types.PySlice, types.PyStr, types.PyTuple, types.PyType]
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError("divmod() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 2) {
        throw new PyTypeError('divmod expected 2 arguments, got ' + args.length)
    }
    if (types.isinstance(args[0], types.PyComplex) || types.isinstance(args[1], types.PyComplex)) {
        throw new PyTypeError("can't take floor or mod of complex number.")
    }
    if (types.isinstance(args[0], notAllowedTypes) || types.isinstance(args[1], notAllowedTypes)) {
        throw new PyTypeError("unsupported operand type(s) for divmod(): '" + type_name(args[0]) + "' and '" + type_name(args[1]) + "'")
    }

    var div = Math.floor(args[0] / args[1])
    var rem = args[0] % args[1]
    return new types.PyTuple([new types.PyInt(div), new types.PyInt(rem)])
}
divmod.__doc__ = 'Return the tuple ((x-x%y)/y, x%y).  Invariant: div*y + mod === x.'
divmod.$pyargs = true
