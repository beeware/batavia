import { StopIteration } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

import * as types from '../types'

/**************************************************
 * Bytearray Iterator
 **************************************************/

export default class BytearrayIterator extends PyObject {
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
            throw new StopIteration()
        }
        var retval = this.data[this.index]
        this.index++
        return new types.Int(retval)
    }

    __str__() {
        return '<bytearray_iterator object at 0x99999999>'
    }
}
create_pyclass(BytearrayIterator, 'bytearray_iterator')
