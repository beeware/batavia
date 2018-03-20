import { pyargs } from '../core/callables'
import { pyOverflowError, pyTypeError, pyValueError, pyZeroDivisionError } from '../core/exceptions'
import { jstype, type_name, PyObject, pyNone } from '../core/types'
import * as version from '../core/version'

import PyStr from './Str'
import * as types from '../types'

/*************************************************************************
 * A Python float type
 *************************************************************************/

function python_modulo(n, m) {
    return ((n % m) + m) % m
}

class PyFloat extends PyObject {
    @pyargs({
        default_args: ['x']
    })
    __init__(x = 0.0) {
        if (typeof x === 'number') {
            this.$val = x
        } else if (types.isinstance(x, PyStr)) {
            if (x.length === 0) {
                throw pyValueError('could not convert string to float: ')
            } else if (x.search(/[^-0-9.]/g) === -1) {
                this.$val = parseFloat(x)
            } else {
                if (x === 'nan' || x === '+nan' || x === '-nan') {
                    this.$val = NaN
                } else if (x === 'inf' || x === '+inf' ||
                           x === 'infinity' || x === '+infinity' ||
                           x === 'Infinity' || x === '+Infinity') {
                    this.$val = Infinity
                } else if (x === '-inf' || x === '-infinity' || x === '-Infinity') {
                    this.$val = -Infinity
                } else {
                    throw pyValueError("could not convert string to float: '" + x + "'")
                }
            }
        } else if (types.isinstance(x, [types.pyint, types.pybool, types.pyfloat])) {
            this.$val = x.__float__().$val
        } else {
            throw pyTypeError(
                "float() argument must be a string, a bytes-like object or a number, not '" + type_name(x) + "'")
        }
    }

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    toString() {
        return this.__str__()
    }

    valueOf() {
        return this.$val
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__() {
        return this.$val !== 0.0
    }

    __int__() {
        return types.pyint(Math.trunc(this.$val))
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        if (!isFinite(this.$val)) {
            if (isNaN(this.$val)) {
                return 'nan'
            }
            if (this.$val < 0) {
                return '-inf'
            }
            return 'inf'
        }
        if (this.$val === 0) {
            if (1 / this.$val === Infinity) {
                return '0.0'
            } else {
                return '-0.0'
            }
        } else if (this.$val === Math.round(this.$val)) {
            var s = this.$val.toString()
            if (s.length >= 19) {
                // force conversion to scientific
                return this.$val.toExponential()
            }
            if (s.indexOf('.') < 0) {
                return s + '.0'
            }
            return s
        } else {
            return this.$val.toString()
        }
    }

    __float__() {
        return this
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (other !== pyNone) {
            if (types.isinstance(other, [
                types.pydict, types.pylist, types.pytuple,
                types.pyNoneType, PyStr, types.pyNotImplementedType,
                types.pyrange, types.pyset, types.pyslice,
                types.pybytes, types.pybytearray
            ])) {
                if (version.earlier('3.6')) {
                    throw pyTypeError(
                        'unorderable types: float() < ' + type_name(other) + '()'
                    )
                } else {
                    throw pyTypeError(
                        "'<' not supported between instances of 'float' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() < other.valueOf()
            }
        } else {
            if (version.earlier('3.6')) {
                throw pyTypeError(
                    'unorderable types: float() < pyNoneType()'
                )
            } else {
                throw pyTypeError(
                    "'<' not supported between instances of 'float' and 'pyNoneType'"
                )
            }
        }
    }

    __le__(other) {
        if (other !== pyNone) {
            if (types.isinstance(other, [
                types.pydict, types.pylist, types.pytuple,
                types.pyNoneType, PyStr, types.pyNotImplementedType,
                types.pyrange, types.pyset, types.pyslice
            ])) {
                if (version.earlier('3.6')) {
                    throw pyTypeError(
                        'unorderable types: float() <= ' + type_name(other) + '()'
                    )
                } else {
                    throw pyTypeError(
                        "'<=' not supported between instances of 'float' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() <= other.valueOf()
            }
        } else {
            if (version.earlier('3.6')) {
                throw pyTypeError(
                    'unorderable types: float() <= pyNoneType()'
                )
            } else {
                throw pyTypeError(
                    "'<=' not supported between instances of 'float' and 'pyNoneType'"
                )
            }
        }
    }

    __eq__(other) {
        if (other !== null && !types.isinstance(other, PyStr)) {
            var val
            if (types.isinstance(other, types.pybool)) {
                if (other.valueOf()) {
                    val = 1.0
                } else {
                    val = 0.0
                }
            } else if (types.isinstance(other, types.pyint)) {
                val = parseFloat(other.val)
            } else {
                val = other.valueOf()
            }
            return this.valueOf() === val
        }
        return false
    }

    __ne__(other) {
        return !this.__eq__(other)
    }

    __gt__(other) {
        if (other !== pyNone) {
            if (types.isinstance(other, [
                types.pydict, types.pylist, types.pytuple,
                types.pyNoneType, PyStr, types.pyNotImplementedType,
                types.pyrange, types.pyset, types.pyslice
            ])) {
                if (version.earlier('3.6')) {
                    throw pyTypeError(
                        'unorderable types: float() > ' + type_name(other) + '()'
                    )
                } else {
                    throw pyTypeError(
                        "'>' not supported between instances of 'float' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() > other.valueOf()
            }
        } else {
            if (version.earlier('3.6')) {
                throw pyTypeError(
                    'unorderable types: float() > pyNoneType()'
                )
            } else {
                throw pyTypeError(
                    "'>' not supported between instances of 'float' and 'pyNoneType'"
                )
            }
        }
    }

    __ge__(other) {
        if (other !== pyNone) {
            if (types.isinstance(other, [
                types.pydict, types.pylist, types.pytuple,
                types.pyNoneType, PyStr, types.pyNotImplementedType,
                types.pyrange, types.pyset, types.pyslice,
                types.pybytes, types.pybytearray
            ])) {
                if (version.earlier('3.6')) {
                    throw pyTypeError(
                        'unorderable types: float() >= ' + type_name(other) + '()'
                    )
                } else {
                    throw pyTypeError(
                        "'>=' not supported between instances of 'float' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() >= other.valueOf()
            }
        } else {
            if (version.earlier('3.6')) {
                throw pyTypeError(
                    'unorderable types: float() >= pyNoneType()'
                )
            } else {
                throw pyTypeError(
                    "'>=' not supported between instances of 'float' and 'pyNoneType'"
                )
            }
        }
    }

    __contains__(other) {
        return false
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        return pyfloat(+this.valueOf())
    }

    __neg__() {
        return pyfloat(-this.valueOf())
    }

    __not__() {
        return types.pybool(!this.valueOf())
    }

    __invert__() {
        throw pyTypeError("bad operand type for unary ~: 'float'")
    }

    __abs__() {
        return pyfloat(Math.abs(this.valueOf()))
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        if (types.isinstance(other, types.pybool)) {
            if (other.valueOf()) {
                return pyfloat(Math.pow(this.valueOf(), 1))
            } else {
                return pyfloat(Math.pow(this.valueOf(), 0))
            }
        } else if (types.isinstance(other, [types.pyfloat, types.pyint])) {
            if (this.valueOf() === 0 && other.valueOf() < 0) {
                throw pyZeroDivisionError('0.0 cannot be raised to a negative power')
            } else {
                return pyfloat(Math.pow(this.valueOf(), other.valueOf()))
            }
        } else {
            throw pyTypeError("unsupported operand type(s) for ** or pow(): 'float' and '" + type_name(other) + "'")
        }
    }

    __div__(other) {
        return this.__truediv__(other)
    }

    __floordiv__(other) {
        if (types.isinstance(other, types.pyint)) {
            if (!other.val.isZero()) {
                return pyfloat(Math.floor(this.valueOf() / other.valueOf()))
            } else {
                throw pyZeroDivisionError('float divmod()')
            }
        } else if (types.isinstance(other, types.pyfloat)) {
            if (other.valueOf()) {
                return pyfloat(Math.floor(this.valueOf() / other.valueOf()))
            } else {
                throw pyZeroDivisionError('float divmod()')
            }
        } else if (types.isinstance(other, types.pybool)) {
            if (other.valueOf()) {
                return pyfloat(Math.floor(this.valueOf()))
            } else {
                throw pyZeroDivisionError('float divmod()')
            }
        } else {
            throw pyTypeError("unsupported operand type(s) for //: 'float' and '" + type_name(other) + "'")
        }
    }

    __truediv__(other) {
        if (types.isinstance(other, types.pyint)) {
            if (!other.val.isZero()) {
                return pyfloat(this.valueOf() / other.valueOf())
            } else {
                throw pyZeroDivisionError('float division by zero')
            }
        } else if (types.isinstance(other, types.pyfloat)) {
            if (other.valueOf()) {
                return pyfloat(this.valueOf() / other.valueOf())
            } else {
                throw pyZeroDivisionError('float division by zero')
            }
        } else if (types.isinstance(other, types.pybool)) {
            if (other.valueOf()) {
                return pyfloat(this.valueOf())
            } else {
                throw pyZeroDivisionError('float division by zero')
            }
        } else {
            throw pyTypeError("unsupported operand type(s) for /: 'float' and '" + type_name(other) + "'")
        }
    }

    __mul__(other) {
        if (other === null) {
            throw pyTypeError("unsupported operand type(s) for *: 'float' and 'pyNoneType'")
        } else if (types.isinstance(other, types.pybool)) {
            if (other.valueOf()) {
                return pyfloat(this.valueOf() * 1)
            } else {
                return pyfloat(this.valueOf() * 0)
            }
        } else if (types.isinstance(other, [types.pyfloat, types.pyint])) {
            return pyfloat(this.valueOf() * other.valueOf())
        } else if (types.isinstance(other, [types.pylist, PyStr, types.pytuple, types.pybytes, types.pybytearray])) {
            throw pyTypeError("can't multiply sequence by non-int of type 'float'")
        } else {
            throw pyTypeError("unsupported operand type(s) for *: 'float' and '" + type_name(other) + "'")
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.pyint)) {
            if (other.val.isZero()) {
                throw pyZeroDivisionError('float modulo')
            } else {
                var thisNum = this.valueOf()
                var otherNum = parseFloat(other.val)
                var result = pyfloat(python_modulo(thisNum, otherNum))
                if (otherNum > PyFloat.MAX_FLOAT || otherNum < PyFloat.MIN_FLOAT || result.toString() === 'nan' || result.toString() === 'inf' || result.toString() === '-inf') {
                    throw pyOverflowError(
                        'int too large to convert to float'
                    )
                }
                if ((otherNum > thisNum && thisNum > 0) || (thisNum > otherNum && thisNum < 0) || thisNum === 0) {
                    return pyfloat(thisNum)
                }
                if (result.valueOf() === 0 && (thisNum % otherNum) + otherNum === otherNum) {
                    return pyfloat(otherNum)
                }
                return result
            }
        } else if (types.isinstance(other, types.pyfloat)) {
            if (other.valueOf() === 0) {
                throw pyZeroDivisionError('float modulo')
            } else {
                return pyfloat(python_modulo(this.valueOf(), other.valueOf()))
            }
        } else if (types.isinstance(other, types.pybool)) {
            if (other.valueOf()) {
                return pyfloat(python_modulo(this.valueOf(), other.valueOf()))
            } else {
                throw pyZeroDivisionError('float modulo')
            }
        } else {
            throw pyTypeError(
                "unsupported operand type(s) for %: 'float' and '" + type_name(other) + "'"
            )
        }
    }

    __add__(other) {
        if (types.isinstance(other, [types.pyint, types.pyfloat])) {
            var value = pyfloat(this.valueOf() + parseFloat(other.valueOf()))
            if (value.toString() === 'inf' || value.toString() === '-inf') {
                throw pyOverflowError(
                    'int too large to convert to float'
                )
            }
            return value
        } else if (types.isinstance(other, types.pybool)) {
            if (other.valueOf()) {
                return pyfloat(this.valueOf() + 1.0)
            } else {
                return pyfloat(this.valueOf())
            }
        } else if (types.isinstance(other, types.pycomplex)) {
            var real = pyfloat(this.valueOf() + other.real)
            return types.pycomplex(real.valueOf(), other.imag.valueOf())
        } else {
            throw pyTypeError("unsupported operand type(s) for +: 'float' and '" + type_name(other) + "'")
        }
    }

    __sub__(other) {
        if (types.isinstance(other, [types.pyint, types.pyfloat])) {
            var value = pyfloat(this.valueOf() - other.valueOf())
            if (value.toString() === 'inf' || value.toString() === '-inf') {
                throw pyOverflowError(
                    'int too large to convert to float'
                )
            }
            return value
        } else if (types.isinstance(other, types.pybool)) {
            if (other.valueOf()) {
                return pyfloat(this.valueOf() - 1.0)
            } else {
                return pyfloat(this.valueOf())
            }
        } else if (types.isinstance(other, types.pycomplex)) {
            var real = pyfloat(this.valueOf() - other.real)
            return types.pycomplex(real.valueOf(), -other.imag.valueOf())
        } else {
            throw pyTypeError("unsupported operand type(s) for -: 'float' and '" + type_name(other) + "'")
        }
    }

    __getitem__(other) {
        throw pyTypeError("'float' object is not subscriptable")
    }

    __lshift__(other) {
        throw pyTypeError(
            "unsupported operand type(s) for <<: 'float' and '" + type_name(other) + "'"
        )
    }

    __rshift__(other) {
        throw pyTypeError(
            "unsupported operand type(s) for >>: 'float' and '" + type_name(other) + "'"
        )
    }

    __and__(other) {
        throw pyTypeError(
            "unsupported operand type(s) for &: 'float' and '" + type_name(other) + "'"
        )
    }

    __xor__(other) {
        throw pyTypeError(
            "unsupported operand type(s) for ^: 'float' and '" + type_name(other) + "'"
        )
    }

    __or__(other) {
        throw pyTypeError(
            "unsupported operand type(s) for |: 'float' and '" + type_name(other) + "'"
        )
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    // Call the method named "f" with argument "other"; if a type error is raised, throw a different type error
    __call_binary_operator__(f, operator_str, other) {
        try {
            return this[f](other)
        } catch (error) {
            if (error instanceof pyTypeError) {
                throw pyTypeError(
                    'unsupported operand type(s) for ' + operator_str + ": 'float' and '" + type_name(other) + "'")
            } else {
                throw error
            }
        }
    }

    __ifloordiv__(other) {
        return this.__call_binary_operator__('__floordiv__', '//=', other)
    }

    __itruediv__(other) {
        return this.__call_binary_operator__('__truediv__', '/=', other)
    }

    __iadd__(other) {
        return this.__call_binary_operator__('__add__', '+=', other)
    }

    __isub__(other) {
        return this.__call_binary_operator__('__sub__', '-=', other)
    }

    __imul__(other) {
        if (types.isinstance(other, [types.pylist, PyStr, types.pytuple])) {
            throw pyTypeError("can't multiply sequence by non-int of type 'float'")
        } else {
            return this.__call_binary_operator__('__mul__', '*=', other)
        }
    }

    __imod__(other) {
        return this.__call_binary_operator__('__mod__', '%=', other)
    }

    __ipow__(other) {
        return this.__pow__(other)
    }

    __ilshift__(other) {
        return this.__call_binary_operator__('__lshift__', '<<=', other)
    }

    __irshift__(other) {
        return this.__call_binary_operator__('__rshift__', '>>=', other)
    }

    __iand__(other) {
        return this.__call_binary_operator__('__and__', '&=', other)
    }

    __ixor__(other) {
        return this.__call_binary_operator__('__xor__', '^=', other)
    }

    __ior__(other) {
        return this.__call_binary_operator__('__or__', '|=', other)
    }

    /**************************************************
     * Methods
     **************************************************/

    copy() {
        return pyfloat(this.valueOf())
    }

    is_integer() {
        return types.pybool(Number.isInteger(this.valueOf()))
    }

    __trunc__() {
        return types.pyint(Math.trunc(this.valueOf()))
    }
}
const pyfloat = jstype(PyFloat, 'float', [], null)

PyFloat.MAX_FLOAT = pyfloat('179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791')
PyFloat.MIN_FLOAT = pyfloat('-179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791')

export default pyfloat
