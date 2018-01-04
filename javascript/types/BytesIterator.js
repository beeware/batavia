import { StopIteration } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

import * as types from '../types'

/**************************************************
 * Bytes Iterator
 **************************************************/

export default function BytesIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
};

create_pyclass(BytesIterator, 'bytes_iterator')

BytesIterator.prototype.__iter__ = function() {
    return this
}

BytesIterator.prototype.__next__ = function() {
    if (this.index >= this.data.length) {
        throw new StopIteration()
    }
    var retval = this.data[this.index]
    this.index++
    return new types.Int(retval)
}

BytesIterator.prototype.__str__ = function() {
    return '<bytes_iterator object at 0x99999999>'
}
