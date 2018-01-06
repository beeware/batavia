import { PyAttributeError } from './exceptions'
import { type_name, PyObject } from './types'

export function getattr_raw(obj, attr, attributes_only) {
    var val = obj[attr]
    if (val instanceof Function) {
        if (attributes_only) {
            return undefined
        }
        // If this is a native Javascript function, wrap the function
        // so that the Python calling convention is used. If it's a
        // class constructor, wrap it in a method that uses the Python
        // calling convention, but instantiates the object rather than just
        // proxying the call.
        if (val.prototype && Object.keys(val.prototype).length > 0) {
            // Python class
            val = (function(func, doc) {
                var fn = function(args, kwargs) {
                    function F() {
                        return func.apply(this, args)
                    }
                    F.prototype = func.prototype
                    return new F()
                }
                fn.__doc__ = doc
                return fn
            }(val, val.__doc__))
        } else if (val.$pyargs) {
            var doc = val.__doc__
            val = val.bind(obj)
            val.__doc__ = doc
        } else {
            val = (function(obj, func, doc) {
                var fn = function(args, kwargs) {
                    return func.apply(obj, args)
                }
                fn.__doc__ = doc
                return fn
            }(obj, val, val.__doc__))
        }
    }
    return val
}

export function getattr(obj, attr) {
    var val = getattr_raw(obj, attr)
    if (val === undefined) {
        throw new PyAttributeError(
            "'" + type_name(obj) + "' object has no attribute '" + attr + "'"
        )
    }
    return val
}

export function getattr_py(obj, attr) {
    var val
    var getattribute
    var getattr

    if (obj.__class__ !== undefined) {
        getattribute = getattr_raw(obj.__class__, '__getattribute__')
        getattr = getattr_raw(obj.__class__, '__getattr__')
        // if class of object has __getattribute__ method,
        // call that, otherwise, call
        // object.__getattribute__
        // if they fail with an PyAttributeError,
        // call __getattr__ (if it exists)
        try {
            if (getattribute !== undefined && getattribute.__get__ !== undefined) {
                val = getattribute.__get__(obj).__call__(attr)
            } else {
                val = PyObject.__class__.__getattribute__(obj, attr)
            }
        } catch (err) {
            if (err instanceof PyAttributeError &&
                getattr !== undefined && getattr.__get__ !== undefined) {
                // clear last_exception because it is handled here
                getattr.$vm.last_exception = null
                val = getattr.__get__(obj).__call__(attr)
            } else {
                throw err
            }
        }
    } else {
        val = obj.__getattribute__(attr)
    }
    return val
}

export function setattr(obj, attr, value) {
    obj[attr] = value
}

export function delattr(obj, attr) {
    if (obj[attr] === undefined) {
        throw new PyAttributeError("'" + type_name(obj) +
                        "' object has no attribute '" + attr + "'"
        )
    } else {
        delete obj[attr]
    }
}
