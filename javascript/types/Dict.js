import { iter_for_each } from '../core/callables'
import { KeyError, TypeError, ValueError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject, PyNone } from '../core/types'
import * as version from '../core/version'

import * as builtins from '../builtins'
import * as types from '../types'

/*************************************************************************
 * A Python dict type
 *************************************************************************/

/*
 * Implementation details: we use closed hashing, open addressing,
 * with linear probing and a max load factor of 0.75.
 */

var MAX_LOAD_FACTOR = 0.75
var INITIAL_SIZE = 8 // after size 0

/**
 * Sentinel keys for empty and deleted.
 */
var EMPTY = {
    __hash__: function() {
        return new types.PyInt(0)
    },
    __eq__: function(other) {
        return new types.PyBool(this === other)
    }
}

var DELETED = {
    __hash__: function() {
        return new types.PyInt(0)
    },
    __eq__: function(other) {
        return new types.PyBool(this === other)
    }
}

export default class PyDict extends PyObject {
    constructor(args, kwargs) {
        super()

        this.data_keys = []
        this.data_values = []
        this.size = 0
        this.mask = 0

        if (args) {
            this.update(args)
        }
    }

    _increase_size() {
        var i

        // increase the table size and rehash
        if (this.data_keys.length === 0) {
            this.mask = INITIAL_SIZE - 1
            this.data_keys = new Array(INITIAL_SIZE)
            this.data_values = new Array(INITIAL_SIZE)

            for (i = 0; i < INITIAL_SIZE; i++) {
                this.data_keys[i] = EMPTY
            }
            return
        }

        var new_keys = new Array(this.data_keys.length * 2)
        var new_values = new Array(this.data_keys.length * 2)
        var new_mask = this.data_keys.length * 2 - 1 // assumes power of two
        for (i = 0; i < new_keys.length; i++) {
            new_keys[i] = EMPTY
        }
        iter_for_each(builtins.iter(this.items()), function(key, value) {
            var hash = builtins.hash(key)
            var h = hash.int32() & new_mask
            while (!this.isEmpty(new_keys[h])) {
                h = (h + 1) & new_mask
            }
            new_keys[h] = key
            new_values[h] = value
        })
        this.data_keys = new_keys
        this.data_values = new_values
        this.mask = new_mask
    }

    deleteAt(dict, index) {
        dict.data_keys[index] = DELETED
        dict.data_values[index] = null
        dict.size--
    }

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    toString() {
        return this.__str__()
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __len__() {
        return this.size
    }

    __bool__() {
        return this.size > 0
    }

    __repr__() {
        return this.__str__()
    }

    isDeleted(x) {
        return x !== null &&
            builtins.hash(x).__eq__(new types.PyInt(0)).valueOf() &&
            x.__eq__(DELETED).valueOf()
    }

    isEmpty(x) {
        return x !== null &&
            builtins.hash(x).__eq__(new types.PyInt(0)).valueOf() &&
            x.__eq__(EMPTY).valueOf()
    }

    __str__() {
        var result = '{'
        var strings = []
        for (var i = 0; i < this.data_keys.length; i++) {
            // ignore deleted or empty
            var key = this.data_keys[i]
            if (this.isEmpty(key) || this.isDeleted(key)) {
                continue
            }
            strings.push(builtins.repr(key) + ': ' + builtins.repr(this.data_values[i]))
        }
        result += strings.join(', ')
        result += '}'
        return result
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (other !== builtins.None) {
            if (types.isbataviainstance(other)) {
                if (version.earlier('3.6')) {
                    throw new TypeError(
                        'unorderable types: dict() < ' + type_name(other) + '()'
                    )
                } else {
                    throw new TypeError(
                        "'<' not supported between instances of 'dict' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() < other.valueOf()
            }
        }
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: dict() < NoneType()'
            )
        } else {
            throw new TypeError(
                "'<' not supported between instances of 'dict' and 'NoneType'"
            )
        }
    }

    __le__(other) {
        if (other !== builtins.None) {
            if (types.isbataviainstance(other)) {
                if (version.earlier('3.6')) {
                    throw new TypeError(
                        'unorderable types: dict() <= ' + type_name(other) + '()'
                    )
                } else {
                    throw new TypeError(
                        "'<=' not supported between instances of 'dict' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() <= other.valueOf()
            }
        }
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: dict() <= NoneType()'
            )
        } else {
            throw new TypeError(
                "'<=' not supported between instances of 'dict' and 'NoneType'"
            )
        }
    }

    __eq__(other) {
        if (!types.isinstance(other, [types.PyDict])) {
            return new types.PyBool(false)
        }
        if (this.data_keys.length !== other.data_keys.length) {
            return new types.PyBool(false)
        }

        for (var i = 0; i < this.data_keys.length; i++) {
            var key = this.data_keys[i]
            if (this.isEmpty(key) || this.isDeleted(key)) {
                continue
            }
            if (!other.__contains__(key).valueOf()) {
                return new types.PyBool(false)
            }
            var this_value = this.__getitem__(key)
            var other_value = other.__getitem__(key)
            if (!this_value.__eq__(other_value)) {
                return new types.PyBool(false)
            }
        }

        return new types.PyBool(true)
    }

    __ne__(other) {
        return this.__eq__(other).__not__()
    }

    __gt__(other) {
        if (other !== builtins.None) {
            if (types.isbataviainstance(other)) {
                if (version.earlier('3.6')) {
                    throw new TypeError(
                        'unorderable types: dict() > ' + type_name(other) + '()'
                    )
                } else {
                    throw new TypeError(
                        "'>' not supported between instances of 'dict' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() > other.valueOf()
            }
        } else {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: dict() > NoneType()'
                )
            } else {
                throw new TypeError(
                    "'>' not supported between instances of 'dict' and 'NoneType'"
                )
            }
        }
    }

    __ge__(other) {
        if (other !== builtins.None) {
            if (types.isbataviainstance(other)) {
                if (version.earlier('3.6')) {
                    throw new TypeError(
                        'unorderable types: dict() >= ' + type_name(other) + '()'
                    )
                } else {
                    throw new TypeError(
                        "'>=' not supported between instances of 'dict' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() >= other.valueOf()
            }
        } else {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: dict() >= NoneType()'
                )
            } else {
                throw new TypeError(
                    "'>=' not supported between instances of 'dict' and 'NoneType'"
                )
            }
        }
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        throw new TypeError("bad operand type for unary +: 'dict'")
    }

    __neg__() {
        throw new TypeError("bad operand type for unary -: 'dict'")
    }

    __not__() {
        return this.__bool__().__not__()
    }

    __invert__() {
        throw new TypeError("bad operand type for unary ~: 'dict'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'dict' and '" + type_name(other) + "'")
    }

    __div__(other) {
        return this.__truediv__(other)
    }

    __floordiv__(other) {
        if (types.isinstance(other, [types.PyComplex])) {
            throw new TypeError("can't take floor of complex number.")
        }

        throw new TypeError("unsupported operand type(s) for //: 'dict' and '" + type_name(other) + "'")
    }

    __truediv__(other) {
        throw new TypeError("unsupported operand type(s) for /: 'dict' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [
            types.PyBool, types.PyDict, types.PyFloat,
            types.JSDict, types.PyInt, types.PyNoneType,
            types.PySlice, types.PySet, types.PyFrozenSet,
            types.PyNotImplementedType, types.PyComplex, types.PyRange,
            types.PyType])) {
            throw new TypeError("unsupported operand type(s) for *: 'dict' and '" + type_name(other) + "'")
        } else {
            throw new TypeError("can't multiply sequence by non-int of type 'dict'")
        }
    }

    __mod__(other) {
        if (types.isinstance(other, [types.PyComplex])) {
            throw new TypeError("can't mod complex numbers.")
        }
        throw new TypeError("unsupported operand type(s) for %: 'dict' and '" + type_name(other) + "'")
    }

    __add__(other) {
        throw new TypeError("unsupported operand type(s) for +: 'dict' and '" + type_name(other) + "'")
    }

    __sub__(other) {
        throw new TypeError("unsupported operand type(s) for -: 'dict' and '" + type_name(other) + "'")
    }

    __lshift__(other) {
        throw new TypeError("unsupported operand type(s) for <<: 'dict' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw new TypeError("unsupported operand type(s) for >>: 'dict' and '" + type_name(other) + "'")
    }

    __and__(other) {
        throw new TypeError("unsupported operand type(s) for &: 'dict' and '" + type_name(other) + "'")
    }

    __xor__(other) {
        throw new TypeError("unsupported operand type(s) for ^: 'dict' and '" + type_name(other) + "'")
    }

    __or__(other) {
        throw new TypeError("unsupported operand type(s) for |: 'dict' and '" + type_name(other) + "'")
    }

    __setitem__(key, value) {
        if (this.size + 1 > this.data_keys.length * MAX_LOAD_FACTOR) {
            this._increase_size()
        }
        var hash = builtins.hash(key)
        var h = hash.int32() & this.mask

        while (true) {
            var current_key = this.data_keys[h]
            if (this.isEmpty(current_key) || this.isDeleted(current_key)) {
                this.data_keys[h] = key
                this.data_values[h] = value
                this.size++
                return
            } else if (current_key === null && key === null) {
                this.data_keys[h] = key
                this.data_values[h] = value
                return
            } else if (builtins.hash(current_key).__eq__(hash).valueOf() &&
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

    __ifloordiv__(other) {
        if (types.isinstance(other, [types.PyComplex])) {
            throw new TypeError("can't take floor of complex number.")
        }

        throw new TypeError("unsupported operand type(s) for //=: 'dict' and '" + type_name(other) + "'")
    }

    __itruediv__(other) {
        throw new TypeError("unsupported operand type(s) for /=: 'dict' and '" + type_name(other) + "'")
    }

    __iadd__(other) {
        throw new TypeError("unsupported operand type(s) for +=: 'dict' and '" + type_name(other) + "'")
    }

    __isub__(other) {
        throw new TypeError("unsupported operand type(s) for -=: 'dict' and '" + type_name(other) + "'")
    }

    __imul__(other) {
        throw new TypeError("unsupported operand type(s) for *=: 'dict' and '" + type_name(other) + "'")
    }

    __imod__(other) {
        if (types.isinstance(other, [types.PyComplex])) {
            throw new TypeError("can't mod complex numbers.")
        }

        throw new TypeError("unsupported operand type(s) for %=: 'dict' and '" + type_name(other) + "'")
    }

    __ipow__(other) {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'dict' and '" + type_name(other) + "'")
    }

    __ilshift__(other) {
        throw new TypeError("unsupported operand type(s) for <<=: 'dict' and '" + type_name(other) + "'")
    }

    __irshift__(other) {
        throw new TypeError("unsupported operand type(s) for >>=: 'dict' and '" + type_name(other) + "'")
    }

    __iand__(other) {
        throw new TypeError("unsupported operand type(s) for &=: 'dict' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        throw new TypeError("unsupported operand type(s) for ^=: 'dict' and '" + type_name(other) + "'")
    }

    __ior__(other) {
        throw new TypeError("unsupported operand type(s) for |=: 'dict' and '" + type_name(other) + "'")
    }

    _find_index(other) {
        if (this.size === 0) {
            return null
        }
        var hash = builtins.hash(other)
        var h = hash.int32() & this.mask
        while (true) {
            var key = this.data_keys[h]
            if (this.isDeleted(key)) {
                h = (h + 1) & this.mask
                continue
            }
            if (this.isEmpty(key)) {
                return null
            }
            if (key === null && other === null) {
                return h
            }
            if (builtins.hash(key).__eq__(hash).valueOf() &&
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

    __contains__(key) {
        return new types.PyBool(this._find_index(key) !== null)
    }

    __getitem__(key) {
        if (!types.isinstance(key, [
            types.PyStr, types.PyInt, types.PyBool,
            types.PyFloat, types.PyRange, types.PyTuple,
            types.PyFrozenSet, types.PyNoneType, types.PyComplex,
            types.PyBytes])) {
            throw new TypeError("unhashable type: '" + type_name(key) + "'")
        }

        var i = this._find_index(key)

        if (i === null) {
            if (key === null) {
                throw new KeyError('PyNone')
            } else {
                throw new KeyError(key)
            }
        }
        return this.data_values[i]
    }

    __delitem__(key) {
        var i = this._find_index(key)
        if (i === null) {
            if (key === null) {
                throw new KeyError('PyNone')
            } else {
                throw new KeyError(key)
            }
        }
        deleteAt(this, i)
    }

    /**************************************************
     * Methods
     **************************************************/

    get(key, backup) {
        var i = this._find_index(key)
        if (i !== null) {
            return this.data_values[i]
        } else if (typeof backup === 'undefined') {
            if (key === null) {
                throw new KeyError('PyNone')
            } else {
                throw new KeyError(key)
            }
        } else {
            return backup
        }
    }

    update(values) {
        var updates
        if (types.isinstance(values, [types.PyDict, types.JSDict])) {
            updates = builtins.iter(values.items())
        } else {
            updates = builtins.iter(values)
        }
        var i = 0
        var self = this
        iter_for_each(updates, function(val) {
            var pieces = new types.PyTuple(val)
            if (pieces.length !== 2) {
                throw new ValueError('dictionary update sequence element #' + i + ' has length ' + pieces.length + '; 2 is required')
            }
            var key = pieces[0]
            var value = pieces[1]
            // we can partially process
            self.__setitem__(key, value)
            i++
        })
    }

    copy() {
        return new Dict(this)
    }

    items() {
        var result = new types.PyList()
        for (var i = 0; i < this.data_keys.length; i++) {
            // ignore deleted or empty
            var key = this.data_keys[i]
            if (this.isEmpty(key) || this.isDeleted(key)) {
                continue
            }
            result.append(new types.PyTuple([key, this.data_values[i]]))
        }
        return result
    }

    keys() {
        var result = new types.PyList()
        for (var i = 0; i < this.data_keys.length; i++) {
            // ignore deleted or empty
            var key = this.data_keys[i]
            if (this.isEmpty(key) || this.isDeleted(key)) {
                continue
            }
            result.append(key)
        }
        return result
    }

    __iter__() {
        return builtins.iter(this.keys())
    }

    values() {
        var result = new types.PyList()
        for (var i = 0; i < this.data_keys.length; i++) {
            // ignore deleted or empty
            var key = this.data_keys[i]
            if (this.isEmpty(key) || this.isDeleted(key)) {
                continue
            }
            result.append(this.data_values[i])
        }
        return result
    }

    clear() {
        this.size = 0
        this.mask = 0
        this.data_keys = []
        this.data_values = []
    }

    pop(key, def) {
        if (arguments.length < 1) {
            throw new TypeError(
                'pop expected at least 1 arguments, got 0'
            )
        } else if (arguments.length > 2) {
            throw new TypeError(
                'pop expected at most 2 arguments, got ' + arguments.length
            )
        }

        var i = this._find_index(key)
        if (i === null) {
            if (def === undefined) {
                throw new KeyError(key)
            }
            return def
        }

        var val = this.data_values[i]
        deleteAt(this, i)
        return val
    }

    popitem() {
        if (arguments.length > 0) {
            throw new TypeError(
                'popitem() takes no arguments (' + arguments.length + ' given)'
            )
        }
        if (this.size < 1) {
            throw new KeyError(
                'popitem(): dictionary is empty'
            )
        }

        for (var i = 0; i < this.data_keys.length; i++) {
            // ignore deleted or empty
            var key = this.data_keys[i]
            if (!this.isEmpty(key) && !this.isDeleted(key)) {
                var val = this.data_values[i]
                deleteAt(this, i)
                return new types.PyTuple([key, val])
            }
        }

        // just in case
        throw new KeyError(
            'popitem(): dictionary is empty'
        )
    }

    setdefault(key, def) {
        if (arguments.length < 1) {
            throw new TypeError(
                'setdefault expected at least 1 arguments, got 0'
            )
        } else if (arguments.length > 2) {
            throw new TypeError(
                'setdefault expected at most 2 arguments, got ' + arguments.length
            )
        }

        if (def === undefined) {
            def = PyNone
        }
        var i = this._find_index(key)
        if (i === null) {
            this.__setitem__(key, def)
            return def
        } else {
            return this.data_values[i]
        }
    }

    fromkeys(iterable, value) {
        if (arguments.length < 1) {
            throw new TypeError(
                'fromkeys expected at least 1 arguments, got 0'
            )
        } else if (arguments.length > 2) {
            throw new TypeError(
                'fromkeys expected at most 2 arguments, got ' + arguments.length
            )
        }
        if (value === undefined) {
            value = PyNone
        }

        var d = new Dict()
        iter_for_each(builtins.iter(iterable), function(key) {
            d.__setitem__(key, value)
        })
        return d
    }
}
create_pyclass(PyDict, 'dict')
