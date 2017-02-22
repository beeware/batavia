var PyObject = require('./Object')

/*************************************************************************
 * A Python type
 *************************************************************************/
function Type(name, bases, dict) {
    Object.call(this)
    this.__name__ = name
    if (bases && Array.isArray(bases) && bases.length > 0) {
        this.__base__ = bases[0]
        this.__bases__ = []
        for (var base = 0; base < bases.length; base++) {
            this.__bases__.push(bases[base])
        }
    // } else if (bases) {
    //     this.__base__ = bases;
    //     this.__bases__ = [this.__base__];
    } else if (name === 'object' && bases === undefined) {
        this.__base__ = null
        this.__bases__ = []
    } else {
        this.__base__ = PyObject.prototype.__class__
        this.__bases__ = [PyObject.prototype.__class__]
    }
    this.dict = dict
}

Type.prototype.__class__ = new Type('type')
Type.prototype.__class__.$pyclass = Type

Type.prototype.toString = function() {
    return this.__repr__()
}

Type.prototype.__repr__ = function() {
    // True primitive types won't have __bases__ defined.
    if (this.__bases__) {
        return "<class '" + this.__name__ + "'>"
    } else {
        return this.__name__
    }
}

Type.prototype.__str__ = function() {
    return this.__repr__()
}

Type.prototype.__bool__ = function() {
    return true
}

Type.prototype.__call__ = function(args, kwargs) {
    var instance
    if (this.$pyinit) {
        instance = new this.$pyclass()

        if (instance.__init__) {
            // Bind the constructor to the instance, and invoke.
            var types = require('../../types')
            var constructor = new types.Method(instance, instance.__init__)
            constructor.__call__.apply(instance, [args, kwargs])
        }
    } else {
        instance = Object.create(this.$pyclass.prototype)
        this.$pyclass.apply(instance, args)
    }
    return instance
}

Type.prototype.__getattr__ = function(name) {
    var exceptions = require('../exceptions')
    var native = require('../native')

    var attr = native.getattr_raw(this, name)
    if (attr === undefined) {
        // if the Type doesn't have the attribute, look to the prototype
        // of the instance. However, exclude functions; this step is
        // only required for class attributes.
        attr = native.getattr_raw(this.$pyclass.prototype, name, true)
        if (attr === undefined) {
            throw new exceptions.AttributeError.$pyclass(
                "type object '" + this.__name__ + "' has no attribute '" + name + "'"
            )
        }
    }
    // If the returned object is a descriptor, invoke it.
    // Otherwise, the returned object *is* the value.
    var value
    if (attr.__get__ !== undefined) {
        value = attr.__get__(this, this.__class__)
    } else {
        value = attr
    }

    return value
}

Type.prototype.__setattr__ = function(name, value) {
    var exceptions = require('../exceptions')
    var native = require('../native')

    if (Object.getPrototypeOf(this) === Type) {
        throw new exceptions.TypeError.$pyclass(
            "can't set attributes of built-in/extension type '" + this.__name__ + "'"
        )
    }

    native.setattr(this.$pyclass.prototype, name, value)
}

Type.prototype.__delattr__ = function(name) {
    var exceptions = require('../exceptions')
    var native = require('../native')

    var attr = native.getattr_raw(this.$pyclass.prototype, name)
    if (attr === undefined) {
        throw new exceptions.AttributeError.$pyclass(
            "type object '" + this.__name__ + "' has no attribute '" + name + "'"
        )
    }

    native.delattr(this.$pyclass.prototype, name)
}

Type.prototype.valueOf = function() {
    return this.prototype
}

Type.prototype.mro = function() {
    // Cache the MRO on the __mro__ attribute
    if (this.__mro__ === undefined) {
        // Self is always the first port of call for the MRO
        this.__mro__ = [this]
        if (this.__bases__) {
            // Now traverse and add the base classes.
            for (var b in this.__bases__) {
                this.__mro__.push(this.__bases__[b])
                var submro = this.__bases__[b].mro()
                for (var sub in submro) {
                    // If the base class is already in the MRO,
                    // push it to the end of the MRO list.
                    var index = this.__mro__.indexOf(submro[sub])
                    if (index !== -1) {
                        this.__mro__.splice(index, 1)
                    }
                    this.__mro__.push(submro[sub])
                }
            }
        } else {
            // Primitives have no base class;
            this.__mro__ = [this]
        }
    }
    return this.__mro__
}

// Set the type properties of the PyObject class
PyObject.__class__ = new Type('object')
PyObject.prototype.__class__ = PyObject.__class__
PyObject.prototype.__class__.$pyclass = PyObject

/*************************************************************************
 * Method for outputting the type of a variable
 *************************************************************************/

var type_name = function(arg) {
    switch (typeof arg) {
        case 'boolean':
            return 'bool'
        case 'number':
            return 'Native number'
        case 'string':
            return 'str'
        case 'object':
        case 'function':
            if (arg.__class__ !== null && arg.__class__.__name__) {
                return arg.__class__.__name__
            }
    }

    return 'Native object'
}

module.exports = {
    'Type': Type,
    'type_name': type_name
}
