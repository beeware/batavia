import { call_method, call_super, python } from './callables'
import { AttributeError, TypeError } from './exceptions'
import * as version from './version'

import * as types from '../types'

/*************************************************************************
 * A base Python object
 *************************************************************************/
export var PyObject = class {
    constructor() {
        this.__init__.apply(this, arguments)
    }

    toString() {
        return this.__str__()
    }

    __init__() {}

    __repr__() {
        return '<' + this.__class__.__name__ + ' 0x...>'
    }

    __str__() {
        return '<' + this.__class__.__name__ + ' 0x...>'
    }

    @python({
        args: ['name']
    })
    __getattribute__(name) {
        let attr = this[name]

        if (attr === undefined) {
            throw new AttributeError(
                "'" + this.__class__.__name__ + "' object has no attribute '" + name + "'"
            )
        }

        let value
        if (attr.__get__) {
            value = attr.__get__(this, this.__class__)
        } else {
            value = attr
        }

        return value
    }

    @python({
        args: ['name', 'value']
    })
    __setattr__(name, value) {
        let attr = this[name]
        if (attr !== undefined && attr.__set__ !== undefined) {
            call_method(this, '__set__', value)
        } else {
            this[name] = value
        }
    }

    @python({
        args: ['name']
    })
    __delattr__(name) {
        var attr = this[name]
        if (attr.__delete__ !== undefined) {
            attr.__delete__(this)
        } else {
            delete this[name]
        }
    }
}

// Set the type properties of the PyObject class
PyObject.prototype.__doc__ = 'The most base type'

/*************************************************************************
 * A Python Type
 *************************************************************************/
export var PyType = class {
    constructor(name, bases, attrs) {
        this.__name__ = name
        if (bases && Array.isArray(bases) && bases.length > 0) {
            this.__base__ = bases[0]
            this.__bases__ = bases.slice()
        } else if (name == 'object') {
            this.__base__ = null
            this.__bases__ = []
        } else {
            this.__base__ = PyObject.__class__
            this.__bases__ = [PyObject.__class__]
        }
        this.attrs = attrs
    }

    __repr__() {
        // True primitive types won't have __bases__ defined.
        if (this.__bases__) {
            if (this.attrs) {
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

    __call__() {
        return new this.$pyclass(...arguments)
    }

    @python({
        args: ['name', 'value']
    })
    __setattr__(name, value) {
        if (Object.getPrototypeOf(this) === PyType) {
            throw new TypeError(
                "can't set attributes of built-in/extension type '" + this.__name__ + "'"
            )
        }

        this[name] = value
    }

    @python({
        args: ['name']
    })
    __delattr__(name) {
        if (this.attrs) {
            throw new AttributeError(name)
        }

        if (['int', 'str'].indexOf(this.__name__) > -1) {
            throw new TypeError("can't set attributes of built-in/extension type '" + this.__name__ + "'")
        }

        var attr = this.prototype[name]
        if (attr === undefined) {
            throw new AttributeError(
                "type object '" + this.__name__ + "' has no attribute '" + name + "'"
            )
        }

        delete this[name]
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
                for (let base of this.__bases__) {
                    let submros = base.mro()
                    for (let submro of submros) {
                        // // If the base class is already in the MRO,
                        // // push it to the end of the MRO list.
                        // let index = this.__mro__.indexOf(submro)
                        // if (index == -1) {
                        //     this.__mro__.splice(index, 1)
                        // }
                        this.__mro__.push(submro)
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
PyType.prototype.__doc__ = "type(object_or_name, bases, dict)\ntype(object) -> the object's type\ntype(name, bases, dict) -> a new type"

/*************************************************************************
 * Method for adding types to Python class hierarchy
 *************************************************************************/

export function create_pyclass(Class, name, bases=[]) {
    let py_bases = []
    for (let base of bases) {
        py_bases.push(base.__class__)
    }
    let type = new PyType(name, py_bases)

    type.$pyclass = Class

    Class.__class__ = type
    Class.prototype.__class__ = type

    if (Class.prototype.__doc__ === undefined) {
        Class.prototype.__doc__ = ''
    }
    type.__doc__ = Class.prototype.__doc__

    // Iterate over base classes, adding any methods from
    // the bases that aren't natively defined on the class
    // itself.
    // console.log(Class.__class__.__name__)
    for (var base of type.__bases__) {
        // console.log('  ' + base.__name__)
        for (var attr of Object.getOwnPropertyNames(base.$pyclass.prototype)) {
            // console.log('    attr ' + attr)
            if (!Class.prototype.hasOwnProperty(attr)) {
                Class.prototype[attr] = base.$pyclass.prototype[attr]
            //    console.log ('      copied from ' + base.__name__)
            // } else {
            //     console.log ('    already exists')
            }
        }
    }

    return type
}

// Now that we have PyType and PyObject, we can start setting them up
create_pyclass(PyObject, 'object')
create_pyclass(PyType, 'type')

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
 * An implementation of NoneType
 *************************************************************************/
export var PyNoneType = class extends PyObject {
    __init__() {
        call_super(this, '__init__', arguments)
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
            throw new AttributeError("'NoneType' object has no attribute '" + attr + "'")
        } else {
            throw new AttributeError("'NoneType' object attribute '" + attr + "' is read-only")
        }
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
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

    __le__(other) {
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

    __eq__(other) {
        return other === this
    }

    __ne__(other) {
        return other !== this
    }

    __gt__(other) {
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

    __ge__(other) {
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

    __contains__(other) {
        return false
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        throw new TypeError("bad operand type for unary +: 'NoneType'")
    }

    __neg__() {
        throw new TypeError("bad operand type for unary -: 'NoneType'")
    }

    __not__() {
        return true
    }

    __invert__() {
        throw new TypeError("bad operand type for unary ~: 'NoneType'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + type_name(other) + "'")
    }

    __div__(other) {
        return PyNoneType.__truediv__(other)
    }

    __floordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't take floor of complex number.")
        } else {
            throw new TypeError("unsupported operand type(s) for //: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __truediv__(other) {
        throw new TypeError("unsupported operand type(s) for /: 'NoneType' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [types.PyList, types.PyTuple, types.PyStr, types.PyBytes, types.PyBytearray])) {
            throw new TypeError("can't multiply sequence by non-int of type 'NoneType'")
        } else {
            throw new TypeError("unsupported operand type(s) for *: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't mod complex numbers.")
        } else {
            throw new TypeError("unsupported operand type(s) for %: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __add__(other) {
        throw new TypeError("unsupported operand type(s) for +: 'NoneType' and '" + type_name(other) + "'")
    }

    __sub__(other) {
        throw new TypeError("unsupported operand type(s) for -: 'NoneType' and '" + type_name(other) + "'")
    }

    __getitem__(other) {
        throw new TypeError("'NoneType' object is not subscriptable")
    }

    __lshift__(other) {
        throw new TypeError("unsupported operand type(s) for <<: 'NoneType' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw new TypeError("unsupported operand type(s) for >>: 'NoneType' and '" + type_name(other) + "'")
    }

    __and__(other) {
        throw new TypeError("unsupported operand type(s) for &: 'NoneType' and '" + type_name(other) + "'")
    }

    __xor__(other) {
        throw new TypeError("unsupported operand type(s) for ^: 'NoneType' and '" + type_name(other) + "'")
    }

    __or__(other) {
        throw new TypeError("unsupported operand type(s) for |: 'NoneType' and '" + type_name(other) + "'")
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't take floor of complex number.")
        } else {
            throw new TypeError("unsupported operand type(s) for //=: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __itruediv__(other) {
        throw new TypeError("unsupported operand type(s) for /=: 'NoneType' and '" + type_name(other) + "'")
    }

    __iadd__(other) {
        throw new TypeError("unsupported operand type(s) for +=: 'NoneType' and '" + type_name(other) + "'")
    }

    __isub__(other) {
        throw new TypeError("unsupported operand type(s) for -=: 'NoneType' and '" + type_name(other) + "'")
    }

    __imul__(other) {
        if (types.isinstance(other, [types.PyList, types.PyTuple, types.PyStr, types.PyBytes, types.PyBytearray])) {
            throw new TypeError("can't multiply sequence by non-int of type 'NoneType'")
        } else {
            throw new TypeError("unsupported operand type(s) for *=: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __imod__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't mod complex numbers.")
        } else {
            throw new TypeError("unsupported operand type(s) for %=: 'NoneType' and '" + type_name(other) + "'")
        }
    }

    __ipow__(other) {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + type_name(other) + "'")
    }

    __ilshift__(other) {
        throw new TypeError("unsupported operand type(s) for <<=: 'NoneType' and '" + type_name(other) + "'")
    }

    __irshift__(other) {
        throw new TypeError("unsupported operand type(s) for >>=: 'NoneType' and '" + type_name(other) + "'")
    }

    __iand__(other) {
        throw new TypeError("unsupported operand type(s) for &=: 'NoneType' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        throw new TypeError("unsupported operand type(s) for ^=: 'NoneType' and '" + type_name(other) + "'")
    }

    __ior__(other) {
        throw new TypeError("unsupported operand type(s) for |=: 'NoneType' and '" + type_name(other) + "'")
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
