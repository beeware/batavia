var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var version = require('../core').version
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass
var Int = require('./Int.js')
var Float = require('./Float.js').Float
var NotImplemented = require('../core').NotImplemented

// Helper function defined in Float.js
var scientific_notation_exponent_fix = require('./Float').scientific_notation_exponent_fix

/*************************************************************************
 * A Python complex type
 *************************************************************************/

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
        throw new exceptions.TypeError.$pyclass(
            "complex() first argument must be a string, a bytes-like object or a number, not '" +
            type_name(re) + "'"
        )
    } else if (!types.isinstance(im, [types.Float, types.Int, types.Bool, types.Complex])) {
        throw new exceptions.TypeError.$pyclass(
            "complex() first argument must be a string, a bytes-like object or a number, not '" +
            type_name(im) + "'"
        )
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

Complex.prototype.__dir__ = function() {
    var types = require('../types')
    if (version.at_least(3.6)) {
        // Python 3.6 adds classmethod object.__init_subclass__
        return new types.List(['__abs__', '__add__', '__bool__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__int__', '__le__', '__lt__', '__mod__', '__mul__', '__ne__', '__neg__', '__new__', '__pos__', '__pow__', '__radd__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rmod__', '__rmul__', '__rpow__', '__rsub__', '__rtruediv__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', 'conjugate', 'imag', 'real'])
    }
    return new types.List(['__abs__', '__add__', '__bool__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__int__', '__le__', '__lt__', '__mod__', '__mul__', '__ne__', '__neg__', '__new__', '__pos__', '__pow__', '__radd__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rmod__', '__rmul__', '__rpow__', '__rsub__', '__rtruediv__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', 'conjugate', 'imag', 'real'])
}

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
    if (version.at_least('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            '\'<\' not supported between instances of \'complex\' and \'' + type_name(other) + '\''
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: complex() < ' + type_name(other) + '()'
        )
    }
}

Complex.prototype.__le__ = function(other) {
    if (version.at_least('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            '\'<=\' not supported between instances of \'complex\' and \'' + type_name(other) + '\''
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: complex() <= ' + type_name(other) + '()'
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
    if (version.at_least('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            '\'>\' not supported between instances of \'complex\' and \'' + type_name(other) + '\''
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: complex() > ' + type_name(other) + '()'
        )
    }
}

Complex.prototype.__ge__ = function(other) {
    if (version.at_least('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            '\'>=\' not supported between instances of \'complex\' and \'' + type_name(other) + '\''
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: complex() >= ' + type_name(other) + '()'
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

function quotient(a, b) {
    const abs_bimag = Math.abs(b.imag)
    const abs_breal = Math.abs(b.real)
    if (abs_breal >= abs_bimag) {
        if (abs_breal === 0) {
            return new Complex(0, 0)
        }
        const ratio = b.imag / b.real
        const denom = b.real + b.imag * ratio
        return new Complex((a.real + a.imag * ratio) / denom, (a.imag - a.real * ratio) / denom)
    }

    if (abs_bimag >= abs_breal) {
        const ratio = b.real / b.imag
        const denom = b.real * ratio + b.imag
        return new Complex((a.real * ratio + a.imag) / denom, (a.imag * ratio - a.real) / denom)
    }

    return new Complex(NaN, NaN)
}

function unsigned_exponent(x, y) {
    let mask = 1
    let r = new Complex(1, 0)
    let p = x
    while (mask > 0 && y >= mask) {
        if (y & mask) {
            r = __mul__(r, p)
        }
        mask <<= 1
        p = __mul__(p, p)
    }
    return r
}

function complex_exponent(base, exponent) {
    if (exponent.real === 0 && exponent.imag === 0) {
        return new Complex(1, 0)
    }

    if (base.real === 0 && base.imag === 0) {
        if (exponent.imag !== 0 || exponent.real < 0) {
            throw new exceptions.ZeroDivisionError.$pyclass('0.0 to a negative or complex power')
        }
        return new Complex(0, 0)
    }

    const vabs = Math.hypot(base.real, base.imag)
    const at = Math.atan2(base.imag, base.real)

    let l = Math.pow(vabs, exponent.real)
    let phase = at * exponent.real
    if (exponent.imag !== 0) {
        l /= Math.exp(at * exponent.imag)
        phase += exponent.imag * Math.log(vabs)
    }

    return new Complex(l * Math.cos(phase), l * Math.sin(phase))
}

function integral_exponent(base, exponent) {
    if (Number(exponent) === 0) {
        return new Complex(1, 0)
    }

    if (Number(exponent) >= Int.prototype.MAX_INT) {
        if (Number(exponent) > Float.prototype.MAX_FLOAT) {
            throw new exceptions.OverflowError.$pyclass('int too large to convert to float')
        }

        if (base.real * base.real + base.imag * base.imag === 1) {
            return complex_exponent(base, new Complex(Number(exponent), 0))
        }

        if (base.real === 0 && base.imag === 0) {
            return new Complex(0, 0)
        }

        throw new exceptions.OverflowError.$pyclass('complex exponentiation')
    }

    if (Number(exponent) <= Float.prototype.MIN_FLOAT) {
        throw new exceptions.OverflowError.$pyclass('int too large to convert to float')
    }

    if (base.real === 0 && base.imag === 0) {
        if (Number(exponent) < 0) {
            throw new exceptions.ZeroDivisionError.$pyclass('0.0 to a negative or complex power')
        }
        return new Complex(0, 0)
    }

    if (exponent > 100 || exponent < -100) {
        return complex_exponent(base, new Complex(Number(exponent), 0))
    } else if (exponent > 0) {
        return unsigned_exponent(base, exponent)
    } else {
        return quotient(new Complex(1, 0), unsigned_exponent(base, -exponent))
    }
}

function __pow__(x, y, inplace) {
    var types = require('../types')
    if (types.isinstance(y, types.Int)) {
        return integral_exponent(x, y.val)
    }

    if (types.isinstance(y, types.Bool)) {
        if (y.valueOf()) {
            return new Complex(x.real, x.imag)
        }
        return new Complex(1, 0)
    }

    if (types.isinstance(y, types.Complex)) {
        return complex_exponent(x, y)
    }

    if (types.isinstance(y, types.Float)) {
        return complex_exponent(x, new Complex(y.valueOf(), 0))
    }

    return NotImplemented
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
        return NotImplemented
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
    } else {
        return NotImplemented
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
        return NotImplemented
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
        return NotImplemented
    }
}

Complex.prototype.__sub__ = function(other) {
    return __sub__(this, other)
}

Complex.prototype.__getitem__ = function(other) {
    throw new exceptions.TypeError.$pyclass("'complex' object is not subscriptable")
}

/**************************************************
 * Right-hand operators
 **************************************************/

Complex.prototype.__radd__ = function(other) {
    return this.__add__(other)
}

Complex.prototype.__rfloordiv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
}

Complex.prototype.__rmod__ = function(other) {
    throw new exceptions.TypeError.$pyclass("can't mod complex numbers.")
}

Complex.prototype.__rmul__ = function(other) {
    return this.__mul__(other)
}

Complex.prototype.__rpow__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Complex(1, 0)
        }
        return complex_exponent(new Complex(0, 0), this)
    }

    if (types.isinstance(other, types.Int)) {
        return other.__pow__(this)
    }

    if (types.isinstance(other, types.Float)) {
        return complex_exponent(new Complex(other.valueOf(), 0), this)
    }

    if (types.isinstance(other, types.Complex)) {
        return complex_exponent(other, this)
    }

    return NotImplemented
}

Complex.prototype.__rsub__ = function(other) {
    return NotImplemented
}

Complex.prototype.__rtruediv__ = function(other) {
    return NotImplemented
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

Complex.prototype.__format__ = function(value, formatSpecifier) {
    if(formatSpecifier === ""){
        return value.__str__()
    }
    throw new exceptions.ValueError.$pyclass('ValueError: Unknown format code' +  formatSpecifier + 'for object of type complex')
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Complex
