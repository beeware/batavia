import { StopIteration } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

/**************************************************
 * Set Iterator
 **************************************************/

export default function SetIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
    this.keys = data.data.keys()
}

create_pyclass(SetIterator, 'set_iterator')

SetIterator.prototype.__iter__ = function() {
    return this
}

SetIterator.prototype.__next__ = function() {
    var key = this.keys[this.index]
    if (key === undefined) {
        throw new StopIteration()
    }
    this.index++
    return key
}

SetIterator.prototype.__str__ = function() {
    return '<set_iterator object at 0x99999999>'
}
