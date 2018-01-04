import { StopIteration } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

import * as types from '../types'

/**************************************************
 * Bytearray Iterator
 **************************************************/

export default function BytearrayIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
};

create_pyclass(BytearrayIterator, 'bytearray_iterator')

BytearrayIterator.prototype.__iter__ = function() {
    return this
}

BytearrayIterator.prototype.__next__ = function() {
    if (this.index >= this.data.length) {
        throw new StopIteration()
    }
    var retval = this.data[this.index]
    this.index++
    return new types.Int(retval)
}

BytearrayIterator.prototype.__str__ = function() {
    return '<bytearray_iterator object at 0x99999999>'
}
