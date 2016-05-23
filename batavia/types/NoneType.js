
batavia.types.NoneType = function() {
    function NoneType() {
    }

    NoneType.prototype = Object.create(Object.prototype);

    NoneType.prototype.toString = function() {
        return "None";
    };

    NoneType.prototype.__str__ = function() {
        return this.toString();
    };

    NoneType.prototype.valueOf = function() {
        return null;
    };

    NoneType.prototype.constructor = NoneType;

    return NoneType;
}();
