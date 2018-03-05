import { pyargs } from '../core/callables'
import { PyNotImplementedError, PyTypeError, PyValueError, PyZeroDivisionError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

/*************************************************************************
 * A Python complex type
 *************************************************************************/

function part_from_str(s) {
    if (s && s.valueOf() === '-0') {
        // console.log("there");
        return new types.PyFloat(-0)
    } else if (s) {
        // console.log("part_from_str: " + s);
        return new types.PyFloat(s)
    } else {
        return new types.PyFloat(0)
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

function complex__div__(x, y, inplace) {
    if (types.isinstance(y, types.PyInt)) {
        if (!y.val.isZero()) {
            return new PyComplex(x.real / y.__float__().val, x.imag / y.__float__().val)
        } else {
            throw new PyZeroDivisionError('complex division by zero')
        }
    } else if (types.isinstance(y, types.PyFloat)) {
        if (y.valueOf()) {
            return new PyComplex(x.real / y.valueOf(), x.imag / y.valueOf())
        } else {
            throw new PyZeroDivisionError('complex division by zero')
        }
    } else if (types.isinstance(y, types.PyBool)) {
        if (y.valueOf()) {
            return new PyComplex(x.real, x.imag)
        } else {
            throw new PyZeroDivisionError('complex division by zero')
        }
    } else if (types.isinstance(y, types.PyComplex)) {
        var den = Math.pow(y.real, 2) + Math.pow(y.imag, 2)
        var num_real = x.real * y.real + x.imag * y.imag
        var num_imag = x.imag * y.real - x.real * y.imag
        var real = num_real / den
        var imag = num_imag / den
        return new PyComplex(real, imag)
    } else {
        var prefix
        if (inplace) {
            prefix = '='
        } else {
            prefix = ''
        }
        throw new PyTypeError(
            'unsupported operand type(s) for /' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

function complex__mul__(x, y, inplace) {
    if (types.isinstance(y, types.PyInt)) {
        if (!y.val.isZero()) {
            return new PyComplex(x.real * y.__float__().val, x.imag * y.__float__().val)
        } else {
            return new PyComplex(0, 0)
        }
    } else if (types.isinstance(y, types.PyFloat)) {
        if (y.valueOf()) {
            return new PyComplex(x.real * y.valueOf(), x.imag * y.valueOf())
        } else {
            return new PyComplex(0, 0)
        }
    } else if (types.isinstance(y, types.PyBool)) {
        if (y.valueOf()) {
            return new PyComplex(x.real, x.imag)
        } else {
            return new PyComplex(0, 0)
        }
    } else if (types.isinstance(y, types.PyComplex)) {
        return new PyComplex(x.real * y.real - x.imag * y.imag, x.real * y.imag + x.imag * y.real)
    } else if (types.isinstance(y, [types.PyList, types.PyStr, types.PyTuple, types.PyBytearray, types.PyBytes])) {
        throw new PyTypeError("can't multiply sequence by non-int of type 'complex'")
    } else {
        var prefix
        if (inplace) {
            prefix = '='
        } else {
            prefix = ''
        }
        throw new PyTypeError(
            'unsupported operand type(s) for *' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

function complex__add__(x, y, inplace) {
    if (types.isinstance(y, types.PyInt)) {
        return new PyComplex(x.real + y.__float__().val, x.imag)
    } else if (types.isinstance(y, types.PyFloat)) {
        return new PyComplex(x.real + y.valueOf(), x.imag)
    } else if (types.isinstance(y, types.PyBool)) {
        if (y.valueOf()) {
            return new PyComplex(x.real + 1.0, x.imag)
        } else {
            return new PyComplex(x.real, x.imag)
        }
    } else if (types.isinstance(y, types.PyComplex)) {
        return new PyComplex(x.real + y.real, x.imag + y.imag)
    } else {
        var prefix
        if (inplace) {
            prefix = '='
        } else {
            prefix = ''
        }
        throw new PyTypeError(
            'unsupported operand type(s) for +' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

function complex__sub__(x, y, inplace) {
    if (types.isinstance(y, types.PyInt)) {
        return new PyComplex(x.real - y.__float__().val, x.imag)
    } else if (types.isinstance(y, types.PyFloat)) {
        return new PyComplex(x.real - y.valueOf(), x.imag)
    } else if (types.isinstance(y, types.PyBool)) {
        if (y.valueOf()) {
            return new PyComplex(x.real - 1.0, x.imag)
        } else {
            return new PyComplex(x.real, x.imag)
        }
    } else if (types.isinstance(y, types.PyComplex)) {
        return new PyComplex(x.real - y.real, x.imag - y.imag)
    } else {
        var prefix
        if (inplace) {
            prefix = '='
        } else {
            prefix = ''
        }
        throw new PyTypeError(
            'unsupported operand type(s) for -' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

export default class PyComplex extends PyObject {
    @pyargs({
        default_args: ['re', 'im']
    })
    __init__(re, im) {
        // console.log(100000, re, im);
        if (re === undefined && im === undefined) {
            this.real = 0
            this.imag = 0
        } else if (types.isinstance(re, types.PyStr)) {
            if (im === undefined) {
                var regex = /^\(?(-?[\d.]+)?([+-])?(?:([\d.]+)j)?\)?$/i
                var match = regex.exec(re)
                if (match === null || re === '') {
                    throw new PyValueError('complex() arg is a malformed string')
                }
                this.real = parseFloat(part_from_str(match[1]))
                this.imag = parseFloat(part_from_str(match[3]))
                if (match[2] === '-') {
                    this.imag = -this.imag
                }
            } else {
                throw new PyTypeError("complex() can't take second arg if first is a string")
            }
        } else if (types.isinstance(re, PyComplex)) {
            if (im === undefined) {
                this.real = re.real
                this.imag = re.imag
            } else {
                throw new PyNotImplementedError('Complex initialization from complex argument(s) has not been implemented')
            }
        } else if (typeof re === 'number') {
            this.real = re
            if (im === undefined) {
                this.imag = 0
            } else if (typeof im === 'number') {
                this.imag = im
            } else if (types.isinstance(re, [types.PyFloat, types.PyInt, types.PyBool])) {
                this.imag = im.__float__().valueOf()
            } else {
                if (version.later('3.5')) {
                    if (types.isinstance(im, types.PyStr)) {
                        throw new PyTypeError("complex() second argument can't be a string")
                    } else {
                        throw new PyTypeError(
                            "complex() second argument must be a number, not '" +
                            type_name(re) + "'"
                        )
                    }
                } else {
                    throw new PyTypeError(
                        "complex() argument must be a number, not '" +
                        type_name(re) + "'"
                    )
                }
            }
        } else if (types.isinstance(re, [types.PyFloat, types.PyInt, types.PyBool])) {
            this.real = re.__float__().valueOf()
            if (im === undefined) {
                this.imag = 0
            } else if (types.isinstance(re, [types.PyFloat, types.PyInt, types.PyBool])) {
                this.imag = im.__float__().valueOf()
            } else {
                if (version.later('3.5')) {
                    if (types.isinstance(im, types.PyStr)) {
                        throw new PyTypeError("complex() second argument can't be a string")
                    } else {
                        throw new PyTypeError(
                            "complex() second argument must be a number, not '" +
                            type_name(re) + "'"
                        )
                    }
                } else {
                    throw new PyTypeError(
                        "complex() argument must be a number, not '" +
                        type_name(re) + "'"
                    )
                }
            }
        } else {
            if (version.later('3.5')) {
                throw new PyTypeError(
                    "complex() first argument must be a string, a bytes-like object or a number, not '" +
                    type_name(re) + "'"
                )
            } else {
                throw new PyTypeError(
                    "complex() argument must be a string, a bytes-like object or a number, not '" +
                    type_name(re) + "'"
                )
            }
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
            throw new PyTypeError(
                'unorderable types: complex() < ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'<' not supported between instances of 'complex' and '" + type_name(other) + "'"
            )
        }
    }

    __le__(other) {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: complex() <= ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'<=' not supported between instances of 'complex' and '" + type_name(other) + "'"
            )
        }
    }

    __eq__(other) {
        if (other !== null && !types.isinstance(other, types.PyStr)) {
            if (types.isinstance(other, types.PyComplex)) {
                return this.real.valueOf() === other.real.valueOf() && this.imag.valueOf() === other.imag.valueOf()
            }
            var val
            if (types.isinstance(other, types.PyBool)) {
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
            throw new PyTypeError(
                'unorderable types: complex() > ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'>' not supported between instances of 'complex' and '" + type_name(other) + "'"
            )
        }
    }

    __ge__(other) {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: complex() >= ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'>=' not supported between instances of 'complex' and '" + type_name(other) + "'"
            )
        }
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        return new PyComplex(this.real, this.imag)
    }

    __neg__() {
        return new PyComplex(-this.real, -this.imag)
    }

    __not__() {
        return !this.__bool__()
    }

    __invert__() {
        throw new PyTypeError("bad operand type for unary ~: 'complex'")
    }

    __abs__() {
        return new types.PyFloat(Math.sqrt(this.real * this.real + this.imag * this.imag))
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(exponent) {
        // types.PyBool?? Yes, really; under the hood cpython checks to see if the
        // exponent is a numeric type, and bool subclasses int.
        // See cpython/Objects/abstract.c.
        if (types.isinstance(exponent, types.PyBool)) {
            if (exponent.valueOf()) {
                return this
            } else {
                return new PyComplex(1, 0)
            }
        // else if (types.isinstance(exponent, [types.PyFloat, types.PyInt, types.PyComplex]) {
        // { do some stuff }
        } else {
            throw new PyTypeError(
                "unsupported operand type(s) for ** or pow(): 'complex' and '" + type_name(exponent) + "'"
            )
        }
    }

    __div__(other) {
        return this.__truediv__(other)
    }

    __floordiv__(other) {
        throw new PyTypeError("can't take floor of complex number.")
    }

    __truediv__(other) {
        return complex__div__(this, other)
    }

    __mul__(other) {
        return complex__mul__(this, other)
    }

    __mod__(other) {
        throw new PyTypeError("can't mod complex numbers.")
    }

    __add__(other) {
        return complex__add__(this, other)
    }

    __sub__(other) {
        return complex__sub__(this, other)
    }

    __getitem__(other) {
        throw new PyTypeError("'complex' object is not subscriptable")
    }

    __lshift__(other) {
        throw new PyTypeError(
            "unsupported operand type(s) for <<: 'complex' and '" + type_name(other) + "'"
        )
    }

    __rshift__(other) {
        throw new PyTypeError(
            "unsupported operand type(s) for >>: 'complex' and '" + type_name(other) + "'"
        )
    }

    __and__(other) {
        throw new PyTypeError(
            "unsupported operand type(s) for &: 'complex' and '" + type_name(other) + "'"
        )
    }

    __xor__(other) {
        throw new PyTypeError(
            "unsupported operand type(s) for ^: 'complex' and '" + type_name(other) + "'"
        )
    }

    __or__(other) {
        throw new PyTypeError(
            "unsupported operand type(s) for |: 'complex' and '" + type_name(other) + "'"
        )
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__(other) {
        throw new PyTypeError("can't take floor of complex number.")
    }

    __itruediv__(other) {
        return complex__div__(this, other, true)
    }

    __iadd__(other) {
        return complex__add__(this, other, true)
    }

    __isub__(other) {
        return complex__sub__(this, other, true)
    }

    __imul__(other) {
        return complex__mul__(this, other, true)
    }

    __imod__(other) {
        throw new PyTypeError("can't mod complex numbers.")
    }

    __ipow__(other) {
        throw new PyNotImplementedError('Complex.__ipow__ has not been implemented')
    }

    __ilshift__(other) {
        throw new PyTypeError(
            "unsupported operand type(s) for <<=: 'complex' and '" + type_name(other) + "'"
        )
    }

    __irshift__(other) {
        throw new PyTypeError(
            "unsupported operand type(s) for >>=: 'complex' and '" + type_name(other) + "'"
        )
    }

    __iand__(other) {
        throw new PyTypeError(
            "unsupported operand type(s) for &=: 'complex' and '" + type_name(other) + "'"
        )
    }

    __ixor__(other) {
        throw new PyTypeError(
            "unsupported operand type(s) for ^=: 'complex' and '" + type_name(other) + "'"
        )
    }

    __ior__(other) {
        throw new PyTypeError(
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
        return new PyComplex(this)
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
create_pyclass(PyComplex, 'complex')
