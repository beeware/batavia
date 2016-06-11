
/*************************************************************************
 * A Python float type
 *************************************************************************/

batavia.types.Float = function() {
    function Float(val) {
        this.val = val;
    }

    Float.prototype = Object.create(Object.prototype);

    Float.prototype.constructor = Float;
    Float.prototype.__name__ = 'float';

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
            return this.valueOf() < other.valueOf();
        }
        return false;
    };

    Float.prototype.__le__ = function(other) {
        if (other !== null) {
            return this.valueOf() <= other.valueOf();
        }
        return false;
    };

    Float.prototype.__eq__ = function(other) {
        if (other !== null) {
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
        if (other !== null) {
            var val;
            if (batavia.isinstance(other, batavia.types.Bool)) {
                val = other.valueOf() ? 1.0 : 0.0;
            } else {
                val = other.valueOf();
            }
            return this.valueOf() !== val;
        }
        return true;
    };

    Float.prototype.__gt__ = function(other) {
        if (other !== null) {
            return this.valueOf() > other.valueOf();
        }
        return false;
    };

    Float.prototype.__ge__ = function(other) {
        if (other !== null) {
            return this.valueOf() >= other.valueOf();
        }
        return false;
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
        return new Float(~this.valueOf());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Float.prototype.__pow__ = function(other) {
        return new Float(Math.pow(this.valueOf(), b.valueOf()));
    };

    Float.prototype.__div__ = function(other) {
        return this.__truediv__(other);
    };

    Float.prototype.__floordiv__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.Float, batavia.types.Int])) {
            if (other.valueOf()) {
                return new Float(Math.floor(this.valueOf() / other.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
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
        if (batavia.isinstance(other, [batavia.types.Float, batavia.types.Int])) {
            if (other.valueOf() === 0.0) {
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
        } else if (batavia.isinstance(other, [batavia.types.NotImplementedType, batavia.types.Dict])) {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'float' and '" + batavia.type_name(other) + "'");
        } else {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'float'");
        }
    };

    Float.prototype.__mod__ = function(other) {
        /* TODO: Fix case for -0.0, which is coming out 0.0 */
        if (batavia.isinstance(other, [batavia.types.Int, batavia.types.Float])) {
            if (other.valueOf() === 0) {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
            } else {
                return new Float(python_modulo(this.valueOf(), other.valueOf()));
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Float(python_modulo(this.valueOf(), other.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
            }
        } else {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for %: 'float' and '" + batavia.type_name(other) + "'"
            );
        }
    };

    Float.prototype.__add__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.Int, batavia.types.Float])) {
            return new Float(this.valueOf() + other.valueOf());
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
        throw new batavia.builtins.NotImplementedError("Float.__getitem__ has not been implemented");
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

    Float.prototype.__idiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__idiv__ has not been implemented");
    };

    Float.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__ifloordiv__ has not been implemented");
    };

    Float.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__itruediv__ has not been implemented");
    };

    Float.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__iadd__ has not been implemented");
    };

    Float.prototype.__isub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__isub__ has not been implemented");
    };

    Float.prototype.__imul__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__imul__ has not been implemented");
    };

    Float.prototype.__imod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__imod__ has not been implemented");
    };

    Float.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__ipow__ has not been implemented");
    };

    Float.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__ilshift__ has not been implemented");
    };

    Float.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__irshift__ has not been implemented");
    };

    Float.prototype.__iand__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__iand__ has not been implemented");
    };

    Float.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__ixor__ has not been implemented");
    };

    Float.prototype.__ior__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Float.__ior__ has not been implemented");
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
