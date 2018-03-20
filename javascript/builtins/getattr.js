import { pyAttributeError, pyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import { isinstance, pystr } from '../types'

export default function getattr(obj, attr, default_) {
    let value
    if (!isinstance(attr, pystr)) {
        throw pyTypeError('getattr(): attribute name must be string')
    }

    try {
        // Use normal Javascript attribute lookup.
        // This will raise an AttributeError if the object is
        // a Python object, return undefined if it's a normal
        // Javascript object (or an odd Python primitive like bool)
        value = obj[attr]
    } catch (e) {
        if (isinstance(e, pyAttributeError)) {
            if (default_ === undefined) {
                throw e
            }
        } else {
            throw e
        }
    }

    if (value === undefined) {
        if (default_ !== undefined) {
           return default_
        } else {
            throw pyAttributeError(
                `'${obj.__class__.__name__}' object has no attribute '${attr}'`
            )
        }
    }

    return value
}

getattr.__name__ = 'getattr'
getattr.__doc__ = `getattr(object, name[, default]) -> value

Get a named attribute from an object; getattr(x, 'y') is equivalent to x.y.
When a default argument is given, it is returned when the attribute doesn't
exist; without it, an exception is raised in that case.`
getattr.$pyargs = {
    args: ['obj', 'attr'],
    default_args: ['default']
}
