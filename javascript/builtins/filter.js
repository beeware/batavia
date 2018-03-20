import { pyargs } from '../core/callables'
import { pyTypeError } from '../core/exceptions'
import { jstype, type_name, PyObject } from '../core/types'

import * as builtins from '../builtins'

/*************************************************************************
 * A Python filter builtin is a type
 *************************************************************************/

class PyFilter extends PyObject {
    @pyargs({
        args: ['fn', 'iterable']
    })
    __init__(fn, iterable) {
        if (builtins.callable(fn)) {
            this.$func = fn
        } else {
            throw pyTypeError(`${type_name(fn)}' object is not callable`)
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
        return this.$iter
    }

    __next__() {
        let val, pass
        do {
            val = this.$iter.__next__()
            pass = this.$func(val)
        } while (!pass)

        return val
    }

    __str__() {
        return '<filter object at 0x99999999>'
    }
}
PyFilter.prototype.__doc__ = `filter(function or pyNone, iterable) --> filter object

Return an iterator yielding those items of iterable for which function(item)
is true. If function is pyNone, return the items that are true.`

const filter = jstype(PyFilter, 'filter')
export default filter
