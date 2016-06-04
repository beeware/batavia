
batavia.types.NoneType = {
    __name__: 'NoneType',

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__: function() {
        return false;
    },

    __repr__: function() {
        return 'None';
    },

    __str__: function() {
        return 'None';
    },

    /**************************************************
     * Comparison operators
     **************************************************/

    __le__: function(other) {
        return false;
    },

    __eq__: function(other) {
        return other === null;
    },

    __ne__: function(other) {
        return other !== null;
    },

    __gt__: function(other) {
        return false;
    },

    __ge__: function(other) {
        return false;
    },

    __contains__: function(other) {
        return false;
    },

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__: function() {
        throw new batavia.builtins.NotImplementedError("NoneType.__pos__ has not been implemented");
    },

    __neg__: function() {
        throw new batavia.builtins.NotImplementedError("NoneType.__neg__ has not been implemented");
    },

    __not__: function() {
        return true;
    },

    __invert__: function() {
        throw new batavia.builtins.NotImplementedError("NoneType.__invert__ has not been implemented");
    },

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for pow: 'NoneType' and '" + batavia.type_name(other) + "'");
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
        throw new batavia.builtins.TypeError("unsupported operand type(s) for []: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __lshift__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for <<: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __rshift__: function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for >>: 'NoneType' and '" + batavia.type_name(other) + "'");
    },

    __and__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__and__ has not been implemented");
    },

    __xor__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__xor__ has not been implemented");
    },

    __or__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__or__ has not been implemented");
    },

    /**************************************************
     * Inplace operators
     **************************************************/

    __idiv__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__idiv__ has not been implemented");
    },

    __ifloordiv__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__ifloordiv__ has not been implemented");
    },

    __itruediv__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__itruediv__ has not been implemented");
    },

    __iadd__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__iadd__ has not been implemented");
    },

    __isub__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__isub__ has not been implemented");
    },

    __imul__: function(other) {
        if (batavia.isinstance(other, [batavia.types.List, batavia.types.Tuple, batavia.types.Str])) {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'NoneType'");
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'NoneType' and '" + batavia.type_name(other) + "'");
        }
    },

    __imod__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__imod__ has not been implemented");
    },

    __ipow__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__ipow__ has not been implemented");
    },

    __ilshift__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__ilshift__ has not been implemented");
    },

    __irshift__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__irshift__ has not been implemented");
    },

    __iand__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__iand__ has not been implemented");
    },

    __ixor__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__ixor__ has not been implemented");
    },

    __ior__: function(other) {
        throw new batavia.builtins.NotImplementedError("NoneType.__ior__ has not been implemented");
    }
};
