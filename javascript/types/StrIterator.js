import { PyObject } from '../core/types/object'
import { create_pyclass } from '../core/types/types'
import * as exceptions from '../core/exceptions'

/**************************************************
 * Str Iterator
 **************************************************/

export default function StrIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
}

create_pyclass(StrIterator, 'str_iterator')

StrIterator.prototype.__next__ = function() {
    var retval = this.data[this.index]
    if (retval === undefined) {
        throw new exceptions.StopIteration.$pyclass()
    }
    this.index++
    return retval
}

StrIterator.prototype.__str__ = function() {
    return '<str_iterator object at 0x99999999>'
}
