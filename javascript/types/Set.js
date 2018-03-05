/* eslint-disable no-extend-native */
import { iter_for_each, pyargs } from '../core/callables'
import { PyIndexError, PyNotImplementedError, PyStopIteration, PyTypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'
import * as version from '../core/version'

import * as builtins from '../builtins'
import * as types from '../types'

/**************************************************
 * Set Iterator
 **************************************************/

class PySetIterator extends PyObject {
    constructor(data) {
        super()
        this.index = 0
        this.keys = []
        for (let i = 0; i < data.$data_keys.length; i++) {
            let key = data.$data_keys[i]
            // ignore deleted or empty
            if (data.$isEmpty(key) || data.$isDeleted(key)) {
                continue
            }
            this.keys.push(key)
        }
    }

    __iter__() {
        return this
    }

    __next__() {
        var key = this.keys[this.index]
        if (key === undefined) {
            throw new PyStopIteration()
        }
        this.index++
        return key
    }

    __str__() {
        return '<set_iterator object at 0x99999999>'
    }
}
create_pyclass(PySetIterator, 'set_iterator')

/*************************************************************************
 * A Python Set type
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

export default class PySet extends PyObject {
    @pyargs({
        default_args: ['iterable']
    })
    __init__(iterable) {
        this.$data_keys = []
        this.$size = 0
        this.$mask = 0

        if (iterable !== undefined) {
            this.update(iterable)
        }
    }

    $increase_size() {
        // increase the table size and rehash
        if (this.$data_keys.length === 0) {
            this.$mask = INITIAL_SIZE - 1
            this.$data_keys = new Array(INITIAL_SIZE)

            for (let i = 0; i < INITIAL_SIZE; i++) {
                this.$data_keys[i] = EMPTY
            }
            return
        }

        let new_keys = new Array(this.$data_keys.length * 2)
        let new_mask = this.$data_keys.length * 2 - 1 // assumes power of two
        for (let i = 0; i < new_keys.length; i++) {
            new_keys[i] = EMPTY
        }

        for (let i = 0; i < this.$data_keys.length; i++) {
            let key = this.$data_keys[i]
            if (this.$isEmpty(key) || this.$isDeleted(key)) {
                continue
            }

            var hash = builtins.hash(key).int32()
            var h = hash & new_mask
            while (!this.$isEmpty(new_keys[h])) {
                h = (h + 1) & new_mask
            }
            new_keys[h] = key
        }
        this.$data_keys = new_keys
        this.$mask = new_mask
    }

    $deleteAt(index) {
        this.$data_keys[index] = DELETED
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

    /**************************************************
     * Type conversions
     **************************************************/

    __len__() {
        return this.$size
    }

    __bool__() {
        return this.$size > 0
    }

    __iter__() {
        return new PySetIterator(this)
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        let result
        if (this.$size === 0) {
            result = 'set()'
        } else {
            result = '{'
            let strings = []
            for (let i = 0; i < this.$data_keys.length; i++) {
                let key = this.$data_keys[i]
                // ignore deleted or empty
                if (this.$isEmpty(key) || this.$isDeleted(key)) {
                    continue
                }
                strings.push(builtins.repr(key))
            }
            result += strings.join(', ')
            result += '}'
        }
        return result
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (types.isinstance(other, [types.PySet, types.PyFrozenSet])) {
            return new types.PyBool(this.$size < other.$size)
        }
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: ' + this.__class__.__name__ + '() < ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'<' not supported between instances of '" + this.__class__.__name__ + "' and '" + type_name(other) + "'"
            )
        }
    }

    __le__(other) {
        if (types.isinstance(other, [types.PySet, types.PyFrozenSet])) {
            return new types.PyBool(this.$size <= other.$size)
        }
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: ' + this.__class__.__name__ + '() <= ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'<=' not supported between instances of '" + this.__class__.__name__ + "' and '" + type_name(other) + "'"
            )
        }
    }

    __eq__(other) {
        if (!types.isinstance(other, [types.PyFrozenSet, types.PySet])) {
            return new types.PyBool(false)
        }
        if (this.$size !== other.$size) {
            return new types.PyBool(false)
        }
        var iterobj = builtins.iter(this)
        var equal = true
        iter_for_each(iterobj, function(val) {
            equal = equal && other.__contains__(val).valueOf()
        })

        return new types.PyBool(equal)
    }

    __ne__(other) {
        return this.__eq__(other).__not__()
    }

    __gt__(other) {
        if (types.isinstance(other, [types.PySet, types.PyFrozenSet])) {
            return new types.PyBool(this.$size > other.$size)
        }
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: ' + this.__class__.__name__ + '() > ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'>' not supported between instances of '" + this.__class__.__name__ + "' and '" + type_name(other) + "'"
            )
        }
    }

    __ge__(other) {
        if (types.isinstance(other, [types.PySet, types.PyFrozenSet])) {
            return new types.PyBool(this.$size >= other.$size)
        }
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: ' + this.__class__.__name__ + '() >= ' + type_name(other) + '()'
            )
        } else {
            throw new PyTypeError(
                "'>=' not supported between instances of '" + this.__class__.__name__ + "' and '" + type_name(other) + "'"
            )
        }
    }

    __contains__(value) {
        return new types.PyBool(this.$find_index(value) !== null)
    }

    /**************************************************
     * Unary operators
     **************************************************/
    __pos__() {
        throw new PyTypeError("bad operand type for unary +: '" + this.__class__.__name__ + "'")
    }

    __neg__() {
        throw new PyTypeError("bad operand type for unary -: '" + this.__class__.__name__ + "'")
    }

    __not__() {
        return this.__bool__().__not__()
    }

    __invert__() {
        throw new PyTypeError("bad operand type for unary ~: '" + this.__class__.__name__ + "'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new PyTypeError("unsupported operand type(s) for ** or pow(): '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __div__(other) {
        throw new PyTypeError("unsupported operand type(s) for /: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __floordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new PyTypeError("can't take floor of complex number.")
        } else {
            throw new PyTypeError("unsupported operand type(s) for //: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __truediv__(other) {
        throw new PyTypeError("unsupported operand type(s) for /: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [
            types.PyBytearray, types.PyBytes, types.PyList,
            types.PyStr, types.PyTuple
        ])) {
            throw new PyTypeError("can't multiply sequence by non-int of type '" + this.__class__.__name__ + "'")
        } else {
            throw new PyTypeError("unsupported operand type(s) for *: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new PyTypeError("can't mod complex numbers.")
        } else {
            throw new PyTypeError("unsupported operand type(s) for %: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __add__(other) {
        throw new PyTypeError("unsupported operand type(s) for +: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __sub__(other) {
        if (types.isinstance(other, [types.PyFrozenSet, types.PySet])) {
            var both = []
            var iterobj1 = builtins.iter(this)
            iter_for_each(iterobj1, function(val) {
                if (!(other.__contains__(val).valueOf())) {
                    both.push(val)
                }
            })
            return new PySet(both)
        }
        throw new PyTypeError("unsupported operand type(s) for -: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __getitem__(other) {
        if (types.isinstance(other, [types.PyBool])) {
            throw new PyTypeError("'" + this.__class__.__name__ + "' object does not support indexing")
        } else if (types.isinstance(other, [types.PyInt])) {
            if (other.val.gt(types.PyInt.MAX_INT.val) || other.val.lt(types.PyInt.MIN_INT.val)) {
                throw new PyIndexError("cannot fit 'int' into an index-sized integer")
            } else {
                throw new PyTypeError("'" + this.__class__.__name__ + "' object does not support indexing")
            }
        }
        throw new PyTypeError("'" + this.__class__.__name__ + "' object is not subscriptable")
    }

    __lshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for <<: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for >>: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __and__(other) {
        if (types.isinstance(other, [types.PyFrozenSet, types.PySet])) {
            var both = []
            var iterobj = builtins.iter(this)
            iter_for_each(iterobj, function(val) {
                if (other.__contains__(val).valueOf()) {
                    both.push(val)
                }
            })
            return new PySet(both)
        }
        throw new PyTypeError("unsupported operand type(s) for &: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __xor__(other) {
        if (types.isinstance(other, [types.PyFrozenSet, types.PySet])) {
            var both = []
            var iterobj1 = builtins.iter(this)
            iter_for_each(iterobj1, function(val) {
                if (!(other.__contains__(val).valueOf())) {
                    both.push(val)
                }
            })
            var iterobj2 = builtins.iter(other)
            iter_for_each(iterobj2, function(val) {
                if (!(this.__contains__(val).valueOf())) {
                    both.push(val)
                }
            }.bind(this))
            return new PySet(both)
        }
        throw new PyTypeError("unsupported operand type(s) for ^: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __or__(other) {
        if (types.isinstance(other, [types.PyFrozenSet, types.PySet])) {
            var both = []
            var iterobj1 = builtins.iter(this)
            iter_for_each(iterobj1, function(val) {
                both.push(val)
            })
            var iterobj2 = builtins.iter(other)
            iter_for_each(iterobj2, function(val) {
                both.push(val)
            })
            return new PySet(both)
        }
        throw new PyTypeError("unsupported operand type(s) for |: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new PyTypeError("can't take floor of complex number.")
        } else {
            throw new PyTypeError("unsupported operand type(s) for //=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __itruediv__(other) {
        throw new PyTypeError("unsupported operand type(s) for /=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __iadd__(other) {
        throw new PyTypeError("unsupported operand type(s) for +=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __isub__(other) {
        if (types.isinstance(other, [types.PyFrozenSet, types.PySet])) {
            var both = []
            var iterobj1 = builtins.iter(this)
            iter_for_each(iterobj1, function(val) {
                if (!(other.__contains__(val).valueOf())) {
                    both.push(val)
                }
            })
            this.update(both)
            return new PySet(both)
        }
        throw new PyTypeError("unsupported operand type(s) for -=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __imul__(other) {
        throw new PyTypeError("unsupported operand type(s) for *=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __imod__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new PyTypeError("can't mod complex numbers.")
        } else {
            throw new PyTypeError("unsupported operand type(s) for %=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
        }
    }

    __ipow__(other) {
        throw new PyTypeError("unsupported operand type(s) for ** or pow(): '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __ilshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for <<=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __irshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for >>=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __iand__(other) {
        if (types.isinstance(other, [types.PyFrozenSet, types.PySet])) {
            var intersection = new PySet()
            var iterobj = builtins.iter(this)
            iter_for_each(iterobj, function(val) {
                if (other.__contains__(val).valueOf()) {
                    intersection.add(val)
                }
            })
            return intersection
        }
        throw new PyTypeError("unsupported operand type(s) for &=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        if (types.isinstance(other, [types.PyFrozenSet, types.PySet])) {
            var both = []
            var iterobj1 = builtins.iter(this)
            iter_for_each(iterobj1, function(val) {
                if (!(other.__contains__(val).valueOf())) {
                    both.push(val)
                }
            })
            var iterobj2 = builtins.iter(other)
            iter_for_each(iterobj2, function(val) {
                if (!(this.__contains__(val).valueOf())) {
                    both.push(val)
                }
            }.bind(this))
            this.update(both)
            return new PySet(both)
        }
        throw new PyTypeError("unsupported operand type(s) for ^=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    __ior__(other) {
        if (types.isinstance(other, [types.PyFrozenSet, types.PySet])) {
            var both = []
            var iterobj1 = builtins.iter(this)
            iter_for_each(iterobj1, function(val) {
                both.push(val)
            })
            var iterobj2 = builtins.iter(other)
            iter_for_each(iterobj2, function(val) {
                both.push(val)
            })
            this.update(both)
            return new PySet(both)
        }
        throw new PyTypeError("unsupported operand type(s) for |=: '" + this.__class__.__name__ + "' and '" + type_name(other) + "'")
    }

    /**************************************************
     * Methods
     **************************************************/

    add(val) {
        if (this.$size + 1 > this.$data_keys.length * MAX_LOAD_FACTOR) {
            this.$increase_size()
        }
        var hash = builtins.hash(val).int32()
        var h = hash & this.$mask

        while (true) {
            var current_key = this.$data_keys[h]
            if (this.$isEmpty(current_key) || this.$isDeleted(current_key)) {
                this.$data_keys[h] = val
                this.$size++
                return
            } else if (current_key === null && val === null) {
                this.$data_keys[h] = val
                return
            } else if (builtins.hash(current_key).int32() === hash &&
                       current_key.__eq__(val).valueOf()) {
                this.$data_keys[h] = val
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

    clear() {
        throw new PyNotImplementedError()
    }

    copy() {
        return new PySet(this)
    }

    difference() {
        throw new PyNotImplementedError()
    }

    difference_update() {
        throw new PyNotImplementedError()
    }

    discard() {
        throw new PyNotImplementedError()
    }

    intersection() {
        throw new PyNotImplementedError()
    }

    intersection_update() {
        throw new PyNotImplementedError()
    }

    isdisjoint() {
        throw new PyNotImplementedError()
    }

    issubset() {
        throw new PyNotImplementedError()
    }

    issuperset() {
        throw new PyNotImplementedError()
    }

    pop() {
        throw new PyNotImplementedError()
    }

    remove(v) {
        this.data.__delitem__(v)
    }

    symmetric_difference() {
        throw new PyNotImplementedError()
    }

    symmetric_difference_update() {
        throw new PyNotImplementedError()
    }

    union() {
        throw new PyNotImplementedError()
    }

    update(args) {
        var new_args = types.js2py(args)
        var iterobj = builtins.iter(new_args)
        var self = this
        iter_for_each(iterobj, function(val) {
            self.add(val)
        })
    }
}
PySet.prototype.__doc__ = `set() -> new empty set object
set(iterable) -> new set object

Build an unordered collection of unique elements.`
create_pyclass(PySet, 'set')
