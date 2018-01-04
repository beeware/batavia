import BigNumber from 'bignumber.js'

import {
    AttributeError,
    IndexError,
    MemoryError,
    OverflowError,
    TypeError,
    ValueError,
    ZeroDivisionError
} from '../core/exceptions'
import { create_pyclass, type_name, PyObject, None } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

import * as utils from './utils'

/*************************************************************************
 * A Python int type
 *************************************************************************/

export default function Int(val) {
    PyObject.call(this)
    if (typeof val === 'boolean') {
        if (this.valueOf()) {
            this.val = new BigNumber(1)
        } else {
            this.val = new BigNumber(0)
        }
    } else {
        this.val = new BigNumber(val)
    }
}

create_pyclass(Int, 'int')

var REASONABLE_SHIFT = new Int('8192')
var MAX_SHIFT = new Int('9223372036854775807')
var MAX_INT = new Int('9223372036854775807')
var MIN_INT = new Int('-9223372036854775808')
var MAX_FLOAT = new Int('179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791')
var MIN_FLOAT = new Int('-179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791')

Int.prototype.MAX_INT = MAX_INT
Int.prototype.MIN_INT = MIN_INT
Int.prototype.MAX_FLOAT = MAX_FLOAT
Int.prototype.MIN_FLOAT = MIN_FLOAT

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Int.prototype.int32 = function() {
    if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
        throw new IndexError("cannot fit 'int' into an index-sized integer")
    }
    return parseInt(this.valueOf())
}

Int.prototype.bigNumber = function() {
    return new BigNumber(this.val)
}

Int.prototype.valueOf = function() {
    return this.val.valueOf()
}

Int.prototype.toString = function(base = 10) {
    return this.__str__(base)
}

/**************************************************
 * Type conversions
 **************************************************/

Int.prototype.__bool__ = function() {
    return !this.val.isZero()
}

Int.prototype.__repr__ = function() {
    return this.__str__()
}

Int.prototype.__str__ = function(base = 10) {
    return this.val.round().toString(base)
}

var can_float = function(num) {
    return !(num.gt(MAX_FLOAT.val) || num.lt(MIN_FLOAT.val))
}

Int.prototype.__float__ = function() {
    if (!can_float(this.val)) {
        throw new OverflowError('int too large to convert to float')
    }
    return new types.Float(parseFloat(this.val))
}

Int.prototype.__int__ = function() {
    return this
}

/**************************************************
 * Comparison operators
 **************************************************/

Int.prototype.__lt__ = function(other) {
    if (other !== None) {
        if (types.isinstance(other, types.Bool)) {
            if (other) {
                return this.val.lt(1)
            } else {
                return this.val.lt(0)
            }
        } else if (types.isinstance(other, Int)) {
            return this.val.lt(other.val)
        } else if (types.isinstance(other, types.Float)) {
            return this.val.lt(other.valueOf())
        } else {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: int() < ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'<' not supported between instances of 'int' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: int() < NoneType()'
            )
        } else {
            throw new TypeError(
                "'<' not supported between instances of 'int' and 'NoneType'"
            )
        }
    }
}

Int.prototype.__le__ = function(other) {
    if (other !== None) {
        if (types.isinstance(other, types.Bool)) {
            if (other) {
                return this.val.lte(new Int(1))
            } else {
                return this.val.lte(new Int(0))
            }
        } else if (types.isinstance(other, Int)) {
            return this.val.lte(other.val)
        } else if (types.isinstance(other, types.Float)) {
            return this.val.lte(other.valueOf())
        } else {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: int() <= ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'<=' not supported between instances of 'int' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: int() <= NoneType()'
            )
        } else {
            throw new TypeError(
                "'<=' not supported between instances of 'int' and 'NoneType'"
            )
        }
    }
}

Int.prototype.__eq__ = function(other) {
    if (types.isinstance(other, [types.Float, Int])) {
        return this.val.eq(other.val)
    } else if (types.isinstance(other, types.Bool)) {
        if (other) {
            return this.val.eq(new Int(1))
        } else {
            return this.val.eq(new Int(0))
        }
    } else {
        return false
    }
}

Int.prototype.__ne__ = function(other) {
    return !this.__eq__(other)
}

Int.prototype.__gt__ = function(other) {
    if (other !== None) {
        if (types.isinstance(other, types.Bool)) {
            if (other) {
                return this.val.gt(new Int(1))
            } else {
                return this.val.gt(new Int(0))
            }
        } else if (types.isinstance(other, Int)) {
            return this.val.gt(other.val)
        } else if (types.isinstance(other, types.Float)) {
            return this.val.gt(other.valueOf())
        } else {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: int() > ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'>' not supported between instances of 'int' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: int() > NoneType()'
            )
        } else {
            throw new TypeError(
                "'>' not supported between instances of 'int' and 'NoneType'"
            )
        }
    }
}

Int.prototype.__ge__ = function(other) {
    if (other !== None) {
        if (types.isinstance(other, types.Bool)) {
            if (other) {
                return this.val.gte(new Int(1))
            } else {
                return this.val.gte(new Int(0))
            }
        } else if (types.isinstance(other, Int)) {
            return this.val.gte(other.val)
        } else if (types.isinstance(other, types.Float)) {
            return this.val.gte(other.valueOf())
        } else {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: int() >= ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'>=' not supported between instances of 'int' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: int() >= NoneType()'
            )
        } else {
            throw new TypeError(
                "'>=' not supported between instances of 'int' and 'NoneType'"
            )
        }
    }
}

Int.prototype.__contains__ = function(other) {
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

Int.prototype.__pos__ = function() {
    return this
}

Int.prototype.__neg__ = function() {
    return new Int(this.val.neg())
}

Int.prototype.__not__ = function() {
    return new types.Bool(this.val.isZero())
}

Int.prototype.__invert__ = function() {
    return new Int(this.val.neg().sub(1))
}

Int.prototype.__abs__ = function() {
    return new Int(this.val.abs())
}

/**************************************************
 * Binary operators
 **************************************************/

Int.prototype.__pow__ = function(other) {
    if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return this
        } else {
            return new Int(1)
        }
    } else if (types.isinstance(other, Int)) {
        if (other.val.isNegative()) {
            return this.__float__().__pow__(other)
        } else {
            var y = other.val.toString(2).split('')
            var result = new BigNumber(1)
            var base = this.val.add(0)
            while (y.length > 0) {
                var bit = y.pop()
                if (bit === '1') {
                    result = result.mul(base)
                }
                base = base.mul(base)
            }
            return new Int(result)
        }
    } else if (types.isinstance(other, types.Float)) {
        return this.__float__().__pow__(other)
    } else {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Int.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, Int)) {
        if (!other.val.isZero()) {
            var quo = this.val.div(other.val)
            var quo_floor = quo.floor()
            var rem = this.val.mod(other.val)

            if (rem.isZero()) {
                return new Int(quo_floor)
            }
            // we have a fraction leftover
            // check if it is too small for bignumber.js to detect
            if (quo.isInt() && quo.isNegative()) {
                return new Int(quo.sub(1))
            }
            return new Int(quo_floor)
        } else {
            throw new ZeroDivisionError('integer division or modulo by zero')
        }
    } else if (types.isinstance(other, types.Float)) {
        var f = this.__float__()
        if (other.valueOf()) {
            return f.__floordiv__(other)
        } else {
            throw new ZeroDivisionError('float divmod()')
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Int(this.val.floor())
        } else {
            throw new ZeroDivisionError('integer division or modulo by zero')
        }
    } else if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        throw new TypeError("unsupported operand type(s) for //: 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__truediv__ = function(other) {
    // if it is dividing by another int, we can allow both to be bigger than floats
    if (types.isinstance(other, Int)) {
        if (other.val.isZero()) {
            throw new ZeroDivisionError('division by zero')
        }
        var result = this.val.div(other.val)
        if (!can_float(result)) {
            throw new OverflowError('integer division result too large for a float')
        }
        // check for negative 0
        if (other.val.lt(0) && result.isZero()) {
            return new types.Float(parseFloat('-0.0'))
        }
        return new Int(result).__float__()
    } else if (types.isinstance(other, types.Float)) {
        return this.__float__().__div__(other)
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return this.__truediv__(new Int(1))
        } else {
            return this.__truediv__(new Int(0))
        }
    } else if (types.isinstance(other, types.Complex)) {
        var castToComplex = new types.Complex(this.valueOf())
        return castToComplex.__truediv__(other.valueOf())
    } else {
        throw new TypeError("unsupported operand type(s) for /: 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__mul__ = function(other) {
    var result, i

    if (types.isinstance(other, Int)) {
        return new Int(this.val.mul(other.val))
    } else if (types.isinstance(other, types.Float)) {
        return this.__float__().__mul__(other.val)
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return this
        } else {
            return new Int(0)
        }
    } else if (types.isinstance(other, types.List)) {
        if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
            throw new OverflowError("cannot fit 'int' into an index-sized integer")
        }
        if ((other.length === 0) || (this.valueOf() < 0)) {
            return new types.List()
        }
        if (this.valueOf() > 4294967295) {
            throw new MemoryError('')
        }
        result = new types.List()
        for (i = 0; i < this.valueOf(); i++) {
            result.extend(other)
        }
        return result
    } else if (types.isinstance(other, types.Str)) {
        if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
            throw new OverflowError("cannot fit 'int' into an index-sized integer")
        }
        if (this.val.isNegative()) {
            return ''
        }
        var size = this.val.mul(other.length)
        if (size.gt(MAX_INT.val)) {
            throw new OverflowError('repeated string is too long')
        }
        if (other.length === 0) {
            return ''
        }
        if ((this.valueOf() > 4294967295) || (this.valueOf() < -4294967296)) {
            throw new MemoryError('')
        }

        result = ''
        for (i = 0; i < this.valueOf(); i++) {
            result += other.valueOf()
        }
        return result
    } else if (types.isinstance(other, types.Tuple)) {
        if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
            throw new OverflowError("cannot fit 'int' into an index-sized integer")
        }
        if ((other.length === 0) || (this.valueOf() < 0)) {
            return new types.Tuple()
        }
        if (this.valueOf() > 4294967295) {
            throw new MemoryError('')
        }
        result = new types.Tuple()
        for (i = 0; i < this.valueOf(); i++) {
            result = result.__add__(other)
        }
        return result
    } else if (types.isinstance(other, types.Bytes)) {
        if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
            throw new OverflowError("cannot fit 'int' into an index-sized integer")
        }
        if ((other.__len__() <= 0) || (this.valueOf() <= 0)) {
            return new types.Bytes('')
        }
        if (this.valueOf() > 4294967295) {
            throw new OverflowError('repeated bytes are too long')
        }
        return other.__mul__(this)
    } else if (types.isinstance(other, types.Bytearray)) {
        if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
            throw new OverflowError("cannot fit 'int' into an index-sized integer")
        }
        if ((other.length <= 0) || (this.valueOf() <= 0)) {
            return new types.Bytearray('')
        }
        if (this.valueOf() > 4294967295) {
            throw new MemoryError('')
        }
        result = new types.Bytearray('')
        for (i = 0; i < this.valueOf(); i++) {
            result = new types.Bytearray(result.valueOf() + other.valueOf())
        }
        return result
    } else if (types.isinstance(other, types.Complex)) {
        if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
            throw new OverflowError('int too large to convert to float')
        } else {
            return new types.Complex(this.val.mul(other.real).toNumber(), this.val.mul(other.imag).toNumber())
        }
    } else {
        throw new TypeError("unsupported operand type(s) for *: 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__mod__ = function(other) {
    if (types.isinstance(other, Int)) {
        if (!other.val.isZero()) {
            return new Int(this.val.mod(other.val).add(other.val).mod(other.val))
        } else {
            throw new ZeroDivisionError('integer division or modulo by zero')
        }
    } else if (types.isinstance(other, types.Float)) {
        var f = this.__float__()
        if (other.valueOf()) {
            return f.__mod__(other)
        } else {
            throw new ZeroDivisionError('float modulo')
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Int(0)
        } else {
            throw new ZeroDivisionError('integer division or modulo by zero')
        }
    } else if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't mod complex numbers.")
    } else {
        throw new TypeError("unsupported operand type(s) for %: 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__add__ = function(other) {
    if (types.isinstance(other, Int)) {
        return new Int(this.val.add(other.val))
    } else if (types.isinstance(other, types.Float)) {
        return this.__float__().__add__(other)
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Int(this.val.add(1))
        } else {
            return this
        }
    } else if (types.isinstance(other, types.Complex)) {
        if (this.__float__() > MAX_FLOAT || this.__float__() < MIN_FLOAT) {
            throw new OverflowError('int too large to convert to float')
        } else {
            return new types.Complex(this.val.add(other.real).toNumber(), other.imag)
        }
    } else {
        throw new TypeError("unsupported operand type(s) for +: 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__sub__ = function(other) {
    if (types.isinstance(other, Int)) {
        return new Int(this.val.sub(other.val))
    } else if (types.isinstance(other, types.Float)) {
        return this.__float__().__sub__(other)
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Int(this.val.sub(1))
        } else {
            return this
        }
    } else {
        throw new TypeError("unsupported operand type(s) for -: 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__getitem__ = function(index) {
    throw new TypeError("'int' object is not subscriptable")
}

Int.prototype.__setattr__ = function(other) {
    throw new AttributeError("'int' object has no attribute '" + other + "'")
}
/**************************************************
 * Bitshift and logical ops
 **************************************************/

// converts this integer to an binary array for efficient bit operations
// BUG: javascript bignumber is incredibly inefficient for bit operations
var toArray = function(self) {
    return self.val.abs().toString(2).split('').map(function(x) { return x - '0' })
}

Int.prototype._bits = function() {
    return toArray(this)
}

// convert a binary array back into an int
var fromArray = function(arr) {
    return new Int(new BigNumber(arr.join('') || 0, 2))
}
// return j with the sign inverted if i is negative.
var fixSign = function(i, j) {
    if (i.val.isNeg()) {
        return j.__neg__()
    }
    return j
}
// invert the bits of an array
var invert = function(arr) {
    return arr.map(function(x) { return 1 - x })
}
// add 1 to the bit array
var plusOne = function(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === 0) {
            arr[i] = 1
            return
        }
        arr[i] = 0
    }
    arr.reverse()
    arr.push(1)
    arr.reverse()
}
// convert the int to an array, and negative ints to their
// twos complement representation
var twos_complement = function(n) {
    var arr = toArray(n)
    if (n.val.isNeg()) {
        arr = invert(arr)
        plusOne(arr)
    }
    return arr
}
// extend a to be at least b bits long (by prepending zeros or ones)
var extend = function(a, b, ones) {
    if (a.length >= b.length) {
        return
    }
    a.reverse()
    while (a.length < b.length) {
        if (ones) {
            a.push(1)
        } else {
            a.push(0)
        }
    }
    a.reverse()
}

Int.prototype.__lshift__ = function(other) {
    if (types.isinstance(other, Int)) {
        // Anything beyond ~8192 bits is too inefficient to convert to a binary array
        // due to Bignumber.js.
        if (other.val.gt(REASONABLE_SHIFT.val)) {
            throw new OverflowError('batavia: shift too large')
        }
        if (other.val.gt(MAX_SHIFT.val)) {
            throw new OverflowError('Python int too large to convert to C ssize_t')
        }
        if (other.valueOf() < 0) {
            throw new ValueError('negative shift count')
        }
        var arr = toArray(this)
        for (var i = 0; i < other.valueOf(); i++) {
            arr.push(0)
        }
        return fixSign(this, new Int(fromArray(arr)))
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return this.__lshift__(new Int(1))
        } else {
            return this
        }
    } else {
        throw new TypeError("unsupported operand type(s) for <<: 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__rshift__ = function(other) {
    if (types.isinstance(other, Int)) {
        if (this.val.isNegative()) {
            return this.__invert__().__rshift__(other).__invert__()
        }
        // Anything beyond ~8192 bits is too inefficient to convert to a binary array
        // due to Bignumber.js.
        if (other.val.gt(MAX_INT.val) || other.val.lt(MIN_INT.val)) {
            throw new OverflowError('Python int too large to convert to C ssize_t')
        }
        if (other.val.gt(REASONABLE_SHIFT.val)) {
            throw new ValueError('batavia: shift too large')
        }
        if (other.val.isNegative()) {
            throw new ValueError('negative shift count')
        }
        if (this.val.isZero()) {
            return this
        }
        var arr = toArray(this)
        if (other.val.gt(arr.length)) {
            return new Int(0)
        }
        return fixSign(this, fromArray(arr.slice(0, arr.length - other.valueOf())))
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return this.__rshift__(new Int(1))
        }
        return this
    } else {
        throw new TypeError("unsupported operand type(s) for >>: 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__and__ = function(other) {
    if (types.isinstance(other, Int)) {
        var a = twos_complement(this)
        var b = twos_complement(other)
        extend(a, b, this.val.isNeg())
        extend(b, a, other.val.isNeg())
        var i = a.length - 1
        var j = b.length - 1
        var arr = []
        while (i >= 0 && j >= 0) {
            arr.push(a[i] & b[j])
            i--
            j--
        }
        arr.reverse()
        if (this.val.isNeg() && other.val.isNeg()) {
            arr = invert(arr)
            return fromArray(arr).__add__(new Int(1)).__neg__()
        }
        return fromArray(arr)
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return this.__and__(new Int(1))
        }
        return new Int(0)
    } else {
        throw new TypeError("unsupported operand type(s) for &: 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__xor__ = function(other) {
    if (types.isinstance(other, Int)) {
        if (this.val.isNeg()) {
            return this.__invert__().__xor__(other).__invert__()
        }
        if (other.val.isNeg()) {
            return this.__xor__(other.__invert__()).__invert__()
        }
        var a = twos_complement(this)
        var b = twos_complement(other)
        extend(a, b)
        extend(b, a)
        var i = a.length - 1
        var j = b.length - 1
        var arr = []
        while (i >= 0 && j >= 0) {
            arr.push(a[i] ^ b[j])
            i--
            j--
        }
        arr.reverse()
        return fromArray(arr)
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return this.__xor__(new Int(1))
        }
        return this
    } else {
        throw new TypeError("unsupported operand type(s) for ^: 'int' and '" + type_name(other) + "'")
    }
}

Int.prototype.__or__ = function(other) {
    if (types.isinstance(other, Int)) {
        if (this.val.eq(other.val)) {
            return this
        }
        if (this.val.eq(-1) || other.val.eq(-1)) {
            return new Int(-1)
        }
        if (this.val.isZero()) {
            return other
        }
        var a = twos_complement(this)
        var b = twos_complement(other)
        extend(a, b, this.val.isNeg())
        extend(b, a, other.val.isNeg())
        var i = a.length - 1
        var j = b.length - 1
        var arr = []
        while (i >= 0 && j >= 0) {
            arr.push(a[i] | b[j])
            i--
            j--
        }
        arr.reverse()
        if (this.val.isNeg() || other.val.isNeg()) {
            arr = invert(arr)
            return fromArray(arr).__add__(new Int(1)).__neg__()
        }
        return fromArray(arr)
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return this.__or__(new Int(1))
        }
        return this
    } else {
        throw new TypeError("unsupported operand type(s) for |: 'int' and '" + type_name(other) + "'")
    }
}

/**************************************************
 * Inplace operators
 **************************************************/

Int.prototype.__ifloordiv__ = function(other) {
    return utils.inplace_call('__floordiv__', '//=', this, other)
}

Int.prototype.__itruediv__ = function(other) {
    return utils.inplace_call('__truediv__', '/=', this, other)
}

Int.prototype.__iadd__ = function(other) {
    return utils.inplace_call('__add__', '+=', this, other)
}

Int.prototype.__isub__ = function(other) {
    return utils.inplace_call('__sub__', '-=', this, other)
}

Int.prototype.__imul__ = function(other) {
    return utils.inplace_call('__mul__', '*=', this, other)
}

Int.prototype.__imod__ = function(other) {
    return utils.inplace_call('__mod__', '%=', this, other)
}

Int.prototype.__ipow__ = function(other) {
    return this.__pow__(other)
}

Int.prototype.__ilshift__ = function(other) {
    return utils.inplace_call('__lshift__', '<<=', this, other)
}

Int.prototype.__irshift__ = function(other) {
    return utils.inplace_call('__rshift__', '>>=', this, other)
}

Int.prototype.__iand__ = function(other) {
    return utils.inplace_call('__and__', '&=', this, other)
}

Int.prototype.__ixor__ = function(other) {
    return utils.inplace_call('__xor__', '^=', this, other)
}

Int.prototype.__ior__ = function(other) {
    return utils.inplace_call('__or__', '|=', this, other)
}

/**************************************************
 * Methods
 **************************************************/

Int.prototype.copy = function() {
    return new Int(this.valueOf())
}

Int.prototype.__trunc__ = function() {
    return this
}
