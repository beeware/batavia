import { iter_for_each } from '../core/callables'
import { PyAttributeError, PyIndexError, PyTypeError, PyValueError } from '../core/exceptions'
import { create_pyclass, type_name, PyNone } from '../core/types'
import * as version from '../core/version'

import * as builtins from '../builtins'
import * as types from '../types'

import PyListIterator from './ListIterator'

/*************************************************************************
 * A Python list type
 *************************************************************************/

export default function PyList() {
    if (arguments.length === 0) {
        this.push.apply(this)
    } else if (arguments.length === 1) {
        // Fast-path for native Array objects.
        if (Array.isArray(arguments[0])) {
            this.push.apply(this, arguments[0])
        } else {
            var iterobj = builtins.iter([arguments[0]], null)
            var self = this
            iter_for_each(iterobj, function(val) {
                self.push(val)
            })
        }
    } else {
        throw new PyTypeError('list() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

function Array_() {}

Array_.prototype = []

PyList.prototype = Object.create(Array_.prototype)
PyList.prototype.length = 0
PyList.prototype.constructor = PyList
create_pyclass(PyList, 'list', null)

/**************************************************
 * Javascript compatibility methods
 **************************************************/

PyList.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

PyList.prototype.__iter__ = function() {
    return new PyListIterator(this)
}

PyList.prototype.__len__ = function() {
    return this.length
}

PyList.prototype.__repr__ = function() {
    return this.__str__()
}

PyList.prototype.__str__ = function() {
    return '[' + this.map(function(obj) {
        return builtins.repr([obj], null)
    }).join(', ') + ']'
}

PyList.prototype.__bool__ = function() {
    return this.length > 0
}

/**************************************************
 * Comparison operators
 **************************************************/

PyList.prototype.__lt__ = function(other) {
    if (types.isinstance(other, [types.PyBytes, types.PyBytearray])) {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: list() < ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'<' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== builtins.PyNone) {
        if (types.isinstance(other, types.PyList)) {
            // edge case where this==[]
            if (this.length === 0 && other.length > 0) {
                return true
            }

            for (var i = 0; i < this.length; i++) {
                // other ran out of items.
                if (other[i] === undefined) {
                    return false
                }
                if (this[i].__ne__(other[i])) {
                    return this[i].__lt__(other[i])
                }
            }
            // got through loop and all values were equal. Determine by comparing length
            return this.length < other.length
        } else {
            if (version.earlier('3.6')) {
                throw new PyTypeError(
                    'unorderable types: list() < ' + type_name(other) + '()'
                )
            } else {
                throw new PyTypeError(
                    "'<' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: list() < NoneType()'
            )
        } else {
            throw new PyTypeError(
                "'<' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

PyList.prototype.__le__ = function(other) {
    if (types.isinstance(other, [types.PyBytes, types.PyBytearray])) {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: list() <= ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'<=' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== builtins.PyNone) {
        if (types.isinstance(other, types.PyList)) {
            // edge case where this==[]
            if (this.length === 0 && other.length > 0) {
                return true
            }

            for (var i = 0; i < this.length; i++) {
                // other ran out of items.
                if (other[i] === undefined) {
                    return false
                }
                if (this[i].__ne__(other[i])) {
                    return this[i].__le__(other[i])
                }
            }
            // got through loop and all values were equal. Determine by comparing length
            return this.length <= other.length
        } else {
            if (version.earlier('3.6')) {
                throw new PyTypeError(
                    'unorderable types: list() <= ' + type_name(other) + '()'
                )
            } else {
                throw new PyTypeError(
                    "'<=' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: list() <= NoneType()'
            )
        } else {
            throw new PyTypeError(
                "'<=' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

PyList.prototype.__eq__ = function(other) {
    if (types.isinstance(other, types.PyList)) {
        // must be a list to possibly be equal
        if (this.length !== other.length) {
            // lists must have same number of items
            return false
        } else {
            for (var i = 0; i < this.length; i++) {
                if (!this[i].__eq__(other[i])) { return false }
            }
            return true
        }
    } else {
        return false
    }
}

PyList.prototype.__ne__ = function(other) {
    return !this.__eq__(other)
}

PyList.prototype.__gt__ = function(other) {
    if (types.isinstance(other, [types.PyBytes, types.PyBytearray])) {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: list() > ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'>' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== builtins.PyNone) {
        if (types.isinstance(other, types.PyList)) {
            // edge case where this==[]
            if (this.length === 0 && other.length > 0) {
                return false
            }

            for (var i = 0; i < this.length; i++) {
                // other ran out of items.
                if (other[i] === undefined) {
                    return true
                }
                if (this[i].__ne__(other[i])) {
                    return this[i].__gt__(other[i])
                }
            }
            // got through loop and all values were equal. Determine by comparing length
            return this.length > other.length
        } else {
            if (version.earlier('3.6')) {
                throw new PyTypeError(
                    'unorderable types: list() > ' + type_name(other) + '()'
                )
            } else {
                throw new PyTypeError(
                    "'>' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: list() > NoneType()'
            )
        } else {
            throw new PyTypeError(
                "'>' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

PyList.prototype.__ge__ = function(other) {
    if (types.isinstance(other, [types.PyBytes, types.PyBytearray])) {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: list() >= ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'>=' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== builtins.PyNone) {
        if (types.isinstance(other, types.PyList)) {
            // edge case where this==[]
            if (this.length === 0 && other.length > 0) {
                return false
            }

            for (var i = 0; i < this.length; i++) {
                // other ran out of items.
                if (other[i] === undefined) {
                    return true
                }
                if (this[i].__ne__(other[i])) {
                    return this[i].__ge__(other[i])
                }
            }
            // got through loop and all values were equal. Determine by comparing length
            return this.length >= other.length
        } else {
            if (version.earlier('3.6')) {
                throw new PyTypeError(
                    'unorderable types: list() >= ' + type_name(other) + '()'
                )
            } else {
                throw new PyTypeError(
                    "'>=' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: list() >= NoneType()'
            )
        } else {
            throw new PyTypeError(
                "'>=' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

PyList.prototype.__contains__ = function(other) {
    return this.valueOf().index(other) !== -1
}

/**************************************************
 * Unary operators
 **************************************************/

PyList.prototype.__pos__ = function() {
    throw new PyTypeError("bad operand type for unary +: 'list'")
}

PyList.prototype.__neg__ = function() {
    throw new PyTypeError("bad operand type for unary -: 'list'")
}

PyList.prototype.__not__ = function() {
    return this.length === 0
}

PyList.prototype.__invert__ = function() {
    throw new PyTypeError("bad operand type for unary ~: 'list'")
}

/**************************************************
 * Binary operators
 **************************************************/

PyList.prototype.__pow__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for ** or pow(): 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__div__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for /: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, types.PyComplex)) {
        throw new PyTypeError("can't take floor of complex number.")
    } else {
        throw new PyTypeError("unsupported operand type(s) for //: 'list' and '" + type_name(other) + "'")
    }
}

PyList.prototype.__truediv__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for /: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__mul__ = function(other) {
    if (types.isinstance(other, types.PyInt)) {
        var result = new List()
        if (other <= 0) {
            return result
        } else {
            for (var i = 0; i < other; i++) {
                result.extend(this)
            }
            return result
        }
    } else if (types.isinstance(other, types.PyBool)) {
        if (other) {
            return this.copy()
        } else {
            return new List()
        }
    } else {
        throw new PyTypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

PyList.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.PyComplex)) {
        throw new PyTypeError("can't mod complex numbers.")
    } else {
        throw new PyTypeError("unsupported operand type(s) for %: 'list' and '" + type_name(other) + "'")
    }
}

PyList.prototype.__add__ = function(other) {
    var i

    if (types.isinstance(other, types.PyList)) {
        var result = new List()
        for (i = 0; i < this.length; i++) {
            result.push(this[i])
        }

        for (i = 0; i < other.length; i++) {
            result.push(other[i])
        }

        return result
    } else {
        throw new PyTypeError('can only concatenate list (not "' + type_name(other) + '") to list')
    }
}

PyList.prototype.__sub__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for -: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__delattr__ = function(attr) {
    throw new PyAttributeError("'list' object has no attribute '" + attr + "'")
}

PyList.prototype.__getitem__ = function(index) {
    if (types.isinstance(index, types.PyInt)) {
        var idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw new PyIndexError('list index out of range')
            } else {
                return this[this.length + idx]
            }
        } else {
            if (idx >= this.length) {
                throw new PyIndexError('list index out of range')
            } else {
                return this[idx]
            }
        }
    } else if (types.isinstance(index, types.PySlice)) {
        var start, stop, step
        if (index.start === None) {
            start = undefined
        } else if (!(types.isinstance(index.start, types.PyInt))) {
            if (index.start.__index__ === undefined) {
                throw new PyTypeError('slice indices must be integers or None or have an __index__ method')
            } else {
                start = index.start.__index__()
            }
        } else {
            start = index.start.int32()
        }

        if (index.stop === None) {
            stop = undefined
        } else if (!(types.isinstance(index.stop, types.PyInt))) {
            if (index.stop.__index__ === undefined) {
                throw new PyTypeError('slice indices must be integers or None or have an __index__ method')
            } else {
                stop = index.stop.__index__()
            }
        } else {
            stop = index.stop.int32()
        }

        if (index.step === None) {
            step = 1
        } else if (!(types.isinstance(index.step, types.PyInt))) {
            if (index.step.__index__ === undefined) {
                throw new PyTypeError('slice indices must be integers or None or have an __index__ method')
            } else {
                step = index.step.__index__()
            }
        } else {
            step = index.step.int32()
            if (step === 0) {
                throw new PyValueError('slice step cannot be zero')
            }
        }

        // clone list
        var result = Array_.prototype.slice.call(this)

        // handle step
        if (step === 1) {
            return new List(result.slice(start, stop))
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

            result = result.slice(stop, start).reverse()
        }

        var steppedResult = []
        for (var i = 0; i < result.length; i = i + Math.abs(step)) {
            steppedResult.push(result[i])
        }

        result = steppedResult

        return new List(result)
    } else if (types.isinstance(index, types.PyBool)) {
        if (index) {
            idx = 1
        } else {
            idx = 0
        }
        if (this.length === 0) {
            throw new PyIndexError('list index out of range')
        } else if (this.length === 1) {
            if (idx === 1) {
                throw new PyIndexError('list index out of range')
            } else {
                return this[0]
            }
        } else {
            return this[idx]
        }
    } else {
        var msg = 'list indices must be integers or slices, not '
        if (!version.later('3.4')) {
            msg = 'list indices must be integers, not '
        }
        throw new PyTypeError(msg + type_name(index))
    }
}

PyList.prototype.__delitem__ = function(index) {
    if (types.isinstance(index, types.PyInt)) {
        var idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw new PyIndexError('list index out of range')
            } else {
                this.splice(this.length + idx, 1)
            }
        } else {
            if (idx >= this.length) {
                throw new PyIndexError('list index out of range')
            } else {
                this.splice(idx, 1)
            }
        }
    } else {
        throw new PyTypeError('list indices must be integers, not ' + type_name(index))
    }
}

PyList.prototype.__lshift__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for <<: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__rshift__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for >>: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__and__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for &: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__xor__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for ^: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__or__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for |: 'list' and '" + type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

PyList.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, types.PyComplex)) {
        throw new PyTypeError("can't take floor of complex number.")
    } else {
        throw new PyTypeError("unsupported operand type(s) for //=: 'list' and '" + type_name(other) + "'")
    }
}

PyList.prototype.__itruediv__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for /=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__iadd__ = function(other) {
    if (types.isinstance(other, [types.PySet, types.PyDict, types.PyRange, types.PyFrozenSet, types.PyBytes, types.PyBytearray])) {
        var right_operand = new types.PyList(other)
    } else {
        right_operand = other
    }

    if (types.isinstance(right_operand, [types.PyList, types.PyStr, types.PyTuple])) {
        for (var i = 0; i < right_operand.length; i++) {
            this.push(right_operand[i])
        }
    } else {
        throw new PyTypeError("'" + type_name(other) + "' object is not iterable")
    }
    return this
}

PyList.prototype.__isub__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for -=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__imul__ = function(other) {
    if (types.isinstance(other, types.PyInt)) {
        if (other <= 0) {
            return new List()
        } else {
            // Need to cache the length beacuse it will change
            // as a result of inline modification.
            var length = this.length
            for (var i = 1; i < other; i++) {
                for (var j = 0; j < length; j++) {
                    this.push(this[j])
                }
            }
            return this
        }
    } else if (types.isinstance(other, types.PyBool)) {
        if (other === true) {
            return this
        } else {
            return new List()
        }
    } else {
        throw new PyTypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

PyList.prototype.__imod__ = function(other) {
    if (types.isinstance(other, types.PyComplex)) {
        throw new PyTypeError("can't mod complex numbers.")
    } else {
        throw new PyTypeError("unsupported operand type(s) for %=: 'list' and '" + type_name(other) + "'")
    }
}

PyList.prototype.__ipow__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for ** or pow(): 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__ilshift__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for <<=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__irshift__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for >>=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__iand__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for &=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__ixor__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for ^=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__ior__ = function(other) {
    throw new PyTypeError("unsupported operand type(s) for |=: 'list' and '" + type_name(other) + "'")
}

/**************************************************
 * Methods
 **************************************************/

PyList.prototype.append = function(value) {
    this.push(value)
}

PyList.prototype.copy = function() {
    return new List(this)
}

PyList.prototype.extend = function(values) {
    if (values.length > 0) {
        this.push.apply(this, values)
    }
}

PyList.prototype.insert = function(index, value) {
    if (arguments.length !== 2) {
        throw new PyTypeError(
            'insert() takes exactly 2 arguments (' + arguments.length + ' given)'
        )
    }
    validateIndexType(index)
    this.splice(index, 0, value)
}

PyList.prototype.remove = function(value) {
    if (arguments.length !== 1) {
        throw new PyTypeError(
            'remove() takes exactly one argument (' + arguments.length + ' given)'
        )
    }
    var index = this.indexOf(value)
    if (index === -1) {
        throw new PyValueError('list.remove(x): x not in list')
    }
    this.splice(index, 1)
}

PyList.prototype.pop = function(index) {
    if (arguments.length > 1) {
        throw new PyTypeError(
            'pop() takes at most 1 argument (' + arguments.length + ' given)'
        )
    }
    if (index === undefined) {
        return Array_.prototype.pop.call(this)
    }
    validateIndexType(index)
    if (index >= this.length || index < -this.length) {
        throw new PyIndexError('pop index out of range')
    }
    return this.splice(index, 1)[0]
}

PyList.prototype.clear = function() {
    if (arguments.length !== 0) {
        throw new PyTypeError(
            'clear() takes no arguments (' + arguments.length + ' given)'
        )
    }
    this.splice(0, this.length)
}

PyList.prototype.count = function(value) {
    if (arguments.length !== 1) {
        throw new PyTypeError('count() takes exactly one argument (' + arguments.length + ' given)')
    }
    var count = 0
    for (var i = 0; i < this.length; ++i) {
        if (this[i].__eq__(value)) {
            count++
        }
    }
    return count
}

PyList.prototype.index = function(value, start, stop) {
    if (arguments.length < 1) {
        throw new PyTypeError('index() takes at least 1 argument (' + arguments.length + ' given)')
    } else if (arguments.length > 3) {
        throw new PyTypeError('index() takes at most 3 arguments (' + arguments.length + ' given)')
    }

    if (start < 0) {
        start = Number(this.length.valueOf()) + Number(start.valueOf())
        if (start < 0) {
            start = 0
        }
    }
    if (stop < 0) {
        stop = Number(this.length.valueOf()) + Number(stop.valueOf())
    }

    for (var i = (start || 0); i < (stop || this.length); ++i) {
        if (this[i].__eq__(value)) {
            return i
        }
    }
    throw new PyValueError('list.index(x): x not in list')
}

PyList.prototype.reverse = function() {
    if (arguments.length > 0) {
        throw new PyTypeError('reverse() takes no arguments (' + arguments.length + ' given)')
    }
    Array.prototype.reverse.apply(this)
}

function validateIndexType(index) {
    if (!types.isinstance(index, types.PyInt)) {
        if (types.isinstance(index, types.PyFloat)) {
            throw new PyTypeError('integer argument expected, got float')
        }
        throw new PyTypeError(
            "'" + type_name(index) + "' object cannot be interpreted as an integer"
        )
    }
}
