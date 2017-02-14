
/*************************************************************************
 * A base Python object
 *************************************************************************/
function PyObject() {
    Object.call(this);

    // Iterate over base classes in reverse order.
    // Ignore the class at position 0, because that will
    // be self.
    var bases = this.__class__.mro();
    for (var b = bases.length - 1; b >= 1; b--) {
        var klass = bases[b].$pyclass.prototype;
        for (var attr in klass) {
            if (this[attr] === undefined) {
                this[attr] = klass[attr];
            }
        }
    }
}

PyObject.prototype.__doc__ = "The most base type";

PyObject.prototype.toString = function() {
    return '<' + this.__class__.__name__ + ' 0x...>';
}

PyObject.prototype.__getattr__ = function(name) {
    var native = require('../native');

    var attr = native.getattr(this, name);

    // If the returned object is a descriptor, invoke it.
    // Otherwise, the returned object *is* the value.
    var value;
    if (attr.__get__ !== undefined) {
        value = attr.__get__(this, this.__class__);
    } else {
        value = attr;
    }

    return value;
}

PyObject.prototype.__setattr__ = function(name, value) {
    var type_name = require('./Type').type_name;
    var exceptions = require('../exceptions');

    if (Object.getPrototypeOf(this) === PyObject) {
        throw new exceptions.AttributeError.$pyclass("'" + type_name(this) +
            "' object has no attribute '" + name + "'"
        );
    }

    var attr = this[name];
    if (attr !== undefined && attr.__set__ !== undefined) {
        attr.__set__(this, value);
    } else {
        this[name] = value;
    }
}

PyObject.prototype.__delattr__ = function(name) {
    var type_name = require('./Type').type_name;
    var exceptions = require('../exceptions');

    var attr = this[name];
    if (attr === undefined) {
        throw new exceptions.AttributeError.$pyclass("'" + type_name(this) +
            "' object has no attribute '" + name + "'"
        );
    }

    if (attr.__delete__ !== undefined) {
        attr.__delete__(this);
    } else {
        delete this[name];
    }
}

module.exports = PyObject;
