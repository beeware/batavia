import { StopIteration } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

/**************************************************
 * Set Iterator
 **************************************************/

export default class SetIterator extends PyObject {
    constructor(data) {
        super()
        this.index = 0
        this.data = data
        this.keys = data.data.keys()
    }

    __iter__() {
        return this
    }

    __next__() {
        var key = this.keys[this.index]
        if (key === undefined) {
            throw new StopIteration()
        }
        this.index++
        return key
    }

    __str__() {
        return '<set_iterator object at 0x99999999>'
    }
}
create_pyclass(SetIterator, 'set_iterator')
