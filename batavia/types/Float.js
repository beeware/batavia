var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var version = require('../core').version
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass
var None = require('../core').None
var NotImplemented = require('../core').NotImplemented

/*************************************************************************
 * A Python float type
 *************************************************************************/

function Float(val) {
    PyObject.call(this)

    this.val = val
}

create_pyclass(Float, 'float')

function python_modulo(n, M) {
    return ((n % M) + M) % M
}

var MAX_FLOAT = new Float('179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791')
var MIN_FLOAT = new Float('-179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791')

Float.prototype.MAX_FLOAT = MAX_FLOAT
Float.prototype.MIN_FLOAT = MIN_FLOAT

Float.prototype.__dir__ = function() {
    var types = require('../types')
    if (version.at_least(3.7)) {
        // Python 3.7 renames __setformat__ to __set_format__
        return new types.List(['__abs__', '__add__', '__bool__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getformat__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__int__', '__le__', '__lt__', '__mod__', '__mul__', '__ne__', '__neg__', '__new__', '__pos__', '__pow__', '__radd__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rmod__', '__rmul__', '__round__', '__rpow__', '__rsub__', '__rtruediv__', '__set_format__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', '__trunc__', 'as_integer_ratio', 'conjugate', 'fromhex', 'hex', 'imag', 'is_integer', 'real'])
    }
    if (version.at_least(3.6)) {
        // Python 3.6 adds classmethod object.__init_subclass__
        return new types.List(['__abs__', '__add__', '__bool__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getformat__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__int__', '__le__', '__lt__', '__mod__', '__mul__', '__ne__', '__neg__', '__new__', '__pos__', '__pow__', '__radd__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rmod__', '__rmul__', '__round__', '__rpow__', '__rsub__', '__rtruediv__', '__setattr__', '__setformat__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', '__trunc__', 'as_integer_ratio', 'conjugate', 'fromhex', 'hex', 'imag', 'is_integer', 'real'])
    }
    return new types.List(['__abs__', '__add__', '__bool__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getformat__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__int__', '__le__', '__lt__', '__mod__', '__mul__', '__ne__', '__neg__', '__new__', '__pos__', '__pow__', '__radd__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rmod__', '__rmul__', '__round__', '__rpow__', '__rsub__', '__rtruediv__', '__setattr__', '__setformat__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', '__trunc__', 'as_integer_ratio', 'conjugate', 'fromhex', 'hex', 'imag', 'is_integer', 'real'])
}

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Float.prototype.toString = function() {
    return this.__str__()
}

Float.prototype.valueOf = function() {
    return this.val
}

/**************************************************
 * Type conversions
 **************************************************/

Float.prototype.__bool__ = function() {
    return this.val !== 0.0
}

Float.prototype.__repr__ = function() {
    return this.__str__()
}

function scientific_notation_exponent_fix(exp) {
    // Python's negative exponent in scientific notation have a leading 0
    // Input is a float string (if not in scientific notation, nothing happens)
    if (exp.split('e-')[1] < 10) {
        exp = exp.replace('e-', 'e-0')
    }
    return exp
}

Float.prototype.__str__ = function() {
    if (!isFinite(this.val)) {
        if (isNaN(this.val)) {
            return 'nan'
        }
        if (this.val < 0) {
            return '-inf'
        }
        return 'inf'
    }

    var s
    if (this.val === 0) {
        if (1 / this.val === Infinity) {
            return '0.0'
        } else {
            return '-0.0'
        }
    } else if (this.val === Math.round(this.val)) {
        // Force scientific notation if abs(integer) > 1e16
        if (Math.abs(this.val) >= 1e16) {
            return scientific_notation_exponent_fix(this.val.toExponential())
        }

        s = this.val.toString()
        if (s.indexOf('.') < 0) {
            return s + '.0'
        }

        return s
    } else {
        s = this.val.toString()
        // Force conversion to scientific notation if dot is
        // located after 16 digits or if string starts with (-)0.0000
        if (s.indexOf('.') >= 16 || s.startswith('0.0000') || s.startswith('-0.0000')) {
            s = this.val.toExponential()
        }
        return scientific_notation_exponent_fix(s)
    }
}

Float.prototype.__float__ = function() {
    return this
}

/**************************************************
 * Comparison operators
 **************************************************/

Float.prototype.__lt__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice,
            types.Bytes, types.Bytearray
        ])) {
            if (version.at_least('3.6')) {
                throw new exceptions.TypeError.$pyclass(
                    '\'<\' not supported between instances of \'float\' and \'' +
                    type_name(other) + '\''
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: float() < ' + type_name(other) + '()'
                )
            }
        } else {
            return this.valueOf() < other.valueOf()
        }
    } else {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'<\' not supported between instances of \'float\' and \'NoneType\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: float() < NoneType()'
            )
        }
    }
}

Float.prototype.__le__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice
        ])) {
            if (version.at_least('3.6')) {
                throw new exceptions.TypeError.$pyclass(
                    '\'<=\' not supported between instances of \'float\' and \'' +
                    type_name(other) + '\''
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: float() <= ' + type_name(other) + '()'
                )
            }
        } else {
            return this.valueOf() <= other.valueOf()
        }
    } else {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'<=\' not supported between instances of \'float\' and \'NoneType\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: float() <= NoneType()'
            )
        }
    }
}

Float.prototype.__eq__ = function(other) {
    var types = require('../types')

    if (other !== null && !types.isinstance(other, types.Str)) {
        var val
        if (types.isinstance(other, types.Bool)) {
            if (other.valueOf()) {
                val = 1.0
            } else {
                val = 0.0
            }
        } else if (types.isinstance(other, types.Int)) {
            val = parseFloat(other.val)
        } else if (types.isinstance(other, types.Complex)) {
            return other.imag === 0 && this.valueOf() === other.real
        } else {
            val = other.valueOf()
        }
        return this.valueOf() === val
    }
    return false
}

Float.prototype.__ne__ = function(other) {
    return !this.__eq__(other)
}

Float.prototype.__gt__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice
        ])) {
            if (version.at_least('3.6')) {
                throw new exceptions.TypeError.$pyclass(
                    '\'>\' not supported between instances of \'float\' and \'' +
                    type_name(other) + '\''
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: float() > ' + type_name(other) + '()'
                )
            }
        } else {
            return this.valueOf() > other.valueOf()
        }
    } else {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'>\' not supported between instances of \'float\' and \'NoneType\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: float() > NoneType()'
            )
        }
    }
}

Float.prototype.__ge__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Dict, types.List, types.Tuple,
            types.NoneType, types.Str, types.NotImplementedType,
            types.Range, types.Set, types.Slice,
            types.Bytes, types.Bytearray
        ])) {
            if (version.at_least('3.6')) {
                throw new exceptions.TypeError.$pyclass(
                    '\'>=\' not supported between instances of \'float\' and \'' +
                    type_name(other) + '\''
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: float() >= ' + type_name(other) + '()'
                )
            }
        } else {
            return this.valueOf() >= other.valueOf()
        }
    } else {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'>=\' not supported between instances of \'float\' and \'NoneType\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: float() >= NoneType()'
            )
        }
    }
}

Float.prototype.__contains__ = function(other) {
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

Float.prototype.__pos__ = function() {
    return new Float(+this.valueOf())
}

Float.prototype.__neg__ = function() {
    return new Float(-this.valueOf())
}

Float.prototype.__not__ = function() {
    var types = require('../types')
    return new types.Bool(!this.valueOf())
}

Float.prototype.__invert__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'float'")
}

Float.prototype.__abs__ = function() {
    return new Float(Math.abs(this.valueOf()))
}

/**************************************************
 * Binary operators
 **************************************************/

Float.prototype.__pow__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(Math.pow(this.valueOf(), 1))
        } else {
            return new Float(Math.pow(this.valueOf(), 0))
        }
    } else if (types.isinstance(other, [Float, types.Int])) {
        if (this.valueOf() === 0 && other.valueOf() < 0) {
            throw new exceptions.ZeroDivisionError.$pyclass('0.0 cannot be raised to a negative power')
        } else {
            return new Float(Math.pow(this.valueOf(), other.valueOf()))
        }
    } else {
        return NotImplemented
    }
}

Float.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Float.prototype.__floordiv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Int)) {
        if (!other.val.isZero()) {
            return new Float(Math.floor(this.valueOf() / other.valueOf()))
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float divmod()')
        }
    } else if (types.isinstance(other, Float)) {
        if (other.valueOf()) {
            return new Float(Math.floor(this.valueOf() / other.valueOf()))
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float divmod()')
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(Math.floor(this.valueOf()))
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float divmod()')
        }
    } else {
        return NotImplemented
    }
}

Float.prototype.__truediv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Int)) {
        if (!other.val.isZero()) {
            return new Float(this.valueOf() / other.valueOf())
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float division by zero')
        }
    } else if (types.isinstance(other, Float)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() / other.valueOf())
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float division by zero')
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf())
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float division by zero')
        }
    } else {
        return NotImplemented
    }
}

Float.prototype.__mul__ = function(other) {
    var types = require('../types')

    if (other === null) {
        return NotImplemented
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() * 1)
        } else {
            return new Float(this.valueOf() * 0)
        }
    } else if (types.isinstance(other, [Float, types.Int])) {
        return new Float(this.valueOf() * other.__float__().valueOf())
    } else {
        return NotImplemented
    }
}

Float.prototype.__mod__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Int)) {
        if (other.val.isZero()) {
            throw new exceptions.ZeroDivisionError.$pyclass('float modulo')
        } else {
            var thisNum = this.valueOf()
            var otherNum = parseFloat(other.val)
            var result = new Float(python_modulo(thisNum, otherNum))
            if (otherNum > MAX_FLOAT || otherNum < MIN_FLOAT || result.toString() === 'nan' || result.toString() === 'inf' || result.toString() === '-inf') {
                throw new exceptions.OverflowError.$pyclass(
                    'int too large to convert to float'
                )
            }
            if ((otherNum > thisNum && thisNum > 0) || (thisNum > otherNum && thisNum < 0) || thisNum === 0) {
                return new Float(thisNum)
            }
            if (result.valueOf() === 0 && (thisNum % otherNum) + otherNum === otherNum) {
                return new Float(otherNum)
            }
            return result
        }
    } else if (types.isinstance(other, Float)) {
        if (other.valueOf() === 0) {
            throw new exceptions.ZeroDivisionError.$pyclass('float modulo')
        } else {
            return new Float(python_modulo(this.valueOf(), other.valueOf()))
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(python_modulo(this.valueOf(), other.valueOf()))
        } else {
            throw new exceptions.ZeroDivisionError.$pyclass('float modulo')
        }
    } else {
        return NotImplemented
    }
}

Float.prototype.__add__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Int, Float])) {
        var value = new Float(this.valueOf() + parseFloat(other.valueOf()))
        if (value.toString() === 'inf' || value.toString() === '-inf') {
            throw new exceptions.OverflowError.$pyclass(
                'int too large to convert to float'
            )
        }
        return value
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() + 1.0)
        } else {
            return new Float(this.valueOf())
        }
    } else {
        return NotImplemented
    }
}

Float.prototype.__sub__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Int, Float])) {
        var value = new Float(this.valueOf() - other.valueOf())
        if (value.toString() === 'inf' || value.toString() === '-inf') {
            throw new exceptions.OverflowError.$pyclass(
                'int too large to convert to float'
            )
        }
        return value
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return new Float(this.valueOf() - 1.0)
        } else {
            return new Float(this.valueOf())
        }
    } else if (types.isinstance(other, types.Complex)) {
        var real = new Float(this.valueOf() - other.real)
        return new types.Complex(real.valueOf(), -other.imag.valueOf())
    } else {
        return NotImplemented
    }
}

Float.prototype.__getitem__ = function(other) {
    throw new exceptions.TypeError.$pyclass("'float' object is not subscriptable")
}

/**************************************************
 * Right-hand operators
 **************************************************/

Float.prototype.__radd__ = function(other) {
    return this.__add__(other)
}

Float.prototype.__rfloordiv__ = function(other) {
    return NotImplemented
}

Float.prototype.__rmod__ = function(other) {
    return NotImplemented
}

Float.prototype.__rmul__ = function(other) {
    return this.__mul__(other)
}

Float.prototype.__rpow__ = function(other) {
    return NotImplemented
}

Float.prototype.__rsub__ = function(other) {
    return NotImplemented
}

Float.prototype.__rtruediv__ = function(other) {
    return NotImplemented
}

/**************************************************
 * Methods
 **************************************************/

Float.prototype.copy = function() {
    return new Float(this.valueOf())
}

Float.prototype.is_integer = function() {
    var types = require('../types')

    return new types.Bool(Number.isInteger(this.valueOf()))
}

Float.prototype.__trunc__ = function() {
    var types = require('../types')

    return new types.Int(Math.trunc(this.valueOf()))
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = {
    Float: Float,
    scientific_notation_exponent_fix: scientific_notation_exponent_fix
}
