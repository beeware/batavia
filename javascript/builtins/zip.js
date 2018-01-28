import { call_method, pyargs } from '../core/callables'
import { StopIteration, TypeError } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

import * as builtins from '../builtins'

import PyTuple from '../types/Tuple'

/*************************************************************************
 * A Python zip builtin is a type
 *************************************************************************/

class PyZip extends PyObject {
    @pyargs({
        varargs: ['iterables']
    })
    __init__(iterables) {
        this._iterators = []

        for (let i = 0; i < iterables.length; i++) {
            try {
                this._iterators.push(builtins.iter(iterables[i]))
            } catch (e) {
                if (e instanceof TypeError) {
                    throw new TypeError('zip argument #' + (i + 1) + ' must support iteration')
                }
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

    __iter__() {
        return this
    }

    __next__() {
        if (this._iterators.length === 0) {
            throw new StopIteration()
        }

        let values = []
        for (let i = 0; i < this._iterators.length; i++) {
            values.push(call_method(this._iterators[i], '__next__'))
        }
        return new PyTuple(values)
    }

    __str__() {
        return '<zip object at 0x99999999>'
    }
}
PyZip.prototype.__doc__ = `zip(iter1 [,iter2 [...]]) --> zip object

Return a zip object whose .__next__() method returns a tuple where
the i-th element comes from the i-th iterable argument.  The .__next__()
method continues until the shortest iterable in the argument sequence
is exhausted and then it raises StopIteration.`

create_pyclass(PyZip, 'zip')

var zip = PyZip.__class__

export default zip
