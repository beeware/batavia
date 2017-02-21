var PyObject = require('../core').Object
var Type = require('../core').Type
var exceptions = require('../core').exceptions
var callables = require('../core').callables
var type_name = require('../core').type_name
var None = require('../core').None

/*************************************************************************
 * A Python dict type
 *************************************************************************/

/*
 * Implementation details: we use closed hashing, open addressing,
 * with linear probing and a max load factor of 0.75.
 */
function Dict(args, kwargs) {
    PyObject.call(this)

    this.data_keys = []
    this.data_values = []
    this.size = 0
    this.mask = 0

    if (args) {
        this.update(args)
    }
}

Dict.prototype = Object.create(PyObject.prototype)
Dict.prototype.__class__ = new Type('dict')
Dict.prototype.__class__.$pyclass = Dict

var MAX_LOAD_FACTOR = 0.75
var INITIAL_SIZE = 8 // after size 0

/**
 * Sentinel keys for empty and deleted.
 */
var EMPTY = {
    __hash__: function() {
        var types = require('../types')
        return new types.Int(0)
    },
    __eq__: function(other) {
        var types = require('../types')
        return new types.Bool(this === other)
    }
}

var DELETED = {
    __hash__: function() {
        var types = require('../types')
        return new types.Int(0)
    },
    __eq__: function(other) {
        var types = require('../types')
        return new types.Bool(this === other)
    }
}

Dict.prototype._increase_size = function() {
    var builtins = require('../builtins')

    // increase the table size and rehash
    if (this.data_keys.length === 0) {
        this.mask = INITIAL_SIZE - 1
        this.data_keys = new Array(INITIAL_SIZE)
        this.data_values = new Array(INITIAL_SIZE)

        for (var i = 0; i < INITIAL_SIZE; i++) {
            this.data_keys[i] = EMPTY
        }
        return
    }

    var new_keys = new Array(this.data_keys.length * 2)
    var new_values = new Array(this.data_keys.length * 2)
    var new_mask = this.data_keys.length * 2 - 1 // assumes power of two
    for (var i = 0; i < new_keys.length; i++) {
        new_keys[i] = EMPTY
    }
    callables.iter_for_each(builtins.iter([this.items()], null), function(val) {
        var key = val[0]
        var value = val[1]
        var hash = builtins.hash([key], null)
        var h = hash.int32() & new_mask
        while (!isEmpty(new_keys[h])) {
            h = (h + 1) & new_mask
        }
        new_keys[h] = key
        new_values[h] = value
    })
    this.data_keys = new_keys
    this.data_values = new_values
    this.mask = new_mask
}

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Dict.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Dict.prototype.__bool__ = function() {
    return this.size > 0
}

Dict.prototype.__repr__ = function() {
    return this.__str__()
}

var isDeleted = function(x) {
    var types = require('../types')
    var builtins = require('../builtins')

    return x !== null &&
        builtins.hash([x], null).__eq__(new types.Int(0)).valueOf() &&
        x.__eq__(DELETED).valueOf()
}

var isEmpty = function(x) {
    var types = require('../types')
    var builtins = require('../builtins')

    return x !== null &&
        builtins.hash([x], null).__eq__(new types.Int(0)).valueOf() &&
        x.__eq__(EMPTY).valueOf()
}

Dict.prototype.__str__ = function() {
    var builtins = require('../builtins')

    var result = '{'
    var strings = []
    for (var i = 0; i < this.data_keys.length; i++) {
        // ignore deleted or empty
        var key = this.data_keys[i]
        if (isEmpty(key) || isDeleted(key)) {
            continue
        }
        strings.push(builtins.repr([key], null) + ': ' + builtins.repr([this.data_values[i]], null))
    }
    result += strings.join(', ')
    result += '}'
    return result
}

/**************************************************
 * Comparison operators
 **************************************************/

Dict.prototype.__lt__ = function(other) {
    var types = require('../types')
    if (other !== None) {
        if (types.isbataviainstance(other)) {
            throw new exceptions.TypeError.$pyclass('unorderable types: dict() < ' + type_name(other) + '()')
        } else {
            return this.valueOf() < other.valueOf()
        }
    }
    throw new exceptions.TypeError.$pyclass('unorderable types: dict() < NoneType()')
}

Dict.prototype.__le__ = function(other) {
    var types = require('../types')
    if (other !== None) {
        if (types.isbataviainstance(other)) {
            throw new exceptions.TypeError.$pyclass('unorderable types: dict() <= ' + type_name(other) + '()')
        } else {
            return this.valueOf() <= other.valueOf()
        }
    }
    throw new exceptions.TypeError.$pyclass('unorderable types: dict() <= NoneType()')
}

Dict.prototype.__eq__ = function(other) {
    return this.valueOf() === other
}

Dict.prototype.__ne__ = function(other) {
    return this.valueOf() !== other
}

Dict.prototype.__gt__ = function(other) {
    var types = require('../types')
    if (other !== None) {
        if (types.isbataviainstance(other)) {
            throw new exceptions.TypeError.$pyclass('unorderable types: dict() > ' + type_name(other) + '()')
        } else {
            return this.valueOf() > other.valueOf()
        }
    } else {
        throw new exceptions.TypeError.$pyclass('unorderable types: dict() > NoneType()')
    }
}

Dict.prototype.__ge__ = function(other) {
    var types = require('../types')
    if (other !== None) {
        if (types.isbataviainstance(other)) {
            throw new exceptions.TypeError.$pyclass('unorderable types: dict() >= ' + type_name(other) + '()')
        } else {
            return this.valueOf() >= other.valueOf()
        }
    } else {
        throw new exceptions.TypeError.$pyclass('unorderable types: dict() >= NoneType()')
    }
}

/**************************************************
 * Unary operators
 **************************************************/

Dict.prototype.__pos__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary +: 'dict'")
}

Dict.prototype.__neg__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary -: 'dict'")
}

Dict.prototype.__not__ = function() {
    return this.__bool__().__not__()
}

Dict.prototype.__invert__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'dict'")
}

/**************************************************
 * Binary operators
 **************************************************/

Dict.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'dict' and '" + type_name(other) + "'")
}

Dict.prototype.__div__ = function(other) {
    return this.__truediv__(other)
}

Dict.prototype.__floordiv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //: 'dict' and '" + type_name(other) + "'")
}

Dict.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'dict' and '" + type_name(other) + "'")
}

Dict.prototype.__mul__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [
        types.Bool, types.Dict, types.Float,
        types.JSDict, types.Int, types.NoneType])) {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for *: 'dict' and '" + type_name(other) + "'")
    } else {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type 'dict'")
    }
}

Dict.prototype.__mod__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__mod__ has not been implemented')
}

Dict.prototype.__add__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for +: 'dict' and '" + type_name(other) + "'")
}

Dict.prototype.__sub__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -: 'dict' and '" + type_name(other) + "'")
}

Dict.prototype.__lshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__lshift__ has not been implemented')
}

Dict.prototype.__rshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__rshift__ has not been implemented')
}

Dict.prototype.__and__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &: 'dict' and '" + type_name(other) + "'")
}

Dict.prototype.__xor__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__xor__ has not been implemented')
}

Dict.prototype.__or__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__or__ has not been implemented')
}

Dict.prototype.__setitem__ = function(key, value) {
    var builtins = require('../builtins')

    if (this.size + 1 > this.data_keys.length * MAX_LOAD_FACTOR) {
        this._increase_size()
    }
    var hash = builtins.hash([key], null)
    var h = hash.int32() & this.mask
    while (true) {
        var current_key = this.data_keys[h]
        if (isEmpty(current_key) || isDeleted(current_key)) {
            this.data_keys[h] = key
            this.data_values[h] = value
            this.size++
            return
        } else if (current_key === null && key === null) {
            this.data_keys[h] = key
            this.data_values[h] = value
            return
        } else if (builtins.hash([current_key], null).__eq__(hash).valueOf() &&
                   current_key.__eq__(key).valueOf()) {
            this.data_keys[h] = key
            this.data_values[h] = value
            return
        }

        h = (h + 1) & this.mask
        if (h === (hash.int32() & this.mask)) {
            // we have looped, we'll rehash (should be impossible)
            this._increase_size()
            h = hash.int32() & this.mask
        }
    }
}

/**************************************************
 * Inplace operators
 **************************************************/

Dict.prototype.__ifloordiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__ifloordiv__ has not been implemented')
}

Dict.prototype.__itruediv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__itruediv__ has not been implemented')
}

Dict.prototype.__iadd__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__iadd__ has not been implemented')
}

Dict.prototype.__isub__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__isub__ has not been implemented')
}

Dict.prototype.__imul__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__imul__ has not been implemented')
}

Dict.prototype.__imod__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__imod__ has not been implemented')
}

Dict.prototype.__ipow__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__ipow__ has not been implemented')
}

Dict.prototype.__ilshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__ilshift__ has not been implemented')
}

Dict.prototype.__irshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__irshift__ has not been implemented')
}

Dict.prototype.__iand__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__iand__ has not been implemented')
}

Dict.prototype.__ixor__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__ixor__ has not been implemented')
}

Dict.prototype.__ior__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Dict.__ior__ has not been implemented')
}

Dict.prototype._find_index = function(other) {
    var builtins = require('../builtins')

    if (this.size === 0) {
        return null
    }
    var hash = builtins.hash([other], null)
    var h = hash.int32() & this.mask
    while (true) {
        var key = this.data_keys[h]
        if (isDeleted(key)) {
            h = (h + 1) & this.mask
            continue
        }
        if (isEmpty(key)) {
            return null
        }
        if (key === null && other === null) {
            return h
        }
        if (builtins.hash([key], null).__eq__(hash).valueOf() &&
            ((key === null && other === null) || key.__eq__(other).valueOf())) {
            return h
        }
        h = (h + 1) & this.mask

        if (h === (hash.int32() & this.mask)) {
            // we have looped, definitely not here
            return null
        }
    }
}

Dict.prototype.__contains__ = function(key) {
    var types = require('../types')
    return new types.Bool(this._find_index(key) !== null)
}

Dict.prototype.__getitem__ = function(key) {
    var i = this._find_index(key)
    if (i === null) {
        throw new exceptions.KeyError.$pyclass(key === null ? 'None' : key)
    }
    return this.data_values[i]
}

Dict.prototype.__delitem__ = function(key) {
    var i = this._find_index(key)
    if (i === null) {
        throw new exceptions.KeyError.$pyclass(key === null ? 'None' : key)
    }
    this.data_keys[i] = DELETED
    this.data_values[i] = null
    this.size--
}

/**************************************************
 * Methods
 **************************************************/

Dict.prototype.get = function(key, backup) {
    var i = this._find_index(key)
    if (i !== null) {
        return this.data_values[i]
    } else if (typeof backup === 'undefined') {
        throw new exceptions.KeyError.$pyclass(key === null ? 'None' : key)
    } else {
        return backup
    }
}

Dict.prototype.update = function(values) {
    var types = require('../types')
    var builtins = require('../builtins')

    var updates
    if (types.isinstance(values, [types.Dict, types.JSDict])) {
        updates = builtins.iter([values.items()], null)
    } else {
        updates = builtins.iter([values], null)
    }
    var i = 0
    var self = this
    callables.iter_for_each(updates, function(val) {
        var pieces = new types.Tuple(val)
        if (pieces.length !== 2) {
            throw new exceptions.ValueError.$pyclass('dictionary update sequence element #' + i + ' has length ' + pieces.length + '; 2 is required')
        }
        var key = pieces[0]
        var value = pieces[1]
        // we can partially process
        self.__setitem__(key, value)
        i++
    })
}

Dict.prototype.copy = function() {
    return new Dict(this)
}

Dict.prototype.items = function() {
    var types = require('../types')

    var result = new types.List()
    for (var i = 0; i < this.data_keys.length; i++) {
        // ignore deleted or empty
        var key = this.data_keys[i]
        if (isEmpty(key) || isDeleted(key)) {
            continue
        }
        result.append(new types.Tuple([key, this.data_values[i]]))
    }
    return result
}

Dict.prototype.keys = function() {
    var types = require('../types')

    var result = new types.List()
    for (var i = 0; i < this.data_keys.length; i++) {
        // ignore deleted or empty
        var key = this.data_keys[i]
        if (isEmpty(key) || isDeleted(key)) {
            continue
        }
        result.append(key)
    }
    return result
}

Dict.prototype.__iter__ = function() {
    var builtins = require('../builtins')
    return builtins.iter([this.keys()], null)
}

Dict.prototype.values = function() {
    var types = require('../types')

    var result = new types.List()
    for (var i = 0; i < this.data_keys.length; i++) {
        // ignore deleted or empty
        var key = this.data_keys[i]
        if (isEmpty(key) || isDeleted(key)) {
            continue
        }
        result.append(this.data_values[i])
    }
    return result
}

Dict.prototype.clear = function() {
    this.size = 0
    this.mask = 0
    this.data_keys = []
    this.data_values = []
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Dict
