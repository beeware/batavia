/*************************************************************************
 * An implementation of NotImplementedType
 *************************************************************************/
var pytypes = require('./Type');


module.exports = function() {
    var types = require('./_index');
    var builtins = require('../core/builtins');
    var utils = require('../utils');

    function NotImplementedType(args, kwargs) {
        pytypes.Object.call(this);
        if (args) {
            this.update(args);
        }
    }

    NotImplementedType.prototype = Object.create(pytypes.Object.prototype);
    NotImplementedType.prototype.__class__ = new pytypes.Type('NotImplementedType');

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    NotImplementedType.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    NotImplementedType.prototype.__bool__ = function() {
        return new types.Bool(true);
    };

    NotImplementedType.prototype.__repr__ = function() {
        return this.__str__();
    };

    NotImplementedType.prototype.__str__ = function() {
        var result = "{", values = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                values.push(builtins.repr(key));
            }
        }
        result += values.join(', ');
        result += "}";
        return result;
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    NotImplementedType.prototype.__lt__ = function(other) {
        throw new builtins.TypeError("unorderable types: NotImplementedType() < " + utils.type_name(other) + "()");
    };

    NotImplementedType.prototype.__le__ = function(other) {
        throw new builtins.TypeError("unorderable types: NotImplementedType() <= " + utils.type_name(other) + "()");
    };

    NotImplementedType.prototype.__eq__ = function(other) {
        return this.valueOf() == other;
    };

    NotImplementedType.prototype.__ne__ = function(other) {
        return this.valueOf() != other;
    };

    NotImplementedType.prototype.__gt__ = function(other) {
        throw new builtins.TypeError("unorderable types: NotImplementedType() > " + utils.type_name(other) + "()");
    };

    NotImplementedType.prototype.__ge__ = function(other) {
        throw new builtins.TypeError("unorderable types: NotImplementedType() >= " + utils.type_name(other) + "()");
    };

    NotImplementedType.prototype.__contains__ = function(other) {
        return this.valueOf().hasOwnProperty(other);
    };


    /**************************************************
     * Unary operators
     **************************************************/

    NotImplementedType.prototype.__pos__ = function() {
        return new NotImplemented(+this.valueOf());
    };

    NotImplementedType.prototype.__neg__ = function() {
        return new NotImplemented(-this.valueOf());
    };

    NotImplementedType.prototype.__not__ = function() {
        return new NotImplemented(!this.valueOf());
    };

    NotImplementedType.prototype.__invert__ = function() {
        return new NotImplemented(~this.valueOf());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    NotImplementedType.prototype.__pow__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for ** or pow(): 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__div__ = function(other) {
        throw new builtins.NotImplementedError("NotImplementedType.__div__ has not been implemented");
    };

    NotImplementedType.prototype.__floordiv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for //: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__truediv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for /: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__mul__ = function(other) {
        if (utils.isinstance(other, [types.Tuple, types.Str, types.List, types.Bytes,
            types.Bytearray
        ])) {
            throw new builtins.TypeError("can't multiply sequence by non-int of type 'NotImplementedType'")
        }
        throw new builtins.TypeError("unsupported operand type(s) for *: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__mod__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for %: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__add__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for +: 'NotImplementedType' and '" + utils.type_name(other) + "'");
    };

    NotImplementedType.prototype.__sub__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for -: 'NotImplementedType' and '" + utils.type_name(other) + "'");
    };

    NotImplementedType.prototype.__getitem__ = function(other) {
        throw new builtins.NotImplementedError("NotImplementedType.__getitem__ has not been implemented");
    };

    NotImplementedType.prototype.__lshift__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for <<: 'NotImplementedType' and '" + utils.type_name(other) + "'");
    };

    NotImplementedType.prototype.__rshift__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for >>: 'NotImplementedType' and '" + utils.type_name(other) + "'");
    };

    NotImplementedType.prototype.__and__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for &: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__xor__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for ^: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__or__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for |: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    NotImplementedType.prototype.__idiv__ = function(other) {
        throw new builtins.NotImplementedError("NotImplementedType.__idiv__ has not been implemented");
    };

    NotImplementedType.prototype.__ifloordiv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for //=: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__itruediv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for /=: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__iadd__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for +=: 'NotImplementedType' and '" + utils.type_name(other) + "'");
    };

    NotImplementedType.prototype.__isub__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for -=: 'NotImplementedType' and '" + utils.type_name(other) + "'");
    };

    NotImplementedType.prototype.__imul__ = function(other) {
        if (utils.isinstance(other, [types.Tuple, types.Str, types.List, types.Bytes,
            types.Bytearray
        ])) {
            throw new builtins.TypeError("can't multiply sequence by non-int of type 'NotImplementedType'")
        }
        throw new builtins.TypeError("unsupported operand type(s) for *=: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__imod__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for %=: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__ipow__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for ** or pow(): 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__ilshift__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for <<=: 'NotImplementedType' and '" + utils.type_name(other) + "'");
    };

    NotImplementedType.prototype.__irshift__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for >>=: 'NotImplementedType' and '" + utils.type_name(other) + "'");
    };

    NotImplementedType.prototype.__iand__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for &=: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__ixor__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for ^=: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    NotImplementedType.prototype.__ior__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for |=: 'NotImplementedType' and '" + utils.type_name(other) + "'")
    };

    /**************************************************/

    return NotImplementedType;
}()
