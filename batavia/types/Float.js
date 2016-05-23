
/*************************************************************************
 * A Python float type
 *************************************************************************/

batavia.types.Float = function() {
    function Float(val) {
        this.val = val;
    }

    Float.prototype = Object.create(Object.prototype);

    Float.prototype.toString = function() {
        return this.__str__();
    };

    Float.prototype.__str__ = function() {
        if (this.val === Math.round(this. val)) {
            return this.val + '.0';
        } else {
            return this.val.toString();
        }
    };

    Float.prototype.valueOf = function() {
        return this.val;
    };

    Float.prototype.constructor = Float;

    return Float;
}();
