/* eslint-disable no-extend-native */
import { iter_for_each, pyargs } from '../core/callables'
import { PyTypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'

import * as builtins from '../builtins'

import PySet from './Set'

/*************************************************************************
 * A Python FrozenSet type
 *************************************************************************/

export default class PyFrozenSet extends PyObject {
    @pyargs({
        default_args: ['iterable']
    })
    __init__(iterable) {
        this.$data_keys = []
        this.$size = 0
        this.$mask = 0

        if (iterable !== undefined) {
            let iterobj = builtins.iter(iterable)
            let self = this
            iter_for_each(iterobj, function(val) {
                self.$add(val)
            })
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

    __str__() {
        let result
        if (this.$size === 0) {
            result = 'frozenset()'
        } else {
            result = 'frozenset({'
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
            result += '})'
        }
        return result
    }

    /**************************************************
     * Inplace operators
     **************************************************/
    __isub__(other) {
        throw new PyTypeError("unsupported operand type(s) for -=: 'frozenset' and '" + type_name(other) + "'")
    }

    __iand__(other) {
        throw new PyTypeError("unsupported operand type(s) for &=: 'frozenset' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        throw new PyTypeError("unsupported operand type(s) for ^=: 'frozenset' and '" + type_name(other) + "'")
    }

    __ior__(other) {
        throw new PyTypeError("unsupported operand type(s) for |=: 'frozenset' and '" + type_name(other) + "'")
    }
}

/**
 * The implmentation of FrozenSet is almost identical to Set,
 * so copy the methods over. We can't use inheritance because
 * integrating Python and Javascript inheritance at the same
 * time is a delicate balancing act...
 */

PyFrozenSet.prototype.$increase_size = PySet.prototype.$increase_size
PyFrozenSet.prototype.$isDeleted = PySet.prototype.$isDeleted
PyFrozenSet.prototype.$isEmpty = PySet.prototype.$isEmpty
PyFrozenSet.prototype.$add = PySet.prototype.add
PyFrozenSet.prototype.$find_index = PySet.prototype.$find_index

/**************************************************
 * Type conversions
 **************************************************/

PyFrozenSet.prototype.__len__ = PySet.prototype.__len__
PyFrozenSet.prototype.__bool__ = PySet.prototype.__bool__
PyFrozenSet.prototype.__iter__ = PySet.prototype.__iter__
PyFrozenSet.prototype.__repr__ = PySet.prototype.__repr__

/**************************************************
 * Comparison operators
 **************************************************/

PyFrozenSet.prototype.__lt__ = PySet.prototype.__lt__
PyFrozenSet.prototype.__le__ = PySet.prototype.__le__
PyFrozenSet.prototype.__eq__ = PySet.prototype.__eq__
PyFrozenSet.prototype.__ne__ = PySet.prototype.__ne__
PyFrozenSet.prototype.__gt__ = PySet.prototype.__gt__
PyFrozenSet.prototype.__ge__ = PySet.prototype.__ge__
PyFrozenSet.prototype.__contains__ = PySet.prototype.__contains__

/**************************************************
 * Unary operators
 **************************************************/
PyFrozenSet.prototype.__pos__ = PySet.prototype.__pos__
PyFrozenSet.prototype.__neg__ = PySet.prototype.__neg__
PyFrozenSet.prototype.__not__ = PySet.prototype.__not__
PyFrozenSet.prototype.__invert__ = PySet.prototype.__invert__

/**************************************************
 * Binary operators
 **************************************************/

PyFrozenSet.prototype.__pow__ = PySet.prototype.__pow__
PyFrozenSet.prototype.__div__ = PySet.prototype.__div__
PyFrozenSet.prototype.__floordiv__ = PySet.prototype.__floordiv__
PyFrozenSet.prototype.__truediv__ = PySet.prototype.__truediv__
PyFrozenSet.prototype.__mul__ = PySet.prototype.__mul__
PyFrozenSet.prototype.__mod__ = PySet.prototype.__mod__
PyFrozenSet.prototype.__add__ = PySet.prototype.__add__
PyFrozenSet.prototype.__sub__ = PySet.prototype.__sub__
PyFrozenSet.prototype.__getitem__ = PySet.prototype.__getitem__
PyFrozenSet.prototype.__lshift__ = PySet.prototype.__lshift__
PyFrozenSet.prototype.__rshift__ = PySet.prototype.__rshift__
PyFrozenSet.prototype.__and__ = PySet.prototype.__and__
PyFrozenSet.prototype.__xor__ = PySet.prototype.__xor__
PyFrozenSet.prototype.__or__ = PySet.prototype.__or__

/**************************************************
 * Methods
 **************************************************/

PyFrozenSet.prototype.copy = PySet.prototype.copy
PyFrozenSet.prototype.difference = PySet.prototype.difference
PyFrozenSet.prototype.intersection = PySet.prototype.intersection
PyFrozenSet.prototype.isdisjoint = PySet.prototype.isdisjoint
PyFrozenSet.prototype.issubset = PySet.prototype.issubset
PyFrozenSet.prototype.issuperset = PySet.prototype.issuperset
PyFrozenSet.prototype.symmetric_difference = PySet.prototype.symmetric_difference
PyFrozenSet.prototype.union = PySet.prototype.union

// Now, we can finally document and construct FrozenSet
PyFrozenSet.prototype.__doc__ = `frozenset() -> empty frozenset object
frozenset(iterable) -> frozenset object

Build an immutable unordered collection of unique elements.`
create_pyclass(PyFrozenSet, 'frozenset')
