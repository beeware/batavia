var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var None = require('../core').None
var NotImplemented = require('../core').NotImplemented
var BytearrayIterator = require('./BytearrayIterator')
var version = require('../core').version

/*************************************************************************
 * A Python bytearray type
 *************************************************************************/

function Bytearray(val) {
    PyObject.call(this)
    this.val = val
}

create_pyclass(Bytearray, 'bytearray')

Bytearray.prototype.__dir__ = function() {
    // Python 3.6 adds classmethod object.__init_subclass__
    if (!version.earlier(3.6)) {
        return "['__add__', '__alloc__', '__class__', '__contains__', '__delattr__', '__delitem__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__gt__', '__hash__', '__iadd__', '__imul__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__', '__mod__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmod__', '__rmul__', '__setattr__', '__setitem__', '__sizeof__', '__str__', '__subclasshook__', 'append', 'capitalize', 'center', 'clear', 'copy', 'count', 'decode', 'endswith', 'expandtabs', 'extend', 'find', 'fromhex', 'hex', 'index', 'insert', 'isalnum', 'isalpha', 'isdigit', 'islower', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'pop', 'remove', 'replace', 'reverse', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill']"
    } else {
        return "['__add__', '__alloc__', '__class__', '__contains__', '__delattr__', '__delitem__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__gt__', '__hash__', '__iadd__', '__imul__', '__init__', '__iter__', '__le__', '__len__', '__lt__', '__mod__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmod__', '__rmul__', '__setattr__', '__setitem__', '__sizeof__', '__str__', '__subclasshook__', 'append', 'capitalize', 'center', 'clear', 'copy', 'count', 'decode', 'endswith', 'expandtabs', 'extend', 'find', 'fromhex', 'hex', 'index', 'insert', 'isalnum', 'isalpha', 'isdigit', 'islower', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'pop', 'remove', 'replace', 'reverse', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill']"
    }

}

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Bytearray.prototype.toString = function() {
    return this.__str__()
}

Bytearray.prototype.valueOf = function() {
    return this.val
}

/**************************************************
 * Type conversions
 **************************************************/

Bytearray.prototype.__bool__ = function() {
    return this.val.__bool__()
}

Bytearray.prototype.__repr__ = function() {
    return this.__str__()
}

Bytearray.prototype.__str__ = function() {
    return 'bytearray(' + this.val.toString() + ')'
}

Bytearray.prototype.__iter__ = function() {
    if (this.val.__iter__) {
        return this.val.__iter__()
    } else {
        return new BytearrayIterator(this.val)
    }
}

/**************************************************
 * Comparison operators
 **************************************************/

Bytearray.prototype.__lt__ = function(other) {
    if (other !== None) {
        return this.valueOf() < other
    }
    return false
}

Bytearray.prototype.__le__ = function(other) {
    if (other !== None) {
        return this.valueOf() <= other
    }
    return false
}

Bytearray.prototype.__eq__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        var val
        if (types.isinstance(other, [types.Bool, types.Int, types.Float])) {
            return false
        } else {
            return this.valueOf() === val
        }
    }
    return this.valueOf() === ''
}

Bytearray.prototype.__ne__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        var val
        if (types.isinstance(other, [types.Bool, types.Int, types.Float])) {
            return true
        } else {
            return this.valueOf() !== val
        }
    }
    return this.valueOf() !== ''
}

Bytearray.prototype.__gt__ = function(other) {
    if (other !== None) {
        return this.valueOf() > other
    }
    return false
}

Bytearray.prototype.__ge__ = function(other) {
    if (other !== None) {
        return this.valueOf() >= other
    }
    return false
}

Bytearray.prototype.__contains__ = function(other) {
    if (other !== None) {
        return this.valueOf().hasOwnProperty(other)
    }
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

Bytearray.prototype.__pos__ = function() {
    return new Bytearray(+this.valueOf())
}

Bytearray.prototype.__neg__ = function() {
    return new Bytearray(-this.valueOf())
}

Bytearray.prototype.__not__ = function() {
    return new Bytearray(!this.valueOf())
}

Bytearray.prototype.__invert__ = function() {
    return new Bytearray(~this.valueOf())
}

/**************************************************
 * Binary operators
 **************************************************/

Bytearray.prototype.__mul__ = function(other) {
    throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type '" + type_name(other) + "'")
}

Bytearray.prototype.__add__ = function(other) {
    let Buffer = require('buffer').Buffer
    let types = require('../types')
    if (types.isinstance(other, types.Bytearray)) {
        let combined_bytes = new types.Bytes(Buffer.concat([this.val.val, other.val.val]))
        return new Bytearray(combined_bytes)
    } else if (types.isinstance(other, types.Bytes)) {
        let combined_bytes = new types.Bytes(Buffer.concat([this.val.val, other.val]))
        return new Bytearray(combined_bytes)
    } else {
        throw new exceptions.TypeError.$pyclass("can't concat bytearray to " + type_name(other))
    }
}

Bytearray.prototype.__getitem__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__getitem__ has not been implemented')
}

/**************************************************
 * Inplace operators
 **************************************************/

Bytearray.prototype.__iadd__ = function(other) {
    let Buffer = require('buffer').Buffer
    let types = require('../types')
    if (types.isinstance(other, types.Bytearray)) {
        let combined_bytes = new types.Bytes(Buffer.concat([this.val.val, other.val.val]))
        this.val = combined_bytes
        return this
    } else if (types.isinstance(other, types.Bytes)) {
        let combined_bytes = new types.Bytes(Buffer.concat([this.val.val, other.val]))
        this.val = combined_bytes
        return this
    } else {
        throw new exceptions.TypeError.$pyclass("can't concat bytearray to " + type_name(other))
    }
}

/**************************************************
 * Right-hand operators
 **************************************************/

Bytearray.prototype.__rmul__ = function(other) {
    return this.__mul__(other)
}

Bytearray.prototype.__rmod__ = function(other) {
    return NotImplemented
}

Bytearray.prototype.__rmul__ = function(other) {
    return NotImplemented
}

/**************************************************
 * Methods
 **************************************************/

Bytearray.prototype.copy = function() {
    return new Bytearray(this.valueOf())
}

Bytearray.prototype.__len__ = function() {
    return this.val.__len__()
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Bytearray
