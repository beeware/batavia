import { call_function, call_method } from '../core/callables'
import { TypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'

import * as builtins from '../builtins'

/*************************************************************************
 * A Python filter builtin is a type
 *************************************************************************/

export default class Filter extends PyObject {
    constructor(args, kwargs) {
        super()

        if (args.length < 2) {
            throw new TypeError('filter expected 2 arguments, got ' + args.length)
        }
        this._func = args[0]
        this._sequence = args[1]
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
        if (!this._iter) {
            this._iter = builtins.iter([this._sequence], null)
        }
        if (!builtins.callable([this._func], null)) {
            throw new TypeError(type_name(this._func) + "' object is not callable")
        }

        var val, more
        do {
            val = call_method(this._iter, '__next__', [])
            more = !call_function(this._func, [val], null)
        } while (more)

        return val
    }

    __str__() {
        return '<filter object at 0x99999999>'
    }
}
create_pyclass(Filter, 'filter')
