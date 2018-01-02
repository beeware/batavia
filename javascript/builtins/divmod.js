import { BataviaError, TypeError } from '../core/exceptions'
import { type_name } from '../core/types/types'

import * as types from '../types'

export default function divmod(args, kwargs) {
    var notAllowedTypes = [types.Bytearray, types.Bytes, types.Dict, types.FrozenSet, types.List, types.NoneType, types.NotImplementedType, types.Range, types.Set, types.Slice, types.Str, types.Tuple, types.Type]
    if (arguments.length !== 2) {
        throw new BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError.$pyclass("divmod() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 2) {
        throw new TypeError.$pyclass('divmod expected 2 arguments, got ' + args.length)
    }
    if (types.isinstance(args[0], types.Complex) || types.isinstance(args[1], types.Complex)) {
        throw new TypeError.$pyclass("can't take floor or mod of complex number.")
    }
    if (types.isinstance(args[0], notAllowedTypes) || types.isinstance(args[1], notAllowedTypes)) {
        throw new TypeError.$pyclass("unsupported operand type(s) for divmod(): '" + type_name(args[0]) + "' and '" + type_name(args[1]) + "'")
    }

    var div = Math.floor(args[0] / args[1])
    var rem = args[0] % args[1]
    return new types.Tuple([new types.Int(div), new types.Int(rem)])
}
divmod.__doc__ = 'Return the tuple ((x-x%y)/y, x%y).  Invariant: div*y + mod === x.'
divmod.$pyargs = true
