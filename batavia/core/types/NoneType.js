/*************************************************************************
 * An implementation of NoneType
 *************************************************************************/
var PyObject = require('./Object');
var basic_types = require('./Type');
var exceptions = require('../exceptions');

function NoneType() {
    Object.call(this);
}

NoneType.prototype = Object.create(PyObject.prototype);
NoneType.prototype.__class__ = new basic_types.Type('NoneType');
NoneType.prototype.__name__ = 'NoneType';

/**************************************************
 * Type conversions
 **************************************************/

NoneType.prototype.__bool__ = function() {
    var types = require('../../types');
    return new types.Bool(false);
}

NoneType.prototype.__repr__ = function() {
    var types = require('../../types');
    return new types.Str("None");
}

NoneType.prototype.__str__ = function() {
    var types = require('../../types');
    return new types.Str("None");
}

/**************************************************
 * Attribute manipulation
 **************************************************/

NoneType.prototype.__getattr__ = function(attr) {
    throw new exceptions.AttributeError("'NoneType' object has no attribute '" + attr + "'");
}

NoneType.prototype.__setattr__ = function(attr, value) {
    throw new exceptions.AttributeError("'NoneType' object has no attribute '" + attr + "'");
}

/**************************************************
 * Comparison operators
 **************************************************/

NoneType.prototype.__lt__ = function(other) {
    throw new exceptions.TypeError("unorderable types: NoneType() < " +  basic_types.type_name(other) + "()");
}

NoneType.prototype.__le__ = function(other) {
    throw new exceptions.TypeError("unorderable types: NoneType() <= " +  basic_types.type_name(other) + "()");
}

NoneType.prototype.__eq__ = function(other) {
    return other === this;
}

NoneType.prototype.__ne__ = function(other) {
    return other !== this;
}

NoneType.prototype.__gt__ = function(other) {
    throw new exceptions.TypeError("unorderable types: NoneType() > " +  basic_types.type_name(other) + "()");
}

NoneType.prototype.__ge__ = function(other) {
    throw new exceptions.TypeError("unorderable types: NoneType() >= " +  basic_types.type_name(other) + "()");
}

NoneType.prototype.__contains__ = function(other) {
    return false;
}

/**************************************************
 * Unary operators
 **************************************************/

NoneType.prototype.__pos__ = function() {
    throw new exceptions.TypeError("bad operand type for unary +: 'NoneType'");
}

NoneType.prototype.__neg__ = function() {
    throw new exceptions.TypeError("bad operand type for unary -: 'NoneType'");
}

NoneType.prototype.__not__ = function() {
    return true;
}

NoneType.prototype.__invert__ = function() {
    throw new exceptions.TypeError("bad operand type for unary ~: 'NoneType'");
}

/**************************************************
 * Binary operators
 **************************************************/

NoneType.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__div__ = function(other) {
    return NoneType.__truediv__(other);
}

NoneType.prototype.__floordiv__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for //: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for /: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__mul__ = function(other) {
    var types = require('../../types');

    if (types.isinstance(other, [types.List, types.Tuple, types.Str])) {
        throw new exceptions.TypeError("can't multiply sequence by non-int of type 'NoneType'");
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for *: 'NoneType' and '" + basic_types.type_name(other) + "'");
    }
}

NoneType.prototype.__mod__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for %: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__add__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for +: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__sub__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for -: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__getitem__ = function(other) {
    throw new exceptions.TypeError("'NoneType' object is not subscriptable");
}

NoneType.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for <<: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for >>: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__and__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for &: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__xor__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for ^: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__or__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for |: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

/**************************************************
 * Inplace operators
 **************************************************/

NoneType.prototype.__ifloordiv__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for //=: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__itruediv__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for /=: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__iadd__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for +=: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__isub__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for -=: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__imul__ = function(other) {
    var types = require('../../types');

    if (types.isinstance(other, [types.List, types.Tuple, types.Str])) {
        throw new exceptions.TypeError("can't multiply sequence by non-int of type 'NoneType'");
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for *=: 'NoneType' and '" + basic_types.type_name(other) + "'");
    }
}

NoneType.prototype.__imod__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for %=: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__ipow__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__ilshift__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for <<=: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__irshift__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for >>=: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__iand__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for &=: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__ixor__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for ^=: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

NoneType.prototype.__ior__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for |=: 'NoneType' and '" + basic_types.type_name(other) + "'");
}

module.exports = {
    'NoneType': NoneType,
    'None': new NoneType()
}
