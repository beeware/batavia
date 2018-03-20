import { call_function, pyargs } from './callables'
import { pyAttributeError, pyBataviaError, pyTypeError } from './exceptions'
import * as version from './version'

import * as types from '../types'

/*************************************************************************
 * A proxy handler implementing the Python attribute access and
 * function call protocols.
 *************************************************************************/

let pydescriptor = function(self) {
    return {
        get: function(facade, attr) {
            let value
            if (attr === Symbol.toPrimitive) {
                value = self.__getattribute__.call(self.$proxy, '__repr__')
            } else if (attr === '$raw') {
                // object.$raw returns the native, unproxied instance
                value = self
            } else if (attr[0] === '$') {
                // Any other attribute starting with $ is inspected directly
                // on the object, rather than with __getattribute__
                value = self[attr]
            } else if (attr === 'valueOf') {
                // valueOf is a special case; redirect to the javascript object directly
                value = self.valueOf
            } else if (attr === 'toString') {
                // toString is a special case; redirect to the javascript object directly
                value = self.toString
            } else {
                value = self.__getattribute__.call(self.$proxy, attr)
            }
            return value
        },
        set: function(facade, attr, value) {
            // if (attr.match(/^-?\d+$/)) {
            //     // Javascript uses [] for attribute access and for list access
            //     // if the attribute name is a number, redirect to __setitem__,
            //     // rather than __setattr__
            //     self.__setitem__.call(self.$proxy, attr, value)
            // } else
            if (attr[0] === '$') {
                // Any attribute starting with $ is set directly on the
                // instance.
                self[attr] = value
            } else {
                self.__setattr__.call(self.$proxy, attr, value)
            }
            return true
        },
        deleteProperty: function(facade, attr) {
            // if (attr.match(/^-?\d+$/)) {
            //     // Javascript uses [] for attribute access and for list access
            //     // if the attribute name is a number, redirect to __delitem__,
            //     // rather than __delattr__
            //     self.__delitem__.call(self.$proxy, attr)
            // } else
            if (attr[0] === '$') {
                // Any attribute starting with $ is set directly on the
                // instance.
                delete self[attr]
            } else {
                self.__delattr__.call(self.$proxy, attr)
            }
            return true
        },
        apply: function(facade, that, args) {
            return call_function(self.$proxy, self.$proxy, args)

            // let func = self.$proxy.__call__
            // if (func) {
            //     return call_function(self.$proxy, func, args)
            // } else {
                // throw pyTypeError(`${this.__class__.__name__} object is not callable`)
            // }
        },
        construct: function(facade, args) {
            throw pyBataviaError('Python objects should be constructed by invocation')
        }
    }
}

/*************************************************************************
 * A Python Type
 *************************************************************************/
class PyType {
    constructor(name, bases, attrs) {
        this.__name__ = name
        this.__module__ = null
        if (bases && Array.isArray(bases) && bases.length > 0) {
            this.__base__ = bases[0]
            this.__bases__ = bases.slice()
        } else if (name === 'object' || name === 'type') {
            this.__base__ = null
            this.__bases__ = []
        } else {
            this.__base__ = pyobject
            this.__bases__ = [pyobject]
        }

        if (attrs === null) {
            this.$builtin = true
            this.$attrs = {}
        } else {
            this.$builtin = false
            this.$attrs = attrs
        }
    }

    __call__() {
        if (this.__name__ === 'str' || this.__name__ === 'bool' ||
            this.__name__ === 'tuple' || this.__name__ === 'list') {
            // Str, Bool, List and Tuple are unusual types, because they
            // extend primitive objects, rather than PyObject.
            // We have to treat the constructors a little differently.
            // We have to use a named-based comparison to resolve circular
            // dependencies.
            return new this.$pyclass(...arguments)
        } else {
            function obj_facade() {} // eslint-disable-line no-inner-declarations
            obj_facade.obj = new this.$pyclass()

            obj_facade.obj.$pyclass = this.$pyclass
            obj_facade.obj.__class__ = this

            obj_facade.obj.$proxy = new Proxy(obj_facade, pydescriptor(obj_facade.obj))
            call_function(obj_facade.obj.$proxy, obj_facade.obj.$proxy.__init__, Array.from(arguments))
            return obj_facade.obj.$proxy
        }
    }

    /**************************************************
     * String representation
     **************************************************/

    __repr__() {
        if (this.__module__ !== null) {
            return `<class '${this.__module__}.${this.__name__}'>`
        }
        return `<class '${this.__name__}'>`
    }

    __str__() {
        if (this.__module__ !== null) {
            return `<class '${this.__module__}.${this.__name__}'>`
        }
        return `<class '${this.__name__}'>`
    }

    toString() {
        return this.__str__()
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__() {
        return true
    }

    /**************************************************
     * Attribute access
     **************************************************/

    @pyargs({
        args: ['name']
    })
    __getattribute__(name) {
        let attr
        let rawthis = this.$raw

        // Inspect the type instance for the attribute
        // This should only be __base__, __bases__, __name__ or __dict__
        attr = rawthis[name]

        // All other class attributes are stored on the $attrs
        // of the type.
        if (attr === undefined) {
            attr = rawthis.$attrs[name]
        }

        if (attr === undefined) {
            throw pyAttributeError(
                `type object '${this.__name__}' has no attribute '${name}'`
            )
        }

        return attr
    }

    @pyargs({
        args: ['name', 'value']
    })
    __setattr__(name, value) {
        if (this.$builtin) {
            throw pyTypeError(
                `can't set attributes of built-in/extension type '${this.__name__}'`
            )
        }

        this.$attrs[name] = value
    }

    @pyargs({
        args: ['name']
    })
    __delattr__(name) {
        if (this.$builtin) {
            throw pyTypeError(`can't set attributes of built-in/extension type '${this.__name__}'`)
        }

        if (name in this.$attrs) {
            delete this.$attrs[name]
        } else {
            throw pyAttributeError(name)
        }
    }

    mro() {
        // Cache the MRO on the $mro attribute
        if (this.$mro === undefined) {
            // Self is always the first port of call for the MRO
            this.$mro = [this]
            let bases = this.__bases__
            if (bases) {
                // Now traverse and add the base classes.
                for (let base of bases) {
                    let submros = base.$raw.mro.call(base)
                    for (let submro of submros) {
                        // // If the base class is already in the MRO,
                        // // push it to the end of the MRO list.
                        // let index = this.$mro.indexOf(submro)
                        // if (index == -1) {
                        //     this.$mro.splice(index, 1)
                        // }
                        this.$mro.push(submro)
                    }
                }
            } else {
                // Primitives have no base class;
                this.$mro = [this]
            }
        }
        return this.$mro
    }
}
PyType.prototype.__doc__ = `type(object_or_name, bases, dict)
type(object) -> the object's type
type(name, bases, dict) -> a new type`

/*************************************************************************
 * A base Python object
 *
 * Python objects should be constructed by calling them, *not* with
 * the `new` operator. If you use `new`, the full constructor won't be
 * invoked.
 *************************************************************************/
export class PyObject {
    @pyargs({
        surplus_args_error: 'object() takes no parameters'
    })
    __init__() {
    }

    /**************************************************
     * String representation
     **************************************************/

    @pyargs({})
    __repr__() {
        return `<${this.__class__.__name__} object at 0x99999999>`
    }

    @pyargs({})
    __str__() {
        return this.__repr__()
    }

    toString() {
        return this.__str__()
    }

    /**************************************************
     * Attribute access
     **************************************************/

    @pyargs({
        args: ['name']
    })
    __getattr__(name) {
        throw pyAttributeError(`'${this.__class__.__name__}' object has no attribute '${name}'`)
    }

    @pyargs({
        args: ['name']
    })
    __getattribute__(name) {
        let attr
        let rawthis = this.$raw
        // Check if the object instance has an attribute of that name.
        // The attribute must be *directly* on the instance to match.
        if (rawthis.hasOwnProperty(name)) {
            attr = rawthis[name]
        } else {
            // No attribute on the objet instance;
            // Walk the inheritance chain looking for a class attribute.
            let i = 0
            let mro = rawthis.__class__.mro()
            let base = mro[i]
            while (attr === undefined && base) {
                let rawbase = base.$raw

                // First option - Look for an attribute defined on the base type
                attr = base.$attrs[name]

                // Second option - Look for a method defined on the base type
                if (attr === undefined) {
                    if (rawbase.$pyclass.prototype.hasOwnProperty(name)) {
                        attr = rawbase.$pyclass.prototype[name]
                    }
                }

                i = i + 1
                base = mro[i]
            }

            if (attr === undefined) {
                throw pyAttributeError(
                    `'${this.__class__.__name__}' object has no attribute '${name}'`
                )
            }
        }

        let value
        let rawattr
        if (attr) {
            rawattr = attr.$raw
        }

        if (rawattr && rawattr.__get__) {
            value = rawattr.__get__.call(attr, this)
        } else {
            value = attr
        }
        return value
    }

    @pyargs({
        args: ['name', 'value']
    })
    __setattr__(name, value) {
        let rawthis = this.$raw
        if (rawthis.__class__.$builtin) {
            throw pyTypeError(
                `can't set attributes of built-in/extension type '${this.__class__.__name__}'`
            )
        }

        let attr, rawattr
        if (rawthis.hasOwnProperty(name)) {
            attr = rawthis[name]
            if (attr) {
                rawattr = attr.$raw
            }
            if (rawattr && rawattr.hasOwnProperty('__set__')) {
                rawattr.__set__.call(attr, this, value)
            } else {
                rawthis[name] = value
            }
        } else {
            rawthis[name] = value
        }
    }

    @pyargs({
        args: ['name']
    })
    __delattr__(name) {
        let rawthis = this.$raw
        let attr, rawattr
        if (rawthis.hasOwnProperty(name)) {
            attr = rawthis[name]
            if (attr) {
                rawattr = attr.$raw
            }
            if (rawattr && rawattr.hasOwnProperty('__set__')) {
                rawattr.__del__.call(attr, this)
            } else {
                delete rawthis[name]
            }
        } else {
            throw pyAttributeError(
                `'${this.__class__.__name__}' object has no attribute '${name}'`
            )
        }

        try {
            this[name].__del__(this)
        } catch (e) {
            delete this[name]
        }
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        throw pyTypeError(`bad operand type for unary +: '${this.__class__.__name__}'`)
    }

    __neg__() {
        throw pyTypeError(`bad operand type for unary -: '${this.__class__.__name__}'`)
    }

    __not__() {
        throw pyTypeError(`bad operand type for unary not: '${this.__class__.__name__}'`)
    }

    __invert__() {
        throw pyTypeError(`bad operand type for unary ~: '${this.__class__.__name__}'`)
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw pyTypeError(`unsupported operand type(s) for ** or pow(): '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __div__(other) {
        return pyNoneType.__truediv__(other)
    }

    __floordiv__(other) {
        if (types.isinstance(other, types.pycomplex)) {
            throw pyTypeError("can't take floor of complex number.")
        } else {
            throw pyTypeError(`unsupported operand type(s) for //: '${this.__class__.__name__}' and '${type_name(other)}'`)
        }
    }

    __truediv__(other) {
        throw pyTypeError(`unsupported operand type(s) for /: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __mul__(other) {
        if (types.isinstance(other, [types.pylist, types.pytuple, types.pystr, types.pybytes, types.pybytearray])) {
            throw pyTypeError(`can't multiply sequence by non-int of type '${this.__class__.__name__}'`)
        } else {
            throw pyTypeError(`unsupported operand type(s) for *: '${this.__class__.__name__}' and '${type_name(other)}'`)
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.pycomplex)) {
            throw pyTypeError("can't mod complex numbers.")
        } else {
            throw pyTypeError(`unsupported operand type(s) for %: '${this.__class__.__name__}' and '${type_name(other)}'`)
        }
    }

    __add__(other) {
        throw pyTypeError(`unsupported operand type(s) for +: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __sub__(other) {
        throw pyTypeError(`unsupported operand type(s) for -: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __getitem__(other) {
        throw pyTypeError(`'${this.__class__.__name__}' object is not subscriptable`)
    }

    __lshift__(other) {
        throw pyTypeError(`unsupported operand type(s) for <<: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __rshift__(other) {
        throw pyTypeError(`unsupported operand type(s) for >>: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __and__(other) {
        throw pyTypeError(`unsupported operand type(s) for &: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __xor__(other) {
        throw pyTypeError(`unsupported operand type(s) for ^: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __or__(other) {
        throw pyTypeError(`unsupported operand type(s) for |: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__(other) {
        if (types.isinstance(other, types.pycomplex)) {
            throw pyTypeError("can't take floor of complex number.")
        } else {
            throw pyTypeError(`unsupported operand type(s) for //=: '${this.__class__.__name__}' and '${type_name(other)}'`)
        }
    }

    __itruediv__(other) {
        throw pyTypeError(`unsupported operand type(s) for /=: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __iadd__(other) {
        throw pyTypeError(`unsupported operand type(s) for +=: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __isub__(other) {
        throw pyTypeError(`unsupported operand type(s) for -=: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __imul__(other) {
        if (types.isinstance(other, [types.pylist, types.pytuple, types.pystr, types.pybytes, types.pybytearray])) {
            throw pyTypeError(`can't multiply sequence by non-int of type '${this.__class__.__name__}'`)
        } else {
            throw pyTypeError(`unsupported operand type(s) for *=: '${this.__class__.__name__}' and '${type_name(other)}'`)
        }
    }

    __imod__(other) {
        if (types.isinstance(other, types.pycomplex)) {
            throw pyTypeError("can't mod complex numbers.")
        } else {
            throw pyTypeError(`unsupported operand type(s) for %=: '${this.__class__.__name__}' and '${type_name(other)}'`)
        }
    }

    __ipow__(other) {
        throw pyTypeError(`unsupported operand type(s) for ** or pow(): '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __ilshift__(other) {
        throw pyTypeError(`unsupported operand type(s) for <<=: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __irshift__(other) {
        throw pyTypeError(`unsupported operand type(s) for >>=: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __iand__(other) {
        throw pyTypeError(`unsupported operand type(s) for &=: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __ixor__(other) {
        throw pyTypeError(`unsupported operand type(s) for ^=: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }

    __ior__(other) {
        throw pyTypeError(`unsupported operand type(s) for |=: '${this.__class__.__name__}' and '${type_name(other)}'`)
    }
}
PyObject.prototype.__doc__ = 'The most base type'

/*************************************************************************
 * Method for adding types to Python class hierarchy
 *************************************************************************/

// Method for types defined in Python code
export function type(object_or_name, bases, dict) {
    if (bases === undefined && dict === undefined) {
        return object_or_name.__class__
    } else {
        function type_facade() {} // eslint-disable-line no-inner-declarations
        type_facade.new_type = new PyType(object_or_name, bases, dict.$raw.valueOf())
        type_facade.new_type.$proxy = new Proxy(type_facade, pydescriptor(type_facade.new_type))

        class PyClass extends PyObject {}

        type_facade.new_type.$pyclass = PyClass
        type_facade.new_type.__class__ = pytype
        type_facade.new_type.__module__ = '__main__'

        return type_facade.new_type.$proxy
    }
}
type.__name__ = 'type'
type.__doc__ = `type(object_or_name, bases, dict)
type(object) -> the object's type
type(name, bases, dict) -> a new type`
type.$pyargs = {
    args: ['object_or_name'],
    default_args: ['bases', 'dict'],
    missing_args_error: (e) => 'type() takes 1 or 3 arguments'
}

// Method for types defined as Javascript classes
export function jstype(PyClass, name, bases = [], attrs = {}) {
    function jstype_facade() {}
    jstype_facade.pytype = new PyType(name, bases, attrs)
    jstype_facade.pytype.$proxy = new Proxy(jstype_facade, pydescriptor(jstype_facade.pytype))

    jstype_facade.pytype.$pyclass = PyClass
    if (pytype === undefined) {
        jstype_facade.pytype.__class__ = jstype_facade.pytype.$proxy
    } else {
        jstype_facade.pytype.__class__ = pytype
    }

    if (PyClass.prototype.__doc__ === undefined) {
        PyClass.prototype.__doc__ = ''
    }

    return jstype_facade.pytype.$proxy
}

/*************************************************************************
 * Complete the declaration for PyType and PyObject
 *************************************************************************/

export const pytype = jstype(PyType, 'type', [], null)
export const pyobject = jstype(PyObject, 'object', [], null)

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
            if (arg.__class__) {
                return arg.__class__.__name__
            }
    }

    return 'Native object'
}

/*************************************************************************
 * An implementation of pyNoneType
 *************************************************************************/

class PyNoneType extends PyObject {
    /**************************************************
     * Type conversions
     **************************************************/

    __bool__() {
        return false
    }

    __repr__() {
        return 'None'
    }

    __str__() {
        return 'None'
    }

    /**************************************************
     * Attribute manipulation
     **************************************************/

    __setattr__(attr, value) {
        if (this.hasOwnProperty(attr)) {
            throw pyAttributeError(`'NoneType' object attribute '${attr}' is read-only`)
        } else {
            throw pyAttributeError(`'NoneType' object has no attribute '${attr}'`)
        }
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                `unorderable types: NoneType() < '${type_name(other)}'()`
            )
        } else {
            throw pyTypeError(
                `'<' not supported between instances of 'NoneType' and '${type_name(other)}'`
            )
        }
    }

    __le__(other) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                `unorderable types: NoneType() <= '${type_name(other)}'()`
            )
        } else {
            throw pyTypeError(
                `'<=' not supported between instances of 'NoneType' and '${type_name(other)}'`
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
            throw pyTypeError(
                `unorderable types: NoneType() > '${type_name(other)}'()`
            )
        } else {
            throw pyTypeError(
                `'>' not supported between instances of 'NoneType' and '${type_name(other)}'`
            )
        }
    }

    __ge__(other) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                `unorderable types: NoneType() >= '${type_name(other)}'()`
            )
        } else {
            throw pyTypeError(
                `'>=' not supported between instances of 'NoneType' and '${type_name(other)}'`
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

export const pyNoneType = jstype(PyNoneType, 'NoneType', [], undefined)

// Create a singleton instance of pyNone
export const pyNone = pyNoneType()

pyNoneType.__module__ = pyNone
