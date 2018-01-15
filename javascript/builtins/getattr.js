import { AttributeError, TypeError } from '../core/exceptions'
import * as attrs from '../core/attrs'

import * as types from '../types'

export default function getattr(object, name, default) {
    if (!types.isinstance(name, types.PyStr)) {
        throw new TypeError('getattr(): attribute name must be string')
    }

    try {
        if (object.__getattribute__ === undefined) {
            return attrs.getattr(object, name)
        }
    } catch (e) {
        if (e instanceof AttributeError && args.length === 3) {
            return default
        } else {
            throw e
        }
    }
}

getattr.__doc__ = "getattr(object, name[, default]) -> value\n\nGet a named attribute from an object; getattr(x, 'y') is equivalent to x.y.\nWhen a default argument is given, it is returned when the attribute doesn't\nexist; without it, an exception is raised in that case."
getattr.$pyargs = {
    args: ['object', 'name'],
    default_args: ['default']
}