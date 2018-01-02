import { StopIteration } from '../core/exceptions'
import { PyObject } from '../core/types/object'
import { create_pyclass } from '../core/types/types'

/**************************************************
 * Tuple Iterator
 **************************************************/

export default function TupleIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
}

create_pyclass(TupleIterator, 'tuple_iterator')

TupleIterator.prototype.__next__ = function() {
    var retval = this.data[this.index]
    if (retval === undefined) {
        throw new StopIteration.$pyclass()
    }
    this.index++
    return retval
}

TupleIterator.prototype.__str__ = function() {
    return '<tuple_iterator object at 0x99999999>'
}
