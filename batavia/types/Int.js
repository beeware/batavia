
/*************************************************************************
 * A Python int type
 *************************************************************************/

batavia.types.Int = function() {
    function Int(val) {
        this.val = val;
    }

    Int.prototype = Object.create(Object.prototype);

    Int.prototype.toString = function() {
        return this.__str__();
    };

    Int.prototype.__repr__ = function() {
        return this.__str__();
    };

    Int.prototype.__str__ = function() {
        return this.val.toString();
    };

    Int.prototype.__bool__ = function() {
        return this.val !== 0;
    };

    Int.prototype.valueOf = function() {
        return this.val;
    };

    Int.prototype.constructor = Int;

    return Int;
}();
