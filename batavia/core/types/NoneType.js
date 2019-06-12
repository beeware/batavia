/*************************************************************************
 * An implementation of NoneType
 *************************************************************************/
var PyObject = require('./Object')
var basic_types = require('./Type')
var exceptions = require('../exceptions')
var version = require('../version')

function NoneType() {
    PyObject.call(this)
}

NoneType.prototype = Object.create(PyObject.prototype)
NoneType.prototype.__class__ = new basic_types.Type('NoneType')
NoneType.prototype.__name__ = 'NoneType'

NoneType.prototype.__dir__ = function() {
    var types = require('../../types')
    if (version.at_least(3.6)) {
        // Python 3.6 adds classmethod object.__init_subclass__
        return new types.List(['__bool__', '__class__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__'])
    }
    return new types.List(['__bool__', '__class__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__le__', '__lt__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__'])
}

/**************************************************
 * Type conversions
 **************************************************/

NoneType.prototype.__bool__ = function() {
    var types = require('../../types')
    return new types.Bool(false)
}

NoneType.prototype.__repr__ = function() {
    var types = require('../../types')
    return new types.Str('None')
}

NoneType.prototype.__str__ = function() {
    var types = require('../../types')
    return new types.Str('None')
}
 /**************************************************
 * Attribute manipulation
 **************************************************/

NoneType.prototype.__setattr__ = function(attr, value) {
    if (Object.getPrototypeOf(this)[attr] === undefined) {
        throw new exceptions.AttributeError.$pyclass("'NoneType' object has no attribute '" + attr + "'")
    } else {
        throw new exceptions.AttributeError.$pyclass("'NoneType' object attribute '" + attr + "' is read-only")
    }
}

/**************************************************
 * Comparison operators
 **************************************************/

NoneType.prototype.__lt__ = function(other) {
    if (version.at_least('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            '\'<\' not supported between instances of \'NoneType\' and \'' + basic_types.type_name(other) + '\'')
    } else {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: NoneType() < ' + basic_types.type_name(other) + '()')
    }
}

NoneType.prototype.__le__ = function(other) {
    if (version.at_least('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            '\'<=\' not supported between instances of \'NoneType\' and \'' + basic_types.type_name(other) + '\'')
    } else {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: NoneType() <= ' + basic_types.type_name(other) + '()')
    }
}

NoneType.prototype.__eq__ = function(other) {
    return other === this
}

NoneType.prototype.__ne__ = function(other) {
    return other !== this
}

NoneType.prototype.__gt__ = function(other) {
    if (version.at_least('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            '\'>\' not supported between instances of \'NoneType\' and \'' +
            basic_types.type_name(other) + '\''
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: NoneType() > ' + basic_types.type_name(other) + '()'
        )
    }
}

NoneType.prototype.__ge__ = function(other) {
    if (version.at_least('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            '\'>=\' not supported between instances of \'NoneType\' and \'' +
            basic_types.type_name(other) + '\''
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: NoneType() >= ' + basic_types.type_name(other) + '()'
        )
    }
}

NoneType.prototype.__contains__ = function(other) {
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

NoneType.prototype.__pos__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary +: 'NoneType'")
}

NoneType.prototype.__neg__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary -: 'NoneType'")
}

NoneType.prototype.__not__ = function() {
    return true
}

NoneType.prototype.__invert__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'NoneType'")
}

/**************************************************
 * Binary operators
 **************************************************/

NoneType.prototype.__getitem__ = function(other) {
    throw new exceptions.TypeError.$pyclass("'NoneType' object is not subscriptable")
}

// Define the actual instance of None
var None = new NoneType()

// Now that we have an instance of None, we can fill in the blanks where we needed it
PyObject.prototype.__class__.__base__ = None

module.exports = {
    'NoneType': NoneType,
    'None': None
}
