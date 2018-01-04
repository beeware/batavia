import { iter_for_each } from '../core/callables'
import { AttributeError, IndexError, TypeError, ValueError } from '../core/exceptions'
import { create_pyclass, type_name, None } from '../core/types'
import * as version from '../core/version'

import * as builtins from '../builtins'
import * as types from '../types'

import ListIterator from './ListIterator'

/*************************************************************************
 * A Python list type
 *************************************************************************/

export default function List() {
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
        throw new TypeError('list() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

function Array_() {}

Array_.prototype = []

List.prototype = Object.create(Array_.prototype)
List.prototype.length = 0
create_pyclass(List, 'list', true)
List.prototype.constructor = List

/**************************************************
 * Javascript compatibility methods
 **************************************************/

List.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

List.prototype.__iter__ = function() {
    return new ListIterator(this)
}

List.prototype.__len__ = function() {
    return this.length
}

List.prototype.__repr__ = function() {
    return this.__str__()
}

List.prototype.__str__ = function() {
    return '[' + this.map(function(obj) {
        return builtins.repr([obj], null)
    }).join(', ') + ']'
}

List.prototype.__bool__ = function() {
    return this.length > 0
}

/**************************************************
 * Comparison operators
 **************************************************/

List.prototype.__lt__ = function(other) {
    if (types.isinstance(other, [types.Bytes, types.Bytearray])) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: list() < ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'<' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== builtins.None) {
        if (types.isinstance(other, types.List)) {
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
                throw new TypeError(
                    'unorderable types: list() < ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'<' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: list() < NoneType()'
            )
        } else {
            throw new TypeError(
                "'<' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

List.prototype.__le__ = function(other) {
    if (types.isinstance(other, [types.Bytes, types.Bytearray])) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: list() <= ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'<=' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== builtins.None) {
        if (types.isinstance(other, types.List)) {
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
                throw new TypeError(
                    'unorderable types: list() <= ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'<=' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: list() <= NoneType()'
            )
        } else {
            throw new TypeError(
                "'<=' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

List.prototype.__eq__ = function(other) {
    if (types.isinstance(other, types.List)) {
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

List.prototype.__ne__ = function(other) {
    return !this.__eq__(other)
}

List.prototype.__gt__ = function(other) {
    if (types.isinstance(other, [types.Bytes, types.Bytearray])) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: list() > ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'>' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== builtins.None) {
        if (types.isinstance(other, types.List)) {
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
                throw new TypeError(
                    'unorderable types: list() > ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'>' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: list() > NoneType()'
            )
        } else {
            throw new TypeError(
                "'>' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

List.prototype.__ge__ = function(other) {
    if (types.isinstance(other, [types.Bytes, types.Bytearray])) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: list() >= ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'>=' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== builtins.None) {
        if (types.isinstance(other, types.List)) {
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
                throw new TypeError(
                    'unorderable types: list() >= ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'>=' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: list() >= NoneType()'
            )
        } else {
            throw new TypeError(
                "'>=' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

List.prototype.__contains__ = function(other) {
    return this.valueOf().index(other) !== -1
}

/**************************************************
 * Unary operators
 **************************************************/

List.prototype.__pos__ = function() {
    throw new TypeError("bad operand type for unary +: 'list'")
}

List.prototype.__neg__ = function() {
    throw new TypeError("bad operand type for unary -: 'list'")
}

List.prototype.__not__ = function() {
    return this.length === 0
}

List.prototype.__invert__ = function() {
    throw new TypeError("bad operand type for unary ~: 'list'")
}

/**************************************************
 * Binary operators
 **************************************************/

List.prototype.__pow__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ** or pow(): 'list' and '" + type_name(other) + "'")
}

List.prototype.__div__ = function(other) {
    throw new TypeError("unsupported operand type(s) for /: 'list' and '" + type_name(other) + "'")
}

List.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        throw new TypeError("unsupported operand type(s) for //: 'list' and '" + type_name(other) + "'")
    }
}

List.prototype.__truediv__ = function(other) {
    throw new TypeError("unsupported operand type(s) for /: 'list' and '" + type_name(other) + "'")
}

List.prototype.__mul__ = function(other) {
    if (types.isinstance(other, types.Int)) {
        var result = new List()
        if (other <= 0) {
            return result
        } else {
            for (var i = 0; i < other; i++) {
                result.extend(this)
            }
            return result
        }
    } else if (types.isinstance(other, types.Bool)) {
        if (other) {
            return this.copy()
        } else {
            return new List()
        }
    } else {
        throw new TypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

List.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't mod complex numbers.")
    } else {
        throw new TypeError("unsupported operand type(s) for %: 'list' and '" + type_name(other) + "'")
    }
}

List.prototype.__add__ = function(other) {
    var i

    if (types.isinstance(other, types.List)) {
        var result = new List()
        for (i = 0; i < this.length; i++) {
            result.push(this[i])
        }

        for (i = 0; i < other.length; i++) {
            result.push(other[i])
        }

        return result
    } else {
        throw new TypeError('can only concatenate list (not "' + type_name(other) + '") to list')
    }
}

List.prototype.__sub__ = function(other) {
    throw new TypeError("unsupported operand type(s) for -: 'list' and '" + type_name(other) + "'")
}

List.prototype.__delattr__ = function(attr) {
    throw new AttributeError("'list' object has no attribute '" + attr + "'")
}

List.prototype.__getitem__ = function(index) {
    if (types.isinstance(index, types.Int)) {
        var idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw new IndexError('list index out of range')
            } else {
                return this[this.length + idx]
            }
        } else {
            if (idx >= this.length) {
                throw new IndexError('list index out of range')
            } else {
                return this[idx]
            }
        }
    } else if (types.isinstance(index, types.Slice)) {
        var start, stop, step
        if (index.start === None) {
            start = undefined
        } else if (!(types.isinstance(index.start, types.Int))) {
            if (index.start.__index__ === undefined) {
                throw new TypeError('slice indices must be integers or None or have an __index__ method')
            } else {
                start = index.start.__index__()
            }
        } else {
            start = index.start.int32()
        }

        if (index.stop === None) {
            stop = undefined
        } else if (!(types.isinstance(index.stop, types.Int))) {
            if (index.stop.__index__ === undefined) {
                throw new TypeError('slice indices must be integers or None or have an __index__ method')
            } else {
                stop = index.stop.__index__()
            }
        } else {
            stop = index.stop.int32()
        }

        if (index.step === None) {
            step = 1
        } else if (!(types.isinstance(index.step, types.Int))) {
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
    } else if (types.isinstance(index, types.Bool)) {
        if (index) {
            idx = 1
        } else {
            idx = 0
        }
        if (this.length === 0) {
            throw new IndexError('list index out of range')
        } else if (this.length === 1) {
            if (idx === 1) {
                throw new IndexError('list index out of range')
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
        throw new TypeError(msg + type_name(index))
    }
}

List.prototype.__delitem__ = function(index) {
    if (types.isinstance(index, types.Int)) {
        var idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw new IndexError('list index out of range')
            } else {
                this.splice(this.length + idx, 1)
            }
        } else {
            if (idx >= this.length) {
                throw new IndexError('list index out of range')
            } else {
                this.splice(idx, 1)
            }
        }
    } else {
        throw new TypeError('list indices must be integers, not ' + type_name(index))
    }
}

List.prototype.__lshift__ = function(other) {
    throw new TypeError("unsupported operand type(s) for <<: 'list' and '" + type_name(other) + "'")
}

List.prototype.__rshift__ = function(other) {
    throw new TypeError("unsupported operand type(s) for >>: 'list' and '" + type_name(other) + "'")
}

List.prototype.__and__ = function(other) {
    throw new TypeError("unsupported operand type(s) for &: 'list' and '" + type_name(other) + "'")
}

List.prototype.__xor__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ^: 'list' and '" + type_name(other) + "'")
}

List.prototype.__or__ = function(other) {
    throw new TypeError("unsupported operand type(s) for |: 'list' and '" + type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

List.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't take floor of complex number.")
    } else {
        throw new TypeError("unsupported operand type(s) for //=: 'list' and '" + type_name(other) + "'")
    }
}

List.prototype.__itruediv__ = function(other) {
    throw new TypeError("unsupported operand type(s) for /=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__iadd__ = function(other) {
    if (types.isinstance(other, [types.Set, types.Dict, types.Range, types.FrozenSet, types.Bytes, types.Bytearray])) {
        var right_operand = new types.List(other)
    } else {
        right_operand = other
    }

    if (types.isinstance(right_operand, [types.List, types.Str, types.Tuple])) {
        for (var i = 0; i < right_operand.length; i++) {
            this.push(right_operand[i])
        }
    } else {
        throw new TypeError("'" + type_name(other) + "' object is not iterable")
    }
    return this
}

List.prototype.__isub__ = function(other) {
    throw new TypeError("unsupported operand type(s) for -=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__imul__ = function(other) {
    if (types.isinstance(other, types.Int)) {
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
    } else if (types.isinstance(other, types.Bool)) {
        if (other === true) {
            return this
        } else {
            return new List()
        }
    } else {
        throw new TypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

List.prototype.__imod__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError("can't mod complex numbers.")
    } else {
        throw new TypeError("unsupported operand type(s) for %=: 'list' and '" + type_name(other) + "'")
    }
}

List.prototype.__ipow__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ** or pow(): 'list' and '" + type_name(other) + "'")
}

List.prototype.__ilshift__ = function(other) {
    throw new TypeError("unsupported operand type(s) for <<=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__irshift__ = function(other) {
    throw new TypeError("unsupported operand type(s) for >>=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__iand__ = function(other) {
    throw new TypeError("unsupported operand type(s) for &=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__ixor__ = function(other) {
    throw new TypeError("unsupported operand type(s) for ^=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__ior__ = function(other) {
    throw new TypeError("unsupported operand type(s) for |=: 'list' and '" + type_name(other) + "'")
}

/**************************************************
 * Methods
 **************************************************/

List.prototype.append = function(value) {
    this.push(value)
}

List.prototype.copy = function() {
    return new List(this)
}

List.prototype.extend = function(values) {
    if (values.length > 0) {
        this.push.apply(this, values)
    }
}

List.prototype.insert = function(index, value) {
    if (arguments.length !== 2) {
        throw new TypeError(
            'insert() takes exactly 2 arguments (' + arguments.length + ' given)'
        )
    }
    validateIndexType(index)
    this.splice(index, 0, value)
}

List.prototype.remove = function(value) {
    if (arguments.length !== 1) {
        throw new TypeError(
            'remove() takes exactly one argument (' + arguments.length + ' given)'
        )
    }
    var index = this.indexOf(value)
    if (index === -1) {
        throw new ValueError('list.remove(x): x not in list')
    }
    this.splice(index, 1)
}

List.prototype.pop = function(index) {
    if (arguments.length > 1) {
        throw new TypeError(
            'pop() takes at most 1 argument (' + arguments.length + ' given)'
        )
    }
    if (index === undefined) {
        return Array_.prototype.pop.call(this)
    }
    validateIndexType(index)
    if (index >= this.length || index < -this.length) {
        throw new IndexError('pop index out of range')
    }
    return this.splice(index, 1)[0]
}

List.prototype.clear = function() {
    if (arguments.length !== 0) {
        throw new TypeError(
            'clear() takes no arguments (' + arguments.length + ' given)'
        )
    }
    this.splice(0, this.length)
}

List.prototype.count = function(value) {
    if (arguments.length !== 1) {
        throw new TypeError('count() takes exactly one argument (' + arguments.length + ' given)')
    }
    var count = 0
    for (var i = 0; i < this.length; ++i) {
        if (this[i].__eq__(value)) {
            count++
        }
    }
    return count
}

List.prototype.index = function(value, start, stop) {
    if (arguments.length < 1) {
        throw new TypeError('index() takes at least 1 argument (' + arguments.length + ' given)')
    } else if (arguments.length > 3) {
        throw new TypeError('index() takes at most 3 arguments (' + arguments.length + ' given)')
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
    throw new ValueError('list.index(x): x not in list')
}

List.prototype.reverse = function() {
    if (arguments.length > 0) {
        throw new TypeError('reverse() takes no arguments (' + arguments.length + ' given)')
    }
    Array.prototype.reverse.apply(this)
}

function validateIndexType(index) {
    if (!types.isinstance(index, types.Int)) {
        if (types.isinstance(index, types.Float)) {
            throw new TypeError('integer argument expected, got float')
        }
        throw new TypeError(
            "'" + type_name(index) + "' object cannot be interpreted as an integer"
        )
    }
}
