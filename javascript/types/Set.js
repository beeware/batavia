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

export default class Set extends PyObject {
    constructor(args, kwargs) {
        super()

        this.data = new types.Dict()
        if (args) {
            this.update(args)
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
        return new types.SetIterator(this)
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        var keys = this.data.keys()
        if (keys.length === 0) {
            return 'set()'
        }
        return '{' + keys.map(function(x) { return x.__repr__() }).join(', ') + '}'
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
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

    __le__(other) {
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

    __eq__(other) {
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

    __ne__(other) {
        return this.__eq__(other).__not__()
    }

    __gt__(other) {
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

    __ge__(other) {
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

    __contains__(other) {
        return this.data.__contains__(other)
    }

    /**************************************************
     * Unary operators
     **************************************************/
    __pos__() {
        throw new TypeError.$pyclass("bad operand type for unary +: 'set'")
    }

    __neg__() {
        throw new TypeError.$pyclass("bad operand type for unary -: 'set'")
    }

    __not__() {
        return this.__bool__().__not__()
    }

    __invert__() {
        throw new TypeError.$pyclass("bad operand type for unary ~: 'set'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'set' and '" + type_name(other) + "'")
    }

    __div__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for /: 'set' and '" + type_name(other) + "'")
    }

    __floordiv__(other) {
        if (types.isinstance(other, types.Complex)) {
            throw new TypeError.$pyclass("can't take floor of complex number.")
        } else {
            throw new TypeError.$pyclass("unsupported operand type(s) for //: 'set' and '" + type_name(other) + "'")
        }
    }

    __truediv__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for /: 'set' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [
            types.Bytearray, types.Bytes, types.List,
            types.Str, types.Tuple
        ])) {
            throw new TypeError.$pyclass("can't multiply sequence by non-int of type 'set'")
        } else {
            throw new TypeError.$pyclass("unsupported operand type(s) for *: 'set' and '" + type_name(other) + "'")
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.Complex)) {
            throw new TypeError.$pyclass("can't mod complex numbers.")
        } else {
            throw new TypeError.$pyclass("unsupported operand type(s) for %: 'set' and '" + type_name(other) + "'")
        }
    }

    __add__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for +: 'set' and '" + type_name(other) + "'")
    }

    __sub__(other) {
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

    __getitem__(other) {
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

    __lshift__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for <<: 'set' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for >>: 'set' and '" + type_name(other) + "'")
    }

    __and__(other) {
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

    __xor__(other) {
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

    __or__(other) {
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

    __ifloordiv__(other) {
        if (types.isinstance(other, types.Complex)) {
            throw new TypeError.$pyclass("can't take floor of complex number.")
        } else {
            throw new TypeError.$pyclass("unsupported operand type(s) for //=: 'set' and '" + type_name(other) + "'")
        }
    }

    __itruediv__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for /=: 'set' and '" + type_name(other) + "'")
    }

    __iadd__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for +=: 'set' and '" + type_name(other) + "'")
    }

    __isub__(other) {
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

    __imul__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for *=: 'set' and '" + type_name(other) + "'")
    }

    __imod__(other) {
        if (types.isinstance(other, types.Complex)) {
            throw new TypeError.$pyclass("can't mod complex numbers.")
        } else {
            throw new TypeError.$pyclass("unsupported operand type(s) for %=: 'set' and '" + type_name(other) + "'")
        }
    }

    __ipow__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for ** or pow(): 'set' and '" + type_name(other) + "'")
    }

    __ilshift__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for <<=: 'set' and '" + type_name(other) + "'")
    }

    __irshift__(other) {
        throw new TypeError.$pyclass("unsupported operand type(s) for >>=: 'set' and '" + type_name(other) + "'")
    }

    __iand__(other) {
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

    __ixor__(other) {
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

    __ior__(other) {
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

    add(v) {
        this.data.__setitem__(v, v)
    }

    copy() {
        return new Set(this)
    }

    remove(v) {
        this.data.__delitem__(v)
    }

    update(args) {
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
}
create_pyclass(Set, 'set')

