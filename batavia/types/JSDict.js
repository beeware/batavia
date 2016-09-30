/*************************************************************************
 * A Python dict type wrapping JS objects
 *************************************************************************/

batavia.types.JSDict = function() {
    function JSDict(args, kwargs) {
        Object.call(this);
        if (args) {
            this.update(args);
        }
    }

    JSDict.prototype = Object.create(Object.prototype);
    JSDict.prototype.__class__ = new batavia.types.Type('jsdict');

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    JSDict.prototype.toString = function () {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    JSDict.prototype.__bool__ = function() {
        return Object.keys(this).length > 0;
    };

    JSDict.prototype.__repr__ = function() {
        return this.__str__();
    };

    JSDict.prototype.__str__ = function () {
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

    JSDict.prototype.__lt__ = function(other) {
         if (other !== null) {
             if (batavia.isinstance(other, [
                         batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                         batavia.types.Int, batavia.types.JSDict, batavia.types.List,
                         batavia.types.NoneType, batavia.types.Str, batavia.types.Tuple
                    ])) {
                 throw new batavia.builtins.TypeError("unorderable types: dict() < " + batavia.type_name(other) + "()");
             } else {
                 return this.valueOf() < other.valueOf();
             }
         } else {
             throw new batavia.builtins.TypeError("unorderable types: dict() < NoneType()");
         }
        return this.valueOf() < other;
    };

    JSDict.prototype.__le__ = function(other) {
         if (other !== null) {
             if (batavia.isinstance(other, [
                         batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                         batavia.types.Int, batavia.types.JSDict, batavia.types.List,
                         batavia.types.NoneType, batavia.types.Str, batavia.types.Tuple
                    ])) {
                 throw new batavia.builtins.TypeError("unorderable types: dict() <= " + batavia.type_name(other) + "()");
             } else {
                 return this.valueOf() <= other.valueOf();
             }
         } else {
             throw new batavia.builtins.TypeError("unorderable types: dict() <= NoneType()");
         }
    };

    JSDict.prototype.__eq__ = function(other) {
        return this.valueOf() == other;
    };

    JSDict.prototype.__ne__ = function(other) {
        return this.valueOf() != other;
    };

    JSDict.prototype.__gt__ = function(other) {
         if (other !== null) {
             if (batavia.isinstance(other, [
                         batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                         batavia.types.Int, batavia.types.JSDict, batavia.types.List,
                         batavia.types.NoneType, batavia.types.Set, batavia.types.Str,
                         batavia.types.Tuple
                    ])) {
                 throw new batavia.builtins.TypeError("unorderable types: dict() > " + batavia.type_name(other) + "()");
             } else {
                 return this.valueOf() > other.valueOf();
             }
         } else {
             throw new batavia.builtins.TypeError("unorderable types: dict() > NoneType()");
         }
    };

    JSDict.prototype.__ge__ = function(other) {
         if (other !== null) {
             if (batavia.isinstance(other, [
                         batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                         batavia.types.Int, batavia.types.JSDict, batavia.types.List,
                         batavia.types.NoneType, batavia.types.Str, batavia.types.Tuple
                    ])) {
                 throw new batavia.builtins.TypeError("unorderable types: dict() >= " + batavia.type_name(other) + "()");
             } else {
                 return this.valueOf() >= other.valueOf();
             }
         } else {
             throw new batavia.builtins.TypeError("unorderable types: dict() >= NoneType()");
         }
    };

    JSDict.prototype.__contains__ = function(other) {
        return this.valueOf().hasOwnProperty(other);
    };

    /**************************************************
     * Unary operators
     **************************************************/

    JSDict.prototype.__pos__ = function() {
        return new Dict(+this.valueOf());
    };

    JSDict.prototype.__neg__ = function() {
        return new Dict(-this.valueOf());
    };

    JSDict.prototype.__not__ = function() {
        return new Dict(!this.valueOf());
    };

    JSDict.prototype.__invert__ = function() {
        return new Dict(~this.valueOf());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    JSDict.prototype.__pow__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'dict' and '" + batavia.type_name(other) + "'");
    };

    JSDict.prototype.__div__ = function(other) {
        return this.__truediv__(other);
    };

    JSDict.prototype.__floordiv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'dict' and '" + batavia.type_name(other) + "'");
    };

    JSDict.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'dict' and '" + batavia.type_name(other) + "'");
    };

    JSDict.prototype.__mul__ = function(other) {
        if (batavia.isinstance(other, [
                batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                batavia.types.JSDict, batavia.types.Int, batavia.types.NoneType])) {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'dict' and '" + batavia.type_name(other) + "'");
        } else {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'dict'");
        }
    };

    JSDict.prototype.__mod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__mod__ has not been implemented");
    };

    JSDict.prototype.__add__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'dict' and '" + batavia.type_name(other) + "'");
    };

    JSDict.prototype.__sub__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'dict' and '" + batavia.type_name(other) + "'");
    };

    JSDict.prototype.__getitem__ = function(other) {
        var value = this[other];
        if (value === undefined) {
            throw new batavia.builtins.KeyError(other === null ? 'None': other.__str__());
        }
        return value;
    };

    JSDict.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__lshift__ has not been implemented");
    };

    JSDict.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__rshift__ has not been implemented");
    };

    JSDict.prototype.__and__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for &: 'dict' and '" + batavia.type_name(other) + "'");
    };

    JSDict.prototype.__xor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__xor__ has not been implemented");
    };

    JSDict.prototype.__or__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__or__ has not been implemented");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    JSDict.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__ifloordiv__ has not been implemented");
    };

    JSDict.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__itruediv__ has not been implemented");
    };

    JSDict.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__iadd__ has not been implemented");
    };

    JSDict.prototype.__isub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__isub__ has not been implemented");
    };

    JSDict.prototype.__imul__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__imul__ has not been implemented");
    };

    JSDict.prototype.__imod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__imod__ has not been implemented");
    };

    JSDict.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__ipow__ has not been implemented");
    };

    JSDict.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__ilshift__ has not been implemented");
    };

    JSDict.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__irshift__ has not been implemented");
    };

    JSDict.prototype.__iand__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__iand__ has not been implemented");
    };

    JSDict.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__ixor__ has not been implemented");
    };

    JSDict.prototype.__ior__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Dict.__ior__ has not been implemented");
    };

    /**************************************************
     * Methods
     **************************************************/

    JSDict.prototype.get = function(key, backup) {
        if (this.__contains__(key)) {
            return this[key];
        } else if (typeof backup === 'undefined') {
            return null;
        } else {
            return backup;
        }
    };

    JSDict.prototype.update = function(values) {
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key];
            }
        }
    };

    JSDict.prototype.copy = function() {
        return new Dict(this);
    };

    JSDict.prototype.items = function() {
        var result = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                result.push([key, this[key]]);
            }
        }
        return result;
    };

    JSDict.prototype.keys = function() {
        var result = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                result.push(key);
            }
        }
        return new batavia.types.List(result);
    };

    JSDict.prototype.values = function() {
        var result = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                result.push(this[key]);
            }
        }
        return new batavia.types.List(result);
    };

    return JSDict;
}();
