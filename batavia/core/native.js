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
