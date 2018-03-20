import { iter_for_each } from '../core/callables'
import { pyAttributeError, pyIndexError, pyStopIteration, pyTypeError, pyValueError } from '../core/exceptions'
import { jstype, type_name, pyNone, PyObject } from '../core/types'
import * as version from '../core/version'

import * as builtins from '../builtins'
import * as types from '../types'

/**************************************************
 * List Iterator
 **************************************************/

class PyListIterator extends PyObject {
    __init__(data) {
        this.$index = 0
        this.$data = data
    }

    __iter__() {
        return this
    }

    __next__() {
        if (this.$index >= this.$data.length) {
            throw pyStopIteration()
        }
        let retval = this.$data[this.$index]
        this.$index++
        return retval
    }

    __str__() {
        return '<list_iterator object at 0x99999999>'
    }
}
const list_iterator = jstype(PyListIterator, 'list_iterator', [], null)

/*************************************************************************
 * A Python list type
 *************************************************************************/

function PyList() {
    if (arguments.length === 0) {
        this.push.apply(this)
    } else if (arguments.length === 1) {
        // Fast-path for native Array objects.
        if (Array.isArray(arguments[0])) {
            this.push.apply(this, arguments[0])
        } else {
            let iterobj = builtins.iter(arguments[0])
            let self = this
            iter_for_each(iterobj, function(val) {
                self.push(val)
            })
        }
    } else {
        throw pyTypeError('list() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

function Array_() {}

Array_.prototype = []

PyList.prototype = Object.create(Array_.prototype)
PyList.prototype.length = 0
PyList.prototype.constructor = PyList

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
    return list_iterator(this)
}

PyList.prototype.__len__ = function() {
    return types.pyint(this.length)
}

PyList.prototype.__repr__ = function() {
    return this.__str__()
}

PyList.prototype.__str__ = function() {
    return '[' + this.map(function(obj) {
        return builtins.repr(obj)
    }).join(', ') + ']'
}

PyList.prototype.__bool__ = function() {
    return this.length > 0
}

/**************************************************
 * Comparison operators
 **************************************************/

PyList.prototype.__lt__ = function(other) {
    if (types.isinstance(other, [types.pybytes, types.pybytearray])) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: list() < ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'<' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== pyNone) {
        if (types.isinstance(other, types.pylist)) {
            // edge case where this==[]
            if (this.length === 0 && other.length > 0) {
                return true
            }

            for (let i = 0; i < this.length; i++) {
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
                throw pyTypeError(
                    'unorderable types: list() < ' + type_name(other) + '()'
                )
            } else {
                throw pyTypeError(
                    "'<' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: list() < pyNoneType()'
            )
        } else {
            throw pyTypeError(
                "'<' not supported between instances of 'list' and 'pyNoneType'"
            )
        }
    }
}

PyList.prototype.__le__ = function(other) {
    if (types.isinstance(other, [types.pybytes, types.pybytearray])) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: list() <= ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'<=' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== pyNone) {
        if (types.isinstance(other, types.pylist)) {
            // edge case where this==[]
            if (this.length === 0 && other.length > 0) {
                return true
            }

            for (let i = 0; i < this.length; i++) {
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
                throw pyTypeError(
                    'unorderable types: list() <= ' + type_name(other) + '()'
                )
            } else {
                throw pyTypeError(
                    "'<=' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: list() <= pyNoneType()'
            )
        } else {
            throw pyTypeError(
                "'<=' not supported between instances of 'list' and 'pyNoneType'"
            )
        }
    }
}

PyList.prototype.__eq__ = function(other) {
    if (types.isinstance(other, types.pylist)) {
        // must be a list to possibly be equal
        if (this.length !== other.length) {
            // lists must have same number of items
            return false
        } else {
            for (let i = 0; i < this.length; i++) {
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
    if (types.isinstance(other, [types.pybytes, types.pybytearray])) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: list() > ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'>' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== pyNone) {
        if (types.isinstance(other, types.pylist)) {
            // edge case where this==[]
            if (this.length === 0 && other.length > 0) {
                return false
            }

            for (let i = 0; i < this.length; i++) {
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
                throw pyTypeError(
                    'unorderable types: list() > ' + type_name(other) + '()'
                )
            } else {
                throw pyTypeError(
                    "'>' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: list() > pyNoneType()'
            )
        } else {
            throw pyTypeError(
                "'>' not supported between instances of 'list' and 'pyNoneType'"
            )
        }
    }
}

PyList.prototype.__ge__ = function(other) {
    if (types.isinstance(other, [types.pybytes, types.pybytearray])) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: list() >= ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'>=' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== pyNone) {
        if (types.isinstance(other, types.pylist)) {
            // edge case where this==[]
            if (this.length === 0 && other.length > 0) {
                return false
            }

            for (let i = 0; i < this.length; i++) {
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
                throw pyTypeError(
                    'unorderable types: list() >= ' + type_name(other) + '()'
                )
            } else {
                throw pyTypeError(
                    "'>=' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: list() >= pyNoneType()'
            )
        } else {
            throw pyTypeError(
                "'>=' not supported between instances of 'list' and 'pyNoneType'"
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
    throw pyTypeError("bad operand type for unary +: 'list'")
}

PyList.prototype.__neg__ = function() {
    throw pyTypeError("bad operand type for unary -: 'list'")
}

PyList.prototype.__not__ = function() {
    return this.length === 0
}

PyList.prototype.__invert__ = function() {
    throw pyTypeError("bad operand type for unary ~: 'list'")
}

/**************************************************
 * Binary operators
 **************************************************/

PyList.prototype.__pow__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ** or pow(): 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__div__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for /: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't take floor of complex number.")
    } else {
        throw pyTypeError("unsupported operand type(s) for //: 'list' and '" + type_name(other) + "'")
    }
}

PyList.prototype.__truediv__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for /: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__mul__ = function(other) {
    if (types.isinstance(other, types.pyint)) {
        let result = types.pylist()
        if (other <= 0) {
            return result
        } else {
            for (let i = 0; i < other; i++) {
                result.extend(this)
            }
            return result
        }
    } else if (types.isinstance(other, types.pybool)) {
        if (other) {
            return this.copy()
        } else {
            return types.pylist()
        }
    } else {
        throw pyTypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

PyList.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't mod complex numbers.")
    } else {
        throw pyTypeError("unsupported operand type(s) for %: 'list' and '" + type_name(other) + "'")
    }
}

PyList.prototype.__add__ = function(other) {
    let i

    if (types.isinstance(other, types.pylist)) {
        let result = types.pylist()
        for (i = 0; i < this.length; i++) {
            result.push(this[i])
        }

        for (i = 0; i < other.length; i++) {
            result.push(other[i])
        }

        return result
    } else {
        throw pyTypeError('can only concatenate list (not "' + type_name(other) + '") to list')
    }
}

PyList.prototype.__sub__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for -: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__delattr__ = function(attr) {
    throw pyAttributeError("'list' object has no attribute '" + attr + "'")
}

PyList.prototype.__getitem__ = function(index) {
    if (typeof index === 'number' || types.isinstance(index, types.pyint)) {
        let idx
        if (index === 'number') {
            idx = index
        } else {
            idx = index.int32()
        }

        if (idx < 0) {
            if (-idx > this.length) {
                throw pyIndexError('list index out of range')
            } else {
                return this[this.length + idx]
            }
        } else {
            if (idx >= this.length) {
                throw pyIndexError('list index out of range')
            } else {
                return this[idx]
            }
        }
    } else if (types.isinstance(index, types.pyslice)) {
        let start, stop, step
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

        // clone list
        let result = Array_.prototype.slice.call(this)

        // handle step
        if (step === 1) {
            return types.pylist(result.slice(start, stop))
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

        let steppedResult = []
        for (let i = 0; i < result.length; i = i + Math.abs(step)) {
            steppedResult.push(result[i])
        }

        result = steppedResult

        return types.pylist(result)
    } else if (types.isinstance(index, types.pybool)) {
        let idx
        if (index) {
            idx = 1
        } else {
            idx = 0
        }
        if (this.length === 0) {
            throw pyIndexError('list index out of range')
        } else if (this.length === 1) {
            if (idx === 1) {
                throw pyIndexError('list index out of range')
            } else {
                return this[0]
            }
        } else {
            return this[idx]
        }
    } else {
        let msg = 'list indices must be integers or slices, not '
        if (!version.later('3.4')) {
            msg = 'list indices must be integers, not '
        }
        throw pyTypeError(msg + type_name(index))
    }
}

PyList.prototype.__delitem__ = function(index) {
    if (types.isinstance(index, types.pyint)) {
        let idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw pyIndexError('list index out of range')
            } else {
                this.splice(this.length + idx, 1)
            }
        } else {
            if (idx >= this.length) {
                throw pyIndexError('list index out of range')
            } else {
                this.splice(idx, 1)
            }
        }
    } else {
        throw pyTypeError('list indices must be integers, not ' + type_name(index))
    }
}

PyList.prototype.__lshift__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for <<: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__rshift__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for >>: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__and__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for &: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__xor__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ^: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__or__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for |: 'list' and '" + type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

PyList.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't take floor of complex number.")
    } else {
        throw pyTypeError("unsupported operand type(s) for //=: 'list' and '" + type_name(other) + "'")
    }
}

PyList.prototype.__itruediv__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for /=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__iadd__ = function(other) {
    let right_operand
    if (types.isinstance(other, [types.pyset, types.pydict, types.pyrange, types.pyfrozenset, types.pybytes, types.pybytearray])) {
        right_operand = types.pylist(other)
    } else {
        right_operand = other
    }

    if (types.isinstance(right_operand, [types.pylist, types.pystr, types.pytuple])) {
        for (let i = 0; i < right_operand.length; i++) {
            this.push(right_operand[i])
        }
    } else {
        throw pyTypeError("'" + type_name(other) + "' object is not iterable")
    }
    return this
}

PyList.prototype.__isub__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for -=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__imul__ = function(other) {
    if (types.isinstance(other, types.pyint)) {
        if (other <= 0) {
            return types.pylist()
        } else {
            // Need to cache the length beacuse it will change
            // as a result of inline modification.
            let length = this.length
            for (let i = 1; i < other; i++) {
                for (let j = 0; j < length; j++) {
                    this.push(this[j])
                }
            }
            return this
        }
    } else if (types.isinstance(other, types.pybool)) {
        if (other === true) {
            return this
        } else {
            return types.pylist()
        }
    } else {
        throw pyTypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

PyList.prototype.__imod__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't mod complex numbers.")
    } else {
        throw pyTypeError("unsupported operand type(s) for %=: 'list' and '" + type_name(other) + "'")
    }
}

PyList.prototype.__ipow__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ** or pow(): 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__ilshift__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for <<=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__irshift__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for >>=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__iand__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for &=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__ixor__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ^=: 'list' and '" + type_name(other) + "'")
}

PyList.prototype.__ior__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for |=: 'list' and '" + type_name(other) + "'")
}

/**************************************************
 * Methods
 **************************************************/

PyList.prototype.append = function(value) {
    this.push(value)
}

PyList.prototype.copy = function() {
    return types.pylist(this)
}

PyList.prototype.extend = function(values) {
    if (values.length > 0) {
        this.push.apply(this, values)
    }
}

PyList.prototype.insert = function(index, value) {
    if (arguments.length !== 2) {
        throw pyTypeError(
            'insert() takes exactly 2 arguments (' + arguments.length + ' given)'
        )
    }
    validateIndexType(index)
    this.splice(index, 0, value)
}

PyList.prototype.remove = function(value) {
    if (arguments.length !== 1) {
        throw pyTypeError(
            'remove() takes exactly one argument (' + arguments.length + ' given)'
        )
    }
    let index = this.indexOf(value)
    if (index === -1) {
        throw pyValueError('list.remove(x): x not in list')
    }
    this.splice(index, 1)
}

PyList.prototype.pop = function(index) {
    if (arguments.length > 1) {
        throw pyTypeError(
            'pop() takes at most 1 argument (' + arguments.length + ' given)'
        )
    }
    if (index === undefined) {
        return Array_.prototype.pop.call(this)
    }
    validateIndexType(index)
    if (index >= this.length || index < -this.length) {
        throw pyIndexError('pop index out of range')
    }
    return this.splice(index, 1)[0]
}

PyList.prototype.clear = function() {
    if (arguments.length !== 0) {
        throw pyTypeError(
            'clear() takes no arguments (' + arguments.length + ' given)'
        )
    }
    this.splice(0, this.length)
}

PyList.prototype.count = function(value) {
    if (arguments.length !== 1) {
        throw pyTypeError('count() takes exactly one argument (' + arguments.length + ' given)')
    }
    let count = 0
    for (let i = 0; i < this.length; ++i) {
        if (this[i].__eq__(value)) {
            count++
        }
    }
    return count
}

PyList.prototype.index = function(value, start, stop) {
    if (arguments.length < 1) {
        throw pyTypeError('index() takes at least 1 argument (' + arguments.length + ' given)')
    } else if (arguments.length > 3) {
        throw pyTypeError('index() takes at most 3 arguments (' + arguments.length + ' given)')
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

    for (let i = (start || 0); i < (stop || this.length); ++i) {
        if (this[i].__eq__(value)) {
            return i
        }
    }
    throw pyValueError('list.index(x): x not in list')
}

PyList.prototype.reverse = function() {
    if (arguments.length > 0) {
        throw pyTypeError('reverse() takes no arguments (' + arguments.length + ' given)')
    }
    Array.prototype.reverse.apply(this)
}

function validateIndexType(index) {
    if (!types.isinstance(index, types.pyint)) {
        if (types.isinstance(index, types.pyfloat)) {
            throw pyTypeError('integer argument expected, got float')
        }
        throw pyTypeError(
            "'" + type_name(index) + "' object cannot be interpreted as an integer"
        )
    }
}

const pylist = jstype(PyList, 'list', [], null)
export default pylist

PyList.prototype.__class__ = pylist
