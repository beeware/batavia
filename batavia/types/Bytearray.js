var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var None = require('../core').None
var BytearrayIterator = require('./BytearrayIterator')

/*************************************************************************
 * A Python bytearray type
 *************************************************************************/

function Bytearray(val) {
    PyObject.call(this)
    this.val = val
}

create_pyclass(Bytearray, 'bytearray')

Bytearray.prototype.__dir__ = function() {
    var types = require('../types')
    return new types.List(['center', 'title', '__getattribute__', '__setitem__', '__str__', 'index', '__reduce_ex__', 'decode', 'insert', '__format__', '__subclasshook__', '__eq__', 'isalpha', 'count', 'isalnum', '__repr__', 'clear', 'islower', '__delitem__', '__reduce__', 'swapcase', '__mul__', '__iadd__', 'pop', '__new__', 'remove', '__rmul__', 'copy', 'isdigit', 'startswith', '__ne__', 'fromhex', '__le__', 'ljust', '__lt__', 'lstrip', '__sizeof__', '__dir__', '__gt__', 'append', 'splitlines', 'rjust', '__alloc__', 'strip', 'extend', 'istitle', 'reverse', 'partition', '__add__', '__init__', 'isupper', 'translate', '__delattr__', 'endswith', '__contains__', 'replace', '__ge__', '__class__', 'rstrip', 'rfind', 'rpartition', 'maketrans', 'find', 'join', 'upper', 'zfill', 'isspace', 'rsplit', '__imul__', 'expandtabs', '__iter__', 'split', 'capitalize', '__hash__', 'rindex', '__setattr__', '__getitem__', '__doc__', 'lower', '__len__'])
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

Bytearray.prototype.__pow__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__pow__ has not been implemented')
}

Bytearray.prototype.__div__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__div__ has not been implemented')
}

Bytearray.prototype.__floordiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__floordiv__ has not been implemented')
}

Bytearray.prototype.__truediv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__truediv__ has not been implemented')
}

Bytearray.prototype.__mul__ = function(other) {
    throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type '" + type_name(other) + "'")
}

Bytearray.prototype.__mod__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__mod__ has not been implemented')
}

Bytearray.prototype.__add__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Bool)) {
        throw new exceptions.TypeError.$pyclass("can't concat bytearray to " + type_name(other))
    }
}

Bytearray.prototype.__sub__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__sub__ has not been implemented')
}

Bytearray.prototype.__getitem__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__getitem__ has not been implemented')
}

Bytearray.prototype.__lshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__lshift__ has not been implemented')
}

Bytearray.prototype.__rshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__rshift__ has not been implemented')
}

Bytearray.prototype.__and__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__and__ has not been implemented')
}

Bytearray.prototype.__xor__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__xor__ has not been implemented')
}

Bytearray.prototype.__or__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__or__ has not been implemented')
}

/**************************************************
 * Inplace operators
 **************************************************/

Bytearray.prototype.__idiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__idiv__ has not been implemented')
}

Bytearray.prototype.__ifloordiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__ifloordiv__ has not been implemented')
}

Bytearray.prototype.__itruediv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__itruediv__ has not been implemented')
}

Bytearray.prototype.__iadd__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__iadd__ has not been implemented')
}

Bytearray.prototype.__isub__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__isub__ has not been implemented')
}

Bytearray.prototype.__imul__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__imul__ has not been implemented')
}

Bytearray.prototype.__imod__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__imod__ has not been implemented')
}

Bytearray.prototype.__ipow__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__ipow__ has not been implemented')
}

Bytearray.prototype.__ilshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__ilshift__ has not been implemented')
}

Bytearray.prototype.__irshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__irshift__ has not been implemented')
}

Bytearray.prototype.__iand__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__iand__ has not been implemented')
}

Bytearray.prototype.__ixor__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__ixor__ has not been implemented')
}

Bytearray.prototype.__ior__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__ior__ has not been implemented')
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
