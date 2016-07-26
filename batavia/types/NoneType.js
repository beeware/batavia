
batavia.types.NoneType = {
    __name__: 'NoneType',

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__: function() {
        return false;
    },

    __repr__: function() {
        return "<class 'NoneType'>";
    },

    __str__: function() {
        return "<class 'NoneType'>";
    },

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__: function(other) {
        throw new batavia.builtins.TypeError("unorderable types: NoneType() < " +  batavia.type_name(other) + "()");
    },

    __le__: function(other) {
        throw new batavia.builtins.TypeError("unorderable types: NoneType() <= " +  batavia.type_name(other) + "()");
    },

    __eq__: function(other) {
        return other === null;
    },

    __ne__: function(other) {
        return other !== null;
    },

    __gt__: function(other) {
        throw new batavia.builtins.TypeError("unorderable types: NoneType() > " +  batavia.type_name(other) + "()");
    },

    __ge__: function(other) {
        throw new batavia.builtins.TypeError("unorderable types: NoneType() >= " +  batavia.type_name(other) + "()");
    },

    __contains__: function(other) {
        return false;
    },

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__: function() {
        throw new batavia.builtins.TypeError("bad operand type for unary +: 'NoneType'");
    },

    __neg__: function() {
        throw new batavia.builtins.TypeError("bad operand type for unary -: 'NoneType'");
    },

    __not__: function() {
        return true;
    },

    __invert__: function() {
        throw new batavia.builtins.TypeError("bad operand type for unary ~: 'NoneType'");
    },

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __div__: function(other) {
        return NoneType.__truediv__(other);
    },

    __floordiv__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __truediv__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __mul__: function(other) {
        if (batavia.isinstance(other, [batavia.types.List, batavia.types.Tuple, batavia.types.Str])) {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'NoneType'");
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'NoneType' and '" + batavia.type_name(other) + "'");
        }
    },

    __mod__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for %: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __add__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __sub__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __getitem__: function(other) {
        throw new batavia.builtins.TypeError("'NoneType' object is not subscriptable");
    },

    __lshift__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for <<: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __rshift__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for >>: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __and__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for &: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __xor__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ^: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __or__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for |: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //=: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __itruediv__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /=: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __iadd__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for +=: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __isub__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -=: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __imul__: function(other) {
        if (batavia.isinstance(other, [batavia.types.List, batavia.types.Tuple, batavia.types.Str])) {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'NoneType'");
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *=: 'NoneType' and '" + batavia.type_name(other) + "'");
        }
    },

    __imod__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for %=: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __ipow__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __ilshift__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for <<=: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __irshift__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for >>=: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __iand__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for &=: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __ixor__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ^=: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __ior__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for |=: 'NoneType' and '" + batavia.type_name(other) + "'");
    }
};
