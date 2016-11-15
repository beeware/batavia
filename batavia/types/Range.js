/*************************************************************************
 * An implementation of range
 *************************************************************************/
var types = require('./Type');


module.exports = function() {
    // BUG: Range supports longs.
    function Range(start, stop, step) {
        types.Object.call(this);

        this.start = start.int32();
        this.step = new batavia.types.Int(step || 1).int32();

        if (stop === undefined) {
            this.start = 0;
            this.stop = start;
        } else {
            this.stop = stop.int32();
        }
    }

    Range.prototype = Object.create(types.Object.prototype);
    Range.prototype.__class__ = new types.Type('range');

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Range.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Range.prototype.__iter__ = function() {
        return new Range.prototype.RangeIterator(this);
    };

    Range.prototype.__repr__ = function() {
        return this.__str__();
    };

    Range.prototype.__str__ = function() {
        if (this.step) {
            return '(' + this.start + ', ' + this.stop + ', ' + this.step + ')';
        } else {
            return '(' + this.start + ', ' + this.stop + ')';
        }
    };

    /**************************************************
     * Range Iterator
     **************************************************/

    Range.prototype.RangeIterator = function (data) {
        Object.call(this);
        this.data = data;
        this.index = this.data.start.valueOf();
        this.step = this.data.step.valueOf();
    };

    Range.prototype.RangeIterator.prototype = Object.create(Object.prototype);

    Range.prototype.RangeIterator.prototype.__next__ = function() {
        var retval = this.index;
        if ((this.step > 0 && this.index < this.data.stop) ||
            (this.step < 0 && this.index > this.data.stop)) {
            this.index = this.index + this.data.step;
            return new batavia.types.Int(retval);
        }
        throw new batavia.builtins.StopIteration();
    };

    Range.prototype.RangeIterator.prototype.__str__ = function() {
        return "<range_iterator object at 0x99999999>";
    };

    /**************************************************/

    return Range;
}();
