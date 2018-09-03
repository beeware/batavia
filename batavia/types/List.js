var version = require('../core').version
var exceptions = require('../core').exceptions
var callables = require('../core').callables
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass
var None = require('../core').None
var ListIterator = require('./ListIterator')

/*************************************************************************
 * A Python list type
 *************************************************************************/

function List() {
    var builtins = require('../builtins')

    if (arguments.length === 0) {
        this.push.apply(this)
    } else if (arguments.length === 1) {
        // Fast-path for native Array objects.
        if (Array.isArray(arguments[0])) {
            this.push.apply(this, arguments[0])
        } else {
            var iterobj = builtins.iter([arguments[0]], null)
            var self = this
            callables.iter_for_each(iterobj, function(val) {
                self.push(val)
            })
        }
    } else {
        throw new exceptions.TypeError.$pyclass('list() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

function Array_() {}

Array_.prototype = []

List.prototype = Object.create(Array_.prototype)
List.prototype.length = 0
create_pyclass(List, 'list', true)
List.prototype.constructor = List

List.prototype.__dir__ = function() {
    return "['__add__', '__class__', '__contains__', '__delattr__', '__delitem__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__gt__', '__hash__', '__iadd__', '__imul__', '__init__', '__iter__', '__le__', '__len__', '__lt__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__reversed__', '__rmul__', '__setattr__', '__setitem__', '__sizeof__', '__str__', '__subclasshook__', 'append', 'clear', 'copy', 'count', 'extend', 'index', 'insert', 'pop', 'remove', 'reverse', 'sort']"
}

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
    var types = require('../types')
    return new types.Int(this.length)
}

List.prototype.__repr__ = function() {
    return this.__str__()
}

List.prototype.__str__ = function() {
    var builtins = require('../builtins')

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
    var types = require('../types')

    if (types.isinstance(other, [types.Bytes, types.Bytearray])) {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: list() < ' + type_name(other) + '()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'<' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== None) {
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
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: list() < ' + type_name(other) + '()'
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    "'<' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: list() < NoneType()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'<' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

List.prototype.__le__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Bytes, types.Bytearray])) {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: list() <= ' + type_name(other) + '()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'<=' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== None) {
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
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: list() <= ' + type_name(other) + '()'
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    "'<=' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: list() <= NoneType()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'<=' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

List.prototype.__eq__ = function(other) {
    var types = require('../types')

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
    var types = require('../types')

    if (types.isinstance(other, [types.Bytes, types.Bytearray])) {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: list() > ' + type_name(other) + '()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'>' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== None) {
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
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: list() > ' + type_name(other) + '()'
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    "'>' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: list() > NoneType()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'>' not supported between instances of 'list' and 'NoneType'"
            )
        }
    }
}

List.prototype.__ge__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Bytes, types.Bytearray])) {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: list() >= ' + type_name(other) + '()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'>=' not supported between instances of 'list' and '" +
                type_name(other) + "'"
            )
        }
    }

    if (other !== None) {
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
                throw new exceptions.TypeError.$pyclass(
                    'unorderable types: list() >= ' + type_name(other) + '()'
                )
            } else {
                throw new exceptions.TypeError.$pyclass(
                    "'>=' not supported between instances of 'list' and '" +
                    type_name(other) + "'"
                )
            }
        }
    } else {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: list() >= NoneType()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
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
    throw new exceptions.TypeError.$pyclass("bad operand type for unary +: 'list'")
}

List.prototype.__neg__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary -: 'list'")
}

List.prototype.__not__ = function() {
    return this.length === 0
}

List.prototype.__invert__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'list'")
}

/**************************************************
 * Binary operators
 **************************************************/

List.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'list' and '" + type_name(other) + "'")
}

List.prototype.__div__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'list' and '" + type_name(other) + "'")
}

List.prototype.__floordiv__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //: 'list' and '" + type_name(other) + "'")
    }
}

List.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'list' and '" + type_name(other) + "'")
}

List.prototype.__mul__ = function(other) {
    var types = require('../types')

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
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

List.prototype.__mod__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't mod complex numbers.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for %: 'list' and '" + type_name(other) + "'")
    }
}

List.prototype.__add__ = function(other) {
    var types = require('../types')
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
        throw new exceptions.TypeError.$pyclass('can only concatenate list (not "' + type_name(other) + '") to list')
    }
}

List.prototype.__sub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -: 'list' and '" + type_name(other) + "'")
}

List.prototype.__delattr__ = function(attr) {
    throw new exceptions.AttributeError.$pyclass("'list' object has no attribute '" + attr + "'")
}

List.prototype.__getitem__ = function(index) {
    var types = require('../types')

    if (types.isinstance(index, types.Int)) {
        var idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw new exceptions.IndexError.$pyclass('list index out of range')
            } else {
                return this[this.length + idx]
            }
        } else {
            if (idx >= this.length) {
                throw new exceptions.IndexError.$pyclass('list index out of range')
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
                throw new exceptions.TypeError.$pyclass('slice indices must be integers or None or have an __index__ method')
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
                throw new exceptions.TypeError.$pyclass('slice indices must be integers or None or have an __index__ method')
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
                throw new exceptions.TypeError.$pyclass('slice indices must be integers or None or have an __index__ method')
            } else {
                step = index.step.__index__()
            }
        } else {
            step = index.step.int32()
            if (step === 0) {
                throw new exceptions.ValueError.$pyclass('slice step cannot be zero')
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
            throw new exceptions.IndexError.$pyclass('list index out of range')
        } else if (this.length === 1) {
            if (idx === 1) {
                throw new exceptions.IndexError.$pyclass('list index out of range')
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
        throw new exceptions.TypeError.$pyclass(msg + type_name(index))
    }
}

List.prototype.__delitem__ = function(index) {
    var types = require('../types')

    if (types.isinstance(index, types.Int)) {
        var idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw new exceptions.IndexError.$pyclass('list index out of range')
            } else {
                this.splice(this.length + idx, 1)
            }
        } else {
            if (idx >= this.length) {
                throw new exceptions.IndexError.$pyclass('list index out of range')
            } else {
                this.splice(idx, 1)
            }
        }
    } else {
        throw new exceptions.TypeError.$pyclass('list indices must be integers, not ' + type_name(index))
    }
}

List.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<: 'list' and '" + type_name(other) + "'")
}

List.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>: 'list' and '" + type_name(other) + "'")
}

List.prototype.__and__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &: 'list' and '" + type_name(other) + "'")
}

List.prototype.__xor__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^: 'list' and '" + type_name(other) + "'")
}

List.prototype.__or__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |: 'list' and '" + type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

List.prototype.__ifloordiv__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //=: 'list' and '" + type_name(other) + "'")
    }
}

List.prototype.__itruediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__iadd__ = function(other) {
    var types = require('../types')

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
        throw new exceptions.TypeError.$pyclass("'" + type_name(other) + "' object is not iterable")
    }
    return this
}

List.prototype.__isub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__imul__ = function(other) {
    var types = require('../types')

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
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

List.prototype.__imod__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't mod complex numbers.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for %=: 'list' and '" + type_name(other) + "'")
    }
}

List.prototype.__ipow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'list' and '" + type_name(other) + "'")
}

List.prototype.__ilshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__irshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__iand__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__ixor__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^=: 'list' and '" + type_name(other) + "'")
}

List.prototype.__ior__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |=: 'list' and '" + type_name(other) + "'")
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
        throw new exceptions.TypeError.$pyclass(
            'insert() takes exactly 2 arguments (' + arguments.length + ' given)'
        )
    }
    validateIndexType(index)
    this.splice(index, 0, value)
}

List.prototype.remove = function(value) {
    if (arguments.length !== 1) {
        throw new exceptions.TypeError.$pyclass(
            'remove() takes exactly one argument (' + arguments.length + ' given)'
        )
    }
    var index = this.indexOf(value)
    if (index === -1) {
        throw new exceptions.ValueError.$pyclass('list.remove(x): x not in list')
    }
    this.splice(index, 1)
}

List.prototype.pop = function(index) {
    if (arguments.length > 1) {
        throw new exceptions.TypeError.$pyclass(
            'pop() takes at most 1 argument (' + arguments.length + ' given)'
        )
    }
    if (index === undefined) {
        return Array_.prototype.pop.call(this)
    }
    validateIndexType(index)
    if (index >= this.length || index < -this.length) {
        throw new exceptions.IndexError.$pyclass('pop index out of range')
    }
    return this.splice(index, 1)[0]
}

List.prototype.clear = function() {
    if (arguments.length !== 0) {
        throw new exceptions.TypeError.$pyclass(
            'clear() takes no arguments (' + arguments.length + ' given)'
        )
    }
    this.splice(0, this.length)
}

List.prototype.count = function(value) {
    if (arguments.length !== 1) {
        throw new exceptions.TypeError.$pyclass('count() takes exactly one argument (' + arguments.length + ' given)')
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
        throw new exceptions.TypeError.$pyclass('index() takes at least 1 argument (' + arguments.length + ' given)')
    } else if (arguments.length > 3) {
        throw new exceptions.TypeError.$pyclass('index() takes at most 3 arguments (' + arguments.length + ' given)')
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
    throw new exceptions.ValueError.$pyclass('list.index(x): x not in list')
}

List.prototype.reverse = function() {
    if (arguments.length > 0) {
        throw new exceptions.TypeError.$pyclass('reverse() takes no arguments (' + arguments.length + ' given)')
    }
    Array.prototype.reverse.apply(this)
}

function validateIndexType(index) {
    var types = require('../types')
    if (!types.isinstance(index, types.Int)) {
        if (types.isinstance(index, types.Float)) {
            throw new exceptions.TypeError.$pyclass('integer argument expected, got float')
        }
        throw new exceptions.TypeError.$pyclass(
            "'" + type_name(index) + "' object cannot be interpreted as an integer"
        )
    }
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = List
