var exceptions = require('../exceptions')

/*************************************************************************
 * A base Python object
 *************************************************************************/
function PyObject() {
    Object.call(this)

    // Iterate over base classes in reverse order.
    // Ignore the class at position 0, because that will
    // be self.
    var bases = this.__class__.mro()
    for (var b = bases.length - 1; b >= 1; b--) {
        var klass = bases[b].$pyclass.prototype
        for (var attr in klass) {
            if (this[attr] === undefined) {
                this[attr] = klass[attr]
            }
        }
    }
}

PyObject.prototype.__doc__ = 'The most base type'

PyObject.prototype.__format__ = function(val, format_spec) {
    if (typeof format_spec !== 'undefined') {
        throw exceptions.TypeError.$pyclass(
            'non-empty format string passed to object.__format__'
        )
    }
    return val
}

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
    var type_name = require('./Type').type_name
    var exceptions = require('../exceptions')

    if (Object.getPrototypeOf(this) === PyObject) {
        throw new exceptions.AttributeError.$pyclass("'" + type_name(this) +
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
    var type_name = require('./Type').type_name
    var exceptions = require('../exceptions')

    var attr = this[name]
    if (attr === undefined) {
        throw new exceptions.AttributeError.$pyclass("'" + type_name(this) +
            "' object has no attribute '" + name + "'"
        )
    }

    if (attr.__delete__ !== undefined) {
        attr.__delete__(this)
    } else {
        delete this[name]
    }
}

module.exports = PyObject
