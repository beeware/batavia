var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var version = require('../core').version
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass
var Int = require('./Int.js')

// Helper function defined in Float.js
var scientific_notation_exponent_fix = require('./Float').scientific_notation_exponent_fix
/*************************************************************************
 * A Python complex type
 *************************************************************************/

var MAX_INT = new Int('9223372036854775807')
var MAX_FLOAT = new Int('179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791')
var MIN_FLOAT = new Int('-179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791')

function part_from_str(s) {
    var types = require('../types')

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
        if (x === Math.round(x)) {
            // Integer
            if (Math.abs(x) >= 1e16) {
                x_str = scientific_notation_exponent_fix(x.toExponential())
            } else {
                x_str = x.toString()
            }
        } else {
            // Reuse float's implementation of __str__
            var types = require('../types')
            x_str = (new types.Float(x)).__str__()
        }
    } else if (Object.is(x, -0)) {
        x_str = '-0'
    } else {
        x_str = '0'
    }
    return x_str
}

function under_js_precision(complex) {
    // With complex numbers, imaginary value may be off in JavaScript,
    // due to JS imprecision (Epsilon) and/or too big difference between
    // real and imaginary components, and may have to be rounded.
    // Return True if it's the case.
    return complex.real !== 0 && Math.abs(complex.imag) < 10 / 9 * Number.EPSILON &&
           Math.abs(complex.imag / complex.real) > Number.EPSILON &&
           Math.abs(complex.imag / complex.real) < 1e-10
}

function Complex(re, im) {
    var types = require('../types')
    PyObject.call(this)
    // console.log(100000, re, im);
    if (types.isinstance(re, types.Str)) {
        // console.log(1000, re, im);
        var regex = /^\(?(-?[\d.]+)?([+-])?(?:([\d.]+)j)?\)?$/i
        var match = regex.exec(re)
        if (match === null || re === '') {
            throw new exceptions.ValueError.$pyclass('complex() arg is a malformed string')
        }
        this.real = parseFloat(part_from_str(match[1]))
        this.imag = parseFloat(part_from_str(match[3]))
        if (match[2] === '-') {
            this.imag = -this.imag
        }
    } else if (!types.isinstance(re, [types.Float, types.Int, types.Bool, types.Complex])) {
        if (version.later('3.5')) {
            throw new exceptions.TypeError.$pyclass(
                "complex() first argument must be a string, a bytes-like object or a number, not '" +
                type_name(re) + "'"
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "complex() argument must be a string, a bytes-like object or a number, not '" +
                type_name(re) + "'"
            )
        }
    } else if (!types.isinstance(im, [types.Float, types.Int, types.Bool, types.Complex])) {
        if (version.later('3.5')) {
            throw new exceptions.TypeError.$pyclass(
                "complex() first argument must be a string, a bytes-like object or a number, not '" +
                type_name(im) + "'"
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
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
        throw new exceptions.NotImplementedError.$pyclass('Complex initialization from complex argument(s) has not been implemented')
    }
}

create_pyclass(Complex, 'complex')

var COMPLEX_ROUND_DECIMALS = Math.floor(Math.abs(Math.log10(Number.EPSILON)))

Complex.prototype.COMPLEX_ROUND_DECIMALS = COMPLEX_ROUND_DECIMALS

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
        if (under_js_precision(this)) {
            this.imag = parseFloat(this.imag.toFixed(this.COMPLEX_ROUND_DECIMALS))
        }

        var sign
        if (Object.is(this.imag, -0) || this.imag < 0) {
            sign = '-'
        } else {
            sign = '+'
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
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: complex() < ' + type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'<' not supported between instances of 'complex' and '" + type_name(other) + "'"
        )
    }
}

Complex.prototype.__le__ = function(other) {
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: complex() <= ' + type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'<=' not supported between instances of 'complex' and '" + type_name(other) + "'"
        )
    }
}

Complex.prototype.__eq__ = function(other) {
    var types = require('../types')

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
        } else if (types.isinstance(other, types.Int)) {
            // Int.valueOf() returns a string, convert it
            val = parseInt(other.valueOf())
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
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: complex() > ' + type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'>' not supported between instances of 'complex' and '" + type_name(other) + "'"
        )
    }
}

Complex.prototype.__ge__ = function(other) {
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: complex() >= ' + type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
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
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'complex'")
}

Complex.prototype.__abs__ = function() {
    var types = require('../types')

    return new types.Float(Math.sqrt(this.real * this.real + this.imag * this.imag))
}

/**************************************************
 * Binary operators
 **************************************************/
function hyp(x, y) {
    x = Math.abs(x)
    y = Math.abs(y)
    if (x < y) {
        var temp = x
        x = y
        y = temp
    }
    if (x === 0) {
        return 0
    } else {
        var yx = y / x
        return x * Math.sqrt(1 + yx * yx)
    }
}
function quot(a, b) {
    var r = new Complex(0, 0)
    var abs_bimag = 0
    var abs_breal = 0
    if (b.real < 0) {
        abs_breal = -b.real
    } else {
        abs_breal = b.real
    }
    if (b.imag < 0) {
        abs_bimag = -b.imag
    } else {
        abs_bimag = b.imag
    }
    if (abs_breal >= abs_bimag) {
        if (abs_breal === 0) {
            r = new Complex(0, 0)
        } else {
            const ratio = b.imag / b.real
            const denom = b.real + b.imag * ratio
            r = new Complex((a.real + a.imag * ratio) / denom, (a.imag - a.real * ratio) / denom)
        }
    } else if (abs_bimag >= abs_breal) {
        const ratio = b.real / b.imag
        const denom = b.real * ratio + b.imag
        r = new Complex((a.real * ratio + a.imag) / denom, (a.imag * ratio - a.real) / denom)
    } else {
        r = new Complex(NaN, NaN)
    }
    return r
}
function powu(x, y) {
    var mask = 1
    var r = new Complex(1, 0)
    var p = x
    while (mask > 0 && y >= mask) {
        if (y & mask) {
            r = __mul__(r, p)
        }
        mask <<= 1
        p = __mul__(p, p)
    }
    return r
}
function powc(x, y) {
    if (y.real === 0 && y.imag === 0) {
        return new Complex(1, 0)
    } else if (x.real === 0 && x.imag === 0) {
        if (y.imag !== 0 || y.real < 0) {
            throw new exceptions.ZeroDivisionError.$pyclass(
                '0.0 to a negative or complex power'
                )
        }
        return new Complex(0, 0)
    }
    var vabs = hyp(x.real, x.imag)
    var l = Math.pow(vabs, y.real)
    var at = Math.atan2(x.imag, x.real)
    var phase = at * y.real
    if (y.imag !== 0) {
        l /= Math.exp(at * y.imag)
        phase += y.imag * Math.log(vabs)
    }
    var r = l * Math.cos(phase)
    var im = l * Math.sin(phase)
    return new Complex(r, im)
}
function powi(x, y) {
    var cn
    if (Number(y) == 0) {
	return new Complex(1, 0)
    }
    if (Number(y) >= MAX_INT) {
        if (Number(y) <= MAX_FLOAT) {
            if (x.real*x.real + x.imag*x.imag == 1) {
		return powc(x, new Complex(Number(y), 0))
            }
	    else if (x.real === 0 && x.imag === 0) {
		return new Complex(0, 0)
	    }
            throw new exceptions.OverflowError.$pyclass(
                'complex exponentiation'
            )
        } else {
            throw new exceptions.OverflowError.$pyclass(
                'int too large to convert to float'
            )
        }
    }
    else if (Number(y) <= MIN_FLOAT) {
        throw new exceptions.OverflowError.$pyclass(
            'int too large to convert to float'
        )
    }
    else if (x.real === 0 && x.imag === 0) {
	if (Number(y) < 0) {
	    throw new exceptions.ZeroDivisionError.$pyclass(
                '0.0 to a negative or complex power'
            )
	}
	return new Complex(0, 0)
    } else {
        if (y > 100 || y < -100) {
            cn = new Complex(Number(y), 0)
            return powc(x, cn)
        } else if (y > 0) {
            return powu(x, y)
        } else {
            return quot(new Complex(1, 0), powu(x, -y))
        }
    }
}
function __pow__(x, y, inplace) {
    var types = require('../types')
    if (types.isinstance(y, types.Int)) {
        return powi(x, y.val)
    } else if (types.isinstance(y, types.Bool)) {
        if (y.valueOf()) {
            return new Complex(x.real, x.imag)
        } else {
            return new Complex(1, 0)
        }
    } else if (types.isinstance(y, types.Complex)) {
        return powc(x, y)
    } else if (types.isinstance(y, types.Float)) {
        return powc(x, new Complex(y.valueOf(), 0))
    } else {
        var prefix
        if (inplace) {
            prefix = '='
        } else {
            prefix = ''
        }
        throw new exceptions.TypeError.$pyclass(
            'unsupported operand type(s) for ** or pow()' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

Complex.prototype.__pow__ = function(other) {
    return __pow__(this, other)
}

function __div__(x, y, inplace) {
    var types = require('../types')

    if (types.isinstance(y, types.Int)) {
        if (!y.val.isZero()) {
            return new Complex(x.real / y.__float__().val, x.imag / y.__float__().val)
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('complex division by zero')
        }
    } else if (types.isinstance(y, types.Float)) {
        if (y.valueOf()) {
            return new Complex(x.real / y.valueOf(), x.imag / y.valueOf())
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('complex division by zero')
        }
    } else if (types.isinstance(y, types.Bool)) {
        if (y.valueOf()) {
            return new Complex(x.real, x.imag)
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('complex division by zero')
        }
    } else if (types.isinstance(y, types.Complex)) {
        var den = Math.pow(y.real, 2) + Math.pow(y.imag, 2)
        if (den === 0) {
            throw new exceptions.ZeroDivisionError.$pyclass('complex division by zero')
        }
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
        throw new exceptions.TypeError.$pyclass(
            'unsupported operand type(s) for /' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

Complex.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Complex.prototype.__floordiv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
}

Complex.prototype.__truediv__ = function(other) {
    return __div__(this, other)
}

function __mul__(x, y, inplace) {
    var types = require('../types')

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
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type 'complex'")
    } else {
        var prefix
        if (inplace) {
            prefix = '='
        } else {
            prefix = ''
        }
        throw new exceptions.TypeError.$pyclass(
            'unsupported operand type(s) for *' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

Complex.prototype.__mul__ = function(other) {
    return __mul__(this, other)
}

Complex.prototype.__mod__ = function(other) {
    throw new exceptions.TypeError.$pyclass("can't mod complex numbers.")
}

function __add__(x, y, inplace) {
    var types = require('../types')

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
        throw new exceptions.TypeError.$pyclass(
            'unsupported operand type(s) for +' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

Complex.prototype.__add__ = function(other) {
    return __add__(this, other)
}

function __sub__(x, y, inplace) {
    var types = require('../types')

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
        throw new exceptions.TypeError.$pyclass(
            'unsupported operand type(s) for -' + prefix + ": 'complex' and '" + type_name(y) + "'"
        )
    }
}

Complex.prototype.__sub__ = function(other) {
    return __sub__(this, other)
}

Complex.prototype.__getitem__ = function(other) {
    throw new exceptions.TypeError.$pyclass("'complex' object is not subscriptable")
}

Complex.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for <<: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for >>: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__and__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for &: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__xor__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for ^: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__or__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for |: 'complex' and '" + type_name(other) + "'"
    )
}

/**************************************************
 * Inplace operators
 **************************************************/

Complex.prototype.__ifloordiv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
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
    throw new exceptions.TypeError.$pyclass("can't mod complex numbers.")
}

Complex.prototype.__ipow__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Complex.__ipow__ has not been implemented')
}

Complex.prototype.__ilshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for <<=: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__irshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for >>=: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__iand__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for &=: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__ixor__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for ^=: 'complex' and '" + type_name(other) + "'"
    )
}

Complex.prototype.__ior__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
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

/**************************************************
 * Module exports
 **************************************************/

module.exports = Complex
