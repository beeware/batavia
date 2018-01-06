import { AttributeError, OverflowError, TypeError, ValueError, ZeroDivisionError } from '../core/exceptions'
import { create_pyclass, type_name } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

import * as utils from './utils'

/*************************************************************************
 * Modify Javascript Boolean to behave like a Python bool
 *************************************************************************/

var Bool = Boolean

create_pyclass(Bool, 'bool', null)

/**************************************************
 * Type conversions
 **************************************************/

Bool.prototype.__bool__ = function() {
    return this.valueOf()
}

Bool.prototype.__repr__ = function(args, kwargs) {
    return this.__str__()
}

Bool.prototype.__str__ = function(args, kwargs) {
    if (this.valueOf()) {
        return 'True'
    } else {
        return 'False'
    }
}

Bool.prototype.__float__ = function() {
    var this_bool
    if (this.valueOf()) {
        this_bool = 1.0
    } else {
        this_bool = 0.0
    }
    return new types.Float(this_bool)
}

/**************************************************
 * Comparison operators
 **************************************************/

Bool.prototype.__eq__ = function(other) {
    if (types.isinstance(other, Bool)) {
        return this.valueOf() === other.__bool__()
    } else if (types.isinstance(other, types.Float)) {
        if (other.valueOf() === 0.0) {
            return this.valueOf() === false
        } else {
            return false
        }
    } else if (types.isinstance(other, types.Int)) {
        if (other.val.eq(0)) {
            return this.valueOf() === false
        } else if (other.val.eq(1)) {
            return this.valueOf() === true
        } else {
            return false
        }
    } else {
        return false
    }
}

Bool.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__()
}

Bool.prototype.__ge__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new Bool(this_bool >= other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__ge__(other)
    } else if (types.isinstance(other, Bool)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        if (other.valueOf()) {
            other_bool = 1
        } else {
            other_bool = 0
        }
        return new Bool(this_bool >= other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: bool() >= ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'>=' not supported between instances of 'bool' and '" + type_name(other) + "'"
            )
        }
    } else {
        throw new TypeError("unsupported operand type(s) for >=: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__gt__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new Bool(this_bool > other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__gt__(other)
    } else if (types.isinstance(other, Bool)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        if (other.valueOf()) {
            other_bool = 1
        } else {
            other_bool = 0
        }
        return new Bool(this_bool > other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: bool() > ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'>' not supported between instances of 'bool' and '" +
                type_name(other) + "'"
            )
        }
    } else {
        throw new TypeError("unsupported operand type(s) for >: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__le__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new Bool(this_bool <= other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__le__(other)
    } else if (types.isinstance(other, Bool)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        if (other.valueOf()) {
            other_bool = 1
        } else {
            other_bool = 0
        }
        return new Bool(this_bool <= other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: bool() <= ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'<=' not supported between instances of 'bool' and '" +
                type_name(other) + "'"
            )
        }
    } else {
        throw new TypeError("unsupported operand type(s) for <=: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__lt__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new Bool(this_bool < other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__lt__(other)
    } else if (types.isinstance(other, Bool)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        if (other.valueOf()) {
            other_bool = 1
        } else {
            other_bool = 0
        }
        return new Bool(this_bool < other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: bool() < ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'<' not supported between instances of 'bool' and '" +
                type_name(other) + "'"
            )
        }
    } else {
        throw new TypeError("unsupported operand type(s) for <: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__contains__ = function(other) {
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

Bool.prototype.__pos__ = function() {
    return +this.valueOf()
}

Bool.prototype.__neg__ = function() {
    return -this.valueOf()
}

Bool.prototype.__not__ = function() {
    return Bool(!this.valueOf())
}

Bool.prototype.__invert__ = function() {
    return ~this.valueOf()
}

Bool.prototype.__int__ = function() {
    if (this.valueOf()) {
        return new types.Int(1)
    } else {
        return new types.Int(0)
    }
}

/**************************************************
 * Binary operators
 **************************************************/

Bool.prototype.__pow__ = function(other) {
    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(1)
        } else if (this.valueOf()) {
            return new types.Int(1)
        } else if (other.valueOf()) {
            return new types.Int(0)
        } else {
            return new types.Int(1)
        }
    } else if (types.isinstance(other, [types.Float, types.Int, types.Complex])) {
        if (this.valueOf()) {
            if (types.isinstance(other, types.Int) && other.__ge__(new types.Float(0.0))) {
                return new types.Int(Math.pow(1, other.valueOf()))
            } else if (types.isinstance(other, types.Complex)) {
                return new types.Complex('1')
            } else {
                return new types.Float(Math.pow(1.0, other.valueOf()))
            }
        } else {
            if (types.isinstance(other, types.Complex)) {
                throw new ZeroDivisionError('0.0 to a negative or complex power')
            } else if (other.__lt__(new types.Float(0.0))) {
                throw new ZeroDivisionError('0.0 cannot be raised to a negative power')
            } else if (types.isinstance(other, types.Int)) {
                return new types.Int(Math.pow(0, other.valueOf()))
            } else {
                return new types.Float(Math.pow(0.0, other.valueOf()))
            }
        }
    } else {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Bool.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, [types.Float, types.Int, types.Bool])) {
        var thisValue
        if (this.valueOf()) {
            thisValue = new types.Int(1)
        } else {
            thisValue = new types.Int(0)
        }
        return thisValue.__floordiv__(other)
    } else if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        throw new TypeError("unsupported operand type(s) for //: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__truediv__ = function(other) {
    if (types.isinstance(other, [types.Float, types.Int, types.Bool, types.Complex])) {
        var thisValue
        if (this.valueOf()) {
            thisValue = new types.Int(1)
        } else {
            thisValue = new types.Int(0)
        }
        return thisValue.__truediv__(other)
    } else {
        throw new TypeError("unsupported operand type(s) for /: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__mul__ = function(other) {
    var this_bool

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(1)
        } else {
            return new types.Int(0)
        }
    } else if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.Float(this_bool * other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Int(this_bool * other.valueOf())
    } else if (types.isinstance(other, types.Complex)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.Complex('0j')
        }
    } else if (types.isinstance(other, types.Str)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.Str()
        }
    } else if (types.isinstance(other, types.Bytes)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.Bytes('')
        }
    } else if (types.isinstance(other, types.Tuple)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.Tuple()
        }
    } else if (types.isinstance(other, types.List)) {
        if (this.valueOf()) {
            return new types.List(other.valueOf())
        } else {
            return new types.List([])
        }
    } else if (types.isinstance(other, types.Bytearray)) {
        if (this.valueOf()) {
            return new types.Bytearray(other.valueOf())
        } else {
            return new types.Bytearray(new types.Bytes(''))
        }
    } else {
        throw new TypeError("unsupported operand type(s) for *: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't mod complex numbers.")
    } else if ((types.isinstance(other, types.Int) && other.val.isZero()) || (types.isinstance(other, types.Bool) && !other.valueOf())) {
        throw new ZeroDivisionError('integer division or modulo by zero')
    } else if (this.valueOf() && (types.isinstance(other, types.Int) && other.valueOf() > 1)) {
        return new types.Bool(true)
    } else if (this.valueOf() && (types.isinstance(other, types.Bool) && other.valueOf())) {
        return new types.Int(0)
    } else if (!this.valueOf() && types.isinstance(other, [types.Bool, types.Int]) && other.valueOf()) {
        return new types.Bool(false)
    } else if (types.isinstance(other, types.Int)) {
        var this_val
        if (this.valueOf()) {
            this_val = new types.Int(1)
        } else {
            this_val = new types.Int(0)
        }
        return new types.Int(this_val.val.mod(other.val).add(other.val).mod(other.val))
    } else if (types.isinstance(other, types.Float)) {
        var this_val2
        if (this.valueOf()) {
            this_val2 = new types.Int(1)
        } else {
            this_val2 = new types.Int(0)
        }
        var result = ((this_val2 % other) + other) % other
        if (other.valueOf() === 0.0) {
            throw new ZeroDivisionError('float modulo')
        } else {
            return new types.Float(result)
        }
    } else {
        throw new TypeError("unsupported operand type(s) for %: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__add__ = function(other) {
    var this_bool

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(2)
        } else if (this.valueOf() || other.valueOf()) {
            return new types.Int(1)
        } else {
            return new types.Int(0)
        }
    } else if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.Float(this_bool + other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Int(other.val.add(this_bool))
    } else if (types.isinstance(other, types.Complex)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Complex(this_bool + other.real, other.imag)
    } else {
        throw new TypeError("unsupported operand type(s) for +: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__sub__ = function(other) {
    var this_bool

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(0)
        } else if (this.valueOf()) {
            return new types.Int(1)
        } else if (other.valueOf()) {
            return new types.Int(-1)
        } else {
            return new types.Int(0)
        }
    } else if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.Float(this_bool - other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.Int(other.val.sub(this_bool).neg())
    } else if (types.isinstance(other, types.Complex)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Complex(this_bool - other.real, 0 - other.imag)
    } else {
        throw new TypeError("unsupported operand type(s) for -: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__getitem__ = function(other) {
    throw new TypeError("'bool' object is not subscriptable")
}

Bool.prototype.__setattr__ = function(other) {
    throw new AttributeError("'bool' object has no attribute '" + other + "'")
}

Bool.prototype.__lshift__ = function(other) {
    var this_bool

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(2)
        } else if (this.valueOf()) {
            return new types.Int(1)
        } else if (other.valueOf()) {
            return new types.Int(0)
        } else {
            return new types.Int(0)
        }
    } else if (types.isinstance(other, types.Int)) {
        if (other.valueOf() < 0) {
            throw new ValueError('negative shift count')
        }
        if (Number.MAX_SAFE_INTEGER < other.valueOf()) {
            throw new OverflowError('Python int too large to convert to C ssize_t')
        }
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Int(this_bool << other.valueOf())
    } else {
        throw new TypeError("unsupported operand type(s) for <<: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__rshift__ = function(other) {
    var this_bool

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && !other.valueOf()) {
            return new types.Int(1)
        } else {
            return new types.Int(0)
        }
    } else if (types.isinstance(other, types.Int)) {
        if (other.valueOf() < 0) {
            throw new ValueError('negative shift count')
        }
        if (Number.MAX_SAFE_INTEGER < Math.abs(other.valueOf())) {
            throw new OverflowError('Python int too large to convert to C ssize_t')
        }
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Int(this_bool >> other.valueOf())
    } else {
        throw new TypeError("unsupported operand type(s) for >>: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__and__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.Int)) {
        return this.__int__().__and__(other)
    } else if (types.isinstance(other, Bool)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        if (other.valueOf()) {
            other_bool = 1
        } else {
            other_bool = 0
        }
        return new Bool(this_bool & other_bool)
    } else {
        throw new TypeError("unsupported operand type(s) for &: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__xor__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.Int)) {
        return this.__int__().__xor__(other)
    } else if (types.isinstance(other, Bool)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        if (other.valueOf()) {
            other_bool = 1
        } else {
            other_bool = 0
        }
        return new Bool(this_bool ^ other_bool)
    } else {
        throw new TypeError("unsupported operand type(s) for ^: 'bool' and '" + type_name(other) + "'")
    }
}

Bool.prototype.__or__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.Int)) {
        return this.__int__().__or__(other)
    } else if (types.isinstance(other, Bool)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        if (other.valueOf()) {
            other_bool = 1
        } else {
            other_bool = 0
        }
        return new Bool(this_bool | other_bool)
    } else {
        throw new TypeError("unsupported operand type(s) for |: 'bool' and '" + type_name(other) + "'")
    }
}

/**************************************************
 * Inplace operators
 **************************************************/

Bool.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        return utils.inplace_call('__floordiv__', '//=', this, other)
    }
}

Bool.prototype.__itruediv__ = function(other) {
    return utils.inplace_call('__truediv__', '/=', this, other)
}

Bool.prototype.__iadd__ = function(other) {
    return utils.inplace_call('__add__', '+=', this, other)
}

Bool.prototype.__isub__ = function(other) {
    return utils.inplace_call('__sub__', '-=', this, other)
}

Bool.prototype.__imul__ = function(other) {
    return utils.inplace_call('__mul__', '*=', this, other)
}

Bool.prototype.__imod__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't mod complex numbers.")
    } else {
        return utils.inplace_call('__mod__', '%=', this, other)
    }
}

Bool.prototype.__ipow__ = function(other) {
    return utils.inplace_call('__pow__', '** or pow()', this, other)
}

Bool.prototype.__ilshift__ = function(other) {
    return utils.inplace_call('__lshift__', '<<=', this, other)
}

Bool.prototype.__irshift__ = function(other) {
    return utils.inplace_call('__rshift__', '>>=', this, other)
}

Bool.prototype.__iand__ = function(other) {
    return utils.inplace_call('__and__', '&=', this, other)
}

Bool.prototype.__ixor__ = function(other) {
    return utils.inplace_call('__xor__', '^=', this, other)
}

Bool.prototype.__ior__ = function(other) {
    return utils.inplace_call('__or__', '|=', this, other)
}

/**************************************************
 * Methods
 **************************************************/

Bool.prototype.copy = function() {
    return this.valueOf()
}

Bool.prototype.__trunc__ = function() {
    if (this.valueOf()) {
        return new types.Int(1)
    }
    return new types.Int(0)
}

export default Bool
