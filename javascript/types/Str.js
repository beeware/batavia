import { Buffer } from 'buffer'

import { TEXT_ENCODINGS } from '../core/constants'
import { pyAttributeError, pyIndexError, pyNotImplementedError, pyStopIteration, pyTypeError, pyValueError } from '../core/exceptions'
import { jstype, type_name, pyNone, PyObject } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

import * as StrUtils from './StrUtils'

/**************************************************
 * Str Iterator
 **************************************************/

class PyStrIterator extends PyObject {
    __init__(data) {
        this.$index = 0
        this.$data = data
    }

    __next__() {
        var retval = this.$data[this.$index]
        if (retval === undefined) {
            throw pyStopIteration()
        }
        this.$index++
        return retval
    }

    __str__() {
        return '<str_iterator object at 0x99999999>'
    }
}
const str_iterator = jstype(PyStrIterator, 'str_iterator', [], null)

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
    return str_iterator(this)
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

PyStr.prototype.__setattr__ = function(attr, value) {
    if (Object.getPrototypeOf(this)[attr] === undefined) {
        throw pyAttributeError("'str' object has no attribute '" + attr + "'")
    } else {
        throw pyAttributeError("'str' object attribute '" + attr + "' is read-only")
    }
}

PyStr.prototype.__delattr__ = function(attr) {
    throw pyAttributeError("'str' object has no attribute '" + attr + "'")
}

/**************************************************
 * Comparison operators
 **************************************************/

PyStr.prototype.__lt__ = function(other) {
    if (other !== pyNone) {
        if (types.isinstance(other, [
            types.pybool, types.pyint, types.pyfloat,
            types.pylist, types.pydict, types.pytuple,
            types.pybytearray, types.pybytes, types.pytype,
            types.pycomplex, types.pyNotImplementedType,
            types.pyrange, types.pyset, types.pyslice,
            types.pyfrozenset
        ])) {
            if (version.earlier('3.6')) {
                throw pyTypeError(
                    'unorderable types: str() < ' + type_name(other) + '()'
                )
            } else {
                throw pyTypeError(
                    "'<' not supported between instances of 'str' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() < other
        }
    } else {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: str() < pyNoneType()'
            )
        } else {
            throw pyTypeError(
                "'<' not supported between instances of 'str' and 'pyNoneType'"
            )
        }
    }
}

PyStr.prototype.__le__ = function(other) {
    if (other !== pyNone) {
        if (types.isinstance(other, [
            types.pybool, types.pyint, types.pyfloat,
            types.pylist, types.pydict, types.pytuple,
            types.pyset, types.pybytearray, types.pybytes,
            types.pytype, types.pycomplex, types.pyNotImplementedType,
            types.pyrange, types.pyslice, types.pyfrozenset
        ])) {
            if (version.earlier('3.6')) {
                throw pyTypeError(
                    'unorderable types: str() <= ' + type_name(other) + '()'
                )
            } else {
                throw pyTypeError(
                    "'<=' not supported between instances of 'str' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() <= other
        }
    } else {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: str() <= pyNoneType()'
            )
        } else {
            throw pyTypeError(
                "'<=' not supported between instances of 'str' and 'pyNoneType'"
            )
        }
    }
}

PyStr.prototype.__eq__ = function(other) {
    if (other !== pyNone) {
        if (types.isinstance(other, [
            types.pybool, types.pyint, types.pyfloat,
            types.pylist, types.pydict, types.pytuple
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
    if (other !== pyNone) {
        if (types.isinstance(other, [
            types.pybool, types.pyint, types.pyfloat,
            types.pylist, types.pydict, types.pytuple

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
    if (other !== pyNone) {
        if (types.isinstance(other, [
            types.pybool, types.pyint, types.pyfloat,
            types.pylist, types.pydict, types.pytuple,
            types.pyset, types.pybytearray, types.pybytes,
            types.pytype, types.pycomplex,
            types.pyNotImplementedType, types.pyrange,
            types.pyslice, types.pyfrozenset
        ])) {
            if (version.earlier('3.6')) {
                throw pyTypeError(
                    'unorderable types: str() > ' + type_name(other) + '()'
                )
            } else {
                throw pyTypeError(
                    "'>' not supported between instances of 'str' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() > other
        }
    } else {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: str() > pyNoneType()'
            )
        } else {
            throw pyTypeError(
                "'>' not supported between instances of 'str' and 'pyNoneType'"
            )
        }
    }
}

PyStr.prototype.__ge__ = function(other) {
    if (other !== pyNone) {
        if (types.isinstance(other, [
            types.pybool, types.pyint, types.pyfloat,
            types.pylist, types.pydict, types.pytuple,
            types.pyset, types.pybytearray, types.pybytes,
            types.pytype, types.pycomplex, types.pyNotImplementedType,
            types.pyrange, types.pyslice, types.pyfrozenset

        ])) {
            if (version.earlier('3.6')) {
                throw pyTypeError(
                    'unorderable types: str() >= ' + type_name(other) + '()'
                )
            } else {
                throw pyTypeError(
                    "'>=' not supported between instances of 'str' and '" +
                    type_name(other) + "'"
                )
            }
        } else {
            return this.valueOf() >= other
        }
    } else {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: str() >= pyNoneType()'
            )
        } else {
            throw pyTypeError(
                "'>=' not supported between instances of 'str' and 'pyNoneType'"
            )
        }
    }
}

PyStr.prototype.__contains__ = function(other) {
    if (!types.isinstance(other, PyStr)) {
        throw pyTypeError("'in <string>' requires string as left operand, not " + type_name(other))
    } else {
        return this.valueOf().search(other.valueOf()) >= 0
    }
}

/**************************************************
 * Unary operators
 **************************************************/

PyStr.prototype.__pos__ = function() {
    throw pyTypeError("bad operand type for unary +: 'str'")
}

PyStr.prototype.__neg__ = function() {
    throw pyTypeError("bad operand type for unary -: 'str'")
}

PyStr.prototype.__not__ = function() {
    return this.length === 0
}

PyStr.prototype.__invert__ = function() {
    throw pyTypeError("bad operand type for unary ~: 'str'")
}

/**************************************************
 * Binary operators
 **************************************************/

PyStr.prototype.__pow__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ** or pow(): 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

PyStr.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, [types.pycomplex])) {
        throw pyTypeError("can't take floor of complex number.")
    } else {
        throw pyTypeError("unsupported operand type(s) for //: 'str' and '" + type_name(other) + "'")
    }
}

PyStr.prototype.__truediv__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for /: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__mul__ = function(other) {
    var result
    if (types.isinstance(other, types.pyint)) {
        result = ''
        for (var i = 0; i < other.valueOf(); i++) {
            result += this.valueOf()
        }
        return result
    } else if (types.isinstance(other, types.pybool)) {
        if (other === true) {
            result = this.valueOf()
        } else {
            result = ''
        }
        return result
    } else {
        throw pyTypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

PyStr.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.pytuple)) {
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
            throw pyTypeError(
                "Can't convert '" + type_name(other) + "' object to str implicitly"
            )
        } else {
            throw pyTypeError('must be str, not ' + type_name(other))
        }
    }
}

PyStr.prototype.__sub__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for -: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__getitem__ = function(index) {
    if (types.isinstance(index, types.pybool)) {
        index = index.__int__()
    }
    if (types.isinstance(index, types.pyint)) {
        var idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw pyIndexError('string index out of range')
            } else {
                return this[this.length + idx]
            }
        } else {
            if (idx >= this.length) {
                throw pyIndexError('string index out of range')
            } else {
                return this[idx]
            }
        }
    } else if (types.isinstance(index, types.pyslice)) {
        var start, stop, step

        if (index.start === pyNone) {
            start = undefined
        } else if (!(types.isinstance(index.start, types.pyint))) {
            if (index.start.__index__ === undefined) {
                throw pyTypeError('slice indices must be integers or pyNone or have an __index__ method')
            } else {
                start = index.start.__index__()
            }
        } else {
            start = index.start.int32()
        }

        if (index.stop === pyNone) {
            stop = undefined
        } else if (!(types.isinstance(index.stop, types.pyint))) {
            if (index.stop.__index__ === undefined) {
                throw pyTypeError('slice indices must be integers or pyNone or have an __index__ method')
            } else {
                stop = index.stop.__index__()
            }
        } else {
            stop = index.stop.int32()
        }

        if (index.step === pyNone) {
            step = 1
        } else if (!(types.isinstance(index.step, types.pyint))) {
            if (index.step.__index__ === undefined) {
                throw pyTypeError('slice indices must be integers or pyNone or have an __index__ method')
            } else {
                step = index.step.__index__()
            }
        } else {
            step = index.step.int32()
            if (step === 0) {
                throw pyValueError('slice step cannot be zero')
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
        throw pyTypeError('string indices must be integers')
    }
}

PyStr.prototype.__lshift__ = function(other) {
    throw pyTypeError(
        "unsupported operand type(s) for <<: 'str' and '" + type_name(other) + "'"
    )
}

PyStr.prototype.__rshift__ = function(other) {
    throw pyTypeError(
        "unsupported operand type(s) for >>: 'str' and '" + type_name(other) + "'"
    )
}

PyStr.prototype.__and__ = function(other) {
    throw pyTypeError(
        "unsupported operand type(s) for &: 'str' and '" + type_name(other) + "'"
    )
}

PyStr.prototype.__xor__ = function(other) {
    throw pyTypeError(
        "unsupported operand type(s) for ^: 'str' and '" + type_name(other) + "'"
    )
}

PyStr.prototype.__or__ = function(other) {
    throw pyTypeError(
        "unsupported operand type(s) for |: 'str' and '" + type_name(other) + "'"
    )
}

/**************************************************
 * Inplace operators
 **************************************************/

PyStr.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, [types.pycomplex])) {
        throw pyTypeError("can't take floor of complex number.")
    } else {
        throw pyTypeError("unsupported operand type(s) for //=: 'str' and '" + type_name(other) + "'")
    }
}

PyStr.prototype.__itruediv__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for /=: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__iadd__ = function(other) {
    if (types.isinstance(other, PyStr)) {
        return this.valueOf() + other.valueOf()
    } else {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                "Can't convert '" + type_name(other) + "' object to str implicitly"
            )
        } else {
            throw pyTypeError('must be str, not ' + type_name(other))
        }
    }
}

PyStr.prototype.__isub__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for -=: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__imul__ = function(other) {
    return this.__mul__(other)
}

PyStr.prototype.__imod__ = function(other) {
    return this.__mod__(other)
}

PyStr.prototype.__ipow__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ** or pow(): 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__ilshift__ = function(other) {
    throw pyTypeError(
        "unsupported operand type(s) for <<=: 'str' and '" + type_name(other) + "'"
    )
}

PyStr.prototype.__irshift__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for >>=: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__iand__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for &=: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__ixor__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ^=: 'str' and '" + type_name(other) + "'")
}

PyStr.prototype.__ior__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for |=: 'str' and '" + type_name(other) + "'")
}

/**************************************************
 * Methods
 * https://docs.python.org/3.4/library/stdtypes.html#string-methods
 **************************************************/

PyStr.prototype.__len__ = function() {
    return types.pyint(this.length)
}

PyStr.prototype.join = function(iter) {
    var l = types.pylist(iter)
    for (var i = 0; i < l.length; i++) {
        if (!types.isinstance(l[i], PyStr)) {
            throw pyTypeError('sequence item ' + i + ': expected str instance, ' + type_name(l[i]) + ' found')
        }
    }
    return l.join(this)
}

PyStr.prototype.copy = function() {
    return this.valueOf()
}

PyStr.prototype.encode = function(encoding, errors) {
    if (errors !== undefined) {
        return pyNotImplementedError(
            "'errors' parameter of str.encode not implemented"
        )
    }
    encoding = encoding.toLowerCase()
    var encs = TEXT_ENCODINGS
    if (encs.ascii.indexOf(encoding) !== -1) {
        return types.pybytes(
            Buffer.from(this.valueOf(), 'ascii'))
    } else if (encs.latin_1.indexOf(encoding) !== -1) {
        return types.pybytes(
            Buffer.from(this.valueOf(), 'latin1'))
    } else if (encs.utf_8.indexOf(encoding) !== -1) {
        return types.pybytes(
            Buffer.from(this.valueOf(), 'utf8'))
    } else {
        return pyNotImplementedError(
            'encoding not implemented or incorrect encoding'
        )
    }
}

PyStr.prototype.lstrip = function() {
    if (arguments.length === 0) {
        return this.valueOf().trimLeft()
    } else if (arguments.length === 1) {
        var charsToTrim = arguments[0]
        if (!types.isinstance(charsToTrim, PyStr)) {
            throw pyTypeError('lstrip arg must be pyNone or str')
        }
        var result = this.valueOf()
        var i = 0
        while (charsToTrim.indexOf(result[i]) > -1) {
            i++
        }
        return result.slice(i)
    } else {
        throw pyTypeError('lstrip() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

PyStr.prototype.rstrip = function() {
    if (arguments.length === 0) {
        return this.valueOf().trimRight()
    } else if (arguments.length === 1) {
        var charsToTrim = arguments[0]
        if (!types.isinstance(charsToTrim, PyStr)) {
            throw pyTypeError('rstrip arg must be pyNone or str')
        }
        var result = this.valueOf()
        var i = result.length
        while (charsToTrim.indexOf(result[i - 1]) > -1) {
            i--
        }
        return result.slice(0, i)
    } else {
        throw pyTypeError('rstrip() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

PyStr.prototype.strip = function() {
    if (arguments.length === 0) {
        return this.valueOf().trim()
    } else if (arguments.length === 1) {
        var charsToTrim = arguments[0]
        if (!types.isinstance(charsToTrim, PyStr)) {
            throw pyTypeError('strip arg must be pyNone or str')
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
        throw pyTypeError('strip() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

PyStr.prototype.startswith = function(prefix) {
    if (arguments.length > 1) {
        throw pyTypeError(
            'slice indices must be integers or pyNone or have an __index__ method'
        )
    } else if (arguments.length === 0) {
        throw pyTypeError(
            'startswith() takes at least 1 argument (0 given)'
        )
    }

    if (prefix !== pyNone) {
        if (types.isinstance(prefix, pystr)) {
            return this.slice(0, prefix.length) === prefix
        } else if (types.isinstance(prefix, [types.pytuple])) {
            for (var i = 0; i < prefix.length; i++) {
                if (this.startswith(prefix[i])) {
                    return true
                }
            }
            return false
        } else {
            throw pyTypeError(
                'pyTypeError: startswith first arg must be str or a tuple of str, not ' + type_name(prefix)
            )
        }
    }
}

PyStr.prototype.endswith = function(suffix) {
    return this.slice(this.length - suffix.length) === suffix
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
    return types.pyint(h)
}

PyStr.prototype.capitalize = function() {
    if (arguments.length === 0) {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
    } else {
        throw pyTypeError('capitalize() takes no arguments (' + arguments.length + ' given)')
    }
}

PyStr.prototype.format = function(args, kwargs) {
    const positionalArguments = types.pytuple(types.js2py(args))
    const keywordArguments = types.js2py(kwargs)
    return StrUtils._new_subsitute(this, positionalArguments, keywordArguments)
}
PyStr.prototype.format.$pyargs = {
    varargs: 'args',
    kwargs: 'kwargs'
}

const pystr = jstype(PyStr, 'str', [], null)
export default pystr

PyStr.prototype.__class__ = pystr
