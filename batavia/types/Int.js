
/*************************************************************************
 * A Python int type
 *************************************************************************/

batavia.types.Int = function() {
    function Int(val) {
        this.val = val;
    }

    Int.prototype = Object.create(Object.prototype);

    Int.prototype.constructor = Int;

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Int.prototype.valueOf = function() {
        return this.val;
    };

    Int.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Int.prototype.__bool__ = function() {
        return this.val !== 0;
    };

    Int.prototype.__repr__ = function() {
        return this.__str__();
    };

    Int.prototype.__str__ = function() {
        return this.val.toString();
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Int.prototype.__le__ = function(args, kwargs) {
        if (args[0] !== null) {
            return this.valueOf() <= args[0].valueOf();
        }
        return false;
    };

    Int.prototype.__eq__ = function(args, kwargs) {
        if (args[0] !== null) {
            return this.valueOf() == args[0].valueOf();
        }
        return false;
    };

    Int.prototype.__ne__ = function(args, kwargs) {
        if (args[0] !== null) {
            return this.valueOf() != args[0].valueOf();
        }
        return true;
    };

    Int.prototype.__gt__ = function(args, kwargs) {
        if (args[0] !== null) {
            return this.valueOf() > args[0].valueOf();
        }
        return false;
    };

    Int.prototype.__ge__ = function(args, kwargs) {
        if (args[0] !== null) {
            return this.valueOf() >= args[0].valueOf();
        }
        return false;
    };

    Int.prototype.__contains__ = function(args, kwargs) {
        return false;
    };

    return Int;
}();
