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

export default class Complex extends PyObject {
    constructor(re, im) {
        super()

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

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    toString() {
        return this.__str__()
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__() {
        return Boolean(this.real || this.imag)
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
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

    __lt__(other) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: complex() < ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'<' not supported between instances of 'complex' and '" + type_name(other) + "'"
            )
        }
    }

    __le__(other) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: complex() <= ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'<=' not supported between instances of 'complex' and '" + type_name(other) + "'"
            )
        }
    }

    __eq__(other) {
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

    __ne__(other) {
        return !this.__eq__(other)
    }

    __gt__(other) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: complex() > ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'>' not supported between instances of 'complex' and '" + type_name(other) + "'"
            )
        }
    }

    __ge__(other) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: complex() >= ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'>=' not supported between instances of 'complex' and '" + type_name(other) + "'"
            )
        }
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        return new Complex(this.real, this.imag)
    }

    __neg__() {
        return new Complex(-this.real, -this.imag)
    }

    __not__() {
        return !this.__bool__()
    }

    __invert__() {
        throw new TypeError("bad operand type for unary ~: 'complex'")
    }

    __abs__() {
        return new types.Float(Math.sqrt(this.real * this.real + this.imag * this.imag))
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(exponent) {
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
            throw new TypeError(
                "unsupported operand type(s) for ** or pow(): 'complex' and '" + type_name(exponent) + "'"
            )
        }
    }

    __div__(x, y, inplace) {
        if (types.isinstance(y, types.Int)) {
            if (!y.val.isZero()) {
                return new Complex(x.real / y.__float__().val, x.imag / y.__float__().val)
            } else {
                throw new ZeroDivisionError('complex division by zero')
            }
        } else if (types.isinstance(y, types.Float)) {
            if (y.valueOf()) {
                return new Complex(x.real / y.valueOf(), x.imag / y.valueOf())
            } else {
                throw new ZeroDivisionError('complex division by zero')
            }
        } else if (types.isinstance(y, types.Bool)) {
            if (y.valueOf()) {
                return new Complex(x.real, x.imag)
            } else {
                throw new ZeroDivisionError('complex division by zero')
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
            throw new TypeError(
                'unsupported operand type(s) for /' + prefix + ": 'complex' and '" + type_name(y) + "'"
            )
        }
    }

    __div__(other) {
        return this.__truediv__(other)
    }

    __floordiv__(other) {
        throw new TypeError("can't take floor of complex number.")
    }

    __truediv__(other) {
        return __div__(this, other)
    }

    __mul__(x, y, inplace) {
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
            throw new TypeError("can't multiply sequence by non-int of type 'complex'")
        } else {
            var prefix
            if (inplace) {
                prefix = '='
            } else {
                prefix = ''
            }
            throw new TypeError(
                'unsupported operand type(s) for *' + prefix + ": 'complex' and '" + type_name(y) + "'"
            )
        }
    }

    __mul__(other) {
        return __mul__(this, other)
    }

    __mod__(other) {
        throw new TypeError("can't mod complex numbers.")
    }

    __add__(x, y, inplace) {
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
            throw new TypeError(
                'unsupported operand type(s) for +' + prefix + ": 'complex' and '" + type_name(y) + "'"
            )
        }
    }

    __add__(other) {
        return __add__(this, other)
    }

    __sub__(x, y, inplace) {
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
            throw new TypeError(
                'unsupported operand type(s) for -' + prefix + ": 'complex' and '" + type_name(y) + "'"
            )
        }
    }

    __sub__(other) {
        return __sub__(this, other)
    }

    __getitem__(other) {
        throw new TypeError("'complex' object is not subscriptable")
    }

    __lshift__(other) {
        throw new TypeError(
            "unsupported operand type(s) for <<: 'complex' and '" + type_name(other) + "'"
        )
    }

    __rshift__(other) {
        throw new TypeError(
            "unsupported operand type(s) for >>: 'complex' and '" + type_name(other) + "'"
        )
    }

    __and__(other) {
        throw new TypeError(
            "unsupported operand type(s) for &: 'complex' and '" + type_name(other) + "'"
        )
    }

    __xor__(other) {
        throw new TypeError(
            "unsupported operand type(s) for ^: 'complex' and '" + type_name(other) + "'"
        )
    }

    __or__(other) {
        throw new TypeError(
            "unsupported operand type(s) for |: 'complex' and '" + type_name(other) + "'"
        )
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__(other) {
        throw new TypeError("can't take floor of complex number.")
    }

    __itruediv__(other) {
        return __div__(this, other, true)
    }

    __iadd__(other) {
        return __add__(this, other, true)
    }

    __isub__(other) {
        return __sub__(this, other, true)
    }

    __imul__(other) {
        return __mul__(this, other, true)
    }

    __imod__(other) {
        throw new TypeError("can't mod complex numbers.")
    }

    __ipow__(other) {
        throw new NotImplementedError('Complex.__ipow__ has not been implemented')
    }

    __ilshift__(other) {
        throw new TypeError(
            "unsupported operand type(s) for <<=: 'complex' and '" + type_name(other) + "'"
        )
    }

    __irshift__(other) {
        throw new TypeError(
            "unsupported operand type(s) for >>=: 'complex' and '" + type_name(other) + "'"
        )
    }

    __iand__(other) {
        throw new TypeError(
            "unsupported operand type(s) for &=: 'complex' and '" + type_name(other) + "'"
        )
    }

    __ixor__(other) {
        throw new TypeError(
            "unsupported operand type(s) for ^=: 'complex' and '" + type_name(other) + "'"
        )
    }

    __ior__(other) {
        throw new TypeError(
            "unsupported operand type(s) for |=: 'complex' and '" + type_name(other) + "'"
        )
    }

    /**************************************************
     * Methods
     **************************************************/

    add(v) {
        this[v] = null
    }

    copy() {
        return new Complex(this)
    }

    remove(v) {
        delete this[v]
    }

    update(values) {
        for (var value in values) {
            if (values.hasOwnProperty(value)) {
                this[values[value]] = null
            }
        }
    }
}
create_pyclass(Complex, 'complex')
