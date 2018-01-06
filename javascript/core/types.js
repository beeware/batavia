import { PyAttributeError, PyTypeError } from './exceptions'
import * as native from './native'
import * as types from '../types'
import * as version from './version'

/*************************************************************************
 * Method for adding types to Python class hierarchy
 *************************************************************************/

export function create_pyclass(Class, name, base) {
    var type
    if (base === undefined) {
        type = new PyType(name)
    } else if (base !== null) {
        type = new PyType(name, [base])
    } else {
        type = new PyType(name)
    }

    type.$pyclass = Class

    Class.__class__ = type
    Class.prototype.__class__ = type
}

/*************************************************************************
 * Method for outputting the type of a variable
 *************************************************************************/

export function type_name(arg) {
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
export var PyType = class {
    constructor(name, bases, dict) {
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
            this.__base__ = PyObject
            this.__bases__ = [PyObject]
        }
        this.dict = dict
    }

    toString() {
        return this.__repr__()
    }

    __repr__() {
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

    __str__() {
        return this.__repr__()
    }

    __bool__() {
        return true
    }

    __call__(args, kwargs) {
        var instance = new this.$pyclass()

        if (instance.__init__) {
            // Bind the constructor to the instance, and invoke.
            var constructor = new types.PyMethod(instance, instance.__init__)
            constructor.__call__.apply(instance, [args, kwargs])
        }
        return instance
    }

    __getattribute__(obj, name) {
        var attr = native.getattr_raw(obj, name)

        if (attr === undefined && obj !== undefined) {
            // if it's a 'type' object and doesn't have attr,
            // look to the prototype of the instance, but exclude functions
            attr = native.getattr_raw(obj.prototype, name, true)
        }
        if (attr === undefined) {
            if (obj === undefined) {
                throw new PyAttributeError(
                    "'" + type_name(obj) + "' object has no attribute '" + name + "'"
                )
            } else {
                throw new PyAttributeError(
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

    __setattr__(name, value) {
        if (Object.getPrototypeOf(this) === PyType) {
            throw new PyTypeError(
                "can't set attributes of built-in/extension type '" + this.__name__ + "'"
            )
        }

        native.setattr(this.prototype, name, value)
    }

    __delattr__(name) {
        if (this.dict) {
            throw new PyAttributeError(name)
        }

        if (['int', 'str'].indexOf(this.__name__) > -1) {
            throw new PyTypeError("can't set attributes of built-in/extension type '" + this.__name__ + "'")
        }

        var attr = native.getattr_raw(this.prototype, name)
        if (attr === undefined) {
            throw new PyAttributeError(
                "type object '" + this.__name__ + "' has no attribute '" + name + "'"
            )
        }

        native.delattr(this.prototype, name)
    }

    valueOf() {
        return this.prototype
    }

    mro() {
        // Cache the MRO on the __mro__ attribute
        if (this.__mro__ === undefined) {
            // Self is always the first port of call for the MRO
            this.__mro__ = [this]
            if (this.__bases__) {
                // Now traverse and add the base classes.
                for (var b in this.__bases__) {
                    this.__mro__.push(this.__bases__[b].__class__)
                    var submro = this.__bases__[b].__class__.mro()
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
}

// Set the type properties of the Type class
create_pyclass(PyType, 'type', null)
PyType.prototype.__doc__ = "type(object_or_name, bases, dict)\ntype(object) -> the object's type\ntype(name, bases, dict) -> a new type"

/*************************************************************************
 * A base Python object
 *************************************************************************/
export var PyObject = class {
    constructor() {
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

    toString() {
        return '<' + this.__class__.__name__ + ' 0x...>'
    }

    __repr__() {
        return '<' + this.__class__.__name__ + ' 0x...>'
    }

    __str__() {
        return '<' + this.__class__.__name__ + ' 0x...>'
    }

    __getattribute__(name) {
        var value = this.__class__.__getattribute__(this, name)
        return value
    }

    __setattr__(name, value) {
        if (Object.getPrototypeOf(this) === PyObject) {
            throw new PyAttributeError("'" + type_name(this) +
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

    __delattr__(name) {
        var attr = this[name]
        if (attr === undefined) {
            throw new PyAttributeError("'" + type_name(this) +
                "' object has no attribute '" + name + "'"
            )
        }

        if (attr.__delete__ !== undefined) {
            attr.__delete__(this)
        } else {
            delete this[name]
        }
    }
}

// Set the type properties of the PyObject class
PyObject.prototype.__doc__ = 'The most base type'
create_pyclass(PyObject, 'object')

/*************************************************************************
 * An implementation of NoneType
 *************************************************************************/
export var PyNoneType = class extends PyObject {
    constructor() {
        super()
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__() {
        return new types.PyBool(false)
    }

    __repr__() {
        return new types.PyStr('None')
    }

    __str__() {
        return new types.PyStr('None')
    }
    /**************************************************
     * Attribute manipulation
     **************************************************/

    __setattr__(attr, value) {
        if (Object.getPrototypeOf(this)[attr] === undefined) {
            throw new PyAttributeError("'NoneType' object has no attribute '" + attr + "'")
        } else {
            throw new PyAttributeError("'NoneType' object attribute '" + attr + "' is read-only")
        }
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: NoneType() < ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'<' not supported between instances of 'NoneType' and '" +
                type_name(other) + "'"
            )
        }
    }

    __le__(other) {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: NoneType() <= ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'<=' not supported between instances of 'NoneType' and '" +
                type_name(other) + "'"
            )
        }
    }

    __eq__(other) {
        return other === this
    }

    __ne__(other) {
        return other !== this
    }

    __gt__(other) {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: NoneType() > ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'>' not supported between instances of 'NoneType' and '" +
                type_name(other) + "'"
            )
        }
    }

    __ge__(other) {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: NoneType() >= ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'>=' not supported between instances of 'NoneType' and '" +
                type_name(other) + "'"
            )
        }
    }

    __contains__(other) {
        return false
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        throw new PyTypeError("bad operand type for unary +: 'NoneType'")
    }

    __neg__() {
        throw new PyTypeError("bad operand type for unary -: 'NoneType'")
    }

    __not__() {
        return true
    }

    __invert__() {
        throw new PyTypeError("bad operand type for unary ~: 'NoneType'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new PyTypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + type_name(other) + "'")
    }

    __div__(other) {
        return PyNoneType.__truediv__(other)
    }

    __floordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new PyTypeError("can't take floor of complex number.")
        } else {
            throw new PyTypeError("unsupported operand type(s) for //: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __truediv__(other) {
        throw new PyTypeError("unsupported operand type(s) for /: 'NoneType' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [types.PyList, types.PyTuple, types.PyStr, types.PyBytes, types.PyBytearray])) {
            throw new PyTypeError("can't multiply sequence by non-int of type 'NoneType'")
        } else {
            throw new PyTypeError("unsupported operand type(s) for *: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new PyTypeError("can't mod complex numbers.")
        } else {
            throw new PyTypeError("unsupported operand type(s) for %: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __add__(other) {
        throw new PyTypeError("unsupported operand type(s) for +: 'NoneType' and '" + type_name(other) + "'")
    }

    __sub__(other) {
        throw new PyTypeError("unsupported operand type(s) for -: 'NoneType' and '" + type_name(other) + "'")
    }

    __getitem__(other) {
        throw new PyTypeError("'NoneType' object is not subscriptable")
    }

    __lshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for <<: 'NoneType' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for >>: 'NoneType' and '" + type_name(other) + "'")
    }

    __and__(other) {
        throw new PyTypeError("unsupported operand type(s) for &: 'NoneType' and '" + type_name(other) + "'")
    }

    __xor__(other) {
        throw new PyTypeError("unsupported operand type(s) for ^: 'NoneType' and '" + type_name(other) + "'")
    }

    __or__(other) {
        throw new PyTypeError("unsupported operand type(s) for |: 'NoneType' and '" + type_name(other) + "'")
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new PyTypeError("can't take floor of complex number.")
        } else {
            throw new PyTypeError("unsupported operand type(s) for //=: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __itruediv__(other) {
        throw new PyTypeError("unsupported operand type(s) for /=: 'NoneType' and '" + type_name(other) + "'")
    }

    __iadd__(other) {
        throw new PyTypeError("unsupported operand type(s) for +=: 'NoneType' and '" + type_name(other) + "'")
    }

    __isub__(other) {
        throw new PyTypeError("unsupported operand type(s) for -=: 'NoneType' and '" + type_name(other) + "'")
    }

    __imul__(other) {
        if (types.isinstance(other, [types.PyList, types.PyTuple, types.PyStr, types.PyBytes, types.PyBytearray])) {
            throw new PyTypeError("can't multiply sequence by non-int of type 'NoneType'")
        } else {
            throw new PyTypeError("unsupported operand type(s) for *=: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __imod__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new PyTypeError("can't mod complex numbers.")
        } else {
            throw new PyTypeError("unsupported operand type(s) for %=: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __ipow__(other) {
        throw new PyTypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + type_name(other) + "'")
    }

    __ilshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for <<=: 'NoneType' and '" + type_name(other) + "'")
    }

    __irshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for >>=: 'NoneType' and '" + type_name(other) + "'")
    }

    __iand__(other) {
        throw new PyTypeError("unsupported operand type(s) for &=: 'NoneType' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        throw new PyTypeError("unsupported operand type(s) for ^=: 'NoneType' and '" + type_name(other) + "'")
    }

    __ior__(other) {
        throw new PyTypeError("unsupported operand type(s) for |=: 'NoneType' and '" + type_name(other) + "'")
    }

}

create_pyclass(PyNoneType, 'NoneType')

/*************************************************************************
 * Resolve circular reference issues
 *************************************************************************/

// Create a singleton instance of None
export var PyNone = new PyNoneType()

// Now that we have an instance of None, we can fill in the blanks where we needed it
PyObject.prototype.__class__.__base__ = PyNone
