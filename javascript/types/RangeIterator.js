import BigNumber from 'bignumber.js'

import { StopIteration } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

import * as types from '../types'

/**************************************************
 * Range Iterator
 **************************************************/

export default function RangeIterator(data) {
    PyObject.call(this)
    this.index = data.start
    this.step = data.step
    this.stop = data.stop
}

create_pyclass(RangeIterator, 'range_iterator')

RangeIterator.prototype.__next__ = function() {
    var retval = new BigNumber(this.index)
    if ((this.step.gt(0) && this.index.lt(this.stop)) ||
        (this.step.lt(0) && this.index.gt(this.stop))) {
        this.index = this.index.add(this.step)
        return new types.Int(retval)
    }
    throw new StopIteration()
}

RangeIterator.prototype.__str__ = function() {
    return '<range_iterator object at 0x99999999>'
}
