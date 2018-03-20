import { pyAttributeError, pyOverflowError, pyTypeError, pyValueError, pyZeroDivisionError } from '../core/exceptions'
import { jstype, type_name } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

/*************************************************************************
 * Modify Javascript Boolean to behave like a Python bool
 *************************************************************************/

var PyBool = Boolean

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
    return types.pyfloat(this_bool)
}

/**************************************************
 * Comparison operators
 **************************************************/

PyBool.prototype.__eq__ = function(other) {
    if (types.isinstance(other, types.pybool)) {
        return this.valueOf() === other.__bool__()
    } else if (types.isinstance(other, types.pyfloat)) {
        if (other.valueOf() === 0.0) {
            return this.valueOf() === false
        } else {
            return false
        }
    } else if (types.isinstance(other, types.pyint)) {
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

    if (types.isinstance(other, types.pyfloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return pybool(this_bool >= other.valueOf())
    } else if (types.isinstance(other, types.pyint)) {
        return this.__int__().__ge__(other)
    } else if (types.isinstance(other, types.pybool)) {
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
        return pybool(this_bool >= other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: bool() >= ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'>=' not supported between instances of 'bool' and '" + type_name(other) + "'"
            )
        }
    } else {
        throw pyTypeError("unsupported operand type(s) for >=: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__gt__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.pyfloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return pybool(this_bool > other.valueOf())
    } else if (types.isinstance(other, types.pyint)) {
        return this.__int__().__gt__(other)
    } else if (types.isinstance(other, types.pybool)) {
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
        return pybool(this_bool > other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: bool() > ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'>' not supported between instances of 'bool' and '" +
                type_name(other) + "'"
            )
        }
    } else {
        throw pyTypeError("unsupported operand type(s) for >: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__le__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.pyfloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return pybool(this_bool <= other.valueOf())
    } else if (types.isinstance(other, types.pyint)) {
        return this.__int__().__le__(other)
    } else if (types.isinstance(other, types.pybool)) {
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
        return pybool(this_bool <= other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: bool() <= ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'<=' not supported between instances of 'bool' and '" +
                type_name(other) + "'"
            )
        }
    } else {
        throw pyTypeError("unsupported operand type(s) for <=: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__lt__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.pyfloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return pybool(this_bool < other.valueOf())
    } else if (types.isinstance(other, types.pyint)) {
        return this.__int__().__lt__(other)
    } else if (types.isinstance(other, types.pybool)) {
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
        return pybool(this_bool < other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: bool() < ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'<' not supported between instances of 'bool' and '" +
                type_name(other) + "'"
            )
        }
    } else {
        throw pyTypeError("unsupported operand type(s) for <: 'bool' and '" + type_name(other) + "'")
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
        return types.pyint(1)
    } else {
        return types.pyint(0)
    }
}

/**************************************************
 * Binary operators
 **************************************************/

PyBool.prototype.__pow__ = function(other) {
    if (types.isinstance(other, types.pybool)) {
        if (this.valueOf() && other.valueOf()) {
            return types.pyint(1)
        } else if (this.valueOf()) {
            return types.pyint(1)
        } else if (other.valueOf()) {
            return types.pyint(0)
        } else {
            return types.pyint(1)
        }
    } else if (types.isinstance(other, [types.pyfloat, types.pyint, types.pycomplex])) {
        if (this.valueOf()) {
            if (types.isinstance(other, types.pyint) && other.__ge__(types.pyfloat(0.0))) {
                return types.pyint(Math.pow(1, other.valueOf()))
            } else if (types.isinstance(other, types.pycomplex)) {
                return types.pycomplex('1')
            } else {
                return types.pyfloat(Math.pow(1.0, other.valueOf()))
            }
        } else {
            if (types.isinstance(other, types.pycomplex)) {
                throw pyZeroDivisionError('0.0 to a negative or complex power')
            } else if (other.__lt__(types.pyfloat(0.0))) {
                throw pyZeroDivisionError('0.0 cannot be raised to a negative power')
            } else if (types.isinstance(other, types.pyint)) {
                return types.pyint(Math.pow(0, other.valueOf()))
            } else {
                return types.pyfloat(Math.pow(0.0, other.valueOf()))
            }
        }
    } else {
        throw pyTypeError("unsupported operand type(s) for ** or pow(): 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

PyBool.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, [types.pyfloat, types.pyint, types.pybool])) {
        var thisValue
        if (this.valueOf()) {
            thisValue = types.pyint(1)
        } else {
            thisValue = types.pyint(0)
        }
        return thisValue.__floordiv__(other)
    } else if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't take floor of complex number.")
    } else {
        throw pyTypeError("unsupported operand type(s) for //: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__truediv__ = function(other) {
    if (types.isinstance(other, [types.pyfloat, types.pyint, types.pybool, types.pycomplex])) {
        var thisValue
        if (this.valueOf()) {
            thisValue = types.pyint(1)
        } else {
            thisValue = types.pyint(0)
        }
        return thisValue.__truediv__(other)
    } else {
        throw pyTypeError("unsupported operand type(s) for /: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__mul__ = function(other) {
    var this_bool

    if (types.isinstance(other, types.pybool)) {
        if (this.valueOf() && other.valueOf()) {
            return types.pyint(1)
        } else {
            return types.pyint(0)
        }
    } else if (types.isinstance(other, types.pyfloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return types.pyfloat(this_bool * other.valueOf())
    } else if (types.isinstance(other, types.pyint)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return types.pyint(this_bool * other.valueOf())
    } else if (types.isinstance(other, types.pycomplex)) {
        if (this.valueOf()) {
            return other
        } else {
            return types.pycomplex('0j')
        }
    } else if (types.isinstance(other, types.pystr)) {
        if (this.valueOf()) {
            return other
        } else {
            return types.pystr()
        }
    } else if (types.isinstance(other, types.pybytes)) {
        if (this.valueOf()) {
            return other
        } else {
            return types.pybytes()
        }
    } else if (types.isinstance(other, types.pytuple)) {
        if (this.valueOf()) {
            return other
        } else {
            return types.pytuple()
        }
    } else if (types.isinstance(other, types.pylist)) {
        if (this.valueOf()) {
            return types.pylist(other.valueOf())
        } else {
            return types.pylist([])
        }
    } else if (types.isinstance(other, types.pybytearray)) {
        if (this.valueOf()) {
            return types.pybytearray(other.valueOf())
        } else {
            return types.pybytearray(types.pybytes())
        }
    } else {
        throw pyTypeError("unsupported operand type(s) for *: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't mod complex numbers.")
    } else if ((types.isinstance(other, types.pyint) && other.val.isZero()) || (types.isinstance(other, types.pybool) && !other.valueOf())) {
        throw pyZeroDivisionError('integer division or modulo by zero')
    } else if (this.valueOf() && (types.isinstance(other, types.pyint) && other.valueOf() > 1)) {
        return types.pybool(true)
    } else if (this.valueOf() && (types.isinstance(other, types.pybool) && other.valueOf())) {
        return types.pyint(0)
    } else if (!this.valueOf() && types.isinstance(other, [types.pybool, types.pyint]) && other.valueOf()) {
        return types.pybool(false)
    } else if (types.isinstance(other, types.pyint)) {
        var this_val
        if (this.valueOf()) {
            this_val = types.pyint(1)
        } else {
            this_val = types.pyint(0)
        }
        return types.pyint(this_val.val.mod(other.val).add(other.val).mod(other.val))
    } else if (types.isinstance(other, types.pyfloat)) {
        var this_val2
        if (this.valueOf()) {
            this_val2 = types.pyint(1)
        } else {
            this_val2 = types.pyint(0)
        }
        var result = ((this_val2 % other) + other) % other
        if (other.valueOf() === 0.0) {
            throw pyZeroDivisionError('float modulo')
        } else {
            return types.pyfloat(result)
        }
    } else {
        throw pyTypeError("unsupported operand type(s) for %: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__add__ = function(other) {
    var this_bool

    if (types.isinstance(other, types.pybool)) {
        if (this.valueOf() && other.valueOf()) {
            return types.pyint(2)
        } else if (this.valueOf() || other.valueOf()) {
            return types.pyint(1)
        } else {
            return types.pyint(0)
        }
    } else if (types.isinstance(other, types.pyfloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return types.pyfloat(this_bool + other.valueOf())
    } else if (types.isinstance(other, types.pyint)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return types.pyint(other.val.add(this_bool))
    } else if (types.isinstance(other, types.pycomplex)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return types.pycomplex(this_bool + other.real, other.imag)
    } else {
        throw pyTypeError("unsupported operand type(s) for +: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__sub__ = function(other) {
    var this_bool

    if (types.isinstance(other, types.pybool)) {
        if (this.valueOf() && other.valueOf()) {
            return types.pyint(0)
        } else if (this.valueOf()) {
            return types.pyint(1)
        } else if (other.valueOf()) {
            return types.pyint(-1)
        } else {
            return types.pyint(0)
        }
    } else if (types.isinstance(other, types.pyfloat)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return types.pyfloat(this_bool - other.valueOf())
    } else if (types.isinstance(other, types.pyint)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return types.pyint(other.val.sub(this_bool).neg())
    } else if (types.isinstance(other, types.pycomplex)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return types.pycomplex(this_bool - other.real, 0 - other.imag)
    } else {
        throw pyTypeError("unsupported operand type(s) for -: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__getitem__ = function(other) {
    throw pyTypeError("'bool' object is not subscriptable")
}

PyBool.prototype.__setattr__ = function(other) {
    throw pyAttributeError("'bool' object has no attribute '" + other + "'")
}

PyBool.prototype.__lshift__ = function(other) {
    var this_bool

    if (types.isinstance(other, types.pybool)) {
        if (this.valueOf() && other.valueOf()) {
            return types.pyint(2)
        } else if (this.valueOf()) {
            return types.pyint(1)
        } else if (other.valueOf()) {
            return types.pyint(0)
        } else {
            return types.pyint(0)
        }
    } else if (types.isinstance(other, types.pyint)) {
        if (other.valueOf() < 0) {
            throw pyValueError('negative shift count')
        }
        if (Number.MAX_SAFE_INTEGER < other.valueOf()) {
            throw pyOverflowError('Python int too large to convert to C ssize_t')
        }
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return types.pyint(this_bool << other.valueOf())
    } else {
        throw pyTypeError("unsupported operand type(s) for <<: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__rshift__ = function(other) {
    var this_bool

    if (types.isinstance(other, types.pybool)) {
        if (this.valueOf() && !other.valueOf()) {
            return types.pyint(1)
        } else {
            return types.pyint(0)
        }
    } else if (types.isinstance(other, types.pyint)) {
        if (other.valueOf() < 0) {
            throw pyValueError('negative shift count')
        }
        if (Number.MAX_SAFE_INTEGER < Math.abs(other.valueOf())) {
            throw pyOverflowError('Python int too large to convert to C ssize_t')
        }
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return types.pyint(this_bool >> other.valueOf())
    } else {
        throw pyTypeError("unsupported operand type(s) for >>: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__and__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.pyint)) {
        return this.__int__().__and__(other)
    } else if (types.isinstance(other, types.pybool)) {
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
        return pybool(this_bool & other_bool)
    } else {
        throw pyTypeError("unsupported operand type(s) for &: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__xor__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.pyint)) {
        return this.__int__().__xor__(other)
    } else if (types.isinstance(other, types.pybool)) {
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
        return pybool(this_bool ^ other_bool)
    } else {
        throw pyTypeError("unsupported operand type(s) for ^: 'bool' and '" + type_name(other) + "'")
    }
}

PyBool.prototype.__or__ = function(other) {
    var this_bool, other_bool

    if (types.isinstance(other, types.pyint)) {
        return this.__int__().__or__(other)
    } else if (types.isinstance(other, types.pybool)) {
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
        return pybool(this_bool | other_bool)
    } else {
        throw pyTypeError("unsupported operand type(s) for |: 'bool' and '" + type_name(other) + "'")
    }
}

/**************************************************
 * Inplace operators
 **************************************************/

PyBool.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't take floor of complex number.")
    } else {
        try {
            return this.__floordiv__(other)
        } catch (e) {
            if (types.isinstance(e, pyTypeError)) {
                throw pyTypeError("unsupported operand type(s) for //=: '" + type_name(this) + "' and '" + type_name(other) + "'")
            } else {
                throw e
            }
        }
    }
}

PyBool.prototype.__itruediv__ = function(other) {
    try {
        return this.__truediv__(other)
    } catch (e) {
        if (types.isinstance(e, pyTypeError)) {
            throw pyTypeError("unsupported operand type(s) for /=: '" + type_name(this) + "' and '" + type_name(other) + "'")
        } else {
            throw e
        }
    }
}

PyBool.prototype.__iadd__ = function(other) {
    try {
        return this.__add__(other)
    } catch (e) {
        if (types.isinstance(e, pyTypeError)) {
            throw pyTypeError("unsupported operand type(s) for +=: '" + type_name(this) + "' and '" + type_name(other) + "'")
        } else {
            throw e
        }
    }
}

PyBool.prototype.__isub__ = function(other) {
    try {
        return this.__sub__(other)
    } catch (e) {
        if (types.isinstance(e, pyTypeError)) {
            throw pyTypeError("unsupported operand type(s) for -=: '" + type_name(this) + "' and '" + type_name(other) + "'")
        } else {
            throw e
        }
    }
}

PyBool.prototype.__imul__ = function(other) {
    try {
        return this.__mul__(other)
    } catch (e) {
        if (types.isinstance(e, pyTypeError)) {
            throw pyTypeError("unsupported operand type(s) for *=: '" + type_name(this) + "' and '" + type_name(other) + "'")
        } else {
            throw e
        }
    }
}

PyBool.prototype.__imod__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't mod complex numbers.")
    } else {
        try {
            return this.__mod__(other)
        } catch (e) {
            if (types.isinstance(e, pyTypeError)) {
                throw pyTypeError("unsupported operand type(s) for %=: '" + type_name(this) + "' and '" + type_name(other) + "'")
            } else {
                throw e
            }
        }
    }
}

PyBool.prototype.__ipow__ = function(other) {
    try {
        return this.__pow__(other)
    } catch (e) {
        if (types.isinstance(e, pyTypeError)) {
            throw pyTypeError("unsupported operand type(s) for ** or pow(): '" + type_name(this) + "' and '" + type_name(other) + "'")
        } else {
            throw e
        }
    }
}

PyBool.prototype.__ilshift__ = function(other) {
    try {
        return this.__lshift__(other)
    } catch (e) {
        if (types.isinstance(e, pyTypeError)) {
            throw pyTypeError("unsupported operand type(s) for <<=: '" + type_name(this) + "' and '" + type_name(other) + "'")
        } else {
            throw e
        }
    }
}

PyBool.prototype.__irshift__ = function(other) {
    try {
        return this.__rshift__(other)
    } catch (e) {
        if (types.isinstance(e, pyTypeError)) {
            throw pyTypeError("unsupported operand type(s) for >>=: '" + type_name(this) + "' and '" + type_name(other) + "'")
        } else {
            throw e
        }
    }
}

PyBool.prototype.__iand__ = function(other) {
    try {
        return this.__and__(other)
    } catch (e) {
        if (types.isinstance(e, pyTypeError)) {
            throw pyTypeError("unsupported operand type(s) for &=: '" + type_name(this) + "' and '" + type_name(other) + "'")
        } else {
            throw e
        }
    }
}

PyBool.prototype.__ixor__ = function(other) {
    try {
        return this.__xor__(other)
    } catch (e) {
        if (types.isinstance(e, pyTypeError)) {
            throw pyTypeError("unsupported operand type(s) for ^=: '" + type_name(this) + "' and '" + type_name(other) + "'")
        } else {
            throw e
        }
    }
}

PyBool.prototype.__ior__ = function(other) {
    try {
        return this.__or__(other)
    } catch (e) {
        if (types.isinstance(e, pyTypeError)) {
            throw pyTypeError("unsupported operand type(s) for |=: '" + type_name(this) + "' and '" + type_name(other) + "'")
        } else {
            throw e
        }
    }
}

/**************************************************
 * Methods
 **************************************************/

PyBool.prototype.copy = function() {
    return this.valueOf()
}

PyBool.prototype.__trunc__ = function() {
    if (this.valueOf()) {
        return types.pyint(1)
    }
    return types.pyint(0)
}

const pybool = jstype(PyBool, 'bool', [], null)
PyBool.prototype.__class__ = pybool

export default pybool

