import { TypeError } from '../core/exceptions'
import * as native from '../core/native'
import { type_name } from '../core/types/types'

import * as types from '../types'

export default function delattr(args, kwargs) {
    if (args) {
        if (args.length === 2) {
            if (!types.isinstance(args[1], types.Str)) {
                throw new TypeError.$pyclass("attribute name must be string, not '" + type_name(args[1]) + "'")
            }

            if (args[0].__delattr__ === undefined) {
                native.delattr(args[0], args[1])
            } else {
                args[0].__delattr__(args[1])
            }
        } else {
            throw new TypeError.$pyclass('delattr expected exactly 2 arguments, got ' + args.length)
        }
    } else {
        throw new TypeError.$pyclass('delattr expected exactly 2 arguments, got 0')
    }
}

delattr.__doc__ = "delattr(object, name)\n\nDelete a named attribute on an object; delattr(x, 'y') is equivalent to\n``del x.y''."
delattr.$pyargs = true
