var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var version = require('../core').version
var type_name = require('../core').type_name
var NotImplemented = require('../core').NotImplemented

/*************************************************************************
 * Modify Javascript Boolean to behave like a Python bool
 *************************************************************************/

var Bool = Boolean

create_pyclass(Bool, 'bool', true)

Bool.prototype.__dir__ = function() {
    var types = require('../types')
    if (version.at_least(3.6)) {
        // Python 3.6 adds classmethod object.__init_subclass__
        return new types.List(['__abs__', '__add__', '__and__', '__bool__', '__ceil__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__', '__floor__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getnewargs__', '__gt__', '__hash__', '__index__', '__init__', '__init_subclass__', '__int__', '__invert__', '__le__', '__lshift__', '__lt__', '__mod__', '__mul__', '__ne__', '__neg__', '__new__', '__or__', '__pos__', '__pow__', '__radd__', '__rand__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rlshift__', '__rmod__', '__rmul__', '__ror__', '__round__', '__rpow__', '__rrshift__', '__rshift__', '__rsub__', '__rtruediv__', '__rxor__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', '__trunc__', '__xor__', 'bit_length', 'conjugate', 'denominator', 'from_bytes', 'imag', 'numerator', 'real', 'to_bytes'])
    }
    return new types.List(['__abs__', '__add__', '__and__', '__bool__', '__ceil__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__', '__floor__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getnewargs__', '__gt__', '__hash__', '__index__', '__init__', '__int__', '__invert__', '__le__', '__lshift__', '__lt__', '__mod__', '__mul__', '__ne__', '__neg__', '__new__', '__or__', '__pos__', '__pow__', '__radd__', '__rand__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rlshift__', '__rmod__', '__rmul__', '__ror__', '__round__', '__rpow__', '__rrshift__', '__rshift__', '__rsub__', '__rtruediv__', '__rxor__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', '__trunc__', '__xor__', 'bit_length', 'conjugate', 'denominator', 'from_bytes', 'imag', 'numerator', 'real', 'to_bytes'])
}

/**************************************************
 * Type conversions
 **************************************************/

Bool.prototype.__bool__ = function() {
    return this.valueOf()
}

Bool.prototype.__repr__ = function(args, kwargs) {
    return this.__str__()
}

Bool.prototype.__str__ = function(args, kwargs) {
    if (this.valueOf()) {
        return 'True'
    } else {
        return 'False'
    }
}

Bool.prototype.__float__ = function() {
    var types = require('../types')
    var this_bool
    if (this.valueOf()) {
        this_bool = 1.0
    } else {
        this_bool = 0.0
    }
    return new types.Float(this_bool)
}

/**************************************************
 * Comparison operators
 **************************************************/

Bool.prototype.__eq__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, Bool)) {
        return this.valueOf() === other.__bool__()
    } else if (types.isinstance(other, types.Float)) {
        if (other.valueOf() === 0.0) {
            return this.valueOf() === false
        } else {
            return false
        }
    } else if (types.isinstance(other, types.Int)) {
        if (other.val.eq(0)) {
            return this.valueOf() === false
        } else if (other.val.eq(1)) {
            return this.valueOf() === true
        } else {
            return false
        }
    } else if (types.isinstance(other, types.Complex)) {
        var this_bool
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return other.imag === 0 && this_bool === other.real
    } else {
        return false
    }
}

Bool.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__()
}

Bool.prototype.__ge__ = function(other) {
    var types = require('../types')
    var this_bool, other_bool

    if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new Bool(this_bool >= other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__ge__(other)
    } else if (types.isinstance(other, Bool)) {
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
        return new Bool(this_bool >= other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'>=\' not supported between instances of \'bool\' and \'' + type_name(other) + '\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: bool() >= ' + type_name(other) + '()'
            )
        }
    } else {
        return NotImplemented
    }
}

Bool.prototype.__gt__ = function(other) {
    var types = require('../types')
    var this_bool, other_bool

    if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new Bool(this_bool > other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__gt__(other)
    } else if (types.isinstance(other, Bool)) {
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
        return new Bool(this_bool > other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'>\' not supported between instances of \'bool\' and \'' +
                type_name(other) + '\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: bool() > ' + type_name(other) + '()'
            )
        }
    } else {
        return NotImplemented
    }
}

Bool.prototype.__le__ = function(other) {
    var types = require('../types')
    var this_bool, other_bool

    if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new Bool(this_bool <= other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__le__(other)
    } else if (types.isinstance(other, Bool)) {
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
        return new Bool(this_bool <= other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'<=\' not supported between instances of \'bool\' and \'' + type_name(other) + '\'')
        } else {
            throw new exceptions.TypeError.$pyclass('unorderable types: bool() <= ' + type_name(other) + '()')
        }
    } else {
        return NotImplemented
    }
}

Bool.prototype.__lt__ = function(other) {
    var types = require('../types')
    var this_bool, other_bool

    if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new Bool(this_bool < other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__lt__(other)
    } else if (types.isinstance(other, Bool)) {
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
        return new Bool(this_bool < other_bool)
    } else if (types.isbataviainstance(other)) {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'<\' not supported between instances of \'bool\' and \'' +
                type_name(other) + '\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: bool() < ' + type_name(other) + '()'
            )
        }
    } else {
        return NotImplemented
    }
}

Bool.prototype.__contains__ = function(other) {
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

Bool.prototype.__pos__ = function() {
    return +this.valueOf()
}

Bool.prototype.__neg__ = function() {
    return -this.valueOf()
}

Bool.prototype.__not__ = function() {
    return Bool(!this.valueOf())
}

Bool.prototype.__invert__ = function() {
    return ~this.valueOf()
}

Bool.prototype.__int__ = function() {
    var types = require('../types')

    if (this.valueOf()) {
        return new types.Int(1)
    } else {
        return new types.Int(0)
    }
}

Bool.prototype.__index__ = function() {
    return this.__int__()
}

Bool.prototype.__abs__ = function() {
    return this.__int__()
}

/**************************************************
 * Binary operators
 **************************************************/

Bool.prototype.__pow__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(1)
        } else if (this.valueOf()) {
            return new types.Int(1)
        } else if (other.valueOf()) {
            return new types.Int(0)
        } else {
            return new types.Int(1)
        }
    } else if (types.isinstance(other, [types.Float, types.Int, types.Complex])) {
        if (this.valueOf()) {
            if (types.isinstance(other, types.Int) && other.__ge__(new types.Float(0.0))) {
                return new types.Int(Math.pow(1, other.valueOf()))
            } else if (types.isinstance(other, types.Complex)) {
                return new types.Complex('1')
            } else {
                return new types.Float(Math.pow(1.0, other.valueOf()))
            }
        } else {
            if (types.isinstance(other, types.Complex)) {
                return new types.Int(0).__pow__(other)
            } else if (other.__lt__(new types.Float(0.0))) {
                throw new exceptions.ZeroDivisionError.$pyclass('0.0 cannot be raised to a negative power')
            } else if (types.isinstance(other, types.Int)) {
                return new types.Int(Math.pow(0, other.valueOf()))
            } else {
                return new types.Float(Math.pow(0.0, other.valueOf()))
            }
        }
    } else {
        return NotImplemented
    }
}

Bool.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Bool.prototype.__floordiv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Float, types.Int, types.Bool])) {
        var thisValue
        if (this.valueOf()) {
            thisValue = new types.Int(1)
        } else {
            thisValue = new types.Int(0)
        }
        return thisValue.__floordiv__(other)
    } else {
        return NotImplemented
    }
}

Bool.prototype.__truediv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Float, types.Int, types.Bool, types.Complex])) {
        var thisValue
        if (this.valueOf()) {
            thisValue = new types.Int(1)
        } else {
            thisValue = new types.Int(0)
        }
        return thisValue.__truediv__(other)
    } else {
        return NotImplemented
    }
}

Bool.prototype.__mul__ = function(other) {
    var types = require('../types')
    var this_bool

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(1)
        } else {
            return new types.Int(0)
        }
    } else if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.Float(this_bool * other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Int(this_bool * other.valueOf())
    } else if (types.isinstance(other, types.Complex)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.Complex('0j')
        }
    } else if (types.isinstance(other, types.Str)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.Str()
        }
    } else if (types.isinstance(other, types.Bytes)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.Bytes('')
        }
    } else if (types.isinstance(other, types.Tuple)) {
        if (this.valueOf()) {
            return other
        } else {
            return new types.Tuple()
        }
    } else if (types.isinstance(other, types.List)) {
        if (this.valueOf()) {
            return new types.List(other.valueOf())
        } else {
            return new types.List([])
        }
    } else if (types.isinstance(other, types.Bytearray)) {
        if (this.valueOf()) {
            return new types.Bytearray(other.valueOf())
        } else {
            return new types.Bytearray(new types.Bytes(''))
        }
    } else {
        return NotImplemented
    }
}

Bool.prototype.__mod__ = function(other) {
    var types = require('../types')

    if ((types.isinstance(other, types.Int) && other.val.isZero()) || (types.isinstance(other, types.Bool) && !other.valueOf())) {
        throw new exceptions.ZeroDivisionError.$pyclass('integer division or modulo by zero')
    } else if (this.valueOf() && (types.isinstance(other, types.Int) && other.valueOf() > 1)) {
        return new types.Bool(true)
    } else if (this.valueOf() && (types.isinstance(other, types.Bool) && other.valueOf())) {
        return new types.Int(0)
    } else if (!this.valueOf() && types.isinstance(other, [types.Bool, types.Int]) && other.valueOf()) {
        return new types.Bool(false)
    } else if (types.isinstance(other, types.Int)) {
        var this_val
        if (this.valueOf()) {
            this_val = new types.Int(1)
        } else {
            this_val = new types.Int(0)
        }
        return new types.Int(this_val.val.mod(other.val).add(other.val).mod(other.val))
    } else if (types.isinstance(other, types.Float)) {
        var this_val2
        if (this.valueOf()) {
            this_val2 = new types.Int(1)
        } else {
            this_val2 = new types.Int(0)
        }
        var result = ((this_val2 % other) + other) % other
        if (other.valueOf() === 0.0) {
            throw new exceptions.ZeroDivisionError.$pyclass('float modulo')
        } else {
            return new types.Float(result)
        }
    } else {
        return NotImplemented
    }
}

Bool.prototype.__add__ = function(other) {
    var types = require('../types')
    var this_bool

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(2)
        } else if (this.valueOf() || other.valueOf()) {
            return new types.Int(1)
        } else {
            return new types.Int(0)
        }
    } else if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.Float(this_bool + other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Int(other.val.add(this_bool))
    } else if (types.isinstance(other, types.Complex)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Complex(this_bool + other.real, other.imag)
    } else {
        return NotImplemented
    }
}

Bool.prototype.__sub__ = function(other) {
    var types = require('../types')
    var this_bool

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(0)
        } else if (this.valueOf()) {
            return new types.Int(1)
        } else if (other.valueOf()) {
            return new types.Int(-1)
        } else {
            return new types.Int(0)
        }
    } else if (types.isinstance(other, types.Float)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.Float(this_bool - other.valueOf())
    } else if (types.isinstance(other, types.Int)) {
        if (this.valueOf()) {
            this_bool = 1.0
        } else {
            this_bool = 0.0
        }
        return new types.Int(other.val.sub(this_bool).neg())
    } else if (types.isinstance(other, types.Complex)) {
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Complex(this_bool - other.real, 0 - other.imag)
    } else {
        return NotImplemented
    }
}

Bool.prototype.__getitem__ = function(other) {
    throw new exceptions.TypeError.$pyclass("'bool' object is not subscriptable")
}

Bool.prototype.__setattr__ = function(other) {
    throw new exceptions.AttributeError.$pyclass("'bool' object has no attribute '" + other + "'")
}

Bool.prototype.__lshift__ = function(other) {
    var types = require('../types')
    var this_bool

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(2)
        } else if (this.valueOf()) {
            return new types.Int(1)
        } else if (other.valueOf()) {
            return new types.Int(0)
        } else {
            return new types.Int(0)
        }
    } else if (types.isinstance(other, types.Int)) {
        if (other.valueOf() < 0) {
            throw new exceptions.ValueError.$pyclass('negative shift count')
        }
        if (Number.MAX_SAFE_INTEGER < other.valueOf()) {
            throw new exceptions.OverflowError.$pyclass('Python int too large to convert to C ssize_t')
        }
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Int(this_bool << other.valueOf())
    } else {
        return NotImplemented
    }
}

Bool.prototype.__rshift__ = function(other) {
    var types = require('../types')
    var this_bool

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && !other.valueOf()) {
            return new types.Int(1)
        } else {
            return new types.Int(0)
        }
    } else if (types.isinstance(other, types.Int)) {
        if (other.valueOf() < 0) {
            throw new exceptions.ValueError.$pyclass('negative shift count')
        }
        if (Number.MAX_SAFE_INTEGER < Math.abs(other.valueOf())) {
            throw new exceptions.OverflowError.$pyclass('Python int too large to convert to C ssize_t')
        }
        if (this.valueOf()) {
            this_bool = 1
        } else {
            this_bool = 0
        }
        return new types.Int(this_bool >> other.valueOf())
    } else {
        return NotImplemented
    }
}

Bool.prototype.__and__ = function(other) {
    var types = require('../types')
    var this_bool, other_bool

    if (types.isinstance(other, types.Int)) {
        return this.__int__().__and__(other)
    } else if (types.isinstance(other, Bool)) {
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
        return new Bool(this_bool & other_bool)
    } else {
        return NotImplemented
    }
}

Bool.prototype.__xor__ = function(other) {
    var types = require('../types')
    var this_bool, other_bool

    if (types.isinstance(other, types.Int)) {
        return this.__int__().__xor__(other)
    } else if (types.isinstance(other, Bool)) {
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
        return new Bool(this_bool ^ other_bool)
    } else {
        return NotImplemented
    }
}

Bool.prototype.__or__ = function(other) {
    var types = require('../types')
    var this_bool, other_bool

    if (types.isinstance(other, types.Int)) {
        return this.__int__().__or__(other)
    } else if (types.isinstance(other, Bool)) {
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
        return new Bool(this_bool | other_bool)
    } else {
        return NotImplemented
    }
}

/**************************************************
 * Right-hand operators
 **************************************************/

Bool.prototype.__radd__ = function(other) {
    return this.__add__(other)
}

Bool.prototype.__rand__ = function(other) {
    return this.__and__(other)
}

Bool.prototype.__rfloordiv__ = function(other) {
    return this.__floordiv__(other)
}

Bool.prototype.__rlshift__ = function(other) {
    return this.__lshift__(other)
}

Bool.prototype.__rmod__ = function(other) {
    return this.__mod__(other)
}

Bool.prototype.__rmul__ = function(other) {
    return this.__mul__(other)
}

Bool.prototype.__ror__ = function(other) {
    return this.__or__(other)
}

Bool.prototype.__rpow__ = function(other) {
    return this.__pow__(other)
}

Bool.prototype.__rrshift__ = function(other) {
    return this.__rshift__(other)
}

Bool.prototype.__rsub__ = function(other) {
    return this.__sub__(other)
}

Bool.prototype.__rtruediv__ = function(other) {
    return this.__truediv__(other)
}

Bool.prototype.__rxor__ = function(other) {
    return this.__xor__(other)
}

/**************************************************
 * Methods
 **************************************************/

Bool.prototype.copy = function() {
    return this.valueOf()
}

Bool.prototype.__trunc__ = function() {
    var types = require('../types')

    if (this.valueOf()) {
        return new types.Int(1)
    }
    return new types.Int(0)
}

Bool.prototype.__format__ = function(value, specifier) {
    if((specifier && specifier === "") || simpleSpecifier(specifier)){
        return toIntString(value);
    }
    if(specifier === 'e')
        return new types.Float(toInt(value));// + ".000000e+00";
        // return toIntString(value) + ".000000e+00";
    if(specifier === 'E')
        return toIntString(value) + ".000000E+00";
    if(specifier === 'f' || specifier === 'F')
        return toIntString(value) + ".000000";
    if(specifier === 'c')                
        return '\\x0' + toIntString(value);
    if(specifier === '%')                
        return '100.000000%';
    if(specContains(specifier, ['f', 'F', 'E', 'e', 'g','G']))
        return types.Float.__format__(toFloat(value), specifier);
    if(specContains(specifier, ['d', 'b', 'o', 'x','X']))
        return types.Int.__format__(toInt(value), specifier);
    if(specifier.length === 1)
        throw new exceptions.ValueError.$pyclass("Unknown format code '" + specifier + "' for object of type 'bool'")
    throw new exceptions.ValueError.$pyclass("Invalid format specifier")
}

function specContains(specifier, check) {
    for (let i = 0; i < check.length; i++) {
       if(specifier.indexOf(check[i]) > -1){
           return true;
       } 
    }
    return false;
}

function name(params) {
    
}

function toIntString(value) {
    return value ? "1" : "0"; 
}

function toFloat(value) {
    return value ? 1.0 : 0.0; 
}

function toInt(value) {
    return value ? 1 : 0; ;
}

function simpleSpecifier(spec) {
    check = 'bdgGnoxX'
    if(spec.length === 1 && check.indexOf(spec) > -1)
        return true;
    return false;
}

// function tryResolvingAlignmentFlags(args) {
//     return makeFormattingAttempts(getAlignmentFormatObjects(args));
// }

// function makeFormattingAttempts(tryList) {
//     for (let i = 0; i < tryList.length; i++) {
//         if (tryList[i].formatApplies())
//             return tryList[i].format();
//     }
// }

// function getAlignmentFormatObjects(args) {
//     return [
//         formatterWrapper(() => hasAlignLeftFlag(args), () => pad(args, "<", padLeft)),
//         formatterWrapper(() => hasAlignRightFlag(args), () => pad(args, ">", padRight))
//     ];
// }

// function formatterWrapper(formatCheck, formatOperation) {
//     return {
//         formatApplies: formatCheck,
//         format: formatOperation
//     };
// }


// [[fill]align][sign][#][0][width][,][.precision][type]
// where, the options are
// fill        ::=  any character
// align       ::=  "<" | ">" | "=" | "^"
// sign        ::=  "+" | "-" | " "
// width       ::=  integer
// precision   ::=  integer
// type        ::=  "b" | "c" | "d" | "e" | "E" | "f" | "F" | "g" | "G" | "n" | "o" | "s" | "x" | "X" | "%"

/**************************************************
 * Module exports
 **************************************************/

module.exports = Bool
