var BigNumber = require('bignumber.js')

var PyObject = require('../core').Object
var Type = require('../core').Type
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var RangeIterator = require('./RangeIterator')

/*************************************************************************
 * An implementation of range
 *************************************************************************/

function Range(start, stop, step) {
    PyObject.call(this)

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

Range.prototype = Object.create(PyObject.prototype)
Range.prototype.__class__ = new Type('range')
Range.prototype.__class__.$pyclass = Range

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Range.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Range.prototype.__len__ = function() {
    var types = require('../types')
    return new types.Int(this.length.toString())
}

Range.prototype.__iter__ = function() {
    return new RangeIterator(this)
}

Range.prototype.__repr__ = function() {
    return this.__str__()
}

Range.prototype.__str__ = function() {
    if (!this.step.eq(1)) {
        return 'range(' + this.start.toFixed(0) + ', ' + this.stop.toFixed(0) + ', ' + this.step.toFixed(0) + ')'
    } else {
        return 'range(' + this.start.toFixed(0) + ', ' + this.stop.toFixed(0) + ')'
    }
}

Range.prototype.__bool__ = function() {
    var types = require('../types')
    return new types.Bool(!(this.start.eq(0) && this.stop.eq(0)))
}

/**************************************************
 * Binary operators
 **************************************************/

var get_single_item = function(idx, range) {
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

Range.prototype.__getitem__ = function(index) {
    var types = require('../types')

    if (types.isinstance(index, types.Bool)) {
        index = index.__int__()
    }
    if (types.isinstance(index, types.Int)) {
        var idx = index.bigNumber()
        if (idx < 0) {
            if (idx.neg().gt(this.length)) {
                throw new exceptions.IndexError.$pyclass('range object index out of range')
            } else {
                return new types.Int(get_single_item(idx, this))
            }
        } else {
            if (idx.gte(this.length)) {
                throw new exceptions.IndexError.$pyclass('range object index out of range')
            } else {
                return new types.Int(get_single_item(idx, this))
            }
        }
    } else if (types.isinstance(index, types.Slice)) {
        var start = index.start
        var stop = index.stop
        var step = index.step || 1

        if (step === 0) {
            throw new exceptions.ValueError.$pyclass('slice step cannot be zero')
        }

        var newStart, newStop
        if (step > 0) {
            if (start !== null) {
                newStart = get_single_item(start, this)
            } else {
                newStart = get_single_item(0, this)
            }
            if (stop !== null) {
                newStop = get_single_item(stop, this)
            } else {
                newStop = get_single_item(this.length, this)
            }
        } else {
            if (start === null) {
                newStart = get_single_item(this.length, this).sub(this.step)
            } else if (this.length.lte(-start) || this.length.lt(start)) {
                newStart = get_single_item(start, this).sub(this.step)
            } else {
                newStart = get_single_item(start, this)
            }

            if (stop === null) {
                newStop = get_single_item(0, this).sub(this.step)
            } else if (this.length.lte(-stop) || this.length.lt(stop)) {
                newStop = get_single_item(stop, this).sub(this.step)
            } else {
                newStop = get_single_item(stop, this)
            }
        }
        return new Range(new types.Int(newStart),
                         new types.Int(newStop),
                         new types.Int(this.step.mul(step)))
    } else {
        var msg = 'range indices must be integers or slices, not '
        throw new exceptions.TypeError.$pyclass(msg + type_name(index))
    }
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Range
