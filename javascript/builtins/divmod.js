import { pyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function divmod(x, y) {
    var notAllowedTypes = [
        types.pybytearray, types.pybytes, types.pydict, types.pyfrozenset,
        types.pylist, types.pyNoneType, types.pyNotImplementedType, types.pyrange,
        types.pyset, types.pyslice, types.pystr, types.pytuple, types.pytype
    ]
    if (types.isinstance(x, types.pycomplex) || types.isinstance(y, types.pycomplex)) {
        throw pyTypeError("can't take floor or mod of complex number.")
    }
    if (types.isinstance(x, notAllowedTypes) || types.isinstance(y, notAllowedTypes)) {
        throw pyTypeError("unsupported operand type(s) for divmod(): '" + type_name(x) + "' and '" + type_name(y) + "'")
    }

    var div = Math.floor(x / y)
    var rem = x % y
    return types.pytuple([types.pyint(div), types.pyint(rem)])
}

divmod.__name__ = 'divmod'
divmod.__doc__ = 'Return the tuple ((x-x%y)/y, x%y).  Invariant: div*y + mod === x.'
divmod.$pyargs = {
    args: ['x', 'y'],
    missing_args_error: (e) => `divmod expected 2 arguments, got ${e.given}`
}
