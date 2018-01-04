import { AttributeError, TypeError } from './exceptions'
import * as native from './native'
import * as types from '../types'
import * as version from './version'

/*************************************************************************
 * Method for adding types to Python class hierarchy
 *************************************************************************/

export function create_pyclass(type, name, is_native) {
    if (!is_native) {
        extend_PyObject(type, name)
    }
    make_python_class(type, name)
}

function extend_PyObject(type, name) {
    type.prototype = Object.create(PyObject.prototype)
}

function make_python_class(type, name) {
    type.__class__ = new Type(name)
    type.prototype.__class__ = type.__class__
}

/*************************************************************************
 * Method for outputting the type of a variable
 *************************************************************************/

export var type_name = function(arg) {
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

/*************************************************************************
 * A Python Type
 *************************************************************************/
export function Type(name, bases, dict) {
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

// Set the type properties of the Type class
Type.prototype.__doc__ = "type(object_or_name, bases, dict)\ntype(object) -> the object's type\ntype(name, bases, dict) -> a new type"
// make_python_class(Type, 'type')
Type.prototype.__class__ = new Type('type')

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

Type.prototype.__bool__ = function() {
    return true
}

Type.prototype.__call__ = function(args, kwargs) {
    var instance
    if (this.$pyinit) {
        instance = new this()

        if (instance.__init__) {
            // Bind the constructor to the instance, and invoke.
            var constructor = new types.Method(instance, instance.__init__)
            constructor.__call__.apply(instance, [args, kwargs])
        }
    } else {
        instance = Object.create(this.prototype)
        this.apply(instance, args)
    }
    return instance
}

Type.prototype.__getattribute__ = function(obj, name) {
    var attr = native.getattr_raw(obj, name)

    if (attr === undefined && obj !== undefined) {
        // if it's a 'type' object and doesn't have attr,
        // look to the prototype of the instance, but exclude functions
        attr = native.getattr_raw(obj.prototype, name, true)
    }
    if (attr === undefined) {
        if (obj === undefined) {
            throw new AttributeError(
                "'" + type_name(obj) + "' object has no attribute '" + name + "'"
            )
        } else {
            throw new AttributeError(
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
    if (Object.getPrototypeOf(this) === Type) {
        throw new TypeError(
            "can't set attributes of built-in/extension type '" + this.__name__ + "'"
        )
    }

    native.setattr(this.prototype, name, value)
}

Type.prototype.__delattr__ = function(name) {
    if (this.dict) {
        throw new AttributeError(name)
    }

    if (['int', 'str'].indexOf(this.__name__) > -1) {
        throw new TypeError("can't set attributes of built-in/extension type '" + this.__name__ + "'")
    }

    var attr = native.getattr_raw(this.prototype, name)
    if (attr === undefined) {
        throw new AttributeError(
            "type object '" + this.__name__ + "' has no attribute '" + name + "'"
        )
    }

    native.delattr(this.prototype, name)
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

/*************************************************************************
 * A base Python object
 *************************************************************************/
export function PyObject() {
    Object.call(this)

    // Iterate over base classes in reverse order.
    // Ignore the class at position 0, because that will
    // be self.
    var bases = this.__class__.mro()
    for (var b = bases.length - 1; b >= 1; b--) {
        var klass = bases[b].prototype
        for (var attr in klass) {
            if (this[attr] === undefined) {
                this[attr] = klass[attr]
            }
        }
    }
}

// Set the type properties of the PyObject class
PyObject.prototype.__doc__ = 'The most base type'
make_python_class(PyObject, 'object')

PyObject.prototype.toString = function() {
    return '<' + this.__class__.__name__ + ' 0x...>'
}

PyObject.prototype.__repr__ = function() {
    return '<' + this.__class__.__name__ + ' 0x...>'
}

PyObject.prototype.__str__ = function() {
    return '<' + this.__class__.__name__ + ' 0x...>'
}

PyObject.prototype.__getattribute__ = function(name) {
    var value = this.__class__.__getattribute__(this, name)
    return value
}

PyObject.prototype.__setattr__ = function(name, value) {
    if (Object.getPrototypeOf(this) === PyObject) {
        throw new AttributeError("'" + type_name(this) +
            "' object has no attribute '" + name + "'"
        )
    }

    var attr = this[name]
    if (attr !== undefined && attr.__set__ !== undefined) {
        attr.__set__(this, value)
    } else {
        this[name] = value
    }
}

PyObject.prototype.__delattr__ = function(name) {
    var attr = this[name]
    if (attr === undefined) {
        throw new AttributeError("'" + type_name(this) +
            "' object has no attribute '" + name + "'"
        )
    }

    if (attr.__delete__ !== undefined) {
        attr.__delete__(this)
    } else {
        delete this[name]
    }
}

/*************************************************************************
 * An implementation of NoneType
 *************************************************************************/
export function NoneType() {
    PyObject.call(this)
}

NoneType.prototype = Object.create(PyObject.prototype)
make_python_class(NoneType, 'NoneType')

/**************************************************
 * Type conversions
 **************************************************/

NoneType.prototype.__bool__ = function() {
    return new types.Bool(false)
}

NoneType.prototype.__repr__ = function() {
    return new types.Str('None')
}

NoneType.prototype.__str__ = function() {
    return new types.Str('None')
}
/**************************************************
 * Attribute manipulation
 **************************************************/

NoneType.prototype.__setattr__ = function(attr, value) {
    if (Object.getPrototypeOf(this)[attr] === undefined) {
        throw new AttributeError("'NoneType' object has no attribute '" + attr + "'")
    } else {
        throw new AttributeError("'NoneType' object attribute '" + attr + "' is read-only")
    }
}

/**************************************************
 * Comparison operators
 **************************************************/

NoneType.prototype.__lt__ = function(other) {
    if (version.earlier('3.6')) {
        throw new TypeError(
            'unorderable types: NoneType() < ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError(
            "'<' not supported between instances of 'NoneType' and '" +
            type_name(other) + "'"
        )
    }
}

NoneType.prototype.__le__ = function(other) {
    if (version.earlier('3.6')) {
        throw new TypeError(
            'unorderable types: NoneType() <= ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError(
            "'<=' not supported between instances of 'NoneType' and '" +
            type_name(other) + "'"
        )
    }
}

NoneType.prototype.__eq__ = function(other) {
    return other === this
}

NoneType.prototype.__ne__ = function(other) {
    return other !== this
}

NoneType.prototype.__gt__ = function(other) {
    if (version.earlier('3.6')) {
        throw new TypeError(
            'unorderable types: NoneType() > ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError(
            "'>' not supported between instances of 'NoneType' and '" +
            type_name(other) + "'"
        )
    }
}

NoneType.prototype.__ge__ = function(other) {
    if (version.earlier('3.6')) {
        throw new TypeError(
            'unorderable types: NoneType() >= ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError(
            "'>=' not supported between instances of 'NoneType' and '" +
            type_name(other) + "'"
        )
    }
}

NoneType.prototype.__contains__ = function(other) {
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

NoneType.prototype.__pos__ = function() {
    throw new TypeError("bad operand type for unary +: 'NoneType'")
}

NoneType.prototype.__neg__ = function() {
    throw new TypeError("bad operand type for unary -: 'NoneType'")
}

NoneType.prototype.__not__ = function() {
    return true
}

NoneType.prototype.__invert__ = function() {
    throw new TypeError("bad operand type for unary ~: 'NoneType'")
}

/**************************************************
 * Binary operators
 **************************************************/

NoneType.prototype.__pow__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__div__ = function(other) {
    return NoneType.__truediv__(other)
}

NoneType.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        throw new TypeError("unsupported operand type(s) for //: 'NoneType' and '" + type_name(other) + "'")
    }
}

NoneType.prototype.__truediv__ = function(other) {
    throw new TypeError("unsupported operand type(s) for /: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__mul__ = function(other) {
    if (types.isinstance(other, [types.List, types.Tuple, types.Str, types.Bytes, types.Bytearray])) {
        throw new TypeError("can't multiply sequence by non-int of type 'NoneType'")
    } else {
        throw new TypeError("unsupported operand type(s) for *: 'NoneType' and '" + type_name(other) + "'")
    }
}

NoneType.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't mod complex numbers.")
    } else {
        throw new TypeError("unsupported operand type(s) for %: 'NoneType' and '" + type_name(other) + "'")
    }
}

NoneType.prototype.__add__ = function(other) {
    throw new TypeError("unsupported operand type(s) for +: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__sub__ = function(other) {
    throw new TypeError("unsupported operand type(s) for -: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__getitem__ = function(other) {
    throw new TypeError("'NoneType' object is not subscriptable")
}

NoneType.prototype.__lshift__ = function(other) {
    throw new TypeError("unsupported operand type(s) for <<: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__rshift__ = function(other) {
    throw new TypeError("unsupported operand type(s) for >>: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__and__ = function(other) {
    throw new TypeError("unsupported operand type(s) for &: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__xor__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ^: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__or__ = function(other) {
    throw new TypeError("unsupported operand type(s) for |: 'NoneType' and '" + type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

NoneType.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        throw new TypeError("unsupported operand type(s) for //=: 'NoneType' and '" + type_name(other) + "'")
    }
}

NoneType.prototype.__itruediv__ = function(other) {
    throw new TypeError("unsupported operand type(s) for /=: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__iadd__ = function(other) {
    throw new TypeError("unsupported operand type(s) for +=: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__isub__ = function(other) {
    throw new TypeError("unsupported operand type(s) for -=: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__imul__ = function(other) {
    if (types.isinstance(other, [types.List, types.Tuple, types.Str, types.Bytes, types.Bytearray])) {
        throw new TypeError("can't multiply sequence by non-int of type 'NoneType'")
    } else {
        throw new TypeError("unsupported operand type(s) for *=: 'NoneType' and '" + type_name(other) + "'")
    }
}

NoneType.prototype.__imod__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't mod complex numbers.")
    } else {
        throw new TypeError("unsupported operand type(s) for %=: 'NoneType' and '" + type_name(other) + "'")
    }
}

NoneType.prototype.__ipow__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__ilshift__ = function(other) {
    throw new TypeError("unsupported operand type(s) for <<=: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__irshift__ = function(other) {
    throw new TypeError("unsupported operand type(s) for >>=: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__iand__ = function(other) {
    throw new TypeError("unsupported operand type(s) for &=: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__ixor__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ^=: 'NoneType' and '" + type_name(other) + "'")
}

NoneType.prototype.__ior__ = function(other) {
    throw new TypeError("unsupported operand type(s) for |=: 'NoneType' and '" + type_name(other) + "'")
}

// Create a singleton instance of None
export var None = new NoneType()

// Now that we have an instance of None, we can fill in the blanks where we needed it
PyObject.prototype.__class__.__base__ = None
