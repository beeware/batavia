/* eslint-disable no-extend-native */
import { TypeError } from '../core/exceptions'
import * as callables from '../core/callables'
import { create_pyclass, type_name, PyObject } from '../core/types'

import * as builtins from '../builtins'

/*************************************************************************
 * A Python map builtin is a type
 *************************************************************************/

export default function Map(args, kwargs) {
    PyObject.call(this)

    if (args.length < 2) {
        throw new TypeError.$pyclass('map expected 2 arguments, got ' + args.length)
    }
    this._func = args[0]
    this._sequence = args[1]
}

create_pyclass(Map, 'map')

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Map.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Map.prototype.__iter__ = function() {
    return this
}

Map.prototype.__next__ = function() {
    if (!this._iter) {
        this._iter = builtins.iter([this._sequence], null)
    }
    if (!builtins.callable([this._func], null)) {
        throw new TypeError.$pyclass(
            type_name(this._func) + "' object is not callable")
    }

    var val = callables.call_method(this._iter, '__next__', [])
    return callables.call_function(this._func, [val], null)
}

Map.prototype.__str__ = function() {
    return '<map object at 0x99999999>'
}
