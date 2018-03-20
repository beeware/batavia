import { iter_for_each } from '../core/callables'
import { jstype, type_name, pyNone, PyObject } from '../core/types'
import * as version from '../core/version'
import { pyAttributeError, pyIndexError, pyStopIteration, pyTypeError, pyValueError } from '../core/exceptions'

import * as builtins from '../builtins'
import * as types from '../types'

/**************************************************
 * Tuple Iterator
 **************************************************/

class PyTupleIterator extends PyObject {
    __init__(data) {
        this.$index = 0
        this.$data = data
    }

    __next__() {
        let retval = this.$data[this.$index]
        if (retval === undefined) {
            throw pyStopIteration()
        }
        this.$index++
        return retval
    }

    __str__() {
        return '<tuple_iterator object at 0x99999999>'
    }
}
const tuple_iterator = jstype(PyTupleIterator, 'tuple_iterator', [], null)

/*************************************************************************
 * A Python Tuple type
 *************************************************************************/

function PyTuple(length) {
    // PyObject.call(this)

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
        throw pyTypeError('tuple() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

function Array_() {}

Array_.prototype = []

PyTuple.prototype.__doc__ = "tuple() -> empty tuple\ntuple(iterable) -> tuple initialized from iterable's items\n\nIf the argument is a tuple, the return value is the same object."
PyTuple.prototype = Object.create(Array_.prototype)
PyTuple.prototype.length = 0
PyTuple.prototype.constructor = PyTuple

/**************************************************
 * Javascript compatibility methods
 **************************************************/

PyTuple.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

PyTuple.prototype.__iter__ = function() {
    return tuple_iterator(this)
}

PyTuple.prototype.__len__ = function() {
    return types.pyint(this.length)
}

PyTuple.prototype.__repr__ = function() {
    return this.__str__()
}

PyTuple.prototype.__str__ = function() {
    let close
    if (this.length === 1) {
        close = ',)'
    } else {
        close = ')'
    }
    return '(' + this.map(function(obj) {
        return builtins.repr(obj)
    }).join(', ') + close
}

/**************************************************
 * Comparison operators
 **************************************************/

PyTuple.prototype.__lt__ = function(other) {
    if (!types.isinstance(other, types.pytuple)) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: tuple() < ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'<' not supported between instances of 'tuple' and '" + type_name(other) + "'"
            )
        }
    }
    if (this.length === 0 && other.length > 0) {
        return types.pybool(true)
    }
    for (let i = 0; i < this.length; i++) {
        if (i >= other.length) {
            return types.pybool(false)
        }
        if (this[i].__lt__(other[i]).valueOf()) {
            return types.pybool(true)
        } else if (this[i].__eq__(other[i]).valueOf()) {
            continue
        } else {
            return types.pybool(false)
        }
    }
    return types.pybool(this.length < other.length)
}

PyTuple.prototype.__le__ = function(other) {
    if (!types.isinstance(other, types.pytuple)) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: tuple() <= ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'<=' not supported between instances of 'tuple' and '" + type_name(other) + "'"
            )
        }
    }
    for (let i = 0; i < this.length; i++) {
        if (i >= other.length) {
            return types.pybool(false)
        }
        if (this[i].__eq__(other[i]).valueOf()) {
            continue
        } else if (this[i].__le__(other[i]).valueOf()) {
            return types.pybool(true)
        } else {
            return types.pybool(false)
        }
    }
    return types.pybool(this.length <= other.length)
}

PyTuple.prototype.__eq__ = function(other) {
    if (!types.isinstance(other, types.pytuple)) {
        return types.pybool(false)
    }
    if (this.length !== other.length) {
        return types.pybool(false)
    }
    for (let i = 0; i < this.length; i++) {
        if (!this[i].__eq__(other[i]).valueOf()) {
            return types.pybool(false)
        }
    }
    return types.pybool(true)
}

PyTuple.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__()
}

PyTuple.prototype.__gt__ = function(other) {
    if (!types.isinstance(other, types.pytuple)) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: tuple() > ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'>' not supported between instances of 'tuple' and '" + type_name(other) + "'"
            )
        }
    }
    if (this.length === 0 && other.length > 0) {
        return types.pybool(false)
    }
    for (let i = 0; i < this.length; i++) {
        if (i >= other.length) {
            return types.pybool(true)
        }
        // we need to use __gt__ so it throws right exception message if types are unorderable
        if (this[i].__gt__(other[i]).valueOf()) {
            return types.pybool(true)
        } else if (this[i].__eq__(other[i]).valueOf()) {
            continue
        } else {
            return types.pybool(false)
        }
    }
    return types.pybool(this.length > other.length)
}

PyTuple.prototype.__ge__ = function(other) {
    if (!types.isinstance(other, types.pytuple)) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: tuple() >= ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'>=' not supported between instances of 'tuple' and '" + type_name(other) + "'"
            )
        }
    }
    for (let i = 0; i < this.length; i++) {
        if (i >= other.length) {
            return types.pybool(true)
        }
        if (this[i].__eq__(other[i]).valueOf()) {
            continue
        } else if (this[i].__ge__(other[i]).valueOf()) {
            return types.pybool(true)
        } else {
            return types.pybool(false)
        }
    }
    return types.pybool(this.length >= other.length)
}

PyTuple.prototype.__contains__ = function(other) {
    return this.valueOf().index(other) !== -1
}

/**************************************************
 * Unary operators
 **************************************************/

PyTuple.prototype.__pos__ = function() {
    throw pyTypeError("bad operand type for unary +: 'tuple'")
}

PyTuple.prototype.__neg__ = function() {
    throw pyTypeError("bad operand type for unary -: 'tuple'")
}

PyTuple.prototype.__not__ = function() {
    return this.__bool__().__not__()
}

PyTuple.prototype.__invert__ = function() {
    throw pyTypeError("bad operand type for unary ~: 'tuple'")
}

PyTuple.prototype.__bool__ = function() {
    return types.pybool(this.length > 0)
}

/**************************************************
 * Binary operators
 **************************************************/

PyTuple.prototype.__pow__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ** or pow(): 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

PyTuple.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't take floor of complex number.")
    } else {
        throw pyTypeError("unsupported operand type(s) for //: 'tuple' and '" + type_name(other) + "'")
    }
}

PyTuple.prototype.__truediv__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for /: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__mul__ = function(other) {
    if (types.isinstance(other, types.pyint)) {
        let result = pytuple()
        for (let i = 0; i < other.valueOf(); i++) {
            for (let j = 0; j < this.length; j++) {
                result.push(this[j])
            }
        }
        return result
    } else if (types.isinstance(other, types.pybool)) {
        if (other.valueOf()) {
            return this.copy()
        } else {
            return pytuple()
        }
    } else {
        throw pyTypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

PyTuple.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't mod complex numbers.")
    } else {
        throw pyTypeError("unsupported operand type(s) for %: 'tuple' and '" + type_name(other) + "'")
    }
}

PyTuple.prototype.__add__ = function(other) {
    let i

    if (!types.isinstance(other, types.pytuple)) {
        throw pyTypeError('can only concatenate tuple (not "' + type_name(other) + '") to tuple')
    } else {
        let result = pytuple()
        for (i = 0; i < this.length; i++) {
            result.push(this[i])
        }

        for (i = 0; i < other.length; i++) {
            result.push(other[i])
        }

        return result
    }
}

PyTuple.prototype.__sub__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for -: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__delattr__ = function(attr) {
    throw pyAttributeError("'tuple' object has no attribute '" + attr + "'")
}

PyTuple.prototype.__getitem__ = function(index) {
    if (typeof index === 'number' || types.isinstance(index, types.pyint)) {
        let idx
        if (index === 'number') {
            idx = index
        } else {
            idx = index.int32()
        }

        if (idx < 0) {
            if (-idx > this.length) {
                throw pyIndexError('tuple index out of range')
            } else {
                return this[this.length + idx]
            }
        } else {
            if (idx >= this.length) {
                throw pyIndexError('tuple index out of range')
            } else {
                return this[idx]
            }
        }
    } else if (types.isinstance(index, types.pybool)) {
        if (index >= this.length) {
            throw pyIndexError('tuple index out of range')
        } else {
            if (index) {
                return this[1]
            } else {
                return this[0]
            }
        }
    } else if (types.isinstance(index, types.pyslice)) {
        let start, stop, step
        if (index.start === pyNone) {
            start = undefined
        } else if (!types.isinstance(index.start, types.pyint)) {
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
        } else if (!types.isinstance(index.stop, types.pyint)) {
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

        // clone tuple
        let slicedArray = Array_.prototype.slice.call(this)
        if (step === 1) {
            return pytuple(slicedArray.slice(start, stop))
        } else if (step > 0) {
            slicedArray = slicedArray.slice(start, stop)
        } else {
            // adjust start/stop to swap inclusion/exlusion in slice
            if (start !== undefined && start !== -1) {
                start = start + 1
            } else if (start === -1) {
                start = slicedArray.length
            }
            if (stop !== undefined && stop !== -1) {
                stop = stop + 1
            } else if (stop === -1) {
                stop = slicedArray.length
            }

            slicedArray = slicedArray.slice(stop, start).reverse()
        }

        let steppedArray = []
        for (let i = 0; i < slicedArray.length; i = i + Math.abs(step)) {
            steppedArray.push(slicedArray[i])
        }

        return pytuple(steppedArray)
    } else {
        let msg = 'tuple indices must be integers or slices, not '
        if (!version.later('3.4')) {
            msg = 'tuple indices must be integers, not '
        }
        throw pyTypeError(msg + type_name(index))
    }
}

PyTuple.prototype.__lshift__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for <<: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__rshift__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for >>: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__and__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for &: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__xor__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ^: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__or__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for |: 'tuple' and '" + type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

PyTuple.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't take floor of complex number.")
    } else {
        throw pyTypeError("unsupported operand type(s) for //=: 'tuple' and '" + type_name(other) + "'")
    }
}

PyTuple.prototype.__itruediv__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for /=: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__iadd__ = function(other) {
    let i

    if (types.isinstance(other, types.pytuple)) {
        for (i = 0; i < other.length; i++) {
            this.push(other[i])
        }
        return this
    } else {
        throw pyTypeError('can only concatenate tuple (not "' + type_name(other) + '") to tuple')
    }
}

PyTuple.prototype.__isub__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for -=: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__imul__ = function(other) {
    if (types.isinstance(other, types.pyint)) {
        let arrayChange = this
        const otherVal = other.int32()

        if (otherVal <= 0) {
            return pytuple()
        }

        let arrays = Array.apply(arrayChange, new Array(other.int32()))
        arrays = arrays.map(function() { return (arrayChange || []) })
        const concatedArray = arrays.concat.apply([], arrays.map(function(arr) { return [].concat.apply([], arr) }))
        return pytuple(concatedArray)
    } else if (types.isinstance(other, types.pybool)) {
        if (other) {
            return this
        } else {
            return pytuple()
        }
    } else {
        throw pyTypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

PyTuple.prototype.__imod__ = function(other) {
    if (types.isinstance(other, types.pycomplex)) {
        throw pyTypeError("can't mod complex numbers.")
    } else {
        throw pyTypeError("unsupported operand type(s) for %=: 'tuple' and '" + type_name(other) + "'")
    }
}

PyTuple.prototype.__ipow__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ** or pow(): 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__ilshift__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for <<=: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__irshift__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for >>=: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__iand__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for &=: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__ixor__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for ^=: 'tuple' and '" + type_name(other) + "'")
}

PyTuple.prototype.__ior__ = function(other) {
    throw pyTypeError("unsupported operand type(s) for |=: 'tuple' and '" + type_name(other) + "'")
}

/**************************************************
 * Methods
 **************************************************/

PyTuple.prototype.copy = function() {
    return pytuple(this)
}

PyTuple.prototype.count = function(value) {
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

PyTuple.prototype.index = function(value, start, stop) {
    if (arguments.length < 1) {
        throw pyTypeError('index() takes at least 1 argument (' + arguments.length + ' given)')
    } else if (arguments.length > 3) {
        throw pyTypeError('index() takes at most 3 arguments (' + arguments.length + ' given)')
    }
    for (let i = (start || 0); i < (stop || this.length); ++i) {
        if (this[i].__eq__(value)) {
            return i
        }
    }
    throw pyValueError('tuple.index(x): x not in tuple')
}

const pytuple = jstype(PyTuple, 'tuple', [], null)
export default pytuple

PyTuple.prototype.__class__ = pytuple
