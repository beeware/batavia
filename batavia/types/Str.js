var Buffer = require('buffer').Buffer

var PyObject = require('../core').Object
var constants = require('../core').constants
var Type = require('../core').Type
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var None = require('../core').None
var StrIterator = require('./StrIterator')
var StrUtils = require('./StrUtils')

/*************************************************************************
 * Modify String to behave like a Python String
 *************************************************************************/

var Str = String

Str.prototype.__class__ = new Type('str')
Str.prototype.__class__.$pyclass = Str

/**************************************************
 * Type conversions
 **************************************************/

Str.prototype.__bool__ = function() {
    return this.length > 0
}

Str.prototype.__iter__ = function() {
    return new StrIterator(this)
}

Str.prototype.__repr__ = function() {
    // we have to replace all non-printable characters
    return "'" + this.toString()
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\x7F/g, '\\x7f')
        .replace(/[\u0000-\u001F]/g, function(match) {
            var code = match.charCodeAt(0)
            switch (code) {
                case 9:
                    return '\\t'
                case 10:
                    return '\\n'
                case 13:
                    return '\\r'
                default:
                    var hex = code.toString(16)
                    if (hex.length === 1) {
                        hex = '0' + hex
                    }
                    return '\\x' + hex
            }
        }) + "'"
}

Str.prototype.__str__ = function() {
    return this.toString()
}

 /**************************************************
 * Attribute manipulation
 **************************************************/

Str.prototype.__getattr__ = function(attr) {
    return PyObject.prototype.__getattr__.call(this, attr)
}

Str.prototype.__setattr__ = function(attr, value) {
    if (Object.getPrototypeOf(this)[attr] === undefined) {
        throw new exceptions.AttributeError.$pyclass("'str' object has no attribute '" + attr + "'")
    } else {
        throw new exceptions.AttributeError.$pyclass("'str' object attribute '" + attr + "' is read-only")
    }
}

/**************************************************
 * Comparison operators
 **************************************************/

Str.prototype.__lt__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Bool, types.Int, types.Float,
            types.List, types.Dict, types.Tuple,
            types.Bytearray, types.Bytes, types.Type,
            types.Complex, types.NotImplementedType,
            types.Range, types.Set, types.Slice,
            types.FrozenSet
        ])) {
            throw new exceptions.TypeError.$pyclass('unorderable types: str() < ' + type_name(other) + '()')
        } else {
            return this.valueOf() < other
        }
    } else {
        throw new exceptions.TypeError.$pyclass('unorderable types: str() < NoneType()')
    }
}

Str.prototype.__le__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Bool, types.Int, types.Float,
            types.List, types.Dict, types.Tuple,
            types.Set, types.Bytearray, types.Bytes,
            types.Type, types.Complex, types.NotImplementedType,
            types.Range, types.Slice, types.FrozenSet
        ])) {
            throw new exceptions.TypeError.$pyclass('unorderable types: str() <= ' + type_name(other) + '()')
        } else {
            return this.valueOf() <= other
        }
    } else {
        throw new exceptions.TypeError.$pyclass('unorderable types: str() <= NoneType()')
    }
}

Str.prototype.__eq__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Bool, types.Int, types.Float,
            types.List, types.Dict, types.Tuple
        ])) {
            return false
        } else {
            return this.valueOf() === other.valueOf()
        }
    } else {
        return false
    }
}

Str.prototype.__ne__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Bool, types.Int, types.Float,
            types.List, types.Dict, types.Tuple

        ])) {
            return true
        } else {
            return this.valueOf() !== other.valueOf()
        }
    } else {
        return true
    }
}

Str.prototype.__gt__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Bool, types.Int, types.Float,
            types.List, types.Dict, types.Tuple,
            types.Set, types.Bytearray, types.Bytes,
            types.Type, types.Complex,
            types.NotImplementedType, types.Range,
            types.Slice, types.FrozenSet
        ])) {
            throw new exceptions.TypeError.$pyclass('unorderable types: str() > ' + type_name(other) + '()')
        } else {
            return this.valueOf() > other
        }
    } else {
        throw new exceptions.TypeError.$pyclass('unorderable types: str() > NoneType()')
    }
}

Str.prototype.__ge__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        if (types.isinstance(other, [
            types.Bool, types.Int, types.Float,
            types.List, types.Dict, types.Tuple,
            types.Set, types.Bytearray, types.Bytes,
            types.Type, types.Complex, types.NotImplementedType,
            types.Range, types.Slice, types.FrozenSet

        ])) {
            throw new exceptions.TypeError.$pyclass('unorderable types: str() >= ' + type_name(other) + '()')
        } else {
            return this.valueOf() >= other
        }
    } else {
        throw new exceptions.TypeError.$pyclass('unorderable types: str() >= NoneType()')
    }
}

Str.prototype.__contains__ = function(other) {
    var types = require('../types')
    if (!types.isinstance(other, [types.Str])) {
        throw new exceptions.TypeError.$pyclass("'in <string>' requires string as left operand, not " + type_name(other))
    } else {
        return this.valueOf().search(other.valueOf()) >= 0
    }
}

/**************************************************
 * Unary operators
 **************************************************/

Str.prototype.__pos__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary +: 'str'")
}

Str.prototype.__neg__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary -: 'str'")
}

Str.prototype.__not__ = function() {
    return this.length === 0
}

Str.prototype.__invert__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'str'")
}

/**************************************************
 * Binary operators
 **************************************************/

Str.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'str' and '" + type_name(other) + "'")
}

Str.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Str.prototype.__floordiv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Complex])) {
        throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //: 'str' and '" + type_name(other) + "'")
    }
}

Str.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'str' and '" + type_name(other) + "'")
}

Str.prototype.__mul__ = function(other) {
    var types = require('../types')

    var result
    if (types.isinstance(other, types.Int)) {
        result = ''
        for (var i = 0; i < other.valueOf(); i++) {
            result += this.valueOf()
        }
        return result
    } else if (types.isinstance(other, types.Bool)) {
        if (other === true) {
            result = this.valueOf()
        } else {
            result = ''
        }
        return result
    } else {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

Str.prototype.__mod__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Tuple)) {
        return StrUtils._substitute(this, other)
    } else {
        return StrUtils._substitute(this, [other])
    }
}

Str.prototype.__add__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, Str)) {
        return this.valueOf() + other.valueOf()
    } else {
        throw new exceptions.TypeError.$pyclass("Can't convert '" + type_name(other) + "' object to str implicitly")
    }
}

Str.prototype.__sub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -: 'str' and '" + type_name(other) + "'")
}

Str.prototype.__getitem__ = function(index) {
    var types = require('../types')

    if (types.isinstance(index, types.Bool)) {
        index = index.__int__()
    }
    if (types.isinstance(index, types.Int)) {
        var idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw new exceptions.IndexError.$pyclass('string index out of range')
            } else {
                return this[this.length + idx]
            }
        } else {
            if (idx >= this.length) {
                throw new exceptions.IndexError.$pyclass('string index out of range')
            } else {
                return this[idx]
            }
        }
    } else if (types.isinstance(index, types.Slice)) {
        var start, stop, step
        if (index.start === null) {
            start = undefined
        } else {
            start = index.start.valueOf()
        }
        if (index.stop === null) {
            stop = undefined
        } else {
            stop = index.stop.valueOf()
        }
        step = index.step.valueOf()

        if (step === 0) {
            throw new exceptions.ValueError.$pyclass('slice step cannot be zero')
        }

        // clone string
        var result = this.valueOf()

        // handle step
        if (step === undefined || step === 1) {
            return result.slice(start, stop)
        } else if (step > 0) {
            result = result.slice(start, stop)
        } else if (step < 0) {
            // adjust start/stop to swap inclusion/exlusion in slice
            if (start !== undefined && start !== -1) {
                start = start + 1
            } else if (start === -1) {
                start = result.length
            }
            if (stop !== undefined && stop !== -1) {
                stop = stop + 1
            } else if (stop === -1) {
                stop = result.length
            }

            result = result.slice(stop, start).split('').reverse().join('')
        }

        var steppedResult = ''
        for (var i = 0; i < result.length; i = i + Math.abs(step)) {
            steppedResult += result[i]
        }

        result = steppedResult

        return result
    } else {
        throw new exceptions.TypeError.$pyclass('string indices must be integers')
    }
}

Str.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for <<: 'str' and '" + type_name(other) + "'"
    )
}

Str.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for >>: 'str' and '" + type_name(other) + "'"
    )
}

Str.prototype.__and__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for &: 'str' and '" + type_name(other) + "'"
    )
}

Str.prototype.__xor__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for ^: 'str' and '" + type_name(other) + "'"
    )
}

Str.prototype.__or__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for |: 'str' and '" + type_name(other) + "'"
    )
}

/**************************************************
 * Inplace operators
 **************************************************/

Str.prototype.__ifloordiv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Complex])) {
        throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //=: 'str' and '" + type_name(other) + "'")
    }
}

Str.prototype.__itruediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /=: 'str' and '" + type_name(other) + "'")
}

Str.prototype.__iadd__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, Str)) {
        return this.valueOf() + other.valueOf()
    } else {
        throw new exceptions.TypeError.$pyclass("Can't convert '" + type_name(other) + "' object to str implicitly")
    }
}

Str.prototype.__isub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -=: 'str' and '" + type_name(other) + "'")
}

Str.prototype.__imul__ = function(other) {
    return this.__mul__(other)
}

Str.prototype.__imod__ = function(other) {
    return this.__mod__(other)
}

Str.prototype.__ipow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'str' and '" + type_name(other) + "'")
}

Str.prototype.__ilshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass(
        "unsupported operand type(s) for <<=: 'str' and '" + type_name(other) + "'"
    )
}

Str.prototype.__irshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>=: 'str' and '" + type_name(other) + "'")
}

Str.prototype.__iand__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &=: 'str' and '" + type_name(other) + "'")
}

Str.prototype.__ixor__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^=: 'str' and '" + type_name(other) + "'")
}

Str.prototype.__ior__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |=: 'str' and '" + type_name(other) + "'")
}

/**************************************************
 * Methods
 **************************************************/

Str.prototype.join = function(iter) {
    var types = require('../types')

    var l = new types.List(iter)
    for (var i = 0; i < l.length; i++) {
        if (!types.isinstance(l[i], Str)) {
            throw new exceptions.TypeError.$pyclass('sequence item ' + i + ': expected str instance, ' + type_name(l[i]) + ' found')
        }
    }
    return l.join(this)
}

/**************************************************
 * Methods
 **************************************************/

Str.prototype.copy = function() {
    return this.valueOf()
}

Str.prototype.encode = function(encoding, errors) {
    var types = require('../types')

    if (errors !== undefined) {
        return new exceptions.NotImplementedError(
            "'errors' parameter of str.encode not implemented"
        )
    }
    encoding = encoding.toLowerCase()
    var encs = constants.TEXT_ENCODINGS
    if (encs.ascii.indexOf(encoding) !== -1) {
        return new types.Bytes(
            Buffer.from(this.valueOf(), 'ascii'))
    } else if (encs.latin_1.indexOf(encoding) !== -1) {
        return new types.Bytes(
            Buffer.from(this.valueOf(), 'latin1'))
    } else if (encs.utf_8.indexOf(encoding) !== -1) {
        return new types.Bytes(
            Buffer.from(this.valueOf(), 'utf8'))
    } else {
        return new exceptions.NotImplementedError(
            'encoding not implemented or incorrect encoding'
        )
    }
}

Str.prototype.lstrip = function() {
    var types = require('../types')

    if (arguments.length === 0) {
        return this.valueOf().trimLeft()
    } else if (arguments.length === 1) {
        var charsToTrim = arguments[0]
        if (!types.isinstance(charsToTrim, [types.Str])) {
            throw new exceptions.TypeError.$pyclass('lstrip arg must be None or str')
        }
        var result = this.valueOf()
        var i = 0
        while (charsToTrim.indexOf(result[i]) > -1) {
            i++
        }
        return result.slice(i)
    } else {
        throw new exceptions.TypeError.$pyclass('lstrip() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

Str.prototype.rstrip = function() {
    var types = require('../types')

    if (arguments.length === 0) {
        return this.valueOf().trimRight()
    } else if (arguments.length === 1) {
        var charsToTrim = arguments[0]
        if (!types.isinstance(charsToTrim, [types.Str])) {
            throw new exceptions.TypeError.$pyclass('rstrip arg must be None or str')
        }
        var result = this.valueOf()
        var i = result.length
        while (charsToTrim.indexOf(result[i - 1]) > -1) {
            i--
        }
        return result.slice(0, i)
    } else {
        throw new exceptions.TypeError.$pyclass('rstrip() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

Str.prototype.strip = function() {
    var types = require('../types')

    if (arguments.length === 0) {
        return this.valueOf().trim()
    } else if (arguments.length === 1) {
        var charsToTrim = arguments[0]
        if (!types.isinstance(charsToTrim, [types.Str])) {
            throw new exceptions.TypeError.$pyclass('strip arg must be None or str')
        }
        var result = this.valueOf()
        var i = 0
        while (charsToTrim.indexOf(result[i]) > -1) {
            i++
        }
        var j = result.length
        while (charsToTrim.indexOf(result[j - 1]) > -1) {
            j--
        }
        return result.slice(i, j)
    } else {
        throw new exceptions.TypeError.$pyclass('strip() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

Str.prototype.startswith = function(str) {
    var types = require('../types')

    if (arguments.length > 1) {
        throw new exceptions.TypeError.$pyclass(
            'slice indices must be integers or None or have an __index__ method'
        )
    } else if (arguments.length === 0) {
        throw new exceptions.TypeError.$pyclass(
            'startswith() takes at least 1 argument (0 given)'
        )
    }

    if (str !== None) {
        if (types.isinstance(str, [types.Str])) {
            return this.slice(0, str.length) === str
        } else if (types.isinstance(str, [types.Tuple])) {
            for (var i = 0; i < str.length; i++) {
                if (this.startswith(str[i])) {
                    return true
                }
            }
            return false
        } else {
            throw new exceptions.TypeError.$pyclass(
                'TypeError: startswith first arg must be str or a tuple of str, not ' + type_name(str)
            )
        }
    }
}

Str.prototype.endswith = function(str) {
    return this.slice(this.length - str.length) === str
}

Str.prototype.isupper = function() {
    if (!this.match('[a-zA-Z]')) {
        return false
    } else {
        return (this.valueOf() === this.valueOf().toUpperCase())
    }
}

Str.prototype.islower = function() {
    if (!this.match('[a-zA-Z]')) {
        return false
    } else {
        return (this.valueOf() === this.valueOf().toLowerCase())
    }
}

// Based on https://en.wikipedia.org/wiki/Universal_hashing#Hashing_strings
// and http://www.cse.yorku.ca/~oz/hash.html.
//
// CPython returns signed 64-bit integers. But, JS is awful at 64-bit integers,
// so we return signed 32-bit integers. This shouldn't be a problem, since
// technically we can just return 0 and everything should still work :P
Str.prototype.__hash__ = function() {
    var types = require('../types')

    // |0 is used to ensure that we return signed 32-bit integers
    var h = 5381 | 0
    for (var i = 0; i < this.length; i++) {
        h = ((h * 33) | 0) ^ this[i]
    }
    return new types.Int(h)
}

Str.prototype.capitalize = function() {
    if (arguments.length === 0) {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
    } else {
        throw new exceptions.TypeError.$pyclass('capitalize() takes no arguments (' + arguments.length + ' given)')
    }
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Str
