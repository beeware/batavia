var BigNumber = require('bignumber.js')

var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass
var RangeIterator = require('./RangeIterator')
var None = require('../core').None

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

create_pyclass(Range, 'range')

Range.prototype.__dir__ = function() {
    return "['__class__', '__contains__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__gt__', '__hash__', '__init__', '__iter__', '__le__', '__len__', '__lt__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__reversed__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'count', 'index', 'start', 'step', 'stop']"
}

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
        var start, stop, step

        if (index.start === None) {
            start = index.start
        } else if (!types.isinstance(index.start, types.Int)) {
            if (index.start.__index__ === undefined) {
                throw new exceptions.TypeError.$pyclass('slice indices must be integers or None or have an __index__ method')
            } else {
                start = index.start.__index__()
            }
        } else {
            start = index.start.int32()
        }

        if (index.stop === None) {
            stop = index.stop
        } else if (!types.isinstance(index.stop, types.Int)) {
            if (index.stop.__index__ === undefined) {
                throw new exceptions.TypeError.$pyclass('slice indices must be integers or None or have an __index__ method')
            } else {
                stop = index.stop.__index__()
            }
        } else {
            stop = index.stop.int32()
        }

        if (index.step === None) {
            step = 1
        } else if (!(types.isinstance(index.step, types.Int))) {
            if (index.step.__index__ === undefined) {
                throw new exceptions.TypeError.$pyclass('slice indices must be integers or None or have an __index__ method')
            } else {
                step = index.step.__index__()
            }
        } else {
            step = index.step.int32()
            if (step === 0) {
                throw new exceptions.ValueError.$pyclass('slice step cannot be zero')
            }
        }

        var newStart, newStop
        if (step > 0) {
            if (start !== None) {
                newStart = get_single_item(start, this)
            } else {
                newStart = get_single_item(0, this)
            }
            if (stop !== None) {
                newStop = get_single_item(stop, this)
            } else {
                newStop = get_single_item(this.length, this)
            }
        } else {
            if (start === None) {
                newStart = get_single_item(this.length, this).sub(this.step)
            } else if (this.length.lte(-start) || this.length.lt(start)) {
                newStart = get_single_item(start, this).sub(this.step)
            } else {
                newStart = get_single_item(start, this)
            }

            if (stop === None) {
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

Range.prototype.__add__ = function(other) {
    var msg = 'unsupported operand type(s) for +: '
    throw new exceptions.TypeError.$pyclass(msg +
                                            '\'' + type_name(this) +
                                            '\' and \'' +
                                            type_name(other) + '\'')
}

Range.prototype.__and__ = function(other) {
    var msg = 'unsupported operand type(s) for &: '
    throw new exceptions.TypeError.$pyclass(msg +
                                            '\'' + type_name(this) +
                                            '\' and \'' +
                                            type_name(other) + '\'')
}

Range.prototype.__iadd__ = function(other) {
    var msg = 'unsupported operand type(s) for +=: '
    throw new exceptions.TypeError.$pyclass(msg +
                                            '\'' + type_name(this) +
                                            '\' and \'' +
                                            type_name(other) + '\'')
}

Range.prototype.__iand__ = function(other) {
    var msg = 'unsupported operand type(s) for &=: '
    throw new exceptions.TypeError.$pyclass(msg +
                                            '\'' + type_name(this) +
                                            '\' and \'' +
                                            type_name(other) + '\'')
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Range
