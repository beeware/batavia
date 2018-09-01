var version = require('../core').version
var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var callables = require('../core').callables
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass
var TupleIterator = require('./TupleIterator')
var None = require('../core').None

/*************************************************************************
 * A Python Tuple type
 *************************************************************************/

function Tuple(length) {
    PyObject.call(this)

    if (arguments.length === 0) {
        this.push.apply(this)
    } else if (arguments.length === 1) {
        // Fast-path for native Array objects.
        if (Array.isArray(arguments[0])) {
            this.push.apply(this, arguments[0])
        } else {
            var builtins = require('../builtins')
            var iterobj = builtins.iter([arguments[0]], null)
            var self = this
            callables.iter_for_each(iterobj, function(val) {
                self.push(val)
            })
        }
    } else {
        throw new exceptions.TypeError.$pyclass('tuple() takes at most 1 argument (' + arguments.length + ' given)')
    }
}

function Array_() {}

Array_.prototype = []

Tuple.prototype = Object.create(Array_.prototype)
Tuple.prototype.length = 0
create_pyclass(Tuple, 'tuple', true)
Tuple.prototype.constructor = Tuple

Tuple.prototype.__dir__ = function() {
    return "['__add__', '__class__', '__contains__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__iter__', '__le__', '__len__', '__lt__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmul__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'count', 'index']"
}

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Tuple.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Tuple.prototype.__iter__ = function() {
    return new TupleIterator(this)
}

Tuple.prototype.__len__ = function() {
    var types = require('../types')
    return new types.Int(this.length)
}

Tuple.prototype.__repr__ = function() {
    return this.__str__()
}

Tuple.prototype.__str__ = function() {
    var builtins = require('../builtins')
    var close
    if (this.length === 1) {
        close = ',)'
    } else {
        close = ')'
    }
    return '(' + this.map(function(obj) {
        return builtins.repr([obj], null)
    }).join(', ') + close
}

/**************************************************
 * Comparison operators
 **************************************************/

Tuple.prototype.__lt__ = function(other) {
    var types = require('../types')

    if (!types.isinstance(other, types.Tuple)) {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: tuple() < ' + type_name(other) + '()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'<' not supported between instances of 'tuple' and '" + type_name(other) + "'"
            )
        }
    }
    if (this.length === 0 && other.length > 0) {
        return new types.Bool(true)
    }
    for (var i = 0; i < this.length; i++) {
        if (i >= other.length) {
            return new types.Bool(false)
        }
        if (this[i].__lt__(other[i]).valueOf()) {
            return new types.Bool(true)
        } else if (this[i].__eq__(other[i]).valueOf()) {
            continue
        } else {
            return new types.Bool(false)
        }
    }
    return new types.Bool(this.length < other.length)
}

Tuple.prototype.__le__ = function(other) {
    var types = require('../types')

    if (!types.isinstance(other, types.Tuple)) {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: tuple() <= ' + type_name(other) + '()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'<=' not supported between instances of 'tuple' and '" + type_name(other) + "'"
            )
        }
    }
    for (var i = 0; i < this.length; i++) {
        if (i >= other.length) {
            return new types.Bool(false)
        }
        if (this[i].__eq__(other[i]).valueOf()) {
            continue
        } else if (this[i].__le__(other[i]).valueOf()) {
            return new types.Bool(true)
        } else {
            return new types.Bool(false)
        }
    }
    return new types.Bool(this.length <= other.length)
}

Tuple.prototype.__eq__ = function(other) {
    var types = require('../types')

    if (!types.isinstance(other, types.Tuple)) {
        return new types.Bool(false)
    }
    if (this.length !== other.length) {
        return new types.Bool(false)
    }
    for (var i = 0; i < this.length; i++) {
        if (!this[i].__eq__(other[i]).valueOf()) {
            return new types.Bool(false)
        }
    }
    return new types.Bool(true)
}

Tuple.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__()
}

Tuple.prototype.__gt__ = function(other) {
    var types = require('../types')

    if (!types.isinstance(other, types.Tuple)) {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: tuple() > ' + type_name(other) + '()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'>' not supported between instances of 'tuple' and '" + type_name(other) + "'"
            )
        }
    }
    if (this.length === 0 && other.length > 0) {
        return new types.Bool(false)
    }
    for (var i = 0; i < this.length; i++) {
        if (i >= other.length) {
            return new types.Bool(true)
        }
        // we need to use __gt__ so it throws right exception message if types are unorderable
        if (this[i].__gt__(other[i]).valueOf()) {
            return new types.Bool(true)
        } else if (this[i].__eq__(other[i]).valueOf()) {
            continue
        } else {
            return new types.Bool(false)
        }
    }
    return new types.Bool(this.length > other.length)
}

Tuple.prototype.__ge__ = function(other) {
    var types = require('../types')

    if (!types.isinstance(other, types.Tuple)) {
        if (version.earlier('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: tuple() >= ' + type_name(other) + '()'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                "'>=' not supported between instances of 'tuple' and '" + type_name(other) + "'"
            )
        }
    }
    for (var i = 0; i < this.length; i++) {
        if (i >= other.length) {
            return new types.Bool(true)
        }
        if (this[i].__eq__(other[i]).valueOf()) {
            continue
        } else if (this[i].__ge__(other[i]).valueOf()) {
            return new types.Bool(true)
        } else {
            return new types.Bool(false)
        }
    }
    return new types.Bool(this.length >= other.length)
}

Tuple.prototype.__contains__ = function(other) {
    return this.valueOf().index(other) !== -1
}

/**************************************************
 * Unary operators
 **************************************************/

Tuple.prototype.__pos__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary +: 'tuple'")
}

Tuple.prototype.__neg__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary -: 'tuple'")
}

Tuple.prototype.__not__ = function() {
    return this.__bool__().__not__()
}

Tuple.prototype.__invert__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'tuple'")
}

Tuple.prototype.__bool__ = function() {
    var types = require('../types')
    return new types.Bool(this.length > 0)
}

/**************************************************
 * Binary operators
 **************************************************/

Tuple.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Tuple.prototype.__floordiv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //: 'tuple' and '" + type_name(other) + "'")
    }
}

Tuple.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__mul__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Int)) {
        var result = new Tuple()
        for (var i = 0; i < other.valueOf(); i++) {
            for (var j = 0; j < this.length; j++) {
                result.push(this[j])
            }
        }
        return result
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return this.copy()
        } else {
            return new Tuple()
        }
    } else {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

Tuple.prototype.__mod__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't mod complex numbers.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for %: 'tuple' and '" + type_name(other) + "'")
    }
}

Tuple.prototype.__add__ = function(other) {
    var types = require('../types')
    var i

    if (!types.isinstance(other, types.Tuple)) {
        throw new exceptions.TypeError.$pyclass('can only concatenate tuple (not "' + type_name(other) + '") to tuple')
    } else {
        var result = new Tuple()
        for (i = 0; i < this.length; i++) {
            result.push(this[i])
        }

        for (i = 0; i < other.length; i++) {
            result.push(other[i])
        }

        return result
    }
}

Tuple.prototype.__sub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__delattr__ = function(attr) {
    throw new exceptions.AttributeError.$pyclass("'tuple' object has no attribute '" + attr + "'")
}

Tuple.prototype.__getitem__ = function(index) {
    var types = require('../types')

    if (types.isinstance(index, types.Int)) {
        var idx = index.int32()
        if (idx < 0) {
            if (-idx > this.length) {
                throw new exceptions.IndexError.$pyclass('tuple index out of range')
            } else {
                return this[this.length + idx]
            }
        } else {
            if (idx >= this.length) {
                throw new exceptions.IndexError.$pyclass('tuple index out of range')
            } else {
                return this[idx]
            }
        }
    } else if (types.isinstance(index, types.Bool)) {
        if (index >= this.length) {
            throw new exceptions.IndexError.$pyclass('tuple index out of range')
        } else {
            if (index) {
                return this[1]
            } else {
                return this[0]
            }
        }
    } else if (types.isinstance(index, types.Slice)) {
        var start, stop, step
        if (index.start === None) {
            start = undefined
        } else if (!types.isinstance(index.start, types.Int)) {
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
        } else if (!types.isinstance(index.stop, types.Int)) {
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

        // clone tuple
        var slicedArray = Array_.prototype.slice.call(this)
        if (step === 1) {
            return new Tuple(slicedArray.slice(start, stop))
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

        var steppedArray = []
        for (var i = 0; i < slicedArray.length; i = i + Math.abs(step)) {
            steppedArray.push(slicedArray[i])
        }

        return new Tuple(steppedArray)
    } else {
        var msg = 'tuple indices must be integers or slices, not '
        if (!version.later('3.4')) {
            msg = 'tuple indices must be integers, not '
        }
        throw new exceptions.TypeError.$pyclass(msg + type_name(index))
    }
}

Tuple.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__and__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__xor__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__or__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |: 'tuple' and '" + type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

Tuple.prototype.__ifloordiv__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //=: 'tuple' and '" + type_name(other) + "'")
    }
}

Tuple.prototype.__itruediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /=: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__iadd__ = function(other) {
    var types = require('../types')
    var i

    if (types.isinstance(other, types.Tuple)) {
        for (i = 0; i < other.length; i++) {
            this.push(other[i])
        }
        return this
    } else {
        throw new exceptions.TypeError.$pyclass('can only concatenate tuple (not "' + type_name(other) + '") to tuple')
    }
}

Tuple.prototype.__isub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -=: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__imul__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Int)) {
        let arrayChange = this
        const otherVal = other.int32()

        if (otherVal <= 0) {
            return new Tuple()
        }

        let arrays = Array.apply(arrayChange, new Array(other.int32()))
        arrays = arrays.map(function() { return (arrayChange || []) })
        const concatedArray = arrays.concat.apply([], arrays.map(function(arr) { return [].concat.apply([], arr) }))
        return new Tuple(concatedArray)
    } else if (types.isinstance(other, types.Bool)) {
        if (other) {
            return this
        } else {
            return new Tuple()
        }
    } else {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

Tuple.prototype.__imod__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't mod complex numbers.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for %=: 'tuple' and '" + type_name(other) + "'")
    }
}

Tuple.prototype.__ipow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__ilshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<=: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__irshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>=: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__iand__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &=: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__ixor__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^=: 'tuple' and '" + type_name(other) + "'")
}

Tuple.prototype.__ior__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |=: 'tuple' and '" + type_name(other) + "'")
}

/**************************************************
 * Methods
 **************************************************/

Tuple.prototype.copy = function() {
    return new Tuple(this)
}

Tuple.prototype.count = function(value) {
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

Tuple.prototype.index = function(value, start, stop) {
    if (arguments.length < 1) {
        throw new exceptions.TypeError.$pyclass('index() takes at least 1 argument (' + arguments.length + ' given)')
    } else if (arguments.length > 3) {
        throw new exceptions.TypeError.$pyclass('index() takes at most 3 arguments (' + arguments.length + ' given)')
    }
    for (var i = (start || 0); i < (stop || this.length); ++i) {
        if (this[i].__eq__(value)) {
            return i
        }
    }
    throw new exceptions.ValueError.$pyclass('tuple.index(x): x not in tuple')
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Tuple
