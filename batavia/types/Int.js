
/*************************************************************************
 * A Python int type
 *************************************************************************/

batavia.types.Int = function() {
    function Int(val) {
        this.val = val;
    }

    Int.prototype = Object.create(Object.prototype);

    Int.prototype.constructor = Int;

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
        return this.val.toString();
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Int.prototype.__lt__ = function(other) {
        if (other !== null) {
            return this.valueOf() < other.valueOf();
        }
        return false;
    };

    Int.prototype.__le__ = function(other) {
        if (other !== null) {
            return this.valueOf() <= other.valueOf();
        }
        return false;
    };

    Int.prototype.__eq__ = function(other) {
        if (other !== null) {
            return this.valueOf() == other.valueOf();
        }
        return false;
    };

    Int.prototype.__ne__ = function(other) {
        if (other !== null) {
            return this.valueOf() != other.valueOf();
        }
        return true;
    };

    Int.prototype.__gt__ = function(other) {
        if (other !== null) {
            return this.valueOf() > other.valueOf();
        }
        return false;
    };

    Int.prototype.__ge__ = function(other) {
        if (other !== null) {
            return this.valueOf() >= other.valueOf();
        }
        return false;
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
        return new Int(!this.valueOf());
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
            return new Int(Math.pow(this.valueOf(), other.valueOf()));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__div__ = function(other) {
        return this.__truediv__(other);
    };

    Int.prototype.__floordiv__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.Float, batavia.types.Int])) {
            if (other.valueOf()) {
                return new Int(Math.floor(this.valueOf() / other.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Int(Math.floor(this.valueOf()));
            } else {
                throw new batavia.builtins.ZeroDivisionError("float divmod()");
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__truediv__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.Float, batavia.types.Int])) {
            if (other.valueOf()) {
                return new Int(this.valueOf() / other.valueOf());
            } else {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Int(this.valueOf());
            } else {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
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
            var result = '';
            for (var i = 0; i < this.valueOf(); i++) {
                result += other.valueOf();
              }
            return result;
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__mod__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.valueOf() % other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            return new batavia.types.Float(this.valueOf() % other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Int(this.valueOf());
            } else {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
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

    Int.prototype.__getitem__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__getitem__ has not been implemented");
    };

    Int.prototype.__lshift__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.valueOf() << other.valueOf());
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.valueOf() << (other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for <<: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__rshift__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.valueOf() >> other.valueOf());
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

    Int.prototype.__idiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__idiv__ has not been implemented");
    };

    Int.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__ifloordiv__ has not been implemented");
    };

    Int.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__itruediv__ has not been implemented");
    };

    Int.prototype.__iadd__ = function(other) {
        return this.__add__(other).valueOf();
    };

    Int.prototype.__isub__ = function(other) {
        return this.__sub__(other).valueOf();
    };

    Int.prototype.__imul__ = function(other) {
        if (batavia.isinstance(other, [
                batavia.types.Dict,
                batavia.types.NoneType,
        ])) {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *=: 'int' and '" + batavia.type_name(other) + "'");
        } else {
            return this.__mul__(other).valueOf();
        }
    };

    Int.prototype.__imod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__imod__ has not been implemented");
    };

    Int.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__ipow__ has not been implemented");
    };

    Int.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__ilshift__ has not been implemented");
    };

    Int.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__irshift__ has not been implemented");
    };

    Int.prototype.__iand__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__iand__ has not been implemented");
    };

    Int.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__ixor__ has not been implemented");
    };

    Int.prototype.__ior__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Int.__ior__ has not been implemented");
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
