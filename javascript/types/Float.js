import { OverflowError, TypeError, ZeroDivisionError } from '../core/exceptions'
import { PyObject } from '../core/types/object'
import { None } from '../core/types/none'
import { create_pyclass, type_name } from '../core/types/types'
import * as version from '../core/version'

import * as types from '../types'

/*************************************************************************
 * A Python float type
 *************************************************************************/

export default function Float(val) {
    PyObject.call(this)

    this.val = val
}

create_pyclass(Float, 'float')

function python_modulo(n, M) {
    return ((n % M) + M) % M
}

var MAX_FLOAT = new Float('179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791')
var MIN_FLOAT = new Float('-179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791')

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
    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice,
            types.Bytes, types.Bytearray
        ])) {
            if (version.earlier('3.6')) {
                throw new TypeError.$pyclass(
                    'unorderable types: float() < ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError.$pyclass(
                    "'<' not supported between instances of 'float' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() < other.valueOf()
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError.$pyclass(
                'unorderable types: float() < NoneType()'
            )
        } else {
            throw new TypeError.$pyclass(
                "'<' not supported between instances of 'float' and 'NoneType'"
            )
        }
    }
}

Float.prototype.__le__ = function(other) {
    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice
        ])) {
            if (version.earlier('3.6')) {
                throw new TypeError.$pyclass(
                    'unorderable types: float() <= ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError.$pyclass(
                    "'<=' not supported between instances of 'float' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() <= other.valueOf()
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError.$pyclass(
                'unorderable types: float() <= NoneType()'
            )
        } else {
            throw new TypeError.$pyclass(
                "'<=' not supported between instances of 'float' and 'NoneType'"
            )
        }
    }
}

Float.prototype.__eq__ = function(other) {
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
    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice
        ])) {
            if (version.earlier('3.6')) {
                throw new TypeError.$pyclass(
                    'unorderable types: float() > ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError.$pyclass(
                    "'>' not supported between instances of 'float' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() > other.valueOf()
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError.$pyclass(
                'unorderable types: float() > NoneType()'
            )
        } else {
            throw new TypeError.$pyclass(
                "'>' not supported between instances of 'float' and 'NoneType'"
            )
        }
    }
}

Float.prototype.__ge__ = function(other) {
    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice,
            types.Bytes, types.Bytearray
        ])) {
            if (version.earlier('3.6')) {
                throw new TypeError.$pyclass(
                    'unorderable types: float() >= ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError.$pyclass(
                    "'>=' not supported between instances of 'float' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() >= other.valueOf()
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError.$pyclass(
                'unorderable types: float() >= NoneType()'
            )
        } else {
            throw new TypeError.$pyclass(
                "'>=' not supported between instances of 'float' and 'NoneType'"
            )
        }
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
    return new types.Bool(!this.valueOf())
}

Float.prototype.__invert__ = function() {
    throw new TypeError.$pyclass("bad operand type for unary ~: 'float'")
}

Float.prototype.__abs__ = function() {
    return new Float(Math.abs(this.valueOf()))
}

/**************************************************
 * Binary operators
 **************************************************/

Float.prototype.__pow__ = function(other) {
    if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(Math.pow(this.valueOf(), 1))
        } else {
            return new Float(Math.pow(this.valueOf(), 0))
        }
    } else if (types.isinstance(other, [Float, types.Int])) {
        if (this.valueOf() === 0 && other.valueOf() < 0) {
            throw new ZeroDivisionError.$pyclass('0.0 cannot be raised to a negative power')
        } else {
            return new Float(Math.pow(this.valueOf(), other.valueOf()))
        }
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Float.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, types.Int)) {
        if (!other.val.isZero()) {
            return new Float(Math.floor(this.valueOf() / other.valueOf()))
        } else {
            throw new ZeroDivisionError.$pyclass('float divmod()')
        }
    } else if (types.isinstance(other, Float)) {
        if (other.valueOf()) {
            return new Float(Math.floor(this.valueOf() / other.valueOf()))
        } else {
            throw new ZeroDivisionError.$pyclass('float divmod()')
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(Math.floor(this.valueOf()))
        } else {
            throw new ZeroDivisionError.$pyclass('float divmod()')
        }
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for //: 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__truediv__ = function(other) {
    if (types.isinstance(other, types.Int)) {
        if (!other.val.isZero()) {
            return new Float(this.valueOf() / other.valueOf())
        } else {
            throw new ZeroDivisionError.$pyclass('float division by zero')
        }
    } else if (types.isinstance(other, Float)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() / other.valueOf())
        } else {
            throw new ZeroDivisionError.$pyclass('float division by zero')
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf())
        } else {
            throw new ZeroDivisionError.$pyclass('float division by zero')
        }
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for /: 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__mul__ = function(other) {
    if (other === null) {
        throw new TypeError.$pyclass("unsupported operand type(s) for *: 'float' and 'NoneType'")
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() * 1)
        } else {
            return new Float(this.valueOf() * 0)
        }
    } else if (types.isinstance(other, [Float, types.Int])) {
        return new Float(this.valueOf() * other.valueOf())
    } else if (types.isinstance(other, [types.List, types.Str, types.Tuple, types.Bytes, types.Bytearray])) {
        throw new TypeError.$pyclass("can't multiply sequence by non-int of type 'float'")
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for *: 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.Int)) {
        if (other.val.isZero()) {
            throw new ZeroDivisionError.$pyclass('float modulo')
        } else {
            var thisNum = this.valueOf()
            var otherNum = parseFloat(other.val)
            var result = new Float(python_modulo(thisNum, otherNum))
            if (otherNum > MAX_FLOAT || otherNum < MIN_FLOAT || result.toString() === 'nan' || result.toString() === 'inf' || result.toString() === '-inf') {
                throw new OverflowError.$pyclass(
                    'int too large to convert to float'
                )
            }
            if ((otherNum > thisNum && thisNum > 0) || (thisNum > otherNum && thisNum < 0) || thisNum === 0) {
                return new Float(thisNum)
            }
            if (result.valueOf() === 0 && (thisNum % otherNum) + otherNum === otherNum) {
                return new Float(otherNum)
            }
            return result
        }
    } else if (types.isinstance(other, Float)) {
        if (other.valueOf() === 0) {
            throw new ZeroDivisionError.$pyclass('float modulo')
        } else {
            return new Float(python_modulo(this.valueOf(), other.valueOf()))
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(python_modulo(this.valueOf(), other.valueOf()))
        } else {
            throw new ZeroDivisionError.$pyclass('float modulo')
        }
    } else {
        throw new TypeError.$pyclass(
            "unsupported operand type(s) for %: 'float' and '" + type_name(other) + "'"
        )
    }
}

Float.prototype.__add__ = function(other) {
    if (types.isinstance(other, [types.Int, Float])) {
        var value = new Float(this.valueOf() + parseFloat(other.valueOf()))
        if (value.toString() === 'inf' || value.toString() === '-inf') {
            throw new OverflowError.$pyclass(
                'int too large to convert to float'
            )
        }
        return value
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() + 1.0)
        } else {
            return new Float(this.valueOf())
        }
    } else if (types.isinstance(other, types.Complex)) {
        var real = new Float(this.valueOf() + other.real)
        return new types.Complex(real.valueOf(), other.imag.valueOf())
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for +: 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__sub__ = function(other) {
    if (types.isinstance(other, [types.Int, Float])) {
        var value = new Float(this.valueOf() - other.valueOf())
        if (value.toString() === 'inf' || value.toString() === '-inf') {
            throw new OverflowError.$pyclass(
                'int too large to convert to float'
            )
        }
        return value
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() - 1.0)
        } else {
            return new Float(this.valueOf())
        }
    } else if (types.isinstance(other, types.Complex)) {
        var real = new Float(this.valueOf() - other.real)
        return new types.Complex(real.valueOf(), -other.imag.valueOf())
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for -: 'float' and '" + type_name(other) + "'")
    }
}

Float.prototype.__getitem__ = function(other) {
    throw new TypeError.$pyclass("'float' object is not subscriptable")
}

Float.prototype.__lshift__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for <<: 'float' and '" + type_name(other) + "'"
    )
}

Float.prototype.__rshift__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for >>: 'float' and '" + type_name(other) + "'"
    )
}

Float.prototype.__and__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for &: 'float' and '" + type_name(other) + "'"
    )
}

Float.prototype.__xor__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for ^: 'float' and '" + type_name(other) + "'"
    )
}

Float.prototype.__or__ = function(other) {
    throw new TypeError.$pyclass(
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
        if (error instanceof TypeError.$pyclass) {
            throw new TypeError.$pyclass(
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
    if (types.isinstance(other, [types.List, types.Str, types.Tuple])) {
        throw new TypeError.$pyclass("can't multiply sequence by non-int of type 'float'")
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
    return new types.Bool(Number.isInteger(this.valueOf()))
}

Float.prototype.__trunc__ = function() {
    return new types.Int(Math.trunc(this.valueOf()))
}
