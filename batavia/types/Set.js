/* eslint-disable no-extend-native */
var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var version = require('../core').version
var callables = require('../core').callables
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass

/*************************************************************************
 * A Python Set type, with an underlying Dict.
 *************************************************************************/

function Set(args, kwargs) {
    var types = require('../types')

    PyObject.call(this)

    this.data = new types.Dict()
    if (args) {
        this.update(args)
    }
}

create_pyclass(Set, 'set')

Set.prototype.__dir__ = function() {
    return "['__and__', '__class__', '__contains__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__iand__', '__init__', '__ior__', '__isub__', '__iter__', '__ixor__', '__le__', '__len__', '__lt__', '__ne__', '__new__', '__or__', '__rand__', '__reduce__', '__reduce_ex__', '__repr__', '__ror__', '__rsub__', '__rxor__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__xor__', 'add', 'clear', 'copy', 'difference', 'difference_update', 'discard', 'intersection', 'intersection_update', 'isdisjoint', 'issubset', 'issuperset', 'pop', 'remove', 'symmetric_difference', 'symmetric_difference_update', 'union', 'update']"
}

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Set.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Set.prototype.__len__ = function() {
    return this.data.__len__()
}

Set.prototype.__bool__ = function() {
    return this.data.__bool__()
}

Set.prototype.__iter__ = function() {
    var types = require('../types')
    return new types.SetIterator(this)
}

Set.prototype.__repr__ = function() {
    return this.__str__()
}

Set.prototype.__str__ = function() {
    var keys = this.data.keys()
    if (keys.length === 0) {
        return 'set()'
    }
    return '{' + keys.map(function(x) { return x.__repr__() }).join(', ') + '}'
}

/**************************************************
 * Comparison operators
 **************************************************/

Set.prototype.__lt__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length < other.data.keys().length)
    }
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: set() < ' + type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'<' not supported between instances of 'set' and '" + type_name(other) + "'"
        )
    }
}

Set.prototype.__le__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length <= other.data.keys().length)
    }
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: set() <= ' + type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'<=' not supported between instances of 'set' and '" + type_name(other) + "'"
        )
    }
}

Set.prototype.__eq__ = function(other) {
    var types = require('../types')
    var builtins = require('../builtins')

    if (!types.isinstance(other, [types.FrozenSet, types.Set])) {
        return new types.Bool(false)
    }
    if (this.data.keys().length !== other.data.keys().length) {
        return new types.Bool(false)
    }
    var iterobj = builtins.iter([this], null)
    var equal = true
    callables.iter_for_each(iterobj, function(val) {
        equal = equal && other.__contains__(val).valueOf()
    })

    return new types.Bool(equal)
}

Set.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__()
}

Set.prototype.__gt__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length > other.data.keys().length)
    }
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: set() > ' + type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'>' not supported between instances of 'set' and '" + type_name(other) + "'"
        )
    }
}

Set.prototype.__ge__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length >= other.data.keys().length)
    }
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: set() >= ' + type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            "'>=' not supported between instances of 'set' and '" + type_name(other) + "'"
        )
    }
}

Set.prototype.__contains__ = function(other) {
    return this.data.__contains__(other)
}

/**************************************************
 * Unary operators
 **************************************************/
Set.prototype.__pos__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary +: 'set'")
}

Set.prototype.__neg__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary -: 'set'")
}

Set.prototype.__not__ = function() {
    return this.__bool__().__not__()
}

Set.prototype.__invert__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'set'")
}

/**************************************************
 * Binary operators
 **************************************************/

Set.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'set' and '" + type_name(other) + "'")
}

Set.prototype.__div__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__floordiv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //: 'set' and '" + type_name(other) + "'")
    }
}

Set.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__mul__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [
        types.Bytearray, types.Bytes, types.List,
        types.Str, types.Tuple
    ])) {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type 'set'")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for *: 'set' and '" + type_name(other) + "'")
    }
}

Set.prototype.__mod__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't mod complex numbers.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for %: 'set' and '" + type_name(other) + "'")
    }
}

Set.prototype.__add__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for +: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__sub__ = function(other) {
    var types = require('../types')
    var builtins = require('../builtins')

    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        callables.iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val)
            }
        })
        return new Set(both)
    }
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__getitem__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Bool])) {
        throw new exceptions.TypeError.$pyclass("'set' object does not support indexing")
    } else if (types.isinstance(other, [types.Int])) {
        if (other.val.gt(types.Int.prototype.MAX_INT.val) || other.val.lt(types.Int.prototype.MIN_INT.val)) {
            throw new exceptions.IndexError.$pyclass("cannot fit 'int' into an index-sized integer")
        } else {
            throw new exceptions.TypeError.$pyclass("'set' object does not support indexing")
        }
    }
    throw new exceptions.TypeError.$pyclass("'set' object is not subscriptable")
}

Set.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__and__ = function(other) {
    var types = require('../types')
    var builtins = require('../builtins')

    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj = builtins.iter([this], null)
        callables.iter_for_each(iterobj, function(val) {
            if (other.__contains__(val).valueOf()) {
                both.push(val)
            }
        })
        return new Set(both)
    }
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__xor__ = function(other) {
    var types = require('../types')
    var builtins = require('../builtins')

    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        callables.iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val)
            }
        })
        var iterobj2 = builtins.iter([other], null)
        callables.iter_for_each(iterobj2, function(val) {
            if (!(this.__contains__(val).valueOf())) {
                both.push(val)
            }
        }.bind(this))
        return new Set(both)
    }
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__or__ = function(other) {
    var types = require('../types')
    var builtins = require('../builtins')

    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        callables.iter_for_each(iterobj1, function(val) {
            both.push(val)
        })
        var iterobj2 = builtins.iter([other], null)
        callables.iter_for_each(iterobj2, function(val) {
            both.push(val)
        })
        return new Set(both)
    }
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |: 'set' and '" + type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

Set.prototype.__ifloordiv__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //=: 'set' and '" + type_name(other) + "'")
    }
}

Set.prototype.__itruediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__iadd__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for +=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__isub__ = function(other) {
    var types = require('../types')
    var builtins = require('../builtins')

    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        callables.iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val)
            }
        })
        this.update(both)
        return new Set(both)
    }
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__imul__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for *=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__imod__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't mod complex numbers.")
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for %=: 'set' and '" + type_name(other) + "'")
    }
}

Set.prototype.__ipow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'set' and '" + type_name(other) + "'")
}

Set.prototype.__ilshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__irshift__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__iand__ = function(other) {
    var types = require('../types')
    var builtins = require('../builtins')

    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var intersection = new Set()
        var iterobj = builtins.iter([this], null)
        callables.iter_for_each(iterobj, function(val) {
            if (other.__contains__(val).valueOf()) {
                intersection.add(val)
            }
        })
        return intersection
    }
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__ixor__ = function(other) {
    var types = require('../types')
    var builtins = require('../builtins')

    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        callables.iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val)
            }
        })
        var iterobj2 = builtins.iter([other], null)
        callables.iter_for_each(iterobj2, function(val) {
            if (!(this.__contains__(val).valueOf())) {
                both.push(val)
            }
        }.bind(this))
        this.update(both)
        return new Set(both)
    }
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__ior__ = function(other) {
    var types = require('../types')
    var builtins = require('../builtins')

    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        callables.iter_for_each(iterobj1, function(val) {
            both.push(val)
        })
        var iterobj2 = builtins.iter([other], null)
        callables.iter_for_each(iterobj2, function(val) {
            both.push(val)
        })
        this.update(both)
        return new Set(both)
    }
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |=: 'set' and '" + type_name(other) + "'")
}

/**************************************************
 * Methods
 **************************************************/

Set.prototype.add = function(v) {
    this.data.__setitem__(v, v)
}

Set.prototype.copy = function() {
    return new Set(this)
}

Set.prototype.remove = function(v) {
    this.data.__delitem__(v)
}

Set.prototype.update = function(args) {
    var types = require('../types')
    var builtins = require('../builtins')

    var new_args = types.js2py(args)
    if (types.isinstance(new_args, [types.FrozenSet, types.List, types.Set, types.Dict, types.Str, types.Tuple])) {
        var iterobj = builtins.iter([new_args], null)
        var self = this
        callables.iter_for_each(iterobj, function(val) {
            self.data.__setitem__(val, val)
        })
    } else {
        throw new exceptions.TypeError.$pyclass("'" + type_name(new_args) + "' object is not iterable")
    }
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Set
