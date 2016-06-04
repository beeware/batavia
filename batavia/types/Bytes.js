
/*************************************************************************
 * A Python bytes type
 *************************************************************************/

batavia.types.Bytes = function() {
    function Bytes(val) {
        this.val = val;
    }

    Bytes.prototype = Object.create(Object.prototype);

    Bytes.prototype.constructor = Bytes;
    Bytes.__name__ = 'bytes';
    
    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Bytes.prototype.toString = function () {
        return this.__str__();
    };

    Bytes.prototype.valueOf = function() {
        return this.val;
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Bytes.prototype.__bool__ = function() {
        return this.size() !== 0;
    };

    Bytes.prototype.__repr__ = function() {
        return this.__str__();
    };

    Bytes.prototype.__str__ = function() {
        return this.val.toString();
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Bytes.prototype.__lt__ = function(other) {
        if (other !== null) {
            return this.valueOf() < other;
        }
        return false;
    };

    Bytes.prototype.__le__ = function(other) {
        if (other !== null) {
            return this.valueOf() <= other;
        }
        return false;
    };

    Bytes.prototype.__eq__ = function(other) {
        if (other !== null) {
            var val;
            if (batavia.isinstance(other, [
                        batavia.types.Bool, batavia.types.Int, batavia.types.Float])
                    ) {
                return false;
            } else {
                return this.valueOf() === val;
            }
        }
        return this.valueOf() === '';
    };

    Bytes.prototype.__ne__ = function(other) {
        if (other !== null) {
            var val;
            if (batavia.isinstance(other, [
                        batavia.types.Bool, batavia.types.Int, batavia.types.Float])
                    ) {
                return true;
            } else {
                return this.valueOf() !== val;
            }
        }
        return this.valueOf() !== '';
    };

    Bytes.prototype.__gt__ = function(other) {
        if (other !== null) {
            return this.valueOf() > other;
        }
        return false;
    };

    Bytes.prototype.__ge__ = function(other) {
        if (other !== null) {
            return this.valueOf() >= other;
        }
        return false;
    };

    Bytes.prototype.__contains__ = function(other) {
        if (other !== null) {
            return this.valueOf().hasOwnProperty(other);
        }
        return false;
    };

    /**************************************************
     * Unary operators
     **************************************************/

    Bytes.prototype.__pos__ = function() {
        return new Bytes(+this.valueOf());
    };

    Bytes.prototype.__neg__ = function() {
        return new Bytes(-this.valueOf());
    };

    Bytes.prototype.__not__ = function() {
        return new Bytes(!this.valueOf());
    };

    Bytes.prototype.__invert__ = function() {
        return new Bytes(~this.valueOf());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Bytes.prototype.__pow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__pow__ has not been implemented");
    };

    Bytes.prototype.__div__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__div__ has not been implemented");
    };

    Bytes.prototype.__floordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__floordiv__ has not been implemented");
    };

    Bytes.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__truediv__ has not been implemented");
    };

    Bytes.prototype.__mul__ = function(other) {
        throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type '" + batavia.type_name(other) + "'");
    };

    Bytes.prototype.__mod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__mod__ has not been implemented");
    };

    Bytes.prototype.__add__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__add__ has not been implemented");
    };

    Bytes.prototype.__sub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__sub__ has not been implemented");
    };

    Bytes.prototype.__getitem__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__getitem__ has not been implemented");
    };

    Bytes.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__lshift__ has not been implemented");
    };

    Bytes.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__rshift__ has not been implemented");
    };

    Bytes.prototype.__and__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__and__ has not been implemented");
    };

    Bytes.prototype.__xor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__xor__ has not been implemented");
    };

    Bytes.prototype.__or__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__or__ has not been implemented");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    Bytes.prototype.__idiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__idiv__ has not been implemented");
    };

    Bytes.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__ifloordiv__ has not been implemented");
    };

    Bytes.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__itruediv__ has not been implemented");
    };

    Bytes.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__iadd__ has not been implemented");
    };

    Bytes.prototype.__isub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__isub__ has not been implemented");
    };

    Bytes.prototype.__imul__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__imul__ has not been implemented");
    };

    Bytes.prototype.__imod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__imod__ has not been implemented");
    };

    Bytes.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__ipow__ has not been implemented");
    };

    Bytes.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__ilshift__ has not been implemented");
    };

    Bytes.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__irshift__ has not been implemented");
    };

    Bytes.prototype.__iand__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__iand__ has not been implemented");
    };

    Bytes.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__ixor__ has not been implemented");
    };

    Bytes.prototype.__ior__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__ior__ has not been implemented");
    };

    /**************************************************
     * Methods
     **************************************************/

    Bytes.prototype.copy = function() {
        return new Bytes(this.valueOf());
    };

    /**************************************************/

    return Bytes;
}();
