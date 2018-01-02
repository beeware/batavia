import { PyObject } from '../core/types/object'
import { create_pyclass } from '../core/types/types'

import * as types from '../types'

/**************************************************
 * Enumerate
 **************************************************/

export default function Enumerate(iterable) {
    PyObject.call(this)
    this.iterator = iterable.__iter__([])
    this.count = 0
}

create_pyclass(Enumerate, 'enumerate')

Enumerate.prototype.__next__ = function() {
    var item = this.iterator.__next__([])
    var index = new types.Int(this.count)
    this.count += 1

    return new types.Tuple([index, item])
}

Enumerate.prototype.__iter__ = function() {
    return this
}

Enumerate.prototype.__str__ = function() {
    return '<enumerate object at 0x99999999>'
}
