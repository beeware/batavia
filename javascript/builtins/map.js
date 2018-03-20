import { pyargs } from '../core/callables'
import { pyTypeError } from '../core/exceptions'
import { jstype, type_name, PyObject } from '../core/types'

import * as builtins from '../builtins'

/*************************************************************************
 * A Python map builtin is a type
 *************************************************************************/

class PyMap extends PyObject {
    @pyargs({
        args: ['fn', 'iterable']
    })
    __init__(fn, iterable) {
        if (builtins.callable(fn)) {
            this.$func = fn
        } else {
            throw pyTypeError(`${type_name(fn)} object is not callable`)
        }

        this.$iter = builtins.iter(iterable)
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
        let val = this.$iter.__next__()
        return this.$func(val)
    }

    __str__() {
        return '<map object at 0x99999999>'
    }
}
PyMap.prototype.__doc__ = `map(func, *iterables) --> map object

Make an iterator that computes the function using arguments from
each of the iterables.  Stops when the shortest iterable is exhausted.`

const map = jstype(PyMap, 'map')
export default map
