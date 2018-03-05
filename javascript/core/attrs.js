import { PyAttributeError, PyTypeError } from './exceptions'
import { type_name } from './types'

import { isinstance, PyStr } from '../types'

export function getattr(obj, attr, default_) {
    let value
    if (!isinstance(attr, PyStr)) {
        throw new PyTypeError('getattr(): attribute name must be string')
    }

    if (obj.__class__ === undefined) {
        // A native Javascript object
        value = obj[attr]
        if (value === undefined) {
            if (default_ !== undefined) {
                return default_
            } else {
                throw new PyAttributeError(
                    "'" + type_name(obj) + "' object has no attribute '" + attr + "'"
                )
            }
        } else {
            if (value instanceof Function) {
                let pyargs = value.$pyargs
                let pytype = value.$pytype
                value = value.bind(obj)
                value.$pyargs = pyargs
                value.$pytype = pytype
            }
        }
    } else {
        // A Python object
        try {
            value = obj.__getattribute__(attr)
        } catch (e) {
            if (e instanceof PyAttributeError) {
                if (default_ !== undefined) {
                    return default_
                } else {
                    throw e
                }
            } else {
                throw e
            }
        }
    }

    return value
}

getattr.__name__ = 'getattr'
getattr.__doc__ = "getattr(object, name[, default]) -> value\n\nGet a named attribute from an object; getattr(x, 'y') is equivalent to x.y.\nWhen a default argument is given, it is returned when the attribute doesn't\nexist; without it, an exception is raised in that case."
getattr.$pyargs = {
    args: ['obj', 'attr'],
    default_args: ['default']
}

export function hasattr(obj, attr) {
    let val
    if (!isinstance(attr, PyStr)) {
        throw new PyTypeError('hasattr(): attribute name must be string')
    }

    if (obj.__class__ === undefined) {
        // A native Javascript object
        val = obj[attr]
        if (val !== undefined) {
            return true
        }
    } else {
        // A Python object
        try {
            obj.__getattribute__(attr)
            return true
        } catch (e) {}
    }

    return false
}

hasattr.__name__ = 'hasattr'
hasattr.__doc__ = 'hasattr(object, name) -> bool\n\nReturn whether the object has an attribute with the given name.\n(This is done by calling getattr(object, name) and catching PyAttributeError.)'
hasattr.$pyargs = {
    args: ['obj', 'attr']
}

export function setattr(obj, attr, value) {
    if (!isinstance(attr, PyStr)) {
        throw new PyTypeError('setattr(): attribute name must be string')
    }

    if (obj.__class__ === undefined) {
        obj[attr] = value
    } else {
        obj.__setattr__(attr, value)
    }
}

setattr.__name__ = 'setattr'
setattr.__doc__ = "setattr(object, name, value)\n\nSet a named attribute on an object; setattr(x, 'y', v) is equivalent to\n``x.y = v''."
setattr.$pyargs = {
    args: ['obj', 'attr', 'value']
}

export function delattr(obj, attr) {
    if (!isinstance(attr, PyStr)) {
        throw new PyTypeError("attribute name must be string, not '" + type_name(attr) + "'")
    }

    if (obj.__class__ === undefined) {
        if (obj[attr] === undefined) {
            throw new PyAttributeError("'" + type_name(obj) +
                            "' object has no attribute '" + attr + "'"
            )
        } else {
            delete obj[attr]
        }
    } else {
        obj.__delattr__(attr)
    }
}

delattr.__name__ = 'delattr'
delattr.__doc__ = "delattr(object, name)\n\nDelete a named attribute on an object; delattr(x, 'y') is equivalent to\n``del x.y''."
delattr.$pyargs = {
    args: ['obj', 'attr']
}
