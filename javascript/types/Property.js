import { call_function } from '../core/callables'
import { AttributeError, TypeError } from '../core/exceptions'
import { None } from '../core/types/none'
import { PyObject } from '../core/types/object'
import { create_pyclass, type_name } from '../core/types/types'

/*************************************************************************
 * A Python float type
 *************************************************************************/

export default function Property(fget, fset, fdel, doc) {
    PyObject.call(this)

    this.fget = fget
    this.fset = fset
    this.fdel = fdel
    this.doc = doc
}

create_pyclass(Property, 'property')

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Property.prototype.toString = function() {
    return this.__str__()
}

Property.prototype.valueOf = function() {
    return this.val
}

/**************************************************
 * Type conversions
 **************************************************/

Property.prototype.__bool__ = function() {
    return this.val !== 0.0
}

Property.prototype.__repr__ = function() {
    return this.__str__()
}

Property.prototype.__str__ = function() {
    // if (this.expression.getName().startswith("genexpr_"))
    return '<' + type_name(this) + ' object at 0xXXXXXXXX>'
}

/**************************************************
 * Attribute manipulation
 **************************************************/

Property.prototype.__get__ = function(instance, klass) {
    // console.log("Property __get__ on " + instance);
    if (this.fget !== None) {
        try {
            return call_function(this.fget, [instance], null)
        } catch (e) {
            throw new TypeError.$pyclass("'" + type_name(this) + "' object is not callable")
        }
    } else {
        throw new AttributeError.$pyclass("can't get attribute")
    }
}

Property.prototype.__set__ = function(instance, value) {
    // console.log("Property __set__ on " + instance);
    if (this.fset !== None) {
        try {
            call_function(this.fset, [instance, value], null)
        } catch (e) {
            throw new TypeError.$pyclass("'" + type_name(this) + "' object is not callable")
        }
    } else {
        throw new AttributeError.$pyclass("can't set attribute")
    }
}

Property.prototype.__delete__ = function(instance) {
    // console.log("Property __delete__ on " + instance);
    if (this.fdel !== None) {
        try {
            call_function(this.fdel, [instance], null)
        } catch (e) {
            throw new TypeError.$pyclass("'" + type_name(this) + "' object is not callable")
        }
    } else {
        throw new AttributeError.$pyclass("can't delete attribute")
    }
}

/**************************************************
 * Methods
 **************************************************/

Property.prototype.setter = function(fn) {
    // Duplicate the property, substituting the new setter.
    return new Property(this.fget, fn, this.fdel, this.doc)
}

Property.prototype.deleter = function(fn) {
    // Duplicate the property, substituting the new deleter.
    return new Property(this.fget, this.fset, fn, this.doc)
}
