import { call_function } from '../core/callables'
import { PyAttributeError, PyTypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject, PyNone } from '../core/types'

/*************************************************************************
 * A Python float type
 *************************************************************************/

export default class Property extends PyObject {
    constructor(fget, fset, fdel, doc) {
        super()

        this.fget = fget
        this.fset = fset
        this.fdel = fdel
        this.doc = doc
    }

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    toString() {
        return this.__str__()
    }

    valueOf() {
        return this.val
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__() {
        return this.val !== 0.0
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        // if (this.expression.getName().startswith("genexpr_"))
        return '<' + type_name(this) + ' object at 0xXXXXXXXX>'
    }

    /**************************************************
     * Attribute manipulation
     **************************************************/

    __get__(instance, klass) {
        // console.log("Property __get__ on " + instance);
        if (this.fget !== PyNone) {
            try {
                return call_function(this.fget, [instance], null)
            } catch (e) {
                throw new PyTypeError("'" + type_name(this) + "' object is not callable")
            }
        } else {
            throw new PyAttributeError("can't get attribute")
        }
    }

    __set__(instance, value) {
        // console.log("Property __set__ on " + instance);
        if (this.fset !== PyNone) {
            try {
                call_function(this.fset, [instance, value], null)
            } catch (e) {
                throw new PyTypeError("'" + type_name(this) + "' object is not callable")
            }
        } else {
            throw new PyAttributeError("can't set attribute")
        }
    }

    __delete__(instance) {
        // console.log("Property __delete__ on " + instance);
        if (this.fdel !== PyNone) {
            try {
                call_function(this.fdel, [instance], null)
            } catch (e) {
                throw new PyTypeError("'" + type_name(this) + "' object is not callable")
            }
        } else {
            throw new PyAttributeError("can't delete attribute")
        }
    }

    /**************************************************
     * Methods
     **************************************************/

    setter(fn) {
        // Duplicate the property, substituting the new setter.
        return new Property(this.fget, fn, this.fdel, this.doc)
    }

    deleter(fn) {
        // Duplicate the property, substituting the new deleter.
        return new Property(this.fget, this.fset, fn, this.doc)
    }
}
create_pyclass(Property, 'property')
