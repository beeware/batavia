import { AttributeError, TypeError } from '../core/exceptions'
import * as native from '../core/native'

import * as types from '../types'

export default function hasattr(object, name) {
    var val
    try {
        if (object.__getattribute__ === undefined) {
            val = native.getattr(object, name)
        } else {
            val = native.getattr_py(object, name)
        }
    } catch (err) {
        if (err instanceof AttributeError) {
            val = undefined
        } else {
            throw err
        }
    }

    return val !== undefined
}

hasattr.__doc__ = 'hasattr(object, name) -> bool\n\nReturn whether the object has an attribute with the given name.\n(This is done by calling getattr(object, name) and catching AttributeError.)'
hasattr.$pyargs = {
    args: ['object', 'name'],
    default_args: ['default']
}
