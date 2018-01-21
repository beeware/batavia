import { TypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function divmod(x, y) {
    var notAllowedTypes = [types.PyBytearray, types.PyBytes, types.PyDict, types.PyFrozenSet, types.PyList, types.PyNoneType, types.PyNotImplementedType, types.PyRange, types.PySet, types.PySlice, types.PyStr, types.PyTuple, types.PyType]
    if (types.isinstance(x, types.PyComplex) || types.isinstance(y, types.PyComplex)) {
        throw new TypeError("can't take floor or mod of complex number.")
    }
    if (types.isinstance(x, notAllowedTypes) || types.isinstance(y, notAllowedTypes)) {
        throw new TypeError("unsupported operand type(s) for divmod(): '" + type_name(x) + "' and '" + type_name(y) + "'")
    }

    var div = Math.floor(x / y)
    var rem = x % y
    return new types.PyTuple([new types.PyInt(div), new types.PyInt(rem)])
}
divmod.__doc__ = 'Return the tuple ((x-x%y)/y, x%y).  Invariant: div*y + mod === x.'
divmod.$pyargs = {
    args: ['x', 'y'],
    invalid_args: (e) => `divmod expected 2 arguments, got ${e.given}`
}
