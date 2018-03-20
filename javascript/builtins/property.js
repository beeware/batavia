import { pyargs } from '../core/callables'
import { pyAttributeError, pyTypeError } from '../core/exceptions'
import { jstype, type_name, PyObject, pyNone } from '../core/types'

/*************************************************************************
 * A Python property
 *************************************************************************/

class PyProperty extends PyObject {
    @pyargs({
        default_args: ['fget', 'fset', 'fdel', 'doc']
    })
    __init__(fget, fset, fdel, doc) {
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
        return this.$val
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__() {
        return this.$val !== 0.0
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
        if (this.fget !== pyNone) {
            try {
                return this.fget(instance)
            } catch (e) {
                throw pyTypeError("'" + type_name(this) + "' object is not callable")
            }
        } else {
            throw pyAttributeError("can't get attribute")
        }
    }

    __set__(instance, value) {
        // console.log("Property __set__ on " + instance);
        if (this.fset !== pyNone) {
            try {
                this.fset(instance, value)
            } catch (e) {
                throw pyTypeError("'" + type_name(this) + "' object is not callable")
            }
        } else {
            throw pyAttributeError("can't set attribute")
        }
    }

    __delete__(instance) {
        // console.log("Property __delete__ on " + instance);
        if (this.fdel !== pyNone) {
            try {
                this.fdel(instance)
            } catch (e) {
                throw pyTypeError("'" + type_name(this) + "' object is not callable")
            }
        } else {
            throw pyAttributeError("can't delete attribute")
        }
    }

    /**************************************************
     * Methods
     **************************************************/

    setter(fn) {
        // Duplicate the property, substituting the new setter.
        return new PyProperty(this.fget, fn, this.fdel, this.doc)
    }

    deleter(fn) {
        // Duplicate the property, substituting the new deleter.
        return new PyProperty(this.fget, this.fset, fn, this.doc)
    }
}
PyProperty.prototype.__doc__ = `property(fget=pyNone, fset=pyNone, fdel=pyNone, doc=pyNone) -> property attribute

fget is a function to be used for getting an attribute value, and likewise
fset is a function for setting, and fdel a function for del'ing, an
attribute.  Typical use is to define a managed attribute x:

class C(object):
    def getx(self): return self._x
    def setx(self, value): self._x = value
    def delx(self): del self._x
    x = property(getx, setx, delx, "I'm the 'x' property.")

Decorators make defining new properties or modifying existing ones easy:

class C(object):
    @property
    def x(self):
        "I am the 'x' property."
        return self._x
    @x.setter
    def x(self, value):
        self._x = value
    @x.deleter
    def x(self):
        del self._x
`

const property = jstype(PyProperty, 'property')
export default property
