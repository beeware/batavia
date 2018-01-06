import BigNumber from 'bignumber.js'

import { StopIteration } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

import * as types from '../types'

/**************************************************
 * Range Iterator
 **************************************************/

export default class RangeIterator extends PyObject {
    constructor(data) {
        super()
        this.index = data.start
        this.step = data.step
        this.stop = data.stop
    }

    __next__() {
        var retval = new BigNumber(this.index)
        if ((this.step.gt(0) && this.index.lt(this.stop)) ||
            (this.step.lt(0) && this.index.gt(this.stop))) {
            this.index = this.index.add(this.step)
            return new types.Int(retval)
        }
        throw new StopIteration()
    }

    __str__() {
        return '<range_iterator object at 0x99999999>'
    }
}
create_pyclass(RangeIterator, 'range_iterator')
