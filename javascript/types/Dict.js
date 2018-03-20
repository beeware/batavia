import { iter_for_each, pyargs } from '../core/callables'
import { pyKeyError, pyTypeError, pyValueError } from '../core/exceptions'
import JSDict from '../core/JSDict'
import { jstype, type_name, PyObject, pyNone } from '../core/types'
import * as version from '../core/version'

import * as builtins from '../builtins'
import * as types from '../types'

/*************************************************************************
 * A Python dictview type
 *************************************************************************/

// class DictView extends PyObject {
//     __init__() {
//     }
// }
// const dictview = jstype(DictView, 'dictview')

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
        return types.pyint(0)
    },
    __eq__: function(other) {
        return types.pybool(this === other)
    }
}

var DELETED = {
    __hash__: function() {
        return types.pyint(0)
    },
    __eq__: function(other) {
        return types.pybool(this === other)
    }
}

class PyDict extends PyObject {
    @pyargs({
        default_args: ['iterable'],
        kwargs: ['kwargs']
    })
    __init__(iterable, kwargs) {
        this.$data_keys = []
        this.$data_values = []
        this.$size = 0
        this.$mask = 0

        if (iterable !== undefined) {
            // Passing a dictionary as argument
            if (types.isinstance(iterable, types.pydict)) {
                this.update(iterable)
            } else {
                // we have an iterable (iter is not undefined) that's not a string(nor a Bytes/Bytearray)
                // build a JS array of numbers while validating inputs are all int
                let self = this
                let i = 0
                let iter = builtins.iter(iterable)
                iter_for_each(iter, function(val) {
                    // single number or bool in an iterable throws different error
                    let len
                    try {
                        len = builtins.len(val).int32()
                    } catch (e) {
                        throw pyTypeError('cannot convert dictionary update sequence element #' + i + ' to a sequence')
                    }

                    if (len === 2) {
                        self.__setitem__(val[0], val[1])
                    } else {
                        throw pyValueError('dictionary update sequence element #' + i + ' has length ' + builtins.len(val) + '; 2 is required')
                    }

                    i += 1
                })
            }
        }

        if (kwargs) {
            for (let key in kwargs) {
                this.__setitem__(key, kwargs[key])
            }
        }
    }

    $increase_size() {
        // increase the table size and rehash
        if (this.$data_keys.length === 0) {
            this.$mask = INITIAL_SIZE - 1
            this.$data_keys = new Array(INITIAL_SIZE)
            this.$data_values = new Array(INITIAL_SIZE)

            for (let i = 0; i < INITIAL_SIZE; i++) {
                this.$data_keys[i] = EMPTY
            }
            return
        }

        let new_keys = new Array(this.$data_keys.length * 2)
        let new_values = new Array(this.$data_keys.length * 2)
        let new_mask = this.$data_keys.length * 2 - 1 // assumes power of two
        for (let i = 0; i < new_keys.length; i++) {
            new_keys[i] = EMPTY
        }
        for (let i = 0; i < this.$data_keys.length; i++) {
            let key = this.$data_keys[i]
            let hash = builtins.hash(key).int32()
            let h = hash & new_mask
            while (!this.$isEmpty(new_keys[h])) {
                h = (h + 1) & new_mask
            }
            new_keys[h] = key
            new_values[h] = this.$data_values[i]
        }
        this.$data_keys = new_keys
        this.$data_values = new_values
        this.$mask = new_mask
    }

    $deleteAt(index) {
        this.$data_keys[index] = DELETED
        this.$data_values[index] = null
        this.$size--
    }

    $isDeleted(x) {
        return x !== null &&
            builtins.hash(x).int32() === 0 &&
            x.__eq__(DELETED).valueOf()
    }

    $isEmpty(x) {
        return x !== null &&
            builtins.hash(x).int32() === 0 &&
            x.__eq__(EMPTY).valueOf()
    }

    $find_index(other) {
        if (this.$size === 0) {
            return null
        }
        var hash = builtins.hash(other).int32()
        var h = hash & this.$mask
        while (true) {
            var key = this.$data_keys[h]
            if (this.$isDeleted(key)) {
                h = (h + 1) & this.$mask
                continue
            }
            if (this.$isEmpty(key)) {
                return null
            }
            if (key === null && other === null) {
                return h
            }
            if (builtins.hash(key).int32() === hash &&
                ((key === null && other === null) || key.__eq__(other).valueOf())) {
                return h
            }
            h = (h + 1) & this.$mask

            if (h === (hash & this.$mask)) {
                // we have looped, definitely not here
                return null
            }
        }
    }

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    toString() {
        return this.__str__()
    }

    valueOf() {
        let result = {}
        for (let i = 0; i < this.$data_keys.length; i++) {
            let key = this.$data_keys[i]
            // ignore deleted or empty
            if (this.$isEmpty(key) || this.$isDeleted(key)) {
                continue
            }
            result[key] =  this.$data_values[i]
        }
        return result
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __len__() {
        return types.pyint(this.$size)
    }

    __bool__() {
        return this.$size > 0
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        let result = '{'
        let strings = []
        for (let i = 0; i < this.$data_keys.length; i++) {
            let key = this.$data_keys[i]
            // ignore deleted or empty
            if (this.$isEmpty(key) || this.$isDeleted(key)) {
                continue
            }
            strings.push(builtins.repr(key) + ': ' + builtins.repr(this.$data_values[i]))
        }
        result += strings.join(', ')
        result += '}'
        return result
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (other !== pyNone) {
            if (types.isbataviainstance(other)) {
                if (version.earlier('3.6')) {
                    throw pyTypeError(
                        'unorderable types: dict() < ' + type_name(other) + '()'
                    )
                } else {
                    throw pyTypeError(
                        "'<' not supported between instances of 'dict' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() < other.valueOf()
            }
        }
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: dict() < pyNoneType()'
            )
        } else {
            throw pyTypeError(
                "'<' not supported between instances of 'dict' and 'pyNoneType'"
            )
        }
    }

    __le__(other) {
        if (other !== pyNone) {
            if (types.isbataviainstance(other)) {
                if (version.earlier('3.6')) {
                    throw pyTypeError(
                        'unorderable types: dict() <= ' + type_name(other) + '()'
                    )
                } else {
                    throw pyTypeError(
                        "'<=' not supported between instances of 'dict' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() <= other.valueOf()
            }
        }
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: dict() <= pyNoneType()'
            )
        } else {
            throw pyTypeError(
                "'<=' not supported between instances of 'dict' and 'pyNoneType'"
            )
        }
    }

    __eq__(other) {
        if (!types.isinstance(other, [types.pydict])) {
            return types.pybool(false)
        }
        if (this.$data_keys.length !== other.$data_keys.length) {
            return types.pybool(false)
        }

        for (var i = 0; i < this.$data_keys.length; i++) {
            var key = this.$data_keys[i]
            if (this.$isEmpty(key) || this.$isDeleted(key)) {
                continue
            }
            if (!other.__contains__(key).valueOf()) {
                return types.pybool(false)
            }
            var this_value = this.__getitem__(key)
            var other_value = other.__getitem__(key)
            if (!this_value.__eq__(other_value)) {
                return types.pybool(false)
            }
        }

        return types.pybool(true)
    }

    __ne__(other) {
        return this.__eq__(other).__not__()
    }

    __gt__(other) {
        if (other !== pyNone) {
            if (types.isbataviainstance(other)) {
                if (version.earlier('3.6')) {
                    throw pyTypeError(
                        'unorderable types: dict() > ' + type_name(other) + '()'
                    )
                } else {
                    throw pyTypeError(
                        "'>' not supported between instances of 'dict' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() > other.valueOf()
            }
        } else {
            if (version.earlier('3.6')) {
                throw pyTypeError(
                    'unorderable types: dict() > pyNoneType()'
                )
            } else {
                throw pyTypeError(
                    "'>' not supported between instances of 'dict' and 'pyNoneType'"
                )
            }
        }
    }

    __ge__(other) {
        if (other !== pyNone) {
            if (types.isbataviainstance(other)) {
                if (version.earlier('3.6')) {
                    throw pyTypeError(
                        'unorderable types: dict() >= ' + type_name(other) + '()'
                    )
                } else {
                    throw pyTypeError(
                        "'>=' not supported between instances of 'dict' and '" +
                        type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() >= other.valueOf()
            }
        } else {
            if (version.earlier('3.6')) {
                throw pyTypeError(
                    'unorderable types: dict() >= pyNoneType()'
                )
            } else {
                throw pyTypeError(
                    "'>=' not supported between instances of 'dict' and 'pyNoneType'"
                )
            }
        }
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        throw pyTypeError("bad operand type for unary +: 'dict'")
    }

    __neg__() {
        throw pyTypeError("bad operand type for unary -: 'dict'")
    }

    __not__() {
        return this.__bool__().__not__()
    }

    __invert__() {
        throw pyTypeError("bad operand type for unary ~: 'dict'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw pyTypeError("unsupported operand type(s) for ** or pow(): 'dict' and '" + type_name(other) + "'")
    }

    __div__(other) {
        return this.__truediv__(other)
    }

    __floordiv__(other) {
        if (types.isinstance(other, [types.pycomplex])) {
            throw pyTypeError("can't take floor of complex number.")
        }

        throw pyTypeError("unsupported operand type(s) for //: 'dict' and '" + type_name(other) + "'")
    }

    __truediv__(other) {
        throw pyTypeError("unsupported operand type(s) for /: 'dict' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [
            types.pybool, types.pydict, types.pyfloat,
            types.pyint, types.pyNoneType,
            types.pyslice, types.pyset, types.pyfrozenset,
            types.pyNotImplementedType, types.pycomplex, types.pyrange,
            types.pytype])) {
            throw pyTypeError("unsupported operand type(s) for *: 'dict' and '" + type_name(other) + "'")
        } else {
            throw pyTypeError("can't multiply sequence by non-int of type 'dict'")
        }
    }

    __mod__(other) {
        if (types.isinstance(other, [types.pycomplex])) {
            throw pyTypeError("can't mod complex numbers.")
        }
        throw pyTypeError("unsupported operand type(s) for %: 'dict' and '" + type_name(other) + "'")
    }

    __add__(other) {
        throw pyTypeError("unsupported operand type(s) for +: 'dict' and '" + type_name(other) + "'")
    }

    __sub__(other) {
        throw pyTypeError("unsupported operand type(s) for -: 'dict' and '" + type_name(other) + "'")
    }

    __lshift__(other) {
        throw pyTypeError("unsupported operand type(s) for <<: 'dict' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw pyTypeError("unsupported operand type(s) for >>: 'dict' and '" + type_name(other) + "'")
    }

    __and__(other) {
        throw pyTypeError("unsupported operand type(s) for &: 'dict' and '" + type_name(other) + "'")
    }

    __xor__(other) {
        throw pyTypeError("unsupported operand type(s) for ^: 'dict' and '" + type_name(other) + "'")
    }

    __or__(other) {
        throw pyTypeError("unsupported operand type(s) for |: 'dict' and '" + type_name(other) + "'")
    }

    __setitem__(key, value) {
        if (this.$size + 1 > this.$data_keys.length * MAX_LOAD_FACTOR) {
            this.$increase_size()
        }
        let hash = builtins.hash(key).int32()
        let h = hash & this.$mask

        while (true) {
            var current_key = this.$data_keys[h]
            if (this.$isEmpty(current_key) || this.$isDeleted(current_key)) {
                this.$data_keys[h] = key
                this.$data_values[h] = value
                this.$size++
                return
            } else if (current_key === null && key === null) {
                this.$data_keys[h] = key
                this.$data_values[h] = value
                return
            } else if (builtins.hash(current_key).int32() === hash &&
                       current_key.__eq__(key).valueOf()) {
                this.$data_keys[h] = key
                this.$data_values[h] = value
                return
            }

            h = (h + 1) & this.$mask
            if (h === (hash & this.$mask)) {
                // we have looped, we'll rehash (should be impossible)
                this.$increase_size()
                h = hash & this.$mask
            }
        }
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__(other) {
        if (types.isinstance(other, [types.pycomplex])) {
            throw pyTypeError("can't take floor of complex number.")
        }

        throw pyTypeError("unsupported operand type(s) for //=: 'dict' and '" + type_name(other) + "'")
    }

    __itruediv__(other) {
        throw pyTypeError("unsupported operand type(s) for /=: 'dict' and '" + type_name(other) + "'")
    }

    __iadd__(other) {
        throw pyTypeError("unsupported operand type(s) for +=: 'dict' and '" + type_name(other) + "'")
    }

    __isub__(other) {
        throw pyTypeError("unsupported operand type(s) for -=: 'dict' and '" + type_name(other) + "'")
    }

    __imul__(other) {
        throw pyTypeError("unsupported operand type(s) for *=: 'dict' and '" + type_name(other) + "'")
    }

    __imod__(other) {
        if (types.isinstance(other, [types.pycomplex])) {
            throw pyTypeError("can't mod complex numbers.")
        }

        throw pyTypeError("unsupported operand type(s) for %=: 'dict' and '" + type_name(other) + "'")
    }

    __ipow__(other) {
        throw pyTypeError("unsupported operand type(s) for ** or pow(): 'dict' and '" + type_name(other) + "'")
    }

    __ilshift__(other) {
        throw pyTypeError("unsupported operand type(s) for <<=: 'dict' and '" + type_name(other) + "'")
    }

    __irshift__(other) {
        throw pyTypeError("unsupported operand type(s) for >>=: 'dict' and '" + type_name(other) + "'")
    }

    __iand__(other) {
        throw pyTypeError("unsupported operand type(s) for &=: 'dict' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        throw pyTypeError("unsupported operand type(s) for ^=: 'dict' and '" + type_name(other) + "'")
    }

    __ior__(other) {
        throw pyTypeError("unsupported operand type(s) for |=: 'dict' and '" + type_name(other) + "'")
    }

    __contains__(key) {
        return types.pybool(this.$find_index(key) !== null)
    }

    __getitem__(key) {
        if (!types.isinstance(key, [
            types.pystr, types.pyint, types.pybool,
            types.pyfloat, types.pyrange, types.pytuple,
            types.pyfrozenset, types.pyNoneType, types.pycomplex,
            types.pybytes])) {
            throw pyTypeError("unhashable type: '" + type_name(key) + "'")
        }

        var i = this.$find_index(key)

        if (i === null) {
            if (key === null) {
                throw pyKeyError('pyNone')
            } else {
                throw pyKeyError(key)
            }
        }
        return this.$data_values[i]
    }

    __delitem__(key) {
        var i = this.$find_index(key)
        if (i === null) {
            if (key === null) {
                throw pyKeyError('pyNone')
            } else {
                throw pyKeyError(key)
            }
        }
        this.$deleteAt(i)
    }

    /**************************************************
     * Methods
     **************************************************/

    get(key, backup) {
        var i = this.$find_index(key)
        if (i !== null) {
            return this.$data_values[i]
        } else if (backup === undefined) {
            return pyNone
        } else {
            return backup
        }
    }

    update(values) {
        var updates
        if (types.isinstance(values, [types.pydict, JSDict])) {
            updates = builtins.iter(values.items())
        } else {
            updates = builtins.iter(values)
        }
        var i = 0
        var self = this
        iter_for_each(updates, function(val) {
            var pieces = types.pytuple(val)
            if (pieces.length !== 2) {
                throw pyValueError('dictionary update sequence element #' + i + ' has length ' + pieces.length + '; 2 is required')
            }
            var key = pieces[0]
            var value = pieces[1]
            // we can partially process
            self.__setitem__(key, value)
            i++
        })
    }

    copy() {
        return pydict(this)
    }

    items() {
        let result = types.pylist()
        for (let i = 0; i < this.$data_keys.length; i++) {
            // ignore deleted or empty
            let key = this.$data_keys[i]
            if (this.$isEmpty(key) || this.$isDeleted(key)) {
                continue
            }
            result.append(types.pytuple([key, this.$data_values[i]]))
        }
        return result
    }

    keys() {
        var result = types.pylist()
        for (var i = 0; i < this.$data_keys.length; i++) {
            // ignore deleted or empty
            var key = this.$data_keys[i]
            if (this.$isEmpty(key) || this.$isDeleted(key)) {
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
        var result = types.pylist()
        for (var i = 0; i < this.$data_keys.length; i++) {
            // ignore deleted or empty
            var key = this.$data_keys[i]
            if (this.$isEmpty(key) || this.$isDeleted(key)) {
                continue
            }
            result.append(this.$data_values[i])
        }
        return result
    }

    clear() {
        this.$size = 0
        this.$mask = 0
        this.$data_keys = []
        this.$data_values = []
    }

    pop(key, def) {
        if (arguments.length < 1) {
            throw pyTypeError(
                'pop expected at least 1 arguments, got 0'
            )
        } else if (arguments.length > 2) {
            throw pyTypeError(
                'pop expected at most 2 arguments, got ' + arguments.length
            )
        }

        var i = this.$find_index(key)
        if (i === null) {
            if (def === undefined) {
                throw pyKeyError(key)
            }
            return def
        }

        var val = this.$data_values[i]
        this.$deleteAt(i)
        return val
    }

    popitem() {
        if (arguments.length > 0) {
            throw pyTypeError(
                'popitem() takes no arguments (' + arguments.length + ' given)'
            )
        }
        if (this.$size < 1) {
            throw pyKeyError(
                'popitem(): dictionary is empty'
            )
        }

        for (var i = 0; i < this.$data_keys.length; i++) {
            // ignore deleted or empty
            var key = this.$data_keys[i]
            if (!this.$isEmpty(key) && !this.$isDeleted(key)) {
                var val = this.$data_values[i]
                this.$deleteAt(i)
                return types.pytuple([key, val])
            }
        }

        // just in case
        throw pyKeyError(
            'popitem(): dictionary is empty'
        )
    }

    setdefault(key, def) {
        if (arguments.length < 1) {
            throw pyTypeError(
                'setdefault expected at least 1 arguments, got 0'
            )
        } else if (arguments.length > 2) {
            throw pyTypeError(
                'setdefault expected at most 2 arguments, got ' + arguments.length
            )
        }

        if (def === undefined) {
            def = pyNone
        }
        var i = this.$find_index(key)
        if (i === null) {
            this.__setitem__(key, def)
            return def
        } else {
            return this.$data_values[i]
        }
    }

    fromkeys(iterable, value) {
        if (arguments.length < 1) {
            throw pyTypeError(
                'fromkeys expected at least 1 arguments, got 0'
            )
        } else if (arguments.length > 2) {
            throw pyTypeError(
                'fromkeys expected at most 2 arguments, got ' + arguments.length
            )
        }
        if (value === undefined) {
            value = pyNone
        }

        var d = pydict()
        iter_for_each(builtins.iter(iterable), function(key) {
            d.__setitem__(key, value)
        })
        return d
    }
}
PyDict.prototype.__doc__ = `dict() -> new empty dictionary
dict(mapping) -> new dictionary initialized from a mapping object's
    (key, value) pairs
dict(iterable) -> new dictionary initialized as if via:
    d = {}
    for k, v in iterable:
        d[k] = v
dict(**kwargs) -> new dictionary initialized with the name=value pairs
    in the keyword argument list.  For example:  dict(one=1, two=2)`

const pydict = jstype(PyDict, 'dict', [], null)
export default pydict
