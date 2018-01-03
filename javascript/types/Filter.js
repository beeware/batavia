import { call_function, call_method } from '../core/callables'
import { TypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'

import * as builtins from '../builtins'

/*************************************************************************
 * A Python filter builtin is a type
 *************************************************************************/

export default function Filter(args, kwargs) {
    PyObject.call(this)

    if (args.length < 2) {
        throw new TypeError.$pyclass('filter expected 2 arguments, got ' + args.length)
    }
    this._func = args[0]
    this._sequence = args[1]
}

create_pyclass(Filter, 'filter')

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Filter.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Filter.prototype.__iter__ = function() {
    return this
}

Filter.prototype.__next__ = function() {
    if (!this._iter) {
        this._iter = builtins.iter([this._sequence], null)
    }
    if (!builtins.callable([this._func], null)) {
        throw new TypeError.$pyclass(type_name(this._func) + "' object is not callable")
    }

    var val, more
    do {
        val = call_method(this._iter, '__next__', [])
        more = !call_function(this._func, [val], null)
    } while (more)

    return val
}

Filter.prototype.__str__ = function() {
    return '<filter object at 0x99999999>'
}
