import { pyargs } from '../core/callables'
import { pyStopIteration, pyTypeError } from '../core/exceptions'
import { jstype, PyObject } from '../core/types'

import * as builtins from '../builtins'
import * as types from '../types'

/*************************************************************************
 * A Python zip builtin is a type
 *************************************************************************/

class PyZip extends PyObject {
    @pyargs({
        varargs: ['iterables']
    })
    __init__(iterables) {
        this.$iterators = []

        for (let i = 0; i < iterables.length; i++) {
            try {
                this.$iterators.push(builtins.iter(iterables[i]))
            } catch (e) {
                if (types.isinstance(e, pyTypeError)) {
                    throw pyTypeError(`zip argument #${i + 1} must support iteration`)
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
        if (this.$iterators.length === 0) {
            throw pyStopIteration()
        }

        let values = []
        for (let i = 0; i < this.$iterators.length; i++) {
            values.push(this.$iterators[i].__next__())
        }
        return types.pytuple(values)
    }

    __str__() {
        return '<zip object at 0x99999999>'
    }
}
PyZip.prototype.__doc__ = `zip(iter1 [,iter2 [...]]) --> zip object

Return a zip object whose .__next__() method returns a tuple where
the i-th element comes from the i-th iterable argument.  The .__next__()
method continues until the shortest iterable in the argument sequence
is exhausted and then it raises pyStopIteration.`

const zip = jstype(PyZip, 'zip')
export default zip
