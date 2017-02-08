var PyObject = require('../core').Object;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;
var callables = require('../core').callables;
// var None = require('../core').None;

/*************************************************************************
 * A Python float type
 *************************************************************************/

function Property(fget, fset, fdel, doc) {
    PyObject.call(this);

    this.fget = fget;
    this.fset = fset;
    this.fdel = fdel;
    this.doc = doc;
}

Property.prototype = Object.create(PyObject.prototype);
Property.prototype.__class__ = new Type('property');
Property.prototype.constructor = Property;

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Property.prototype.toString = function() {
    return this.__str__();
};

Property.prototype.valueOf = function() {
    return this.val;
};

/**************************************************
 * Type conversions
 **************************************************/

Property.prototype.__bool__ = function() {
    return this.val !== 0.0;
};

Property.prototype.__repr__ = function() {
    return this.__str__();
};

Property.prototype.__str__ = function() {
    // if (this.expression.getName().startswith("genexpr_"))
    return '<' + type_name(this) + ' object at 0xXXXXXXXX>';
};

/**************************************************
 * Attribute manipulation
 **************************************************/

Property.prototype.__get__ = function(instance, klass) {
    // console.log("Property __get__ on " + instance);
    if (this.fget != null) {
        try {
            return callables.run_callable(null, this.fget, [instance], null);
        } catch (e) {
            throw new exceptions.TypeError("'" + type_name(this) + "' object is not callable");
        }
    } else {
        throw new exceptions.AttributeError("can't get attribute");
    }
}

Property.prototype.__set__ = function(instance, value) {
    // console.log("Property __set__ on " + instance);
    if (this.fset != null) {
        try {
            callables.run_callable(null, this.fset, [instance, value], null);
        } catch (e) {
            throw new exceptions.TypeError("'" + type_name(this) + "' object is not callable");
        }
    } else {
        throw new exceptions.AttributeError("can't set attribute");
    }
}

Property.prototype.__delete__ = function(instance) {
    // console.log("Property __delete__ on " + instance);
    if (this.fdel != null) {
        try {
            callables.run_callable(null, this.fdel, [instance], null);
        } catch (e) {
            throw new exceptions.TypeError("'" + type_name(this) + "' object is not callable");
        }
    } else {
        throw new exceptions.AttributeError("can't delete attribute");
    }
}

/**************************************************
 * Methods
 **************************************************/

Property.prototype.setter = function(fn) {
    // Duplicate the property, substituting the new setter.
    return new Property(this.fget, fn, this.fdel, this.doc);
}

Property.prototype.deleter = function(fn) {
    // Duplicate the property, substituting the new deleter.
    return new Property(this.fget, this.fset, fn, this.doc);
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Property;
