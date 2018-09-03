/*************************************************************************
 * An implementation of NotImplementedType
 *************************************************************************/
var PyObject = require('./Object')
var basic_types = require('./Type')
var exceptions = require('../exceptions')
var version = require('../version')

function NotImplementedType() {
    PyObject.call(this)
}

NotImplementedType.prototype = Object.create(PyObject.prototype)
NotImplementedType.prototype.__class__ = new basic_types.Type('NotImplementedType')

NotImplementedType.prototype.__dir__ = function() {
    return "['__class__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__le__', '__lt__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__']"
}

/**************************************************
 * Javascript compatibility methods
 **************************************************/

NotImplementedType.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

NotImplementedType.prototype.__bool__ = function() {
    var types = require('../../types')
    return new types.Bool(true)
}

NotImplementedType.prototype.__repr__ = function() {
    return this.__str__()
}

NotImplementedType.prototype.__str__ = function() {
    return 'NotImplemented'
}

/**************************************************
 * Comparison operators
 **************************************************/

NotImplementedType.prototype.__lt__ = function(other) {
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: NotImplementedType() < ' + basic_types.type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'<' not supported between instances of 'NotImplementedType' and '" +
            basic_types.type_name(other) + "'"
        )
    }
}

NotImplementedType.prototype.__le__ = function(other) {
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: NotImplementedType() <= ' + basic_types.type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'<=' not supported between instances of 'NotImplementedType' and '" +
            basic_types.type_name(other) + "'"
        )
    }
}

NotImplementedType.prototype.__eq__ = function(other) {
    return this.valueOf() === other
}

NotImplementedType.prototype.__ne__ = function(other) {
    return this.valueOf() !== other
}

NotImplementedType.prototype.__gt__ = function(other) {
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: NotImplementedType() > ' + basic_types.type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'>' not supported between instances of 'NotImplementedType' and '" +
            basic_types.type_name(other) + "'"
        )
    }
}

NotImplementedType.prototype.__ge__ = function(other) {
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: NotImplementedType() >= ' + basic_types.type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'>=' not supported between instances of 'NotImplementedType' and '" +
            basic_types.type_name(other) + "'"
        )
    }
}

NotImplementedType.prototype.__contains__ = function(other) {
    return this.valueOf().hasOwnProperty(other)
}

/**************************************************
 * Unary operators
 **************************************************/

NotImplementedType.prototype.__pos__ = function() {
    return new NotImplementedType(+this.valueOf())
}

NotImplementedType.prototype.__neg__ = function() {
    return new NotImplementedType(-this.valueOf())
}

NotImplementedType.prototype.__not__ = function() {
    return new NotImplementedType(!this.valueOf())
}

NotImplementedType.prototype.__invert__ = function() {
    return new NotImplementedType(~this.valueOf())
}

/**************************************************
 * Binary operators
 **************************************************/

NotImplementedType.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__div__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('NotImplementedType.__div__ has not been implemented')
}

NotImplementedType.prototype.__floordiv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__mul__ = function(other) {
    var types = require('../../types')

    if (types.isinstance(other, [types.Tuple, types.Str, types.List, types.Bytes, types.Bytearray])) {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type 'NotImplementedType'")
    }
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for *: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__mod__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for %: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__add__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for +: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__sub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__getitem__ = function(other) {
    throw new exceptions.TypeError.$pyclass("'NotImplementedType' object is not subscriptable")
}

NotImplementedType.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__and__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__xor__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__or__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

NotImplementedType.prototype.__idiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('NotImplementedType.__idiv__ has not been implemented')
}

NotImplementedType.prototype.__ifloordiv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__itruediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__iadd__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for +=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__isub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__imul__ = function(other) {
    var types = require('../../types')

    if (types.isinstance(other, [types.Tuple, types.Str, types.List, types.Bytes, types.Bytearray])) {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type 'NotImplementedType'")
    }
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for *=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__imod__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for %=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__ipow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__ilshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__irshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__iand__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__ixor__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

NotImplementedType.prototype.__ior__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |=: 'NotImplementedType' and '" + basic_types.type_name(other) + "'")
}

/**************************************************/

module.exports = {
    'NotImplementedType': NotImplementedType,
    'NotImplemented': new NotImplementedType()
}
