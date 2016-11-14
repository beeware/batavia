/*************************************************************************
 * An implementation of slice
 *************************************************************************/

module.exports = {
    Slice: function() {
        function Slice(kwargs) {
            // BUG: slices can support arbitrary-sized arguments.
            this.start = kwargs.start === batavia.builtins.None ? null : kwargs.start.int32();
            this.stop = kwargs.stop === batavia.builtins.None ? null : kwargs.stop.int32();
            this.step = (kwargs.step || 1)|0;
        }

        Slice.prototype = Object.create(Object.prototype);
        Slice.prototype.__class__ = new batavia.types.Type('slice');

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
    }()
}
