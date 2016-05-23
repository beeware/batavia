/*************************************************************************
 * An implementation of slice
 *************************************************************************/

batavia.types.Slice = function() {
    function Slice(kwargs) {
        this.start = kwargs.start;
        this.stop = kwargs.stop;
        this.step = kwargs.step;
    }

    Slice.prototype = Object.create(Object.prototype);

    Slice.prototype.constructor = Slice;

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Slice.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Slice.prototype.__repr__ = function() {
        return this.__str__();
    };

    Slice.prototype.__str__ = function() {
        if (this.step) {
            return '(' + this.start + ', ' + this.stop + ', ' + this.step + ')';
        } else {
            return '(' + this.start + ', ' + this.stop + ')';
        }
    };

    /**************************************************/

    return Slice;
}();
