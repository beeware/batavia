import { AttributeError } from './exceptions'
import { type_name } from './types'

export function getattr(obj, attr, default_) {
    let val

    if (obj.__class__ === undefined) {
        // A native Javascript object
        val = obj[attr]
        if (val === undefined) {
            if (default_ !== undefined) {
                return default_
            } else {
                throw new AttributeError(
                    "'" + type_name(obj) + "' object has no attribute '" + attr + "'"
                )
            }
        }
    } else {
        // A Python object
        try {
            val = obj.__getattribute__(attr)
        } catch (e) {
            if (e instanceof AttributeError) {
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

    return val
}
getattr.__doc__ = "getattr(object, name[, default]) -> value\n\nGet a named attribute from an object; getattr(x, 'y') is equivalent to x.y.\nWhen a default argument is given, it is returned when the attribute doesn't\nexist; without it, an exception is raised in that case."
getattr.$pyargs = {
    args: ['obj', 'attr'],
    default_args: ['default']
}

export function hasattr(obj, attr) {
    let val

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
hasattr.__doc__ = 'hasattr(object, name) -> bool\n\nReturn whether the object has an attribute with the given name.\n(This is done by calling getattr(object, name) and catching AttributeError.)'
hasattr.$pyargs = {
    args: ['obj', 'attr']
}

export function setattr(obj, attr, value) {
    if (obj.__class__ === undefined) {
        obj[attr] = value
    } else {
        obj.__setattr__(attr, value)
    }
}
setattr.__doc__ = "setattr(object, name, value)\n\nSet a named attribute on an object; setattr(x, 'y', v) is equivalent to\n``x.y = v''."
setattr.$pyargs = {
    args: ['obj', 'attr', 'value']
}

export function delattr(obj, attr) {
    if (obj.__class === undefined) {
        if (obj[attr] === undefined) {
            throw new AttributeError("'" + type_name(obj) +
                            "' object has no attribute '" + attr + "'"
            )
            delete obj[attr]
        }
    } else {
        obj.__delattr__(attr)
    }
}
delattr.__doc__ = "delattr(object, name)\n\nDelete a named attribute on an object; delattr(x, 'y') is equivalent to\n``del x.y''."
delattr.$pyargs = {
    args: ['obj', 'attr']
}
