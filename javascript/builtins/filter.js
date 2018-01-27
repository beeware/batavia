import { call_function, call_method, python } from '../core/callables'
import { TypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'

import * as builtins from '../builtins'

/*************************************************************************
 * A Python filter builtin is a type
 *************************************************************************/

class PyFilter extends PyObject {
    @python({
        args: ['fn', 'iterable']
    })
    __init__(fn, iterable) {
        if (builtins.callable(fn)) {
            this._func = fn
        } else {
            throw new TypeError(type_name(fn) + "' object is not callable")
        }

        this._iter = builtins.iter(iterable)
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
        return this._iter
    }

    __next__() {
        let val, pass
        do {
            val = call_method(this._iter, '__next__', [])
            pass = call_function(this, this._func, [val], null)
        } while (!pass)

        return val
    }

    __str__() {
        return '<filter object at 0x99999999>'
    }
}
PyFilter.prototype.__doc__ = `filter(function or None, iterable) --> filter object

Return an iterator yielding those items of iterable for which function(item)
is true. If function is None, return the items that are true.`
create_pyclass(PyFilter, 'filter')

var filter = PyFilter.__class__

export default filter
