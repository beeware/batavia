import { PyStopIteration } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

/**************************************************
 * Tuple Iterator
 **************************************************/

export default class TupleIterator extends PyObject {
    constructor(data) {
        super()
        this.index = 0
        this.data = data
    }

    __next__() {
        var retval = this.data[this.index]
        if (retval === undefined) {
            throw new PyStopIteration()
        }
        this.index++
        return retval
    }

    __str__() {
        return '<tuple_iterator object at 0x99999999>'
    }
}
create_pyclass(TupleIterator, 'tuple_iterator')
