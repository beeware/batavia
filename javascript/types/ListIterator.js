import * as exceptions from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

/**************************************************
 * List Iterator
 **************************************************/

export default class ListIterator extends PyObject {
    constructor(data) {
        super()
        this.index = 0
        this.data = data
    }

    __iter__() {
        return this
    }

    __next__() {
        if (this.index >= this.data.length) {
            throw new exceptions.StopIteration()
        }
        var retval = this.data[this.index]
        this.index++
        return retval
    }

    __str__() {
        return '<list_iterator object at 0x99999999>'
    }
}
create_pyclass(ListIterator, 'list_iterator')
