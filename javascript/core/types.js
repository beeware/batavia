import { call_method, call_super, pyargs } from './callables'
import { AttributeError, TypeError } from './exceptions'
import * as version from './version'

import * as types from '../types'

/*************************************************************************
 * A base Python object
 *************************************************************************/
class PyObject {
    constructor() {
        let init = this.__getattribute__('__init__')
        if (init.__call__) {
            init.__call__(...arguments)
        } else {
            init.apply(this, arguments)
        }
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

    @pyargs({
        args: ['name']
    })
    __getattr__(name) {
        throw new AttributeError(
            "'" + this.__class__.__name__ + "' object has no attribute '" + name + "'"
        )
    }

    @pyargs({
        args: ['name']
    })
    __getattribute__(name) {
        let attr = this[name]

        if (attr === undefined) {
            try {
                // No attribute on this instance; look for a class attribute
                attr = this.__class__.__getattribute__(name)
            } catch (e) {
                // No class attribute either; use the descriptor protocol
                attr = this.__getattr__(name)
            }
        }

        let value
        if (attr.__get__) {
            value = attr.__get__(this, this.__class__)
        } else {
            value = attr
        }

        // If attribute is a function, bind the function to the instance
        // that we've retrieved it from.
        if (value instanceof Function) {
            let pyargs = value.$pyargs
            let pytype = value.$pytype
            value = value.bind(this)
            value.$pyargs = pyargs
            value.$pytype = pytype
        }

        return value
    }

    @pyargs({
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

    @pyargs({
        args: ['name']
    })
    __delattr__(name) {
        let attr = this[name]

        if (attr === undefined) {
            throw new AttributeError(
                "'" + this.__class__.__name__ + "' object has no attribute '" + name + "'"
            )
        }

        if (attr.__delete__ !== undefined) {
            attr.__delete__(this)
        } else {
            delete this[name]
        }
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        throw new TypeError("bad operand type for unary +: '" + this.__class__.__name__ + "'")
    }

    __neg__() {
        throw new TypeError("bad operand type for unary -: '" + this.__class__.__name__ + "'")
    }

    __not__() {
        throw new TypeError("bad operand type for unary not: '" + this.__class__.__name__ + "'")
    }

    __invert__() {
        throw new TypeError("bad operand type for unary ~: '" + this.__class__.__name__ + "'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new TypeError("unsupported operand type(s) for ** or pow(): '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __div__(other) {
        return PyNoneType.__truediv__(other)
    }

    __floordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't take floor of complex number.")
        } else {
            throw new TypeError("unsupported operand type(s) for //: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __truediv__(other) {
        throw new TypeError("unsupported operand type(s) for /: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [types.PyList, types.PyTuple, types.PyStr, types.PyBytes, types.PyBytearray])) {
            throw new TypeError("can't multiply sequence by non-int of type '" + this.__class__.__name__ + "'")
        } else {
            throw new TypeError("unsupported operand type(s) for *: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't mod complex numbers.")
        } else {
            throw new TypeError("unsupported operand type(s) for %: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __add__(other) {
        throw new TypeError("unsupported operand type(s) for +: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __sub__(other) {
        throw new TypeError("unsupported operand type(s) for -: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __getitem__(other) {
        throw new TypeError("'" + this.__class__.__name__ + "' object is not subscriptable")
    }

    __lshift__(other) {
        throw new TypeError("unsupported operand type(s) for <<: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw new TypeError("unsupported operand type(s) for >>: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __and__(other) {
        throw new TypeError("unsupported operand type(s) for &: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __xor__(other) {
        throw new TypeError("unsupported operand type(s) for ^: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __or__(other) {
        throw new TypeError("unsupported operand type(s) for |: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't take floor of complex number.")
        } else {
            throw new TypeError("unsupported operand type(s) for //=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __itruediv__(other) {
        throw new TypeError("unsupported operand type(s) for /=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __iadd__(other) {
        throw new TypeError("unsupported operand type(s) for +=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __isub__(other) {
        throw new TypeError("unsupported operand type(s) for -=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __imul__(other) {
        if (types.isinstance(other, [types.PyList, types.PyTuple, types.PyStr, types.PyBytes, types.PyBytearray])) {
            throw new TypeError("can't multiply sequence by non-int of type '" + this.__class__.__name__ + "'")
        } else {
            throw new TypeError("unsupported operand type(s) for *=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __imod__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't mod complex numbers.")
        } else {
            throw new TypeError("unsupported operand type(s) for %=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __ipow__(other) {
        throw new TypeError("unsupported operand type(s) for ** or pow(): '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __ilshift__(other) {
        throw new TypeError("unsupported operand type(s) for <<=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __irshift__(other) {
        throw new TypeError("unsupported operand type(s) for >>=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __iand__(other) {
        throw new TypeError("unsupported operand type(s) for &=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        throw new TypeError("unsupported operand type(s) for ^=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __ior__(other) {
        throw new TypeError("unsupported operand type(s) for |=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }
}

// Set the type properties of the PyObject class
PyObject.prototype.__doc__ = 'The most base type'

/*************************************************************************
 * A Python Type
 *************************************************************************/
class PyType {
    constructor(name, bases, attrs) {
        this.__name__ = name
        if (bases && Array.isArray(bases) && bases.length > 0) {
            this.__base__ = bases[0]
            this.__bases__ = bases.slice()
        } else if (name === 'object') {
            this.__base__ = null
            this.__bases__ = []
        } else {
            this.__base__ = PyObject.__class__
            this.__bases__ = [PyObject.__class__]
        }

        if (attrs === undefined) {
            this.$builtin = true
        }
    }

    __repr__() {
        if (this.$builtin) {
            return "<class '" + this.__name__ + "'>"
        }
        return "<class '__main__." + this.__name__ + "'>"
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

    @pyargs({
        args: ['name']
    })
    __getattribute__(name) {
        let attr = this[name]

        if (attr === undefined && this.$pyclass !== undefined) {
            attr = this.$pyclass.prototype[name]
        }

        if (attr === undefined) {
            throw new AttributeError(
                "type object '" + this.__name__ + "' has no attribute '" + name + "'"
            )
        }

        let value
        if (attr.__get__) {
            value = attr.__get__(this, this.__class__)
        } else {
            value = attr
        }

        // If attribute is a function, bind the function to the instance
        // that we've retrieved it from.
        if (value instanceof Function) {
            let pyargs = value.$pyargs
            let pytype = value.$pytype
            value = value.bind(this)
            value.$pyargs = pyargs
            value.$pytype = pytype
        }

        return value
    }

    @pyargs({
        args: ['name', 'value']
    })
    __setattr__(name, value) {
        if (this.$builtin) {
            throw new TypeError(
                "can't set attributes of built-in/extension type '" + this.__name__ + "'"
            )
        }

        if (this.$pyclass) {
            this.$pyclass.prototype[name] = value
        } else {
            this[name] = value
        }
    }

    @pyargs({
        args: ['name']
    })
    __delattr__(name) {
        if (this.attrs) {
            throw new AttributeError(name)
        }

        if (['int', 'str'].indexOf(this.__name__) > -1) {
            throw new TypeError("can't set attributes of built-in/extension type '" + this.__name__ + "'")
        }

        var attr = this[name]
        if (attr !== undefined) {
            delete this[name]
        } else {
            if (this.$pyclass && this.$pyclass !== undefined && this.$pyclass.prototype[name] !== undefined) {
                delete this.$pyclass.prototype[name]
            } else {
                throw new AttributeError(name)
            }
        }

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
PyType.prototype.__doc__ = `type(object_or_name, bases, dict)
type(object) -> the object's type
type(name, bases, dict) -> a new type`

/*************************************************************************
 * Method for adding types to Python class hierarchy
 *************************************************************************/

function create_pyclass(PyClass, name, bases = [], attrs = undefined) {
    let py_bases = []
    for (let base of bases) {
        py_bases.push(base.__class__)
    }
    let pytype = new PyType(name, py_bases, attrs)

    pytype.$pyclass = PyClass

    PyClass.__class__ = pytype
    PyClass.prototype.__class__ = pytype

    if (PyClass.prototype.__doc__ === undefined) {
        PyClass.prototype.__doc__ = ''
    }
    pytype.__doc__ = PyClass.prototype.__doc__

    // Iterate over base classes, adding any methods from
    // the bases that aren't natively defined on the class
    // itself.
    // console.log(PyClass.__class__.__name__)
    for (var base of pytype.__bases__) {
        // console.log('  ' + base.__name__)
        for (var attr of Object.getOwnPropertyNames(base.$pyclass.prototype)) {
            // console.log('    attr ' + attr)
            if (!PyClass.prototype.hasOwnProperty(attr)) {
                PyClass.prototype[attr] = base.$pyclass.prototype[attr]
            //    console.log ('      copied from ' + base.__name__)
            // } else {
            //     console.log ('    already exists')
            }
        }
    }

    // If attributes are specified, copy all the attributes
    // onto the newly constructed class.
    if (attrs) {
        // Copy in all the attributes that were created
        // as part of object construction.
        for (let attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                PyClass.prototype[attr] = attrs[attr]
                // PyClass[attr] = attrs[attr]
            }
        }
    }

    return pytype
}

// Now that we have PyType and PyObject, we can start setting them up
create_pyclass(PyObject, 'object')
create_pyclass(PyType, 'type')

/*************************************************************************
 * Method for outputting the type of a variable
 *************************************************************************/

function type_name(arg) {
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
class PyNoneType extends PyObject {
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

    __not__() {
        return true
    }
}
create_pyclass(PyNoneType, 'NoneType')

/*************************************************************************
 * Resolve circular reference issues
 *************************************************************************/

// Create a singleton instance of None
const PyNone = new PyNoneType()

// Now that we have an instance of None, we can fill in the blanks where we needed it
PyObject.prototype.__class__.__base__ = PyNone

export {
    PyObject,
    PyType,
    create_pyclass,
    type_name,
    PyNoneType,
    PyNone
}
