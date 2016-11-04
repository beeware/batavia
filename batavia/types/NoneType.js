
batavia.types.NoneType = function() {
    function NoneType() {
        Object.call(this);
    }

    NoneType.prototype = Object.create(Object.prototype);
    NoneType.prototype.__class__ = new batavia.types.Type('NoneType');

    NoneType.prototype.__name__ = 'NoneType';

    /**************************************************
     * Type conversions
     **************************************************/

    NoneType.prototype.__bool__ = function() {
        return false;
    };

    NoneType.prototype.__repr__ = function() {
        return "None";
    };

    NoneType.prototype.__str__ = function() {
        return "None";
    };

    /**************************************************
     * Attribute manipulation
     **************************************************/

    NoneType.prototype.__getattr__ = function(attr) {
        throw new batavia.builtins.AttributeError("'NoneType' object has no attribute '" + attr + "'");
    };

    NoneType.prototype.__setattr__ = function(attr, value) {
        throw new batavia.builtins.AttributeError("'NoneType' object has no attribute '" + attr + "'");
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    NoneType.prototype.__lt__ = function(other) {
        throw new batavia.builtins.TypeError("unorderable types: NoneType() < " +  batavia.type_name(other) + "()");
    };

    NoneType.prototype.__le__ = function(other) {
        throw new batavia.builtins.TypeError("unorderable types: NoneType() <= " +  batavia.type_name(other) + "()");
    };

    NoneType.prototype.__eq__ = function(other) {
        return other === this;
    };

    NoneType.prototype.__ne__ = function(other) {
        return other !== this;
    };

    NoneType.prototype.__gt__ = function(other) {
        throw new batavia.builtins.TypeError("unorderable types: NoneType() > " +  batavia.type_name(other) + "()");
    };

    NoneType.prototype.__ge__ = function(other) {
        throw new batavia.builtins.TypeError("unorderable types: NoneType() >= " +  batavia.type_name(other) + "()");
    };

    NoneType.prototype.__contains__ = function(other) {
        return false;
    };

    /**************************************************
     * Unary operators
     **************************************************/

    NoneType.prototype.__pos__ = function() {
        throw new batavia.builtins.TypeError("bad operand type for unary +: 'NoneType'");
    };

    NoneType.prototype.__neg__ = function() {
        throw new batavia.builtins.TypeError("bad operand type for unary -: 'NoneType'");
    };

    NoneType.prototype.__not__ = function() {
        return true;
    };

    NoneType.prototype.__invert__ = function() {
        throw new batavia.builtins.TypeError("bad operand type for unary ~: 'NoneType'");
    };

    /**************************************************
     * Binary operators
     **************************************************/

    NoneType.prototype.__pow__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__div__ = function(other) {
        return NoneType.__truediv__(other);
    };

    NoneType.prototype.__floordiv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__mul__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.List, batavia.types.Tuple, batavia.types.Str])) {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'NoneType'");
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'NoneType' and '" + batavia.type_name(other) + "'");
        }
    };

    NoneType.prototype.__mod__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for %: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__add__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__sub__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__getitem__ = function(other) {
        throw new batavia.builtins.TypeError("'NoneType' object is not subscriptable");
    };

    NoneType.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for <<: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for >>: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__and__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for &: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__xor__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ^: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__or__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for |: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    NoneType.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //=: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /=: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for +=: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__isub__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -=: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__imul__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.List, batavia.types.Tuple, batavia.types.Str])) {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'NoneType'");
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *=: 'NoneType' and '" + batavia.type_name(other) + "'");
        }
    };

    NoneType.prototype.__imod__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for %=: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for <<=: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for >>=: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__iand__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for &=: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ^=: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    NoneType.prototype.__ior__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for |=: 'NoneType' and '" + batavia.type_name(other) + "'");
    };

    return NoneType;
}();
