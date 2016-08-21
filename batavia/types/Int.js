
/*************************************************************************
 * A Python int type
 *************************************************************************/

batavia.types.Int = function() {
    function Int(val) {
        Object.call(this);
        this.val = val;
    }

    Int.prototype = Object.create(Object.prototype);
    Int.prototype.__class__ = new batavia.types.Type('int');

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Int.prototype.valueOf = function() {
        return this.val;
    };

    Int.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Int.prototype.__bool__ = function() {
        return this.val !== 0;
    };

    Int.prototype.__repr__ = function() {
        return this.__str__();
    };

    Int.prototype.__str__ = function() {
        return this.val.toFixed(0);
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Int.prototype.__lt__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Dict, batavia.types.List, batavia.types.Tuple,
                        batavia.types.NoneType, batavia.types.Str, batavia.types.NotImplementedType,
                        batavia.types.Range, batavia.types.Set, batavia.types.Slice
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: int() < " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() < other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: int() < NoneType()");
        }
    };

    Int.prototype.__le__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Dict, batavia.types.List, batavia.types.Tuple,
                        batavia.types.NoneType, batavia.types.Str, batavia.types.NotImplementedType,
                        batavia.types.Range, batavia.types.Set, batavia.types.Slice
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: int() <= " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() <= other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: int() <= NoneType()");
        }
    };

    Int.prototype.__eq__ = function(other) {
        if (other !== null && !batavia.isinstance(other, batavia.types.Str)) {
            return this.valueOf() == other.valueOf();
        }
        return false;
    };

    Int.prototype.__ne__ = function(other) {
        return !this.__eq__(other);
    };

    Int.prototype.__gt__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Dict, batavia.types.List, batavia.types.Tuple,
                        batavia.types.NoneType, batavia.types.Str, batavia.types.NotImplementedType,
                        batavia.types.Range, batavia.types.Set, batavia.types.Slice
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: int() > " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() > other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: int() > NoneType()");
        }
    };

    Int.prototype.__ge__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Dict, batavia.types.List, batavia.types.Tuple,
                        batavia.types.NoneType, batavia.types.Str, batavia.types.NotImplementedType,
                        batavia.types.Range, batavia.types.Set, batavia.types.Slice
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: int() >= " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() >= other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: int() >= NoneType()");
        }
    };

    Int.prototype.__contains__ = function(other) {
        return false;
    };

    /**************************************************
     * Unary operators
     **************************************************/

    Int.prototype.__pos__ = function() {
        return new Int(+this.valueOf());
    };

    Int.prototype.__neg__ = function() {
        return new Int(-this.valueOf());
    };

    Int.prototype.__not__ = function() {
        return new batavia.types.Bool(!this.valueOf());
    };

    Int.prototype.__invert__ = function() {
        return new Int(~this.valueOf());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Int.prototype.__pow__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(Math.pow(this.valueOf(), other.valueOf() ? 1 : 0));
        } else if (batavia.isinstance(other, [batavia.types.Float, batavia.types.Int])) {
            if (this.valueOf() == 0 && other.valueOf() < 0) {
                throw new batavia.builtins.ZeroDivisionError("0.0 cannot be raised to a negative power");
            } else {
                return new Int(Math.pow(this.valueOf(), other.valueOf()));
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__div__ = function(other) {
        return this.__truediv__(other);
    };

    Int.prototype.__floordiv__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (other.valueOf()) {
                return new Int(Math.floor(this.valueOf() / other.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("integer division or modulo by zero");
            }
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            if (other.valueOf()) {
                return new batavia.types.Float(Math.floor(this.valueOf() / other.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("float divmod()");
            }

        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Int(Math.floor(this.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("integer division or modulo by zero");
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__truediv__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.Float, batavia.types.Int])) {
            if (other.valueOf()) {
                return new batavia.types.Float(this.valueOf() / other.valueOf()).toString();
            } else if (batavia.isinstance(other, batavia.types.Float)) {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
            }
            throw new batavia.builtins.ZeroDivisionError("division by zero");
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new batavia.types.Float(this.valueOf());
            } else {
                throw new batavia.builtins.ZeroDivisionError("division by zero");
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__mul__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.valueOf() * other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            return new batavia.types.Float(this.valueOf() * other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.valueOf() * (other.valueOf() ? 1 : 0));
        } else if (batavia.isinstance(other, batavia.types.List)) {
            result = new batavia.types.List();
            for (i = 0; i < this.valueOf(); i++) {
                result.extend(other);
            }
            return result;
        } else if (batavia.isinstance(other, batavia.types.Str)) {
            result = '';
            for (var i = 0; i < this.valueOf(); i++) {
                result += other.valueOf();
              }
            return result;
        } else if (batavia.isinstance(other, batavia.types.Tuple)) {
            result = new batavia.types.Tuple();
            for (var i = 0; i < this.valueOf(); i++) {
                result.__add__(other);
              }
            return result;
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__mod__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (other.valueOf() !== 0) {
                // JS "%" is remainder, not modulo; see http://javascript.about.com/od/problemsolving/a/modulobug.htm
                return new Int(((this.valueOf() % other.valueOf()) + other.valueOf()) % other.valueOf());
            } else {
                throw new batavia.builtins.ZeroDivisionError("integer division or modulo by zero");
            }
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            if (other.valueOf()) {
                return new batavia.types.Float(((this.valueOf() % other.valueOf()) + other.valueOf()) % other.valueOf());
            } else {
                throw new batavia.builtins.ZeroDivisionError("float modulo");
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Int(0);
            } else {
                throw new batavia.builtins.ZeroDivisionError("integer division or modulo by zero");
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for %: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__add__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.valueOf() + other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            return new batavia.types.Float(this.valueOf() + other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.valueOf() + (other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__sub__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.valueOf() - other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            return new batavia.types.Float(this.valueOf() - other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.valueOf() - (other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__getitem__ = function(index) {
        throw new batavia.builtins.TypeError("'int' object is not subscriptable")
    };

    Int.prototype.__lshift__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (other.valueOf() < 0) {
                throw new batavia.builtins.ValueError("negative shift count");
            } else {
                return new Int(this.valueOf() << other.valueOf());
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.valueOf() << (other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for <<: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__rshift__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (other.valueOf() < 0) {
                throw new batavia.builtins.ValueError("negative shift count");
            } else {
                return new Int(this.valueOf() >> other.valueOf());
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.valueOf() >> (other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for >>: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__and__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.valueOf() & other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.valueOf() & (other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for &: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__xor__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.valueOf() ^ other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.valueOf() ^ (other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for ^: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__or__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.valueOf() | other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.valueOf() | (other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for |: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    // Call the method named "f" with argument "other"; if a type error is raised, throw a different type error
    Int.prototype.__call_type_error_str__ = function(f, operand_str, other) {
        try {
            return this[f](other);
        } catch (error) {
            if (error instanceof batavia.builtins.TypeError) {
                throw new batavia.builtins.TypeError(
                    "unsupported operand type(s) for " + operand_str + ": 'int' and '" + batavia.type_name(other) + "'");
            } else {
                throw error;
            }
        }
    };


    Int.prototype.__ifloordiv__ = function(other) {
        return this.__call_type_error_str__('__floordiv__', "//=", other);
    };

    Int.prototype.__itruediv__ = function(other) {
        return this.__call_type_error_str__('__truediv__', "/=", other);
    };

    Int.prototype.__iadd__ = function(other) {
        return this.__call_type_error_str__('__add__', "+=", other);
    };

    Int.prototype.__isub__ = function(other) {
        return this.__call_type_error_str__('__sub__', "-=", other);
    };

    Int.prototype.__imul__ = function(other) {
        return this.__call_type_error_str__('__mul__', "*=", other);
    };

    Int.prototype.__imod__ = function(other) {
        return this.__call_type_error_str__('__mod__', "%=", other);
    };

    Int.prototype.__ipow__ = function(other) {
        return this.__pow__(other);
    };

    Int.prototype.__ilshift__ = function(other) {
        return this.__call_type_error_str__('__lshift__', "<<=", other);
    };

    Int.prototype.__irshift__ = function(other) {
        return this.__call_type_error_str__('__rshift__', ">>=", other);
    };

    Int.prototype.__iand__ = function(other) {
        return this.__call_type_error_str__('__and__', "&=", other);
    };

    Int.prototype.__ixor__ = function(other) {
        return this.__call_type_error_str__('__xor__', "^=", other);
    };

    Int.prototype.__ior__ = function(other) {
        return this.__call_type_error_str__('__or__', "|=", other);
    };

    /**************************************************
     * Methods
     **************************************************/

    Int.prototype.copy = function() {
        return new Int(this.valueOf());
    };

    /**************************************************/

    return Int;
}();
