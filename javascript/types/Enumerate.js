import { create_pyclass, PyObject } from '../core/types'

import * as types from '../types'

/**************************************************
 * Enumerate
 **************************************************/

export default class Enumerate extends PyObject {
    constructor(iterable) {
        super()
        this.iterator = iterable.__iter__([])
        this.count = 0
    }

    __next__() {
        var item = this.iterator.__next__([])
        var index = new types.Int(this.count)
        this.count += 1

        return new types.Tuple([index, item])
    }

    __iter__() {
        return this
    }

    __str__() {
        return '<enumerate object at 0x99999999>'
    }
}
create_pyclass(Enumerate, 'enumerate')
