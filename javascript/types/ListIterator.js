import { PyObject } from '../core/types/object'
import { create_pyclass } from '../core/types/types'
import * as exceptions from '../core/exceptions'

/**************************************************
 * List Iterator
 **************************************************/

export default function ListIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
};

create_pyclass(ListIterator, 'list_iterator')

ListIterator.prototype.__iter__ = function() {
    return this
}

ListIterator.prototype.__next__ = function() {
    if (this.index >= this.data.length) {
        throw new exceptions.StopIteration.$pyclass()
    }
    var retval = this.data[this.index]
    this.index++
    return retval
}

ListIterator.prototype.__str__ = function() {
    return '<list_iterator object at 0x99999999>'
}
