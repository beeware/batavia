import { NotImplementedError, TypeError, ValueError, ZeroDivisionError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

/*************************************************************************
 * A Python complex type
 *************************************************************************/

function part_from_str(s) {
    if (s && s.valueOf() === '-0') {
        // console.log("there");
        return new types.Float(-0)
    } else if (s) {
        // console.log("part_from_str: " + s);
        return new types.Float(s)
    } else {
        return new types.Float(0)
    }
}

function part_to_str(x) {
    var x_str
    if (x) {
        x_str = x.valueOf().toString()
        var abs_len = Math.abs(x.valueOf()).toString().length
        if (abs_len >= 19) {
            // force conversion to scientific
            var new_str = x.valueOf().toExponential()
            if (new_str.length < x_str.length) {
                x_str = new_str
            }
        }
    } else if (Object.is(x, -0)) {
        x_str = '-0'
    } else {
        x_str = '0'
    }
    return x_str
}

export default function Complex(re, im) {
    PyObject.call(this)

    // console.log(100000, re, im);
    if (types.isinstance(re, types.Str)) {
        // console.log(1000, re, im);
        var regex = /^\(?(-?[\d.]+)?([+-])?(?:([\d.]+)j)?\)?$/i
        var match = regex.exec(re)
        if (match === null || re === '') {
            throw new ValueError('complex() arg is a malformed string')
        }
        this.real = parseFloat(part_from_str(match[1]))
        this.imag = parseFloat(part_from_str(match[3]))
        if (match[2] === '-') {
            this.imag = -this.imag
        }
    } else if (!types.isinstance(re, [types.Float, types.Int, types.Bool, types.Complex])) {
        if (version.later('3.5')) {
            throw new TypeError(
                "complex() first argument must be a string, a bytes-like object or a number, not '" +
                type_name(re) + "'"
            )
        } else {
            throw new TypeError(
                "complex() argument must be a string, a bytes-like object or a number, not '" +
                type_name(re) + "'"
            )
        }
    } else if (!types.isinstance(im, [types.Float, types.Int, types.Bool, types.Complex])) {
        if (version.later('3.5')) {
            throw new TypeError(
                "complex() first argument must be a string, a bytes-like object or a number, not '" +
                type_name(im) + "'"
            )
        } else {
            throw new TypeError(
                "complex() argument must be a string, a bytes-like object or a number, not '" +
                type_name(im) + "'"
            )
        }
    } else if (typeof re === 'number' && typeof im === 'number') {
        this.real = re
        this.imag = im
    } else if (types.isinstance(re, [types.Float, types.Int, types.Bool]) &&
        types.isinstance(im, [types.Float, types.Int, types.Bool])) {
        // console.log(2000, re, im);
        this.real = re.__float__().valueOf()
        this.imag = im.__float__().valueOf()
    } else if (types.isinstance(re, types.Complex) && !im) {
        // console.log(3000, re, im);
        this.real = re.real
        this.imag = re.imag
    } else {
        throw new NotImplementedError('Complex initialization from complex argument(s) has not been implemented')
    }
}

create_pyclass(Complex, 'complex')

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Complex.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Complex.prototype.__bool__ = function() {
    return Boolean(this.real || this.imag)
}

Complex.prototype.__repr__ = function() {
    return this.__str__()
}

Complex.prototype.__str__ = function() {
    if (this.real.valueOf() || Object.is(this.real, -0)) {
        var sign
        if (this.imag >= 0) {
            sign = '+'
        } else {
            sign = '-'
        }
        return '(' + part_to_str(this.real) + sign + part_to_str(Math.abs(this.imag)) + 'j)'
    } else {
        return part_to_str(this.imag) + 'j'
    }
}

/**************************************************
 * Comparison operators
 **************************************************/

Complex.prototype.__lt__ = function(other) {
    if (version.earlier('3.6')) {
        throw new TypeError.$pyclass(
            'unorderable types: complex() < ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError.$pyclass(
            "'<' not supported between instances of 'complex' and '" + type_name(other) + "'"
        )
    }
}

Complex.prototype.__le__ = function(other) {
    if (version.earlier('3.6')) {
        throw new TypeError.$pyclass(
            'unorderable types: complex() <= ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError.$pyclass(
            "'<=' not supported between instances of 'complex' and '" + type_name(other) + "'"
        )
    }
}

Complex.prototype.__eq__ = function(other) {
    if (other !== null && !types.isinstance(other, types.Str)) {
        if (types.isinstance(other, types.Complex)) {
            return this.real.valueOf() === other.real.valueOf() && this.imag.valueOf() === other.imag.valueOf()
        }
        var val
        if (types.isinstance(other, types.Bool)) {
            if (other.valueOf()) {
                val = 1.0
            } else {
                val = 0.0
            }
        } else {
            val = other.valueOf()
        }
        return this.real === val && this.imag === 0
    }
    return false
}

Complex.prototype.__ne__ = function(other) {
    return !this.__eq__(other)
}

Complex.prototype.__gt__ = function(other) {
    if (version.earlier('3.6')) {
        throw new TypeError.$pyclass(
            'unorderable types: complex() > ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError.$pyclass(
            "'>' not supported between instances of 'complex' and '" + type_name(other) + "'"
        )
    }
}

Complex.prototype.__ge__ = function(other) {
    if (version.earlier('3.6')) {
        throw new TypeError.$pyclass(
            'unorderable types: complex() >= ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError.$pyclass(
            "'>=' not supported between instances of 'complex' and '" + type_name(other) + "'"
        )
    }
}

/**************************************************
 * Unary operators
 **************************************************/

Complex.prototype.__pos__ = function() {
    return new Complex(this.real, this.imag)
}

Complex.prototype.__neg__ = function() {
    return new Complex(-this.real, -this.imag)
}

Complex.prototype.__not__ = function() {
    return !this.__bool__()
}

Complex.prototype.__invert__ = function() {
    throw new TypeError.$pyclass("bad operand type for unary ~: 'complex'")
}

Complex.prototype.__abs__ = function() {
    return new types.Float(Math.sqrt(this.real * this.real + this.imag * this.imag))
}

/**************************************************
 * Binary operators
 **************************************************/

Complex.prototype.__pow__ = function(exponent) {
    // types.Bool?? Yes, really; under the hood cpython checks to see if the
    // exponent is a numeric type, and bool subclasses int.
    // See cpython/Objects/abstract.c.
    if (types.isinstance(exponent, types.Bool)) {
        if (exponent.valueOf()) {
            return this
        } else {
            return new Complex(1, 0)
        }
    // else if (types.isinstance(exponent, [types.Float, types.Int, types.Complex]) {
    // { do some stuff }
    } else {
        throw new TypeError.$pyclass(
            "unsupported operand type(s) for ** or pow(): 'complex' and '" + type_name(exponent) + "'"
        )
    }
}

function __div__(x, y, inplace) {
    if (types.isinstance(y, types.Int)) {
        if (!y.val.isZero()) {
            return new Complex(x.real / y.__float__().val, x.imag / y.__float__().val)
        } else {
            throw new ZeroDivisionError.$pyclass('complex division by zero')
        }
    } else if (types.isinstance(y, types.Float)) {
        if (y.valueOf()) {
            return new Complex(x.real / y.valueOf(), x.imag / y.valueOf())
        } else {
            throw new ZeroDivisionError.$pyclass('complex division by zero')
        }
    } else if (types.isinstance(y, types.Bool)) {
        if (y.valueOf()) {
            return new Complex(x.real, x.imag)
        } else {
            throw new ZeroDivisionError.$pyclass('complex division by zero')
        }
    } else if (types.isinstance(y, types.Complex)) {
        var den = Math.pow(y.real, 2) + Math.pow(y.imag, 2)
        var num_real = x.real * y.real + x.imag * y.imag
        var num_imag = x.imag * y.real - x.real * y.imag
        var real = num_real / den
        var imag = num_imag / den
        return new Complex(real, imag)
    } else {
        var prefix
        if (inplace) {
            prefix = '='
        } else {
            prefix = ''
        }
        throw new TypeError.$pyclass(
            'unsupported operand type(s) for /' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

Complex.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Complex.prototype.__floordiv__ = function(other) {
    throw new TypeError.$pyclass("can't take floor of complex number.")
}

Complex.prototype.__truediv__ = function(other) {
    return __div__(this, other)
}

function __mul__(x, y, inplace) {
    if (types.isinstance(y, types.Int)) {
        if (!y.val.isZero()) {
            return new Complex(x.real * y.__float__().val, x.imag * y.__float__().val)
        } else {
            return new Complex(0, 0)
        }
    } else if (types.isinstance(y, types.Float)) {
        if (y.valueOf()) {
            return new Complex(x.real * y.valueOf(), x.imag * y.valueOf())
        } else {
            return new Complex(0, 0)
        }
    } else if (types.isinstance(y, types.Bool)) {
        if (y.valueOf()) {
            return new Complex(x.real, x.imag)
        } else {
            return new Complex(0, 0)
        }
    } else if (types.isinstance(y, types.Complex)) {
        return new Complex(x.real * y.real - x.imag * y.imag, x.real * y.imag + x.imag * y.real)
    } else if (types.isinstance(y, [types.List, types.Str, types.Tuple, types.Bytearray, types.Bytes])) {
        throw new TypeError.$pyclass("can't multiply sequence by non-int of type 'complex'")
    } else {
        var prefix
        if (inplace) {
            prefix = '='
        } else {
            prefix = ''
        }
        throw new TypeError.$pyclass(
            'unsupported operand type(s) for *' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

Complex.prototype.__mul__ = function(other) {
    return __mul__(this, other)
}

Complex.prototype.__mod__ = function(other) {
    throw new TypeError.$pyclass("can't mod complex numbers.")
}

function __add__(x, y, inplace) {
    if (types.isinstance(y, types.Int)) {
        return new Complex(x.real + y.__float__().val, x.imag)
    } else if (types.isinstance(y, types.Float)) {
        return new Complex(x.real + y.valueOf(), x.imag)
    } else if (types.isinstance(y, types.Bool)) {
        if (y.valueOf()) {
            return new Complex(x.real + 1.0, x.imag)
        } else {
            return new Complex(x.real, x.imag)
        }
    } else if (types.isinstance(y, types.Complex)) {
        return new Complex(x.real + y.real, x.imag + y.imag)
    } else {
        var prefix
        if (inplace) {
            prefix = '='
        } else {
            prefix = ''
        }
        throw new TypeError.$pyclass(
            'unsupported operand type(s) for +' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

Complex.prototype.__add__ = function(other) {
    return __add__(this, other)
}

function __sub__(x, y, inplace) {
    if (types.isinstance(y, types.Int)) {
        return new Complex(x.real - y.__float__().val, x.imag)
    } else if (types.isinstance(y, types.Float)) {
        return new Complex(x.real - y.valueOf(), x.imag)
    } else if (types.isinstance(y, types.Bool)) {
        if (y.valueOf()) {
            return new Complex(x.real - 1.0, x.imag)
        } else {
            return new Complex(x.real, x.imag)
        }
    } else if (types.isinstance(y, types.Complex)) {
        return new Complex(x.real - y.real, x.imag - y.imag)
    } else {
        var prefix
        if (inplace) {
            prefix = '='
        } else {
            prefix = ''
        }
        throw new TypeError.$pyclass(
            'unsupported operand type(s) for -' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

Complex.prototype.__sub__ = function(other) {
    return __sub__(this, other)
}

Complex.prototype.__getitem__ = function(other) {
    throw new TypeError.$pyclass("'complex' object is not subscriptable")
}

Complex.prototype.__lshift__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for <<: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__rshift__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for >>: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__and__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for &: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__xor__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for ^: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__or__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for |: 'complex' and '" + type_name(other) + "'"
    )
}

/**************************************************
 * Inplace operators
 **************************************************/

Complex.prototype.__ifloordiv__ = function(other) {
    throw new TypeError.$pyclass("can't take floor of complex number.")
}

Complex.prototype.__itruediv__ = function(other) {
    return __div__(this, other, true)
}

Complex.prototype.__iadd__ = function(other) {
    return __add__(this, other, true)
}

Complex.prototype.__isub__ = function(other) {
    return __sub__(this, other, true)
}

Complex.prototype.__imul__ = function(other) {
    return __mul__(this, other, true)
}

Complex.prototype.__imod__ = function(other) {
    throw new TypeError.$pyclass("can't mod complex numbers.")
}

Complex.prototype.__ipow__ = function(other) {
    throw new NotImplementedError.$pyclass('Complex.__ipow__ has not been implemented')
}

Complex.prototype.__ilshift__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for <<=: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__irshift__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for >>=: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__iand__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for &=: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__ixor__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for ^=: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__ior__ = function(other) {
    throw new TypeError.$pyclass(
        "unsupported operand type(s) for |=: 'complex' and '" + type_name(other) + "'"
    )
}

/**************************************************
 * Methods
 **************************************************/

Complex.prototype.add = function(v) {
    this[v] = null
}

Complex.prototype.copy = function() {
    return new Complex(this)
}

Complex.prototype.remove = function(v) {
    delete this[v]
}

Complex.prototype.update = function(values) {
    for (var value in values) {
        if (values.hasOwnProperty(value)) {
            this[values[value]] = null
        }
    }
}
