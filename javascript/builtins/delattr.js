import { pyAttributeError, pyTypeError } from '../core/exceptions'
import { type_name, pyNone } from '../core/types'

import { isinstance, pystr } from '../types'

import getattr from './getattr'

export default function delattr(obj, attr) {
    if (!isinstance(attr, pystr)) {
        throw pyTypeError("attribute name must be string, not '" + type_name(attr) + "'")
    }

    // Use normal Javascript attribute lookup to find the attribute.
    // This will raise an AttributeError if the object is
    // a Python object, return undefined if it's a normal
    // Javascript object (or an odd Python primitive like bool)
    if (obj.$raw) {
        obj.__delattr__(attr)
    } else {
        if (obj[attr] === undefined)
        {
            throw pyAttributeError(
                `'${obj.__class__.__name__}' object has no attribute '${attr}'`
            )
        } else {
            delete obj[attr]
        }
    }

    return pyNone
}

delattr.__name__ = 'delattr'
delattr.__doc__ = `
delattr(object, name)

Delete a named attribute on an object; delattr(x, 'y') is equivalent to
\`\`del x.y''.`
delattr.$pyargs = {
    args: ['obj', 'attr']
}
