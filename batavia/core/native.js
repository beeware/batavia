var exceptions = require('./exceptions')

var native = {}

native.getattr_raw = function(obj, attr, attributes_only) {
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
            val = (function(func, doc, dict) {
                var fn = function(args, kwargs) {
                    function F() {
                        return func.apply(this, args)
                    }
                    F.prototype = func.prototype
                    return new F()
                }
                fn.__doc__ = doc
                fn.__dict__ = dict
                return fn
            }(val, val.__doc__, val.__dict__))
        } else if (val.$pyargs) {
            var doc = val.__doc__
            var dict = val.__dict__
            val = val.bind(obj)
            val.__doc__ = doc
            val.__dict__ = dict
        } else {
            val = (function(obj, func, doc, dict) {
                var fn = function(args, kwargs) {
                    return func.apply(obj, args)
                }
                fn.__doc__ = doc
                fn.__dict__ = dict
                return fn
            }(obj, val, val.__doc__, val.__dict__))
        }
    }
    return val
}

native.getattr = function(obj, attr) {
    var type_name = require('../core').type_name

    var val = native.getattr_raw(obj, attr)
    if (val === undefined) {
        throw new exceptions.AttributeError.$pyclass(
            "'" + type_name(obj) + "' object has no attribute '" + attr + "'"
        )
    }
    return val
}

native.getattr_py = function(obj, attr) {
    var PyObject = require('./types/Object')
    var val
    var getattribute
    var getattr

    if (obj.__class__ !== undefined) {
        if (obj.__class__.$pyclass !== undefined) {
            getattribute = native.getattr_raw(obj.__class__.$pyclass.prototype,
                '__getattribute__')
            getattr = native.getattr_raw(obj.__class__.$pyclass.prototype,
                '__getattr__')
        } else {
            getattribute = native.getattr_raw(obj.__class__,
                '__getattribute__')
            getattr = native.getattr_raw(obj.__class__,
                '__getattr__')
        }
        // if class of object has __getattribute__ method,
        // call that, otherwise, call
        // object.__getattribute__
        // if they fail with an AttributeError,
        // call __getattr__ (if it exists)
        try {
            if (getattribute !== undefined && getattribute.__get__ !== undefined) {
                val = getattribute.__get__(obj).__call__(attr)
            } else {
                val = PyObject.__class__.__getattribute__(obj, attr)
            }
        } catch (err) {
            if (err instanceof exceptions.AttributeError.$pyclass &&
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

native.setattr = function(obj, attr, value) {
    obj[attr] = value
}

native.delattr = function(obj, attr) {
    var type_name = require('../core').type_name

    if (obj[attr] === undefined) {
        throw new exceptions.AttributeError.$pyclass("'" + type_name(obj) +
                        "' object has no attribute '" + attr + "'"
        )
    } else {
        delete obj[attr]
    }
}

module.exports = native
