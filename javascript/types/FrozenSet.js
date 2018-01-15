import { iter_for_each } from '../core/callables'
import { IndexError, TypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'
import * as version from '../core/version'

import * as builtins from '../builtins'
import * as types from '../types'

import PySetIterator from './SetIterator'

/*************************************************************************
 * A Python FrozenSet type, with an underlying Dict.
 *************************************************************************/

export default class PyFrozenSet extends PyObject {
    constructor(args, kwargs) {
        super()

        this.data = new types.PyDict()
        if (args) {
            this._update(args)
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
        return this.data.size
    }

    __bool__() {
        return this.data.__bool__()
    }

    __iter__() {
        return new PySetIterator(this)
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        var keys = this.data.keys()
        if (keys.length === 0) {
            return 'frozenset()'
        }
        return 'frozenset({' +
            keys.map(function(x) { return x.__repr__() }).join(', ') +
            '})'
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (types.isinstance(other, [types.PySet, types.PyFrozenSet])) {
            return new types.PyBool(this.data.keys().length < other.data.keys().length)
        }

        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: frozenset() < ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'<' not supported between instances of 'frozenset' and '" + type_name(other) + "'"
            )
        }
    }

    __le__(other) {
        if (types.isinstance(other, [types.PySet, types.PyFrozenSet])) {
            return new types.PyBool(this.data.keys().length <= other.data.keys().length)
        }
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: frozenset() <= ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'<=' not supported between instances of 'frozenset' and '" + type_name(other) + "'"
            )
        }
    }

    __eq__(other) {
        if (!types.isinstance(other, [types.PyFrozenSet, types.PySet])) {
            return new types.PyBool(false)
        }
        if (this.data.keys().length !== other.data.keys().length) {
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
            return new types.PyBool(this.data.keys().length > other.data.keys().length)
        }
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: frozenset() > ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'>' not supported between instances of 'frozenset' and '" + type_name(other) + "'"
            )
        }
    }

    __ge__(other) {
        if (types.isinstance(other, [types.PySet, types.PyFrozenSet])) {
            return new types.PyBool(this.data.keys().length >= other.data.keys().length)
        }
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: frozenset() >= ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'>=' not supported between instances of 'frozenset' and '" + type_name(other) + "'"
            )
        }
    }

    __contains__(other) {
        return this.data.__contains__(other)
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __not__() {
        return this.__bool__().__not__()
    }

    __pos__() {
        throw new TypeError("bad operand type for unary +: 'frozenset'")
    }

    __neg__() {
        throw new TypeError("bad operand type for unary -: 'frozenset'")
    }

    __invert__() {
        throw new TypeError("bad operand type for unary ~: 'frozenset'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'frozenset' and '" + type_name(other) + "'")
    }

    __div__(other) {
        throw new TypeError("unsupported operand type(s) for /: 'frozenset' and '" + type_name(other) + "'")
    }

    __floordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't take floor of complex number.")
        } else {
            throw new TypeError("unsupported operand type(s) for //: 'frozenset' and '" + type_name(other) + "'")
        }
    }

    __truediv__(other) {
        throw new TypeError("unsupported operand type(s) for /: 'frozenset' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [
            types.PyBytearray, types.PyBytes, types.PyList,
            types.PyStr, types.PyTuple
        ])) {
            throw new TypeError("can't multiply sequence by non-int of type 'frozenset'")
        } else {
            throw new TypeError("unsupported operand type(s) for *: 'frozenset' and '" + type_name(other) + "'")
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't mod complex numbers.")
        } else {
            throw new TypeError("unsupported operand type(s) for %: 'frozenset' and '" + type_name(other) + "'")
        }
    }

    __add__(other) {
        throw new TypeError("unsupported operand type(s) for +: 'frozenset' and '" + type_name(other) + "'")
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
            return new FrozenSet(both)
        }
        throw new TypeError("unsupported operand type(s) for -: 'frozenset' and '" + type_name(other) + "'")
    }

    __getitem__(other) {
        if (types.isinstance(other, [types.PyBool])) {
            throw new TypeError("'frozenset' object does not support indexing")
        } else if (types.isinstance(other, [types.PyInt])) {
            if (other.val.gt(types.PyInt.prototype.MAX_INT.val) || other.val.lt(types.PyInt.prototype.MIN_INT.val)) {
                throw new IndexError("cannot fit 'int' into an index-sized integer")
            } else {
                throw new TypeError("'frozenset' object does not support indexing")
            }
        }
        throw new TypeError("'frozenset' object is not subscriptable")
    }

    __lshift__(other) {
        throw new TypeError("unsupported operand type(s) for <<: 'frozenset' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw new TypeError("unsupported operand type(s) for >>: 'frozenset' and '" + type_name(other) + "'")
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
            return new FrozenSet(both)
        }
        throw new TypeError("unsupported operand type(s) for &: 'frozenset' and '" + type_name(other) + "'")
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
            return new FrozenSet(both)
        }
        throw new TypeError("unsupported operand type(s) for ^: 'frozenset' and '" + type_name(other) + "'")
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
            return new FrozenSet(both)
        }
        throw new TypeError("unsupported operand type(s) for |: 'frozenset' and '" + type_name(other) + "'")
    }

    /**************************************************
     * Methods
     **************************************************/

    _update(args) {
        var new_args = types.js2py(args)
        if (types.isinstance(new_args, [types.PyFrozenSet, types.PyList, types.PySet, types.PyStr, types.PyTuple])) {
            var iterobj = builtins.iter(new_args)
            var self = this
            iter_for_each(iterobj, function(val) {
                self.data.__setitem__(val, val)
            })
        } else {
            throw new TypeError("'" + type_name(new_args) + "' object is not iterable")
        }
    }
}
create_pyclass(PyFrozenSet, 'frozenset')
