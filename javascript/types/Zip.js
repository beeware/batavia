import * as callables from '../core/callables'
import { StopIteration, TypeError } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

import * as builtins from '../builtins'

import * as Tuple from './Tuple'

/*************************************************************************
 * A Python zip builtin is a type
 *************************************************************************/

export default class Zip extends PyObject {
    constructor(args, kwargs) {
        super()

        this._iterables = args
        this._iterators = []

        for (var i = 0, n = 1; i < args.length; i++, n++) {
            try {
                this._iterators.push(builtins.iter([this._iterables[i]], null))
            } catch (e) {
                if (e instanceof TypeError) {
                    throw new TypeError('zip argument #' + n + ' must support iteration')
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

        var values = []
        for (var i = 0; i < this._iterators.length; i++) {
            values.push(callables.call_method(this._iterators[i], '__next__'))
        }
        return new Tuple(values)
    }

    __str__() {
        return '<zip object at 0x99999999>'
    }
}
create_pyclass(Zip, 'zip')
