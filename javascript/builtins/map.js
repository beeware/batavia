import { call_function, call_method, pyargs } from '../core/callables'
import { TypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'

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
        return this
    }

    __next__() {
        let val = call_method(this._iter, '__next__', [])
        return call_function(this, this._func, [val], null)
    }

    __str__() {
        return '<map object at 0x99999999>'
    }
}
PyMap.prototype.__doc__ = `map(func, *iterables) --> map object

Make an iterator that computes the function using arguments from
each of the iterables.  Stops when the shortest iterable is exhausted.`
create_pyclass(PyMap, 'map')

var map = PyMap.__class__

export default map
