var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass
var None = require('../core').None

/*************************************************************************
 * A Python float type
 *************************************************************************/

function Float(val) {
    PyObject.call(this)

    this.val = val
}

create_pyclass(Float, 'float')

function python_modulo(n, M) {
    return ((n % M) + M) % M
}

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Float.prototype.toString = function() {
    return this.__str__()
}

Float.prototype.valueOf = function() {
    return this.val
}

/**************************************************
 * Type conversions
 **************************************************/

Float.prototype.__bool__ = function() {
    return this.val !== 0.0
}

Float.prototype.__repr__ = function() {
    return this.__str__()
}

Float.prototype.__str__ = function() {
    if (!isFinite(this.val)) {
        if (isNaN(this.val)) {
            return 'nan'
        }
        if (this.val < 0) {
            return '-inf'
        }
        return 'inf'
    }
    if (this.val === 0) {
        if (1 / this.val === Infinity) {
            return '0.0'
        } else {
            return '-0.0'
        }
    } else if (this.val === Math.round(this.val)) {
        var s = this.val.toString()
        if (s.length >= 19) {
          // force conversion to scientific
            return this.val.toExponential()
        }
        if (s.indexOf('.') < 0) {
            return s + '.0'
        }
        return s
    } else {
        return this.val.toString()
    }
}

Float.prototype.__float__ = function() {
    return this
}

/**************************************************
 * Comparison operators
 **************************************************/

Float.prototype.__lt__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice
        ])) {
            throw new exceptions.TypeError.$pyclass('unorderable types: float() < ' + type_name(other) + '()')
        } else {
            return this.valueOf() < other.valueOf()
        }
    } else {
        throw new exceptions.TypeError.$pyclass('unorderable types: float() < NoneType()')
    }
}

Float.prototype.__le__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice
        ])) {
            throw new exceptions.TypeError.$pyclass('unorderable types: float() <= ' + type_name(other) + '()')
        } else {
            return this.valueOf() <= other.valueOf()
        }
    } else {
        throw new exceptions.TypeError.$pyclass('unorderable types: float() <= NoneType()')
    }
}

Float.prototype.__eq__ = function(other) {
    var types = require('../types')

    if (other !== null && !types.isinstance(other, types.Str)) {
        var val
        if (types.isinstance(other, types.Bool)) {
            if (other.valueOf()) {
                val = 1.0
            } else {
                val = 0.0
            }
        } else if (types.isinstance(other, types.Int)) {
            val = parseFloat(other.val)
        } else {
            val = other.valueOf()
        }
        return this.valueOf() === val
    }
    return false
}

Float.prototype.__ne__ = function(other) {
    return !this.__eq__(other)
}

Float.prototype.__gt__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice
        ])) {
            throw new exceptions.TypeError.$pyclass('unorderable types: float() > ' + type_name(other) + '()')
        } else {
            return this.valueOf() > other.valueOf()
        }
    } else {
        throw new exceptions.TypeError.$pyclass('unorderable types: float() > NoneType()')
    }
}

Float.prototype.__ge__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice
        ])) {
            throw new exceptions.TypeError.$pyclass('unorderable types: float() >= ' + type_name(other) + '()')
        } else {
            return this.valueOf() >= other.valueOf()
        }
    } else {
        throw new exceptions.TypeError.$pyclass('unorderable types: float() >= NoneType()')
    }
}

Float.prototype.__contains__ = function(other) {
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

Float.prototype.__pos__ = function() {
    return new Float(+this.valueOf())
}

Float.prototype.__neg__ = function() {
    return new Float(-this.valueOf())
}

Float.prototype.__not__ = function() {
    return new Float(!this.valueOf())
}

Float.prototype.__invert__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'float'")
}

Float.prototype.__abs__ = function() {
    return new Float(Math.abs(this.valueOf()))
}

/**************************************************
 * Binary operators
 **************************************************/

Float.prototype.__pow__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(Math.pow(this.valueOf(), 1))
        } else {
            return new Float(Math.pow(this.valueOf(), 0))
        }
    } else if (types.isinstance(other, [Float, types.Int])) {
        if (this.valueOf() === 0 && other.valueOf() < 0) {
            throw new exceptions.ZeroDivisionError.$pyclass('0.0 cannot be raised to a negative power')
        } else {
            return new Float(Math.pow(this.valueOf(), other.valueOf()))
        }
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Float.prototype.__floordiv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Int)) {
        if (!other.val.isZero()) {
            return new Float(Math.floor(this.valueOf() / other.valueOf()))
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float divmod()')
        }
    } else if (types.isinstance(other, Float)) {
        if (other.valueOf()) {
            return new Float(Math.floor(this.valueOf() / other.valueOf()))
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float divmod()')
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(Math.floor(this.valueOf()))
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float divmod()')
        }
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //: 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__truediv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Int)) {
        if (!other.val.isZero()) {
            return new Float(this.valueOf() / other.valueOf())
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float division by zero')
        }
    } else if (types.isinstance(other, Float)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() / other.valueOf())
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float division by zero')
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf())
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float division by zero')
        }
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__mul__ = function(other) {
    var types = require('../types')

    if (other === null) {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for *: 'float' and 'NoneType'")
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() * 1)
        } else {
            return new Float(this.valueOf() * 0)
        }
    } else if (types.isinstance(other, [Float, types.Int])) {
        return new Float(this.valueOf() * other.valueOf())
    } else if (types.isinstance(other, [types.List, types.Str, types.Tuple])) {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type 'float'")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for *: 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__mod__ = function(other) {
    var types = require('../types')

    /* TODO: Fix case for -0.0, which is coming out 0.0 */
    if (types.isinstance(other, types.Int)) {
        if (other.val.isZero()) {
            throw new exceptions.ZeroDivisionError.$pyclass('float modulo')
        } else {
            return new Float(python_modulo(this.valueOf(), parseFloat(other.val)))
        }
    } else if (types.isinstance(other, Float)) {
        if (other.valueOf() === 0) {
            throw new exceptions.ZeroDivisionError.$pyclass('float modulo')
        } else {
            return new Float(python_modulo(this.valueOf(), other.valueOf()))
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(python_modulo(this.valueOf(), other.valueOf()))
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float modulo')
        }
    } else {
        throw new exceptions.TypeError.$pyclass(
            "unsupported operand type(s) for %: 'float' and '" + type_name(other) + "'"
        )
    }
}

Float.prototype.__add__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Int, Float])) {
        return new Float(this.valueOf() + parseFloat(other.valueOf()))
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() + 1.0)
        } else {
            return new Float(this.valueOf())
        }
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for +: 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__sub__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Int, Float])) {
        return new Float(this.valueOf() - other.valueOf())
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() - 1.0)
        } else {
            return new Float(this.valueOf())
        }
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -: 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__getitem__ = function(other) {
    throw new exceptions.TypeError.$pyclass("'float' object is not subscriptable")
}

Float.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for <<: 'float' and '" + type_name(other) + "'"
    )
}

Float.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for >>: 'float' and '" + type_name(other) + "'"
    )
}

Float.prototype.__and__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for &: 'float' and '" + type_name(other) + "'"
    )
}

Float.prototype.__xor__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for ^: 'float' and '" + type_name(other) + "'"
    )
}

Float.prototype.__or__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for |: 'float' and '" + type_name(other) + "'"
    )
}

/**************************************************
 * Inplace operators
 **************************************************/

// Call the method named "f" with argument "other"; if a type error is raised, throw a different type error
Float.prototype.__call_binary_operator__ = function(f, operator_str, other) {
    try {
        return this[f](other)
    } catch (error) {
        if (error instanceof exceptions.TypeError.$pyclass) {
            throw new exceptions.TypeError.$pyclass(
                'unsupported operand type(s) for ' + operator_str + ": 'float' and '" + type_name(other) + "'")
        } else {
            throw error
        }
    }
}

Float.prototype.__ifloordiv__ = function(other) {
    return this.__call_binary_operator__('__floordiv__', '//=', other)
}

Float.prototype.__itruediv__ = function(other) {
    return this.__call_binary_operator__('__truediv__', '/=', other)
}

Float.prototype.__iadd__ = function(other) {
    return this.__call_binary_operator__('__add__', '+=', other)
}

Float.prototype.__isub__ = function(other) {
    return this.__call_binary_operator__('__sub__', '-=', other)
}

Float.prototype.__imul__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.List, types.Str, types.Tuple])) {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type 'float'")
    } else {
        return this.__call_binary_operator__('__mul__', '*=', other)
    }
}

Float.prototype.__imod__ = function(other) {
    return this.__call_binary_operator__('__mod__', '%=', other)
}

Float.prototype.__ipow__ = function(other) {
    return this.__pow__(other)
}

Float.prototype.__ilshift__ = function(other) {
    return this.__call_binary_operator__('__lshift__', '<<=', other)
}

Float.prototype.__irshift__ = function(other) {
    return this.__call_binary_operator__('__rshift__', '>>=', other)
}

Float.prototype.__iand__ = function(other) {
    return this.__call_binary_operator__('__and__', '&=', other)
}

Float.prototype.__ixor__ = function(other) {
    return this.__call_binary_operator__('__xor__', '^=', other)
}

Float.prototype.__ior__ = function(other) {
    return this.__call_binary_operator__('__or__', '|=', other)
}

/**************************************************
 * Methods
 **************************************************/

Float.prototype.copy = function() {
    return new Float(this.valueOf())
}

Float.prototype.is_integer = function() {
    var types = require('../types')

    return new types.Bool(Number.isInteger(this.valueOf()))
}

Float.prototype.__trunc__ = function() {
    var types = require('../types')

    return new types.Int(Math.trunc(this.valueOf()))
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Float
