/*************************************************************************
 * A Python dict type
 *************************************************************************/

batavia.types.Dict = function() {
    function Dict(args, kwargs) {
        Object.call(this);
        if (args) {
            this.update(args);
        }
    }

    Dict.prototype = Object.create(Object.prototype);

    Dict.prototype.constructor = Dict;
    Dict.__name__ = '__dict__';
    
    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Dict.prototype.toString = function () {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Dict.prototype.__bool__ = function() {
        return this.size() !== 0;
    };

    Dict.prototype.__repr__ = function() {
        return this.__str__();
    };

    Dict.prototype.__str__ = function () {
        var result = "{", values = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                values.push(batavia.builtins.repr([key], null) + ": " + batavia.builtins.repr([this[key]], null));
            }
        }
        result += values.join(', ');
        result += "}";
        return result;
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Dict.prototype.__lt__ = function(other) {
        return this.valueOf() < other;
    };

    Dict.prototype.__le__ = function(other) {
        return this.valueOf() <= other;
    };

    Dict.prototype.__eq__ = function(other) {
        return this.valueOf() == other;
    };

    Dict.prototype.__ne__ = function(other) {
        return this.valueOf() != other;
    };

    Dict.prototype.__gt__ = function(other) {
        return this.valueOf() > other;
    };

    Dict.prototype.__ge__ = function(other) {
        return this.valueOf() >= other;
    };

    Dict.prototype.__contains__ = function(other) {
        return this.valueOf().hasOwnProperty(other);
    };

    /**************************************************
     * Unary operators
     **************************************************/

    Dict.prototype.__pos__ = function() {
        return new Dict(+this.valueOf());
    };

    Dict.prototype.__neg__ = function() {
        return new Dict(-this.valueOf());
    };

    Dict.prototype.__not__ = function() {
        return new Dict(!this.valueOf());
    };

    Dict.prototype.__invert__ = function() {
        return new Dict(~this.valueOf());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Dict.prototype.__pow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__pow__ has not been implemented");
    };

    Dict.prototype.__div__ = function(other) {
        return this.__truediv__(other);
    };

    Dict.prototype.__floordiv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'dict' and '" + batavia.type_name(other) + "'");
    };

    Dict.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'dict' and '" + batavia.type_name(other) + "'");
    };

    Dict.prototype.__mul__ = function(other) {
        if (batavia.isinstance(other, [
                batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                batavia.types.Int, batavia.types.NoneType])) {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'dict' and '" + batavia.type_name(other) + "'");
        } else {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'dict'");
        }
    };

    Dict.prototype.__mod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__mod__ has not been implemented");
    };

    Dict.prototype.__add__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'dict' and '" + batavia.type_name(other) + "'");
    };

    Dict.prototype.__sub__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'dict' and '" + batavia.type_name(other) + "'");
    };

    Dict.prototype.__getitem__ = function(other) {
        var value = this[other];
        if (value === undefined) {
            throw new batavia.builtins.KeyError(other === null ? 'None': other.__str__());
        }
        return value;
    };

    Dict.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__lshift__ has not been implemented");
    };

    Dict.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__rshift__ has not been implemented");
    };

    Dict.prototype.__and__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__and__ has not been implemented");
    };

    Dict.prototype.__xor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__xor__ has not been implemented");
    };

    Dict.prototype.__or__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__or__ has not been implemented");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    Dict.prototype.__idiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__idiv__ has not been implemented");
    };

    Dict.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__ifloordiv__ has not been implemented");
    };

    Dict.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__itruediv__ has not been implemented");
    };

    Dict.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__iadd__ has not been implemented");
    };

    Dict.prototype.__isub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__isub__ has not been implemented");
    };

    Dict.prototype.__imul__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__imul__ has not been implemented");
    };

    Dict.prototype.__imod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__imod__ has not been implemented");
    };

    Dict.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__ipow__ has not been implemented");
    };

    Dict.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__ilshift__ has not been implemented");
    };

    Dict.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__irshift__ has not been implemented");
    };

    Dict.prototype.__iand__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__iand__ has not been implemented");
    };

    Dict.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__ixor__ has not been implemented");
    };

    Dict.prototype.__ior__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__ior__ has not been implemented");
    };

    /**************************************************
     * Methods
     **************************************************/

    Dict.prototype.update = function(values) {
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key];
            }
        }
    };

    Dict.prototype.copy = function() {
        return new Dict(this);
    };

    Dict.prototype.items = function() {
        var result = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                result.push([key, this[key]]);
            }
        }
        return result;
    };

    return Dict;
}();
