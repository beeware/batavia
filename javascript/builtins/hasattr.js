import { pyAttributeError, pyTypeError } from '../core/exceptions'

import { isinstance, pystr } from '../types'

export default function hasattr(obj, attr) {
    let val
    if (!isinstance(attr, pystr)) {
        throw pyTypeError('hasattr(): attribute name must be string')
    }

    try {
        return obj[attr] !== undefined
    } catch (e) {
        if (isinstance(e, pyAttributeError)) {
            return false
        }
        throw e
    }

}

hasattr.__name__ = 'hasattr'
hasattr.__doc__ = `hasattr(object, name) -> bool

Return whether the object has an attribute with the given name.
(This is done by calling getattr(object, name) and catching pyAttributeError.)`
hasattr.$pyargs = {
    args: ['obj', 'attr']
}
