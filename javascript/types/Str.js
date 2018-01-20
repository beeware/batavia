import { Buffer } from 'buffer'

import { TEXT_ENCODINGS } from '../core/constants'
import { IndexError, NotImplementedError, TypeError, ValueError } from '../core/exceptions'
import { create_pyclass, type_name, PyNone } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

import PyStrIterator from './StrIterator'
import * as StrUtils from './StrUtils'

/*************************************************************************
 * Modify String to behave like a Python String
 *************************************************************************/

var PyStr = String

PyStr.prototype.__doc__ = 'str(object) -> string\n\nReturn the canonical string representation of the object.\nFor most object types, eval(repr(object)) === object.'

PyStr.prototype.toString = function() {
    return this
}

/**************************************************
 * Type conversions
 **************************************************/

PyStr.prototype.__bool__ = function() {
    return this.length > 0
}

PyStr.prototype.__iter__ = function() {
    return new PyStrIterator(this)
}

PyStr.prototype.__repr__ = function() {
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

PyStr.prototype.__str__ = function() {
    return this.toString()
}

/**************************************************
 * Attribute manipulation
 **************************************************/

// PyStr.prototype.__getattribute__ = function(attr) {
//     return PyObject.prototype.__class__.__getattribute__(this, attr)
// }

// PyStr.prototype.__setattr__ = function(attr, value) {
//     if (Object.getPrototypeOf(this)[attr] === undefined) {
//         throw new AttributeError("'str' object has no attribute '" + attr + "'")
//     } else {
//         throw new AttributeError("'str' object attribute '" + attr + "' is read-only")
//     }
// }

// PyStr.prototype.__delattr__ = function(attr) {
//     throw new AttributeError("'str' object has no attribute '" + attr + "'")
// }

/**************************************************
 * Comparison operators
 **************************************************/

PyStr.prototype.__lt__ = function(other) {
    if (other !== PyNone) {
        if (types.isinstance(other, [
            types.PyBool, types.PyInt, types.PyFloat,
            types.PyList, types.PyDict, types.PyTuple,
            types.PyBytearray, types.PyBytes, types.PyType,
            types.PyComplex, types.PyNotImplementedType,
            types.PyRange, types.PySet, types.PySlice,
            types.PyFrozenSet
        ])) {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: str() < ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'<' not supported between instances of 'str' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() < other
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: str() < NoneType()'
            )
        } else {
            throw new TypeError(
                "'<' not supported between instances of 'str' and 'NoneType'"
            )
        }
    }
}

PyStr.prototype.__le__ = function(other) {
    if (other !== PyNone) {
        if (types.isinstance(other, [
            types.PyBool, types.PyInt, types.PyFloat,
            types.PyList, types.PyDict, types.PyTuple,
            types.PySet, types.PyBytearray, types.PyBytes,
            types.PyType, types.PyComplex, types.PyNotImplementedType,
            types.PyRange, types.PySlice, types.PyFrozenSet
        ])) {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: str() <= ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'<=' not supported between instances of 'str' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() <= other
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: str() <= NoneType()'
            )
        } else {
            throw new TypeError(
                "'<=' not supported between instances of 'str' and 'NoneType'"
            )
        }
    }
}

PyStr.prototype.__eq__ = function(other) {
    if (other !== PyNone) {
        if (types.isinstance(other, [
            types.PyBool, types.PyInt, types.PyFloat,
            types.PyList, types.PyDict, types.PyTuple
        ])) {
            return false
        } else {
            return this.valueOf() === other.valueOf()
        }
    } else {
        return false
    }
}

PyStr.prototype.__ne__ = function(other) {
    if (other !== PyNone) {
        if (types.isinstance(other, [
            types.PyBool, types.PyInt, types.PyFloat,
            types.PyList, types.PyDict, types.PyTuple

        ])) {
            return true
        } else {
            return this.valueOf() !== other.valueOf()
        }
    } else {
        return true
    }
}

PyStr.prototype.__gt__ = function(other) {
    if (other !== PyNone) {
        if (types.isinstance(other, [
            types.PyBool, types.PyInt, types.PyFloat,
            types.PyList, types.PyDict, types.PyTuple,
            types.PySet, types.PyBytearray, types.PyBytes,
            types.PyType, types.PyComplex,
            types.PyNotImplementedType, types.PyRange,
            types.PySlice, types.PyFrozenSet
        ])) {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: str() > ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'>' not supported between instances of 'str' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() > other
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: str() > NoneType()'
            )
        } else {
            throw new TypeError(
                "'>' not supported between instances of 'str' and 'NoneType'"
            )
        }
    }
}

PyStr.prototype.__ge__ = function(other) {
    if (other !== PyNone) {
        if (types.isinstance(other, [
            types.PyBool, types.PyInt, types.PyFloat,
            types.PyList, types.PyDict, types.PyTuple,
            types.PySet, types.PyBytearray, types.PyBytes,
            types.PyType, types.PyComplex, types.PyNotImplementedType,
            types.PyRange, types.PySlice, types.PyFrozenSet

        ])) {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: str() >= ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'>=' not supported between instances of 'str' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() >= other
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: str() >= NoneType()'
            )
        } else {
            throw new TypeError(
                "'>=' not supported between instances of 'str' and 'NoneType'"
            )
        }
    }
}

PyStr.prototype.__contains__ = function(other) {
    if (!types.isinstance(other, [types.PyStr])) {
        throw new TypeError("'in <string>' requires string as left operand, not " + type_name(other))
    } else {
        return this.valueOf().search(other.valueOf()) >= 0
    }
}

/**************************************************
 * Unary operators
 **************************************************/

PyStr.prototype.__pos__ = function() {
    throw new TypeError("bad operand type for unary +: 'str'")
}

PyStr.prototype.__neg__ = function() {
    throw new TypeError("bad operand type for unary -: 'str'")
}

PyStr.prototype.__not__ = function() {
    return this.length === 0
}

PyStr.prototype.__invert__ = function() {
    throw new TypeError("bad operand type for unary ~: 'str'")
}

/**************************************************
 * Binary operators
 **************************************************/

PyStr.prototype.__pow__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ** or pow(): 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

PyStr.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, [types.PyComplex])) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        throw new TypeError("unsupported operand type(s) for //: 'str' and '" + type_name(other) + "'")
    }
}

PyStr.prototype.__truediv__ = function(other) {
    throw new TypeError("unsupported operand type(s) for /: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__mul__ = function(other) {
    var result
    if (types.isinstance(other, types.PyInt)) {
        result = ''
        for (var i = 0; i < other.valueOf(); i++) {
            result += this.valueOf()
        }
        return result
    } else if (types.isinstance(other, types.PyBool)) {
        if (other === true) {
            result = this.valueOf()
        } else {
            result = ''
        }
        return result
    } else {
        throw new TypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

PyStr.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.PyTuple)) {
        return StrUtils._substitute(this, other)
    } else {
        return StrUtils._substitute(this, [other])
    }
}

PyStr.prototype.__add__ = function(other) {
    if (types.isinstance(other, PyStr)) {
        return this.valueOf() + other.valueOf()
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                "Can't convert '" + type_name(other) + "' object to str implicitly"
            )
        } else {
            throw new TypeError('must be str, not ' + type_name(other))
        }
    }
}

PyStr.prototype.__sub__ = function(other) {
    throw new TypeError("unsupported operand type(s) for -: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__getitem__ = function(index) {
    if (types.isinstance(index, types.PyBool)) {
        index = index.__int__()
    }
    if (types.isinstance(index, types.PyInt)) {
        var idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw new IndexError('string index out of range')
            } else {
                return this[this.length + idx]
            }
        } else {
            if (idx >= this.length) {
                throw new IndexError('string index out of range')
            } else {
                return this[idx]
            }
        }
    } else if (types.isinstance(index, types.PySlice)) {
        var start, stop, step

        if (index.start === PyNone) {
            start = undefined
        } else if (!(types.isinstance(index.start, types.PyInt))) {
            if (index.start.__index__ === undefined) {
                throw new TypeError('slice indices must be integers or None or have an __index__ method')
            } else {
                start = index.start.__index__()
            }
        } else {
            start = index.start.int32()
        }

        if (index.stop === PyNone) {
            stop = undefined
        } else if (!(types.isinstance(index.stop, types.PyInt))) {
            if (index.stop.__index__ === undefined) {
                throw new TypeError('slice indices must be integers or None or have an __index__ method')
            } else {
                stop = index.stop.__index__()
            }
        } else {
            stop = index.stop.int32()
        }

        if (index.step === PyNone) {
            step = 1
        } else if (!(types.isinstance(index.step, types.PyInt))) {
            if (index.step.__index__ === undefined) {
                throw new TypeError('slice indices must be integers or None or have an __index__ method')
            } else {
                step = index.step.__index__()
            }
        } else {
            step = index.step.int32()
            if (step === 0) {
                throw new ValueError('slice step cannot be zero')
            }
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
        throw new TypeError('string indices must be integers')
    }
}

PyStr.prototype.__lshift__ = function(other) {
    throw new TypeError(
        "unsupported operand type(s) for <<: 'str' and '" + type_name(other) + "'"
    )
}

PyStr.prototype.__rshift__ = function(other) {
    throw new TypeError(
        "unsupported operand type(s) for >>: 'str' and '" + type_name(other) + "'"
    )
}

PyStr.prototype.__and__ = function(other) {
    throw new TypeError(
        "unsupported operand type(s) for &: 'str' and '" + type_name(other) + "'"
    )
}

PyStr.prototype.__xor__ = function(other) {
    throw new TypeError(
        "unsupported operand type(s) for ^: 'str' and '" + type_name(other) + "'"
    )
}

PyStr.prototype.__or__ = function(other) {
    throw new TypeError(
        "unsupported operand type(s) for |: 'str' and '" + type_name(other) + "'"
    )
}

/**************************************************
 * Inplace operators
 **************************************************/

PyStr.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, [types.PyComplex])) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        throw new TypeError("unsupported operand type(s) for //=: 'str' and '" + type_name(other) + "'")
    }
}

PyStr.prototype.__itruediv__ = function(other) {
    throw new TypeError("unsupported operand type(s) for /=: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__iadd__ = function(other) {
    if (types.isinstance(other, PyStr)) {
        return this.valueOf() + other.valueOf()
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                "Can't convert '" + type_name(other) + "' object to str implicitly"
            )
        } else {
            throw new TypeError('must be str, not ' + type_name(other))
        }
    }
}

PyStr.prototype.__isub__ = function(other) {
    throw new TypeError("unsupported operand type(s) for -=: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__imul__ = function(other) {
    return this.__mul__(other)
}

PyStr.prototype.__imod__ = function(other) {
    return this.__mod__(other)
}

PyStr.prototype.__ipow__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ** or pow(): 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__ilshift__ = function(other) {
    throw new TypeError(
        "unsupported operand type(s) for <<=: 'str' and '" + type_name(other) + "'"
    )
}

PyStr.prototype.__irshift__ = function(other) {
    throw new TypeError("unsupported operand type(s) for >>=: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__iand__ = function(other) {
    throw new TypeError("unsupported operand type(s) for &=: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__ixor__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ^=: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__ior__ = function(other) {
    throw new TypeError("unsupported operand type(s) for |=: 'str' and '" + type_name(other) + "'")
}

/**************************************************
 * Methods
 * https://docs.python.org/3.4/library/stdtypes.html#string-methods
 **************************************************/

PyStr.prototype.__len__ = function() {
    return new types.PyInt(this.length)
}

PyStr.prototype.join = function(iter) {
    var l = new types.PyList(iter)
    for (var i = 0; i < l.length; i++) {
        if (!types.isinstance(l[i], PyStr)) {
            throw new TypeError('sequence item ' + i + ': expected str instance, ' + type_name(l[i]) + ' found')
        }
    }
    return l.join(this)
}

PyStr.prototype.copy = function() {
    return this.valueOf()
}

PyStr.prototype.encode = function(encoding, errors) {
    if (errors !== undefined) {
        return new NotImplementedError(
            "'errors' parameter of str.encode not implemented"
        )
    }
    encoding = encoding.toLowerCase()
    var encs = TEXT_ENCODINGS
    if (encs.ascii.indexOf(encoding) !== -1) {
        return new types.PyBytes(
            Buffer.from(this.valueOf(), 'ascii'))
    } else if (encs.latin_1.indexOf(encoding) !== -1) {
        return new types.PyBytes(
            Buffer.from(this.valueOf(), 'latin1'))
    } else if (encs.utf_8.indexOf(encoding) !== -1) {
        return new types.PyBytes(
            Buffer.from(this.valueOf(), 'utf8'))
    } else {
        return new NotImplementedError(
            'encoding not implemented or incorrect encoding'
        )
    }
}

PyStr.prototype.lstrip = function() {
    if (arguments.length === 0) {
        return this.valueOf().trimLeft()
    } else if (arguments.length === 1) {
        var charsToTrim = arguments[0]
        if (!types.isinstance(charsToTrim, [types.PyStr])) {
            throw new TypeError('lstrip arg must be None or str')
        }
        var result = this.valueOf()
        var i = 0
        while (charsToTrim.indexOf(result[i]) > -1) {
            i++
        }
        return result.slice(i)
    } else {
        throw new TypeError('lstrip() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

PyStr.prototype.rstrip = function() {
    if (arguments.length === 0) {
        return this.valueOf().trimRight()
    } else if (arguments.length === 1) {
        var charsToTrim = arguments[0]
        if (!types.isinstance(charsToTrim, [types.PyStr])) {
            throw new TypeError('rstrip arg must be None or str')
        }
        var result = this.valueOf()
        var i = result.length
        while (charsToTrim.indexOf(result[i - 1]) > -1) {
            i--
        }
        return result.slice(0, i)
    } else {
        throw new TypeError('rstrip() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

PyStr.prototype.strip = function() {
    if (arguments.length === 0) {
        return this.valueOf().trim()
    } else if (arguments.length === 1) {
        var charsToTrim = arguments[0]
        if (!types.isinstance(charsToTrim, [types.PyStr])) {
            throw new TypeError('strip arg must be None or str')
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
        throw new TypeError('strip() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

PyStr.prototype.startswith = function(str) {
    if (arguments.length > 1) {
        throw new TypeError(
            'slice indices must be integers or None or have an __index__ method'
        )
    } else if (arguments.length === 0) {
        throw new TypeError(
            'startswith() takes at least 1 argument (0 given)'
        )
    }

    if (str !== PyNone) {
        if (types.isinstance(str, [types.PyStr])) {
            return this.slice(0, str.length) === str
        } else if (types.isinstance(str, [types.PyTuple])) {
            for (var i = 0; i < str.length; i++) {
                if (this.startswith(str[i])) {
                    return true
                }
            }
            return false
        } else {
            throw new TypeError(
                'TypeError: startswith first arg must be str or a tuple of str, not ' + type_name(str)
            )
        }
    }
}

PyStr.prototype.endswith = function(str) {
    return this.slice(this.length - str.length) === str
}

PyStr.prototype.isupper = function() {
    if (!this.match('[a-zA-Z]')) {
        return false
    } else {
        return (this.valueOf() === this.valueOf().toUpperCase())
    }
}

PyStr.prototype.islower = function() {
    if (!this.match('[a-zA-Z]')) {
        return false
    } else {
        return (this.valueOf() === this.valueOf().toLowerCase())
    }
}

PyStr.prototype.lower = function() {
    return this.valueOf().toLowerCase()
}

PyStr.prototype.upper = function() {
    return this.valueOf().toUpperCase()
}

PyStr.prototype.swapcase = function() {
    var swapped = ''
    for (var i = 0; i < this.length; i++) {
        if (this[i] === this[i].toLowerCase()) {
            swapped += this[i].toUpperCase()
        } else {
            swapped += this[i].toLowerCase()
        }
    }
    return swapped
}

// Based on https://en.wikipedia.org/wiki/Universal_hashing#Hashing_strings
// and http://www.cse.yorku.ca/~oz/hash.html.
//
// CPython returns signed 64-bit integers. But, JS is awful at 64-bit integers,
// so we return signed 32-bit integers. This shouldn't be a problem, since
// technically we can just return 0 and everything should still work :P
PyStr.prototype.__hash__ = function() {
    // |0 is used to ensure that we return signed 32-bit integers
    var h = 5381 | 0
    for (var i = 0; i < this.length; i++) {
        h = ((h * 33) | 0) ^ this[i]
    }
    return new types.PyInt(h)
}

PyStr.prototype.capitalize = function() {
    if (arguments.length === 0) {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
    } else {
        throw new TypeError('capitalize() takes no arguments (' + arguments.length + ' given)')
    }
}

PyStr.prototype.format = function(args, kwargs) {
    const types = require('../types')
    const positionalArguments = new types.PyTuple(types.js2py(args))
    const keywordArguments = types.js2py(kwargs)
    return StrUtils._new_subsitute(this, positionalArguments, keywordArguments)
}

create_pyclass(PyStr, 'str')

export default PyStr
