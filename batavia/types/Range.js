var BigNumber = require('bignumber.js');

var constants = require('../core').constants;
var PyObject = require('../core').Object;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;

/*************************************************************************
 * An implementation of range
 *************************************************************************/

function Range(start, stop, step) {
    var types = require('../types');

    PyObject.call(this);

    this.start = start.bigNumber();
    if (step === undefined) {
        this.step = new BigNumber(1);
    } else {
        this.step = step.bigNumber();
    }
    if (stop === undefined) {
        this.start = new BigNumber(0);
        this.stop = start.bigNumber();
    } else {
        this.stop = stop.bigNumber();
    }

    var difference = this.stop.sub(this.start);
    var length = difference.div(this.step).ceil();
    this.length = length.lt(0) ? new BigNumber(0) : length;
}

Range.prototype = Object.create(PyObject.prototype);
Range.prototype.__class__ = new Type('range');
Range.prototype.constructor = Range;

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Range.prototype.toString = function() {
    return this.__str__();
}

/**************************************************
 * Type conversions
 **************************************************/

Range.prototype.__len__ = function () {
   return new types.Int(this.length.toString());
}

Range.prototype.__iter__ = function() {
   return new Range.prototype.RangeIterator(this);
}

Range.prototype.__repr__ = function() {
   return this.__str__();
}

Range.prototype.__str__ = function() {
   if (!this.step.eq(1)) {
       return 'range(' + this.start.toFixed(0) + ', ' + this.stop.toFixed(0) + ', ' + this.step.toFixed(0) + ')';
   } else {
       return 'range(' + this.start.toFixed(0) + ', ' + this.stop.toFixed(0) + ')';
   }
}

/**************************************************
 * Binary operators
 **************************************************/

var get_single_item = function (idx, range) {
    idx = new BigNumber(idx);
    var realStop = range.start.add(range.step.mul(range.length));
    if (idx < 0) {
        if (idx.neg().gt(range.length)) {
            return range.start;
        } else {
            return realStop.add(range.step.mul(idx));
        }
    } else {
        if (idx.gte(range.length)) {
            return realStop;
        } else {
            return range.start.add(idx.mul(range.step));
        }
    }
}

Range.prototype.__getitem__ = function(index) {
    var types = require('../types');

    if (types.isinstance(index, types.Bool)) {
        index = index.__int__();
    }
    if (types.isinstance(index, types.Int)) {
        var idx = index.bigNumber();
        if (idx < 0) {
            if (idx.neg().gt(this.length)) {
                throw new exceptions.IndexError("range object index out of range");
            } else {
                return new types.Int(get_single_item(idx, this));
            }
        } else {
            if (idx.gte(this.length)) {
                throw new exceptions.IndexError("range object index out of range");
            } else {
                return new types.Int(get_single_item(idx, this));
            }
        }
    } else if (types.isinstance(index, types.Slice)) {
        var start = index.start;
        var stop = index.stop;
        var step = index.step || 1;

        if (step === 0) {
            throw new exceptions.ValueError("slice step cannot be zero");
        }

        var newStart, newStop;
        if (step > 0) {
            newStart = start !== null ? get_single_item(start, this) : get_single_item(0, this);
            newStop = stop !== null ? get_single_item(stop, this) : get_single_item(this.length, this);
        } else {
            if (start === null) {
                newStart = get_single_item(this.length, this).sub(this.step);
            } else if (this.length.lte(-start) || this.length.lt(start)) {
                newStart = get_single_item(start, this).sub(this.step);
            } else {
                newStart = get_single_item(start, this);
            }

            if (stop === null) {
                newStop = get_single_item(0, this).sub(this.step);
            } else if (this.length.lte(-stop) || this.length.lt(stop)) {
                newStop = get_single_item(stop, this).sub(this.step);
            } else {
                newStop = get_single_item(stop, this);
            }
        }
        return new Range(new types.Int(newStart),
                         new types.Int(newStop),
                         new types.Int(this.step.mul(step)));
    } else {
        var msg = "range indices must be integers or slices, not ";
        if (constants.BATAVIA_MAGIC == constants.BATAVIA_MAGIC_34) {
            msg = "range indices must be integers, not ";
        }
        throw new exceptions.TypeError(msg + type_name(index));
    }
}

/**************************************************
 * Range Iterator
 **************************************************/

Range.prototype.RangeIterator = function (data) {
    PyObject.call(this);
    this.index = data.start;
    this.step = data.step;
    this.stop = data.stop;
}

Range.prototype.RangeIterator.prototype = Object.create(PyObject.prototype);
Range.prototype.RangeIterator.prototype.__class__ = new Type('range_iterator');
Range.prototype.RangeIterator.prototype.constructor = Range.prototype.RangeIterator;

Range.prototype.RangeIterator.prototype.__next__ = function() {
    var types = require('../types');

    var retval = new BigNumber(this.index);
    if ((this.step.gt(0) && this.index.lt(this.stop)) ||
        (this.step.lt(0) && this.index.gt(this.stop))) {
        this.index = this.index.add(this.step);
        return new types.Int(retval);
    }
    throw new exceptions.StopIteration();
}

Range.prototype.RangeIterator.prototype.__str__ = function() {
    return "<range_iterator object at 0x99999999>";
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Range;
