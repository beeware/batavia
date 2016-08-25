
/*************************************************************************
 * A Python float type
 *************************************************************************/

batavia.types.Float = function() {
    function Float(val) {
        this.val = val;
    }

    Float.prototype = Object.create(Object.prototype);
    Float.prototype.__class__ = new batavia.types.Type('float');

    function python_modulo(n, M) {
        return ((n % M) + M) % M;
    }

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Float.prototype.toString = function() {
        return this.__str__();
    };

    Float.prototype.valueOf = function() {
        return this.val;
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Float.prototype.__bool__ = function() {
        return this.val !== 0.0;
    };

    Float.prototype.__repr__ = function() {
        return this.__str__();
    };

    Float.prototype.__str__ = function() {
        if (this.val === 0) {
            if (1/this.val === Infinity) {
                return '0.0';
            } else {
                return '-0.0';
            }
        } else if (this.val === Math.round(this. val)) {
            return this.val.toString() + '.0';
        } else {
            return this.val.toString();
        }
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Float.prototype.__lt__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Dict, batavia.types.List, batavia.types.Tuple,
                        batavia.types.NoneType, batavia.types.Str, batavia.types.NotImplementedType,
                        batavia.types.Range, batavia.types.Set, batavia.types.Slice
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: float() < " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() < other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: float() < NoneType()");
        }
    };

    Float.prototype.__le__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Dict, batavia.types.List, batavia.types.Tuple,
                        batavia.types.NoneType, batavia.types.Str, batavia.types.NotImplementedType,
                        batavia.types.Range, batavia.types.Set, batavia.types.Slice
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: float() <= " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() <= other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: float() <= NoneType()");
        }
    };

    Float.prototype.__eq__ = function(other) {
        if (other !== null && !batavia.isinstance(other, batavia.types.Str)) {
            var val;
            if (batavia.isinstance(other, batavia.types.Bool)) {
                val = other.valueOf() ? 1.0 : 0.0;
            } else {
                val = other.valueOf();
            }
            return this.valueOf() === val;
        }
        return false;
    };

    Float.prototype.__ne__ = function(other) {
        return !this.__eq__(other);
    };

    Float.prototype.__gt__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Dict, batavia.types.List, batavia.types.Tuple,
                        batavia.types.NoneType, batavia.types.Str, batavia.types.NotImplementedType,
                        batavia.types.Range, batavia.types.Set, batavia.types.Slice
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: float() > " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() > other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: float() > NoneType()");
        }
    };

    Float.prototype.__ge__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Dict, batavia.types.List, batavia.types.Tuple,
                        batavia.types.NoneType, batavia.types.Str, batavia.types.NotImplementedType,
                        batavia.types.Range, batavia.types.Set, batavia.types.Slice
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: float() >= " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() >= other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: float() >= NoneType()");
        }
    };

    Float.prototype.__contains__ = function(other) {
        return false;
    };

    /**************************************************
     * Unary operators
     **************************************************/

    Float.prototype.__pos__ = function() {
        return new Float(+this.valueOf());
    };

    Float.prototype.__neg__ = function() {
        return new Float(-this.valueOf());
    };

    Float.prototype.__not__ = function() {
        return new Float(!this.valueOf());
    };

    Float.prototype.__invert__ = function() {
        throw new batavia.builtins.TypeError("bad operand type for unary ~: 'float'");
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Float.prototype.__pow__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Float(Math.pow(this.valueOf(), other.valueOf() ? 1 : 0));
        } else if (batavia.isinstance(other, [batavia.types.Float, batavia.types.Int])) {
            if (this.valueOf() == 0 && other.valueOf() < 0) {
                throw new batavia.builtins.ZeroDivisionError("0.0 cannot be raised to a negative power");
            } else {
                return new Float(Math.pow(this.valueOf(), other.valueOf()));
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'float' and '" + batavia.type_name(other) + "'");
        }
    };

    Float.prototype.__div__ = function(other) {
        return this.__truediv__(other);
    };

    Float.prototype.__floordiv__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (!other.val.isZero()) {
                return new Float(Math.floor(this.valueOf() / other.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("float divmod()");
            }
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            if (other.valueOf()) {
                return new Float(Math.floor(this.valueOf() / other.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("float divmod()");
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Float(Math.floor(this.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("float divmod()");
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'float' and '" + batavia.type_name(other) + "'");
        }
    };

    Float.prototype.__truediv__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (!other.val.isZero()) {
                return new Float(this.valueOf() / other.valueOf());
            } else {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
            }
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            if (other.valueOf()) {
                return new Float(this.valueOf() / other.valueOf());
            } else {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Float(this.valueOf());
            } else {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'float' and '" + batavia.type_name(other) + "'");
        }
    };

    Float.prototype.__mul__ = function(other) {
        if (other === null) {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'float' and 'NoneType'");
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Float(this.valueOf() * (other.valueOf() ? 1 : 0));
        } else if (batavia.isinstance(other, [batavia.types.Float, batavia.types.Int])) {
            return new batavia.types.Float(this.valueOf() * other.valueOf());
        } else if (batavia.isinstance(other, [batavia.types.List, batavia.types.Str, batavia.types.Tuple])) {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'float'");
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'float' and '" + batavia.type_name(other) + "'");
        }
    };

    Float.prototype.__mod__ = function(other) {
        /* TODO: Fix case for -0.0, which is coming out 0.0 */
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (other.val.isZero()) {
                throw new batavia.builtins.ZeroDivisionError("float modulo");
            } else {
                return new Float(python_modulo(this.valueOf(), parseFloat(other.val)));
            }
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            if (other.valueOf() === 0) {
                throw new batavia.builtins.ZeroDivisionError("float modulo");
            } else {
                return new Float(python_modulo(this.valueOf(), other.valueOf()));
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Float(python_modulo(this.valueOf(), other.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("float modulo");
            }
        } else {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for %: 'float' and '" + batavia.type_name(other) + "'"
            );
        }
    };

    Float.prototype.__add__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.Int, batavia.types.Float])) {
            return new Float(this.valueOf() + parseFloat(other.valueOf()));
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Float(this.valueOf() + (other.valueOf() ? 1.0 : 0.0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'float' and '" + batavia.type_name(other) + "'");
        }
    };

    Float.prototype.__sub__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.Int, batavia.types.Float])) {
            return new Float(this.valueOf() - other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Float(this.valueOf() - (other.valueOf() ? 1.0 : 0.0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'float' and '" + batavia.type_name(other) + "'");
        }
    };

    Float.prototype.__getitem__ = function(other) {
        throw new batavia.builtins.TypeError("'float' object is not subscriptable")
    };

    Float.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.TypeError(
            "unsupported operand type(s) for <<: 'float' and '" + batavia.type_name(other) + "'"
        );
    };

    Float.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.TypeError(
            "unsupported operand type(s) for >>: 'float' and '" + batavia.type_name(other) + "'"
        );
    };

    Float.prototype.__and__ = function(other) {
        throw new batavia.builtins.TypeError(
            "unsupported operand type(s) for &: 'float' and '" + batavia.type_name(other) + "'"
        );
    };

    Float.prototype.__xor__ = function(other) {
        throw new batavia.builtins.TypeError(
            "unsupported operand type(s) for ^: 'float' and '" + batavia.type_name(other) + "'"
        );
    };

    Float.prototype.__or__ = function(other) {
        throw new batavia.builtins.TypeError(
            "unsupported operand type(s) for |: 'float' and '" + batavia.type_name(other) + "'"
        );
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    // Call the method named "f" with argument "other"; if a type error is raised, throw a different type error
    Float.prototype.__call_binary_operator__ = function(f, operator_str, other) {
        try {
            return this[f](other);
        } catch (error) {
            if (error instanceof batavia.builtins.TypeError) {
                throw new batavia.builtins.TypeError(
                    "unsupported operand type(s) for " + operator_str + ": 'float' and '" + batavia.type_name(other) + "'");
            } else {
                throw error;
            }
        }
    };

    Float.prototype.__ifloordiv__ = function(other) {
        return this.__call_binary_operator__('__floordiv__', '//=', other);
    };

    Float.prototype.__itruediv__ = function(other) {
        return this.__call_binary_operator__('__truediv__', "/=", other);
    };

    Float.prototype.__iadd__ = function(other) {
        return this.__call_binary_operator__('__add__', "+=", other);
    };

    Float.prototype.__isub__ = function(other) {
        return this.__call_binary_operator__('__sub__', "-=", other);
    };

    Float.prototype.__imul__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.List, batavia.types.Str, batavia.types.Tuple])) {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'float'");
        } else {
            return this.__call_binary_operator__('__mul__', "*=", other);
        }
    };

    Float.prototype.__imod__ = function(other) {
        return this.__call_binary_operator__('__mod__', "%=", other);
    };

    Float.prototype.__ipow__ = function(other) {
        return this.__pow__(other);
    };

    Float.prototype.__ilshift__ = function(other) {
        return this.__call_binary_operator__('__lshift__', "<<=", other);
    };

    Float.prototype.__irshift__ = function(other) {
        return this.__call_binary_operator__('__rshift__', ">>=", other);
    };

    Float.prototype.__iand__ = function(other) {
        return this.__call_binary_operator__('__and__', "&=", other);
    };

    Float.prototype.__ixor__ = function(other) {
        return this.__call_binary_operator__('__xor__', "^=", other);
    };

    Float.prototype.__ior__ = function(other) {
        return this.__call_binary_operator__('__or__', "|=", other);
    };

    /**************************************************
     * Methods
     **************************************************/

    Float.prototype.copy = function() {
        return new Float(this.valueOf());
    };

    /**************************************************/

    return Float;
}();
