import { AttributeError, OverflowError, TypeError, ValueError, ZeroDivisionError } from '../core/exceptions'
import { create_pyclass, type_name } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

import * as utils from './utils'

/*************************************************************************
 * Modify Javascript Boolean to behave like a Python bool
 *************************************************************************/

var PyBool = Boolean

create_pyclass(PyBool, 'bool')

/**************************************************
 * Type conversions
 **************************************************/

PyBool.prototype.__bool__ = function() {
    return this.valueOf()
}

PyBool.prototype.__repr__ = function(args, kwargs) {
    return this.__str__()
}

PyBool.prototype.__str__ = function(args, kwargs) {
    if (this.valueOf()) {
        return 'True'
    } else {
        return 'False'
    }
}

PyBool.prototype.__float__ = function() {
    var this_bool
    if (this.valueOf()) {
        this_bool = 1.0
    } else {
        this_bool = 0.0
    }
    return new types.PyFloat(this_bool)
}

/**************************************************
 * Comparison operators
 **************************************************/

PyBool.prototype.__eq__ = function(other) {
    if (types.isinstance(other, PyBool)) {
        return this.valueOf() === other.__bool__()
    } else if (types.isinstance(other, types.PyFloat)) {
        if (other.valueOf() === 0.0) {
            return this.valueOf() === false
        } else {
            return false
        }
    } else if (types.isinstance(other, types.PyInt)) {
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

PyBool.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__()
}

PyBool.prototype.__ge__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.PyFloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new PyBool(this_bool >= other.valueOf())
    } else if (types.isinstance(other, types.PyInt)) {
        return this.__int__().__ge__(other)
    } else if (types.isinstance(other, PyBool)) {
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
        return new PyBool(this_bool >= other_bool)
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

PyBool.prototype.__gt__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.PyFloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new PyBool(this_bool > other.valueOf())
    } else if (types.isinstance(other, types.PyInt)) {
        return this.__int__().__gt__(other)
    } else if (types.isinstance(other, PyBool)) {
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
        return new PyBool(this_bool > other_bool)
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

PyBool.prototype.__le__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.PyFloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new PyBool(this_bool <= other.valueOf())
    } else if (types.isinstance(other, types.PyInt)) {
        return this.__int__().__le__(other)
    } else if (types.isinstance(other, PyBool)) {
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
        return new PyBool(this_bool <= other_bool)
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

PyBool.prototype.__lt__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.PyFloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new PyBool(this_bool < other.valueOf())
    } else if (types.isinstance(other, types.PyInt)) {
        return this.__int__().__lt__(other)
    } else if (types.isinstance(other, PyBool)) {
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
        return new PyBool(this_bool < other_bool)
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

PyBool.prototype.__contains__ = function(other) {
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

PyBool.prototype.__pos__ = function() {
    return +this.valueOf()
}

PyBool.prototype.__neg__ = function() {
    return -this.valueOf()
}

PyBool.prototype.__not__ = function() {
    return PyBool(!this.valueOf())
}

PyBool.prototype.__invert__ = function() {
    return ~this.valueOf()
}

PyBool.prototype.__int__ = function() {
    if (this.valueOf()) {
        return new types.PyInt(1)
    } else {
        return new types.PyInt(0)
    }
}

/**************************************************
 * Binary operators
 **************************************************/

PyBool.prototype.__pow__ = function(other) {
    if (types.isinstance(other, PyBool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.PyInt(1)
        } else if (this.valueOf()) {
            return new types.PyInt(1)
        } else if (other.valueOf()) {
            return new types.PyInt(0)
        } else {
            return new types.PyInt(1)
        }
    } else if (types.isinstance(other, [types.PyFloat, types.PyInt, types.PyComplex])) {
        if (this.valueOf()) {
            if (types.isinstance(other, types.PyInt) && other.__ge__(new types.PyFloat(0.0))) {
                return new types.PyInt(Math.pow(1, other.valueOf()))
            } else if (types.isinstance(other, types.PyComplex)) {
                return new types.PyComplex('1')
            } else {
                return new types.PyFloat(Math.pow(1.0, other.valueOf()))
            }
        } else {
            if (types.isinstance(other, types.PyComplex)) {
                throw new ZeroDivisionError('0.0 to a negative or complex power')
            } else if (other.__lt__(new types.PyFloat(0.0))) {
                throw new ZeroDivisionError('0.0 cannot be raised to a negative power')
            } else if (types.isinstance(other, types.PyInt)) {
                return new types.PyInt(Math.pow(0, other.valueOf()))
            } else {
                return new types.PyFloat(Math.pow(0.0, other.valueOf()))
            }
        }
    } else {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

PyBool.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, [types.PyFloat, types.PyInt, types.PyBool])) {
        var thisValue
        if (this.valueOf()) {
            thisValue = new types.PyInt(1)
        } else {
            thisValue = new types.PyInt(0)
        }
        return thisValue.__floordiv__(other)
    } else if (types.isinstance(other, types.PyComplex)) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        throw new TypeError("unsupported operand type(s) for //: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__truediv__ = function(other) {
    if (types.isinstance(other, [types.PyFloat, types.PyInt, types.PyBool, types.PyComplex])) {
        var thisValue
        if (this.valueOf()) {
            thisValue = new types.PyInt(1)
        } else {
            thisValue = new types.PyInt(0)
        }
        return thisValue.__truediv__(other)
    } else {
        throw new TypeError("unsupported operand type(s) for /: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__mul__ = function(other) {
    var this_bool

    if (types.isinstance(other, PyBool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.PyInt(1)
        } else {
            return new types.PyInt(0)
        }
    } else if (types.isinstance(other, types.PyFloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.PyFloat(this_bool * other.valueOf())
    } else if (types.isinstance(other, types.PyInt)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.PyInt(this_bool * other.valueOf())
    } else if (types.isinstance(other, types.PyComplex)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.PyComplex('0j')
        }
    } else if (types.isinstance(other, types.PyStr)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.PyStr()
        }
    } else if (types.isinstance(other, types.PyBytes)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.PyBytes()
        }
    } else if (types.isinstance(other, types.PyTuple)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.PyTuple()
        }
    } else if (types.isinstance(other, types.PyList)) {
        if (this.valueOf()) {
            return new types.PyList(other.valueOf())
        } else {
            return new types.PyList([])
        }
    } else if (types.isinstance(other, types.PyBytearray)) {
        if (this.valueOf()) {
            return new types.PyBytearray(other.valueOf())
        } else {
            return new types.PyBytearray(new types.PyBytes())
        }
    } else {
        throw new TypeError("unsupported operand type(s) for *: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.PyComplex)) {
        throw new TypeError("can't mod complex numbers.")
    } else if ((types.isinstance(other, types.PyInt) && other.val.isZero()) || (types.isinstance(other, types.PyBool) && !other.valueOf())) {
        throw new ZeroDivisionError('integer division or modulo by zero')
    } else if (this.valueOf() && (types.isinstance(other, types.PyInt) && other.valueOf() > 1)) {
        return new types.PyBool(true)
    } else if (this.valueOf() && (types.isinstance(other, types.PyBool) && other.valueOf())) {
        return new types.PyInt(0)
    } else if (!this.valueOf() && types.isinstance(other, [types.PyBool, types.PyInt]) && other.valueOf()) {
        return new types.PyBool(false)
    } else if (types.isinstance(other, types.PyInt)) {
        var this_val
        if (this.valueOf()) {
            this_val = new types.PyInt(1)
        } else {
            this_val = new types.PyInt(0)
        }
        return new types.PyInt(this_val.val.mod(other.val).add(other.val).mod(other.val))
    } else if (types.isinstance(other, types.PyFloat)) {
        var this_val2
        if (this.valueOf()) {
            this_val2 = new types.PyInt(1)
        } else {
            this_val2 = new types.PyInt(0)
        }
        var result = ((this_val2 % other) + other) % other
        if (other.valueOf() === 0.0) {
            throw new ZeroDivisionError('float modulo')
        } else {
            return new types.PyFloat(result)
        }
    } else {
        throw new TypeError("unsupported operand type(s) for %: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__add__ = function(other) {
    var this_bool

    if (types.isinstance(other, PyBool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.PyInt(2)
        } else if (this.valueOf() || other.valueOf()) {
            return new types.PyInt(1)
        } else {
            return new types.PyInt(0)
        }
    } else if (types.isinstance(other, types.PyFloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.PyFloat(this_bool + other.valueOf())
    } else if (types.isinstance(other, types.PyInt)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.PyInt(other.val.add(this_bool))
    } else if (types.isinstance(other, types.PyComplex)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.PyComplex(this_bool + other.real, other.imag)
    } else {
        throw new TypeError("unsupported operand type(s) for +: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__sub__ = function(other) {
    var this_bool

    if (types.isinstance(other, PyBool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.PyInt(0)
        } else if (this.valueOf()) {
            return new types.PyInt(1)
        } else if (other.valueOf()) {
            return new types.PyInt(-1)
        } else {
            return new types.PyInt(0)
        }
    } else if (types.isinstance(other, types.PyFloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.PyFloat(this_bool - other.valueOf())
    } else if (types.isinstance(other, types.PyInt)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.PyInt(other.val.sub(this_bool).neg())
    } else if (types.isinstance(other, types.PyComplex)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.PyComplex(this_bool - other.real, 0 - other.imag)
    } else {
        throw new TypeError("unsupported operand type(s) for -: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__getitem__ = function(other) {
    throw new TypeError("'bool' object is not subscriptable")
}

PyBool.prototype.__setattr__ = function(other) {
    throw new AttributeError("'bool' object has no attribute '" + other + "'")
}

PyBool.prototype.__lshift__ = function(other) {
    var this_bool

    if (types.isinstance(other, PyBool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.PyInt(2)
        } else if (this.valueOf()) {
            return new types.PyInt(1)
        } else if (other.valueOf()) {
            return new types.PyInt(0)
        } else {
            return new types.PyInt(0)
        }
    } else if (types.isinstance(other, types.PyInt)) {
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
        return new types.PyInt(this_bool << other.valueOf())
    } else {
        throw new TypeError("unsupported operand type(s) for <<: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__rshift__ = function(other) {
    var this_bool

    if (types.isinstance(other, PyBool)) {
        if (this.valueOf() && !other.valueOf()) {
            return new types.PyInt(1)
        } else {
            return new types.PyInt(0)
        }
    } else if (types.isinstance(other, types.PyInt)) {
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
        return new types.PyInt(this_bool >> other.valueOf())
    } else {
        throw new TypeError("unsupported operand type(s) for >>: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__and__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.PyInt)) {
        return this.__int__().__and__(other)
    } else if (types.isinstance(other, PyBool)) {
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
        return new PyBool(this_bool & other_bool)
    } else {
        throw new TypeError("unsupported operand type(s) for &: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__xor__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.PyInt)) {
        return this.__int__().__xor__(other)
    } else if (types.isinstance(other, PyBool)) {
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
        return new PyBool(this_bool ^ other_bool)
    } else {
        throw new TypeError("unsupported operand type(s) for ^: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__or__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.PyInt)) {
        return this.__int__().__or__(other)
    } else if (types.isinstance(other, PyBool)) {
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
        return new PyBool(this_bool | other_bool)
    } else {
        throw new TypeError("unsupported operand type(s) for |: 'bool' and '" + type_name(other) + "'")
    }
}

/**************************************************
 * Inplace operators
 **************************************************/

PyBool.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, types.PyComplex)) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        return utils.inplace_call('__floordiv__', '//=', this, other)
    }
}

PyBool.prototype.__itruediv__ = function(other) {
    return utils.inplace_call('__truediv__', '/=', this, other)
}

PyBool.prototype.__iadd__ = function(other) {
    return utils.inplace_call('__add__', '+=', this, other)
}

PyBool.prototype.__isub__ = function(other) {
    return utils.inplace_call('__sub__', '-=', this, other)
}

PyBool.prototype.__imul__ = function(other) {
    return utils.inplace_call('__mul__', '*=', this, other)
}

PyBool.prototype.__imod__ = function(other) {
    if (types.isinstance(other, types.PyComplex)) {
        throw new TypeError("can't mod complex numbers.")
    } else {
        return utils.inplace_call('__mod__', '%=', this, other)
    }
}

PyBool.prototype.__ipow__ = function(other) {
    return utils.inplace_call('__pow__', '** or pow()', this, other)
}

PyBool.prototype.__ilshift__ = function(other) {
    return utils.inplace_call('__lshift__', '<<=', this, other)
}

PyBool.prototype.__irshift__ = function(other) {
    return utils.inplace_call('__rshift__', '>>=', this, other)
}

PyBool.prototype.__iand__ = function(other) {
    return utils.inplace_call('__and__', '&=', this, other)
}

PyBool.prototype.__ixor__ = function(other) {
    return utils.inplace_call('__xor__', '^=', this, other)
}

PyBool.prototype.__ior__ = function(other) {
    return utils.inplace_call('__or__', '|=', this, other)
}

/**************************************************
 * Methods
 **************************************************/

PyBool.prototype.copy = function() {
    return this.valueOf()
}

PyBool.prototype.__trunc__ = function() {
    if (this.valueOf()) {
        return new types.PyInt(1)
    }
    return new types.PyInt(0)
}

export default PyBool
