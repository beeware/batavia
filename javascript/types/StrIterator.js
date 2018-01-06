import { create_pyclass, PyObject } from '../core/types'
import * as exceptions from '../core/exceptions'

/**************************************************
 * Str Iterator
 **************************************************/

export default class StrIterator extends PyObject {
    constructor(data) {
        super()
        this.index = 0
        this.data = data
    }

    __next__() {
        var retval = this.data[this.index]
        if (retval === undefined) {
            throw new exceptions.StopIteration()
        }
        this.index++
        return retval
    }

    __str__() {
        return '<str_iterator object at 0x99999999>'
    }
}
create_pyclass(StrIterator, 'str_iterator')
