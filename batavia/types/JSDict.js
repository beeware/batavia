var exceptions = require('../core').exceptions
var version = require('../core').version
var type_name = require('../core').type_name
var None = require('../core').None

/*************************************************************************
 * A Python dict type wrapping JS objects
 *************************************************************************/

function JSDict(args, kwargs) {
    Object.call(this)
    if (args) {
        this.update(args)
    }
}

JSDict.prototype = Object.create(Object.prototype)
// JSDict doesn't need to appear as a Python type,
// so we don't need to set __class__ or define a Type().

/**************************************************
 * Javascript compatibility methods
 **************************************************/

JSDict.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

JSDict.prototype.__bool__ = function() {
    return Object.keys(this).length > 0
}

JSDict.prototype.__repr__ = function() {
    return this.__str__()
}

JSDict.prototype.__str__ = function() {
    var builtins = require('../builtins')

    var result = '{'
    var values = []
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            values.push(builtins.repr([key], null) + ': ' + builtins.repr([this[key]], null))
        }
    }
    result += values.join(', ')
    result += '}'
    return result
}

/**************************************************
 * Comparison operators
 **************************************************/

JSDict.prototype.__lt__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Bool, types.Dict, types.Float,
            types.Int, types.JSDict, types.List,
            types.NoneType, types.Str, types.Tuple
        ])) {
            if (version.earlier('3.6')) {
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: dict() < ' + type_name(other) + '()'
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    "'<' not supported between instances of 'dict' and '" + type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() < other.valueOf()
        }
    }
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: dict() < NoneType()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'<' not supported between instances of 'dict' and 'NoneType'"
        )
    }
}

JSDict.prototype.__le__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Bool, types.Dict, types.Float,
            types.Int, types.JSDict, types.List,
            types.NoneType, types.Str, types.Tuple
        ])) {
            if (version.earlier('3.6')) {
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: dict() <= ' + type_name(other) + '()'
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    "'<=' not supported between instances of 'dict' and '" + type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() <= other.valueOf()
        }
    }
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: dict() <= NoneType()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'<=' not supported between instances of 'dict' and 'NoneType'"
        )
    }
}

JSDict.prototype.__eq__ = function(other) {
    return this.valueOf() === other
}

JSDict.prototype.__ne__ = function(other) {
    return this.valueOf() !== other
}

JSDict.prototype.__gt__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Bool, types.Dict, types.Float,
            types.Int, types.JSDict, types.List,
            types.NoneType, types.Set, types.Str,
            types.Tuple
        ])) {
            if (version.earlier('3.6')) {
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: dict() > ' + type_name(other) + '()'
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    "'>' not supported between instances of 'dict' and '" + type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() > other.valueOf()
        }
    } else {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: dict() > NoneType()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'>' not supported between instances of 'dict' and 'NoneType'"
            )
        }
    }
}

JSDict.prototype.__ge__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Bool, types.Dict, types.Float,
            types.Int, types.JSDict, types.List,
            types.NoneType, types.Str, types.Tuple
        ])) {
            if (version.earlier('3.6')) {
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: dict() >= ' + type_name(other) + '()'
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    "'>=' not supported between instances of 'dict' and '" + type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() >= other.valueOf()
        }
    } else {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: dict() >= NoneType()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'>=' not supported between instances of 'dict' and 'NoneType'"
            )
        }
    }
}

JSDict.prototype.__contains__ = function(other) {
    return this.valueOf().hasOwnProperty(other)
}

/**************************************************
 * Unary operators
 **************************************************/

JSDict.prototype.__pos__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary +: 'jsdict'")
}

JSDict.prototype.__neg__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary -: 'jsdict'")
}

JSDict.prototype.__not__ = function() {
    return this.__bool__().__not__()
}

JSDict.prototype.__invert__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'jsdict'")
}

/**************************************************
 * Binary operators
 **************************************************/

JSDict.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

JSDict.prototype.__floordiv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__mul__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [
        types.Bool, types.Dict, types.Float,
        types.JSDict, types.Int, types.NoneType])) {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for *: 'jsdict' and '" + type_name(other) + "'")
    } else {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type 'jsdict'")
    }
}

JSDict.prototype.__mod__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__mod__ has not been implemented')
}

JSDict.prototype.__add__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for +: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__sub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__setitem__ = function(key, value) {
    this[key] = value
}

JSDict.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__and__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__xor__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__or__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |: 'jsdict' and '" + type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

JSDict.prototype.__ifloordiv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__itruediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__iadd__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for +=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__isub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__imul__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for *=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__imod__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for %=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__ipow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for **=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__ilshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__irshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__iand__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__ixor__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__ior__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |=: 'jsdict' and '" + type_name(other) + "'")
}

JSDict.prototype.__getitem__ = function(other) {
    var value = this[other]
    if (value === undefined) {
        if (other === null) {
            throw new exceptions.KeyError.$pyclass('None')
        } else {
            throw new exceptions.KeyError.$pyclass(other.__str__())
        }
    }
    return value
}

JSDict.prototype.__delitem__ = function(key) {
    if (!this.__contains__(key)) {
        if (key === null) {
            throw new exceptions.KeyError.$pyclass('None')
        } else {
            throw new exceptions.KeyError.$pyclass(key)
        }
    }
    delete this[key]
}

/**************************************************
 * Methods
 **************************************************/

JSDict.prototype.get = function(key, backup) {
    if (this.__contains__(key)) {
        return this[key]
    } else if (typeof backup === 'undefined') {
        if (key === null) {
            throw new exceptions.KeyError.$pyclass('None')
        } else {
            throw new exceptions.KeyError.$pyclass(key)
        }
    } else {
        return backup
    }
}

JSDict.prototype.update = function(values) {
    for (var key in values) {
        if (values.hasOwnProperty(key)) {
            this[key] = values[key]
        }
    }
}

JSDict.prototype.copy = function() {
    return new JSDict(this)
}

JSDict.prototype.items = function() {
    var types = require('../types')

    var result = new types.List()
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            result.append(new types.Tuple([key, this[key]]))
        }
    }
    return result
}

JSDict.prototype.keys = function() {
    var types = require('../types')

    var result = []
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            result.push(key)
        }
    }
    return new types.List(result)
}

JSDict.prototype.__iter__ = function() {
    return this.keys().__iter__()
}

JSDict.prototype.values = function() {
    var types = require('../types')

    var result = []
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            result.push(this[key])
        }
    }
    return new types.List(result)
}

JSDict.prototype.clear = function() {
    for (var key in this) {
        delete this[key]
    }
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = JSDict
