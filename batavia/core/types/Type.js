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
        if (this.dict) {
            return "<class '__main__." + this.__name__ + "'>"
        }
        return "<class '" + this.__name__ + "'>"
    } else {
        return this.__name__
    }
}

Type.prototype.__str__ = function() {
    return this.__repr__()
}

Type.prototype.__eq__ = function(obj) {
    if (this === obj) {
        return true
    }
    if (typeof obj === 'function') {
        // check for builtin function types, which are native functions
        var name = obj.name
        if (name.startswith('bound ')) {
            name = name.substring(6)
        }
        return this.__name__ === name
    }
    return false
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

Type.prototype.__getattribute__ = function(obj, name) {
    var exceptions = require('../exceptions')
    var native = require('../native')

    var attr = native.getattr_raw(obj, name)

    if (attr === undefined && obj.$pyclass !== undefined) {
        // if it's a 'type' object and doesn't have attr,
        // look to the prototype of the instance, but exclude functions
        attr = native.getattr_raw(obj.$pyclass.prototype, name, true)
    }
    if (attr === undefined) {
        if (obj.$pyclass === undefined) {
            throw new exceptions.AttributeError.$pyclass(
                "'" + type_name(obj) + "' object has no attribute '" + name + "'"
            )
        } else {
            throw new exceptions.AttributeError.$pyclass(
                "type object '" + obj.__name__ + "' has no attribute '" + name + "'"
            )
        }
    }

    var value
    if (attr.__get__) {
        value = attr.__get__(obj, obj.__class__)
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

    if (this.dict) {
        throw new exceptions.AttributeError.$pyclass(name)
    }

    if (['int', 'str'].indexOf(this.__name__) > -1) {
        throw new exceptions.TypeError.$pyclass("can't set attributes of built-in/extension type '" + this.__name__ + "'")
    }

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
 * Method for adding types to Python class hierarchy
 *************************************************************************/

function create_pyclass(type, name, is_native) {
    if (!is_native) {
        extend_PyObject(type, name)
    }
    make_python_class(type, name)
}

function extend_PyObject(type, name) {
    type.prototype = Object.create(PyObject.prototype)
}

function make_python_class(type, name) {
    type.prototype.__class__ = new Type(name)
    type.prototype.__class__.$pyclass = type
}

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
            if (arg.__class__ && arg.__class__.__name__) {
                return arg.__class__.__name__
            }
    }

    return 'Native object'
}

module.exports = {
    'Type': Type,
    'type_name': type_name,
    'create_pyclass': create_pyclass
}
