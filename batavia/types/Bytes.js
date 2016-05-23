
/*************************************************************************
 * A Python bytes type
 *************************************************************************/

batavia.types.Bytes = function() {
    function Bytes(val) {
        this.val = val;
    }

    Bytes.prototype = Object.create(Object.prototype);

    Bytes.prototype.toString = function() {
        return this.__str__();
    };

    Bytes.prototype.__str__ = function() {
        return this.val.toString();
    };

    Bytes.prototype.valueOf = function() {
        return this.val;
    };

    Bytes.prototype.constructor = Bytes;

    return Bytes;
}();
