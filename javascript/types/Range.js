import BigNumber from 'bignumber.js'

import { pyargs } from '../core/callables'
import { PyIndexError, PyStopIteration, PyTypeError, PyValueError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject, PyNone } from '../core/types'

import * as types from '../types'

/**************************************************
 * Range Iterator
 **************************************************/

class PyRangeIterator extends PyObject {
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
            return new types.PyInt(retval)
        }
        throw new PyStopIteration()
    }

    __str__() {
        return '<range_iterator object at 0x99999999>'
    }
}
create_pyclass(PyRangeIterator, 'range_iterator')

/*************************************************************************
 * An implementation of range
 *************************************************************************/

export default class PyRange extends PyObject {
    @pyargs({
        args: ['start'],
        default_args: ['stop', 'step']
    })
    __init__(start, stop, step) {
        this.start = start.bigNumber()
        if (step === undefined) {
            this.step = new BigNumber(1)
        } else {
            this.step = step.bigNumber()
        }
        if (stop === undefined) {
            this.start = new BigNumber(0)
            this.stop = start.bigNumber()
        } else {
            this.stop = stop.bigNumber()
        }

        var difference = this.stop.sub(this.start)
        var length = difference.div(this.step).ceil()
        if (length.lt(0)) {
            this.length = new BigNumber(0)
        } else {
            this.length = length
        }
    }

    $get_single_item(idx, range) {
        idx = new BigNumber(idx)
        var realStop = range.start.add(range.step.mul(range.length))
        if (idx < 0) {
            if (idx.neg().gt(range.length)) {
                return range.start
            } else {
                return realStop.add(range.step.mul(idx))
            }
        } else {
            if (idx.gte(range.length)) {
                return realStop
            } else {
                return range.start.add(idx.mul(range.step))
            }
        }
    }

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    toString() {
        return this.__str__()
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __len__() {
        return new types.PyInt(this.length.toString())
    }

    __iter__() {
        return new PyRangeIterator(this)
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        if (!this.step.eq(1)) {
            return 'range(' + this.start.toFixed(0) + ', ' + this.stop.toFixed(0) + ', ' + this.step.toFixed(0) + ')'
        } else {
            return 'range(' + this.start.toFixed(0) + ', ' + this.stop.toFixed(0) + ')'
        }
    }

    __bool__() {
        return new types.PyBool(!(this.start.eq(0) && this.stop.eq(0)))
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __getitem__(index) {
        if (types.isinstance(index, types.PyBool)) {
            index = index.__int__()
        }
        if (types.isinstance(index, types.PyInt)) {
            var idx = index.bigNumber()
            if (idx < 0) {
                if (idx.neg().gt(this.length)) {
                    throw new PyIndexError('range object index out of range')
                } else {
                    return new types.PyInt(this.$get_single_item(idx, this))
                }
            } else {
                if (idx.gte(this.length)) {
                    throw new PyIndexError('range object index out of range')
                } else {
                    return new types.PyInt(this.$get_single_item(idx, this))
                }
            }
        } else if (types.isinstance(index, types.PySlice)) {
            var start, stop, step

            if (index.start === PyNone) {
                start = index.start
            } else if (!types.isinstance(index.start, types.PyInt)) {
                if (index.start.__index__ === undefined) {
                    throw new PyTypeError('slice indices must be integers or None or have an __index__ method')
                } else {
                    start = index.start.__index__()
                }
            } else {
                start = index.start.int32()
            }

            if (index.stop === PyNone) {
                stop = index.stop
            } else if (!types.isinstance(index.stop, types.PyInt)) {
                if (index.stop.__index__ === undefined) {
                    throw new PyTypeError('slice indices must be integers or None or have an __index__ method')
                } else {
                    stop = index.stop.__index__()
                }
            } else {
                stop = index.stop.int32()
            }

            if (index.step === PyNone) {
                step = 1
            } else if (!(types.isinstance(index.step, types.PyInt))) {
                if (index.step.__index__ === undefined) {
                    throw new PyTypeError('slice indices must be integers or None or have an __index__ method')
                } else {
                    step = index.step.__index__()
                }
            } else {
                step = index.step.int32()
                if (step === 0) {
                    throw new PyValueError('slice step cannot be zero')
                }
            }

            var newStart, newStop
            if (step > 0) {
                if (start !== PyNone) {
                    newStart = this.$get_single_item(start, this)
                } else {
                    newStart = this.$get_single_item(0, this)
                }
                if (stop !== PyNone) {
                    newStop = this.$get_single_item(stop, this)
                } else {
                    newStop = this.$get_single_item(this.length, this)
                }
            } else {
                if (start === PyNone) {
                    newStart = this.$get_single_item(this.length, this).sub(this.step)
                } else if (this.length.lte(-start) || this.length.lt(start)) {
                    newStart = this.$get_single_item(start, this).sub(this.step)
                } else {
                    newStart = this.$get_single_item(start, this)
                }

                if (stop === PyNone) {
                    newStop = this.$get_single_item(0, this).sub(this.step)
                } else if (this.length.lte(-stop) || this.length.lt(stop)) {
                    newStop = this.$get_single_item(stop, this).sub(this.step)
                } else {
                    newStop = this.$get_single_item(stop, this)
                }
            }
            return new PyRange(new types.PyInt(newStart),
                new types.PyInt(newStop),
                new types.PyInt(this.step.mul(step)))
        } else {
            var msg = 'range indices must be integers or slices, not '
            throw new PyTypeError(msg + type_name(index))
        }
    }

    __add__(other) {
        if (types.isinstance(other, types.PyBool)) {
            var msg = 'unsupported operand type(s) for +: '
            throw new PyTypeError(msg + '\'' + type_name(this) + '\' and \'' + type_name(other) + '\'')
        }
    }
}
create_pyclass(PyRange, 'range')
