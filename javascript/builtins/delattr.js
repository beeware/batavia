import { TypeError } from '../core/exceptions'
import * as native from '../core/native'
import { type_name } from '../core/types'

import * as types from '../types'

export default function delattr(object, name) {
    if (object.__delattr__ === undefined) {
        native.delattr(object, name)
    } else {
        object.__delattr__(name)
    }
}

delattr.__doc__ = "delattr(object, name)\n\nDelete a named attribute on an object; delattr(x, 'y') is equivalent to\n``del x.y''."
delattr.$pyargs = {
    args: ['object', 'name']
}
