/* eslint-disable no-extend-native */
import { iter_for_each } from '../core/callables'
import { IndexError, TypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'
import * as version from '../core/version'

import * as builtins from '../builtins'
import * as types from '../types'

/*************************************************************************
 * A Python Set type, with an underlying Dict.
 *************************************************************************/

export default function Set(args, kwargs) {
    PyObject.call(this)

    this.data = new types.Dict()
    if (args) {
        this.update(args)
    }
}

create_pyclass(Set, 'set')

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
    return this.data.size
}

Set.prototype.__bool__ = function() {
    return this.data.__bool__()
}

Set.prototype.__iter__ = function() {
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
    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length < other.data.keys().length)
    }
    if (version.earlier('3.6')) {
        throw new TypeError.$pyclass(
            'unorderable types: set() < ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError.$pyclass(
            "'<' not supported between instances of 'set' and '" + type_name(other) + "'"
        )
    }
}

Set.prototype.__le__ = function(other) {
    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length <= other.data.keys().length)
    }
    if (version.earlier('3.6')) {
        throw new TypeError.$pyclass(
            'unorderable types: set() <= ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError.$pyclass(
            "'<=' not supported between instances of 'set' and '" + type_name(other) + "'"
        )
    }
}

Set.prototype.__eq__ = function(other) {
    if (!types.isinstance(other, [types.FrozenSet, types.Set])) {
        return new types.Bool(false)
    }
    if (this.data.keys().length !== other.data.keys().length) {
        return new types.Bool(false)
    }
    var iterobj = builtins.iter([this], null)
    var equal = true
    iter_for_each(iterobj, function(val) {
        equal = equal && other.__contains__(val).valueOf()
    })

    return new types.Bool(equal)
}

Set.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__()
}

Set.prototype.__gt__ = function(other) {
    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length > other.data.keys().length)
    }
    if (version.earlier('3.6')) {
        throw new TypeError.$pyclass(
            'unorderable types: set() > ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError.$pyclass(
            "'>' not supported between instances of 'set' and '" + type_name(other) + "'"
        )
    }
}

Set.prototype.__ge__ = function(other) {
    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length >= other.data.keys().length)
    }
    if (version.earlier('3.6')) {
        throw new TypeError.$pyclass(
            'unorderable types: set() >= ' + type_name(other) + '()'
        )
    } else {
        throw new TypeError.$pyclass(
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
    throw new TypeError.$pyclass("bad operand type for unary +: 'set'")
}

Set.prototype.__neg__ = function() {
    throw new TypeError.$pyclass("bad operand type for unary -: 'set'")
}

Set.prototype.__not__ = function() {
    return this.__bool__().__not__()
}

Set.prototype.__invert__ = function() {
    throw new TypeError.$pyclass("bad operand type for unary ~: 'set'")
}

/**************************************************
 * Binary operators
 **************************************************/

Set.prototype.__pow__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'set' and '" + type_name(other) + "'")
}

Set.prototype.__div__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for /: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__floordiv__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError.$pyclass("can't take floor of complex number.")
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for //: 'set' and '" + type_name(other) + "'")
    }
}

Set.prototype.__truediv__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for /: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__mul__ = function(other) {
    if (types.isinstance(other, [
        types.Bytearray, types.Bytes, types.List,
        types.Str, types.Tuple
    ])) {
        throw new TypeError.$pyclass("can't multiply sequence by non-int of type 'set'")
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for *: 'set' and '" + type_name(other) + "'")
    }
}

Set.prototype.__mod__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError.$pyclass("can't mod complex numbers.")
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for %: 'set' and '" + type_name(other) + "'")
    }
}

Set.prototype.__add__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for +: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__sub__ = function(other) {
    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val)
            }
        })
        return new Set(both)
    }
    throw new TypeError.$pyclass("unsupported operand type(s) for -: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__getitem__ = function(other) {
    if (types.isinstance(other, [types.Bool])) {
        throw new TypeError.$pyclass("'set' object does not support indexing")
    } else if (types.isinstance(other, [types.Int])) {
        if (other.val.gt(types.Int.prototype.MAX_INT.val) || other.val.lt(types.Int.prototype.MIN_INT.val)) {
            throw new IndexError.$pyclass("cannot fit 'int' into an index-sized integer")
        } else {
            throw new TypeError.$pyclass("'set' object does not support indexing")
        }
    }
    throw new TypeError.$pyclass("'set' object is not subscriptable")
}

Set.prototype.__lshift__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for <<: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__rshift__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for >>: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__and__ = function(other) {
    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj = builtins.iter([this], null)
        iter_for_each(iterobj, function(val) {
            if (other.__contains__(val).valueOf()) {
                both.push(val)
            }
        })
        return new Set(both)
    }
    throw new TypeError.$pyclass("unsupported operand type(s) for &: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__xor__ = function(other) {
    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val)
            }
        })
        var iterobj2 = builtins.iter([other], null)
        iter_for_each(iterobj2, function(val) {
            if (!(this.__contains__(val).valueOf())) {
                both.push(val)
            }
        }.bind(this))
        return new Set(both)
    }
    throw new TypeError.$pyclass("unsupported operand type(s) for ^: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__or__ = function(other) {
    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        iter_for_each(iterobj1, function(val) {
            both.push(val)
        })
        var iterobj2 = builtins.iter([other], null)
        iter_for_each(iterobj2, function(val) {
            both.push(val)
        })
        return new Set(both)
    }
    throw new TypeError.$pyclass("unsupported operand type(s) for |: 'set' and '" + type_name(other) + "'")
}

/**************************************************
 * Inplace operators
 **************************************************/

Set.prototype.__ifloordiv__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError.$pyclass("can't take floor of complex number.")
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for //=: 'set' and '" + type_name(other) + "'")
    }
}

Set.prototype.__itruediv__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for /=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__iadd__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for +=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__isub__ = function(other) {
    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val)
            }
        })
        this.update(both)
        return new Set(both)
    }
    throw new TypeError.$pyclass("unsupported operand type(s) for -=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__imul__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for *=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__imod__ = function(other) {
    if (types.isinstance(other, types.Complex)) {
        throw new TypeError.$pyclass("can't mod complex numbers.")
    } else {
        throw new TypeError.$pyclass("unsupported operand type(s) for %=: 'set' and '" + type_name(other) + "'")
    }
}

Set.prototype.__ipow__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'set' and '" + type_name(other) + "'")
}

Set.prototype.__ilshift__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for <<=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__irshift__ = function(other) {
    throw new TypeError.$pyclass("unsupported operand type(s) for >>=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__iand__ = function(other) {
    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var intersection = new Set()
        var iterobj = builtins.iter([this], null)
        iter_for_each(iterobj, function(val) {
            if (other.__contains__(val).valueOf()) {
                intersection.add(val)
            }
        })
        return intersection
    }
    throw new TypeError.$pyclass("unsupported operand type(s) for &=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__ixor__ = function(other) {
    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val)
            }
        })
        var iterobj2 = builtins.iter([other], null)
        iter_for_each(iterobj2, function(val) {
            if (!(this.__contains__(val).valueOf())) {
                both.push(val)
            }
        }.bind(this))
        this.update(both)
        return new Set(both)
    }
    throw new TypeError.$pyclass("unsupported operand type(s) for ^=: 'set' and '" + type_name(other) + "'")
}

Set.prototype.__ior__ = function(other) {
    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var both = []
        var iterobj1 = builtins.iter([this], null)
        iter_for_each(iterobj1, function(val) {
            both.push(val)
        })
        var iterobj2 = builtins.iter([other], null)
        iter_for_each(iterobj2, function(val) {
            both.push(val)
        })
        this.update(both)
        return new Set(both)
    }
    throw new TypeError.$pyclass("unsupported operand type(s) for |=: 'set' and '" + type_name(other) + "'")
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
    var new_args = types.js2py(args)
    if (types.isinstance(new_args, [types.FrozenSet, types.List, types.Set, types.Dict, types.Str, types.Tuple])) {
        var iterobj = builtins.iter([new_args], null)
        var self = this
        iter_for_each(iterobj, function(val) {
            self.data.__setitem__(val, val)
        })
    } else {
        throw new TypeError.$pyclass("'" + type_name(new_args) + "' object is not iterable")
    }
}
