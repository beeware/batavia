
/*************************************************************************
 * A Python float type
 *************************************************************************/

batavia.types.Float = function() {
    function Float(val) {
        this.val = val;
    }

    Float.prototype = Object.create(Object.prototype);

    Float.prototype.constructor = Float;

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Float.prototype.toString = function() {
        return this.__str__();
    };

    Float.prototype.valueOf = function() {
        return this.val;
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Float.prototype.__bool__ = function() {
        return this.val !== 0.0;
    };

    Float.prototype.__repr__ = function() {
        return this.__str__();
    };

    Float.prototype.__str__ = function() {
        if (this.val === Math.round(this. val)) {
            return this.val + '.0';
        } else {
            return this.val.toString();
        }
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Float.prototype.__le__ = function(args, kwargs) {
        if (args[0] !== null) {
            return this.valueOf() <= args[0].valueOf();
        }
        return false;
    };

    Float.prototype.__eq__ = function(args, kwargs) {
        if (args[0] !== null) {
            return this.valueOf() == args[0].valueOf();
        }
        return false;
    };

    Float.prototype.__ne__ = function(args, kwargs) {
        if (args[0] !== null) {
            return this.valueOf() != args[0].valueOf();
        }
        return true;
    };

    Float.prototype.__gt__ = function(args, kwargs) {
        if (args[0] !== null) {
            return this.valueOf() > args[0].valueOf();
        }
        return false;
    };

    Float.prototype.__ge__ = function(args, kwargs) {
        if (args[0] !== null) {
            return this.valueOf() >= args[0].valueOf();
        }
        return false;
    };

    Float.prototype.__contains__ = function(args, kwargs) {
        return false;
    };

    return Float;
}();
