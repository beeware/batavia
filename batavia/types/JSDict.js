var pytypes = require('./Type');

/*************************************************************************
 * A Python dict type wrapping JS objects
 *************************************************************************/

module.exports = function() {
    var types = require('./_index');
    var builtins = require('../core/builtins');
    var utils = require('../utils');

    function JSDict(args, kwargs) {
        pytypes.Object.call(this);
        if (args) {
            this.update(args);
        }
    }

    JSDict.prototype = Object.create(pytypes.Object.prototype);
    JSDict.prototype.__class__ = new pytypes.Type('jsdict');

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    JSDict.prototype.toString = function() {
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

    JSDict.prototype.__str__ = function() {
        var result = "{", values = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                values.push(builtins.repr([key], null) + ": " + builtins.repr([this[key]], null));
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
         if (other !== builtins.None) {
             if (utils.isinstance(other, [
                         types.Bool, types.Dict, types.Float,
                         types.Int, types.JSDict, types.List,
                         types.NoneType, types.Str, types.Tuple
                    ])) {
                 throw new builtins.TypeError("unorderable types: dict() < " + utils.type_name(other) + "()");
             } else {
                 return this.valueOf() < other.valueOf();
             }
         } else {
             throw new builtins.TypeError("unorderable types: dict() < NoneType()");
         }
        return this.valueOf() < other;
    };

    JSDict.prototype.__le__ = function(other) {
         if (other !== builtins.None) {
             if (utils.isinstance(other, [
                         types.Bool, types.Dict, types.Float,
                         types.Int, types.JSDict, types.List,
                         types.NoneType, types.Str, types.Tuple
                    ])) {
                 throw new builtins.TypeError("unorderable types: dict() <= " + utils.type_name(other) + "()");
             } else {
                 return this.valueOf() <= other.valueOf();
             }
         } else {
             throw new builtins.TypeError("unorderable types: dict() <= NoneType()");
         }
    };

    JSDict.prototype.__eq__ = function(other) {
        return this.valueOf() == other;
    };

    JSDict.prototype.__ne__ = function(other) {
        return this.valueOf() != other;
    };

    JSDict.prototype.__gt__ = function(other) {
         if (other !== builtins.None) {
             if (utils.isinstance(other, [
                         types.Bool, types.Dict, types.Float,
                         types.Int, types.JSDict, types.List,
                         types.NoneType, types.Set, types.Str,
                         types.Tuple
                    ])) {
                 throw new builtins.TypeError("unorderable types: dict() > " + utils.type_name(other) + "()");
             } else {
                 return this.valueOf() > other.valueOf();
             }
         } else {
             throw new builtins.TypeError("unorderable types: dict() > NoneType()");
         }
    };

    JSDict.prototype.__ge__ = function(other) {
         if (other !== builtins.None) {
             if (utils.isinstance(other, [
                         types.Bool, types.Dict, types.Float,
                         types.Int, types.JSDict, types.List,
                         types.NoneType, types.Str, types.Tuple
                    ])) {
                 throw new builtins.TypeError("unorderable types: dict() >= " + utils.type_name(other) + "()");
             } else {
                 return this.valueOf() >= other.valueOf();
             }
         } else {
             throw new builtins.TypeError("unorderable types: dict() >= NoneType()");
         }
    };

    JSDict.prototype.__contains__ = function(other) {
        return this.valueOf().hasOwnProperty(other);
    };

    /**************************************************
     * Unary operators
     **************************************************/

    JSDict.prototype.__pos__ = function() {
        throw new builtins.TypeError("bad operand type for unary +: 'jsdict'");
    };

    JSDict.prototype.__neg__ = function() {
        throw new builtins.TypeError("bad operand type for unary -: 'jsdict'");
    };

    JSDict.prototype.__not__ = function() {
        return this.__bool__().__not__();
    };

    JSDict.prototype.__invert__ = function() {
        throw new builtins.TypeError("bad operand type for unary ~: 'jsdict'");
    };

    /**************************************************
     * Binary operators
     **************************************************/

    JSDict.prototype.__pow__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for ** or pow(): 'jsdict' and '" + utils.type_name(other) + "'");
    };

    JSDict.prototype.__div__ = function(other) {
        return this.__truediv__(other);
    };

    JSDict.prototype.__floordiv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for //: 'jsdict' and '" + utils.type_name(other) + "'");
    };

    JSDict.prototype.__truediv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for /: 'jsdict' and '" + utils.type_name(other) + "'");
    };

    JSDict.prototype.__mul__ = function(other) {
        if (utils.isinstance(other, [
                types.Bool, types.Dict, types.Float,
                types.JSDict, types.Int, types.NoneType])) {
            throw new builtins.TypeError("unsupported operand type(s) for *: 'jsdict' and '" + utils.type_name(other) + "'");
        } else {
            throw new builtins.TypeError("can't multiply sequence by non-int of type 'jsdict'");
        }
    };

    JSDict.prototype.__mod__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__mod__ has not been implemented");
    };

    JSDict.prototype.__add__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for +: 'jsdict' and '" + utils.type_name(other) + "'");
    };

    JSDict.prototype.__sub__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for -: 'jsdict' and '" + utils.type_name(other) + "'");
    };

    JSDict.prototype.__setitem__ = function(key, value) {
        this[key] = value;
    };

    JSDict.prototype.__lshift__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__lshift__ has not been implemented");
    };

    JSDict.prototype.__rshift__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__rshift__ has not been implemented");
    };

    JSDict.prototype.__and__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for &: 'jsdict' and '" + utils.type_name(other) + "'");
    };

    JSDict.prototype.__xor__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__xor__ has not been implemented");
    };

    JSDict.prototype.__or__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__or__ has not been implemented");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    JSDict.prototype.__ifloordiv__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__ifloordiv__ has not been implemented");
    };

    JSDict.prototype.__itruediv__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__itruediv__ has not been implemented");
    };

    JSDict.prototype.__iadd__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__iadd__ has not been implemented");
    };

    JSDict.prototype.__isub__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__isub__ has not been implemented");
    };

    JSDict.prototype.__imul__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__imul__ has not been implemented");
    };

    JSDict.prototype.__imod__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__imod__ has not been implemented");
    };

    JSDict.prototype.__ipow__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__ipow__ has not been implemented");
    };

    JSDict.prototype.__ilshift__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__ilshift__ has not been implemented");
    };

    JSDict.prototype.__irshift__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__irshift__ has not been implemented");
    };

    JSDict.prototype.__iand__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__iand__ has not been implemented");
    };

    JSDict.prototype.__ixor__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__ixor__ has not been implemented");
    };

    JSDict.prototype.__ior__ = function(other) {
        throw new builtins.NotImplementedError("Dict.__ior__ has not been implemented");
    };

    JSDict.prototype.__getitem__ = function(other) {
        var value = this[other];
        if (value === undefined) {
            throw new builtins.KeyError(other === null ? 'None': other.__str__());
        }
        return value;
    };

    JSDict.prototype.__delitem__ = function(key) {
        if (!this.__contains__(key)) {
            throw new builtins.KeyError(key === null ? 'None': key);
        }
        delete this[key];
    };

    /**************************************************
     * Methods
     **************************************************/

    JSDict.prototype.get = function(key, backup) {
        if (this.__contains__(key)) {
            return this[key];
        } else if (typeof backup === 'undefined') {
            throw new builtins.KeyError(key === null ? 'None': key);
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
        return new JSDict(this);
    };

    JSDict.prototype.items = function() {
        var result = new types.List();
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                result.append(new types.Tuple([key, this[key]]));
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
        return new types.List(result);
    };

    JSDict.prototype.__iter__ = function() {
        return this.keys().__iter__();
    };

    JSDict.prototype.values = function() {
        var result = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                result.push(this[key]);
            }
        }
        return new types.List(result);
    };

    JSDict.prototype.clear = function() {
        for (var key in this) {
            delete this[key];
        }
    };

    return JSDict;
}();

