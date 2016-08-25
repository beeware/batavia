
/*************************************************************************
 * A Python int type
 *************************************************************************/
var euclidean_mod = function(a, b) {
  return ((a % b) + b) % b;
}

batavia.types.Int = function() {
    function Int(val) {
        Object.call(this);
        this.val = new batavia.vendored.BigNumber(val);
    }

    Int.prototype = Object.create(Object.prototype);
    Int.prototype.__class__ = new batavia.types.Type('int');

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Int.prototype.int32 = function() {
      return this.valueOf()|0;
    }

    Int.prototype.valueOf = function() {
        return this.val.valueOf();
    };

    Int.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Int.prototype.__bool__ = function() {
        return new batavia.types.Bool(!this.val.isZero());
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
                return this.val.lt(other.valueOf());
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
                return this.val.lte(other.valueOf());
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: int() <= NoneType()");
        }
    };

    Int.prototype.__eq__ = function(other) {
        if (other !== null && !batavia.isinstance(other, batavia.types.Str)) {
            return this.val.eq(other.valueOf());
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
                return this.val.gt(other.valueOf());
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
                return this.val.gte(other.valueOf());
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
        return this;
    };

    Int.prototype.__neg__ = function() {
        return new Int(this.val.neg());
    };

    Int.prototype.__not__ = function() {
        return new batavia.types.Bool(this.val.isZero());
    };

    Int.prototype.__invert__ = function() {
        return new Int(this.val.neg().sub(1));
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Int.prototype.__pow__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.val.pow(other.valueOf() ? 1 : 0));
        } else if (batavia.isinstance(other, [batavia.types.Float, batavia.types.Int])) {
            if (this.valueOf() == 0 && other.valueOf() < 0) {
                throw new batavia.builtins.ZeroDivisionError("0.0 cannot be raised to a negative power");
            } else {
                var a = new batavia.vendored.BigNumber(this.valueOf());
                var b = new batavia.vendored.BigNumber(other.valueOf());
                var result = a.pow(b);
                if (result.isInt()) {
                    return new Int(result);
                } else {
                    // truncate precision to a float
                    return new batavia.types.Float(result*1.0);
                }
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
            if (!other.val.isZero()) {
                return new Int(this.val.div(other.val).floor());
            } else {
                throw new batavia.builtins.ZeroDivisionError("integer division or modulo by zero");
            }
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            if (other.valueOf()) {
                var result = parseFloat(this.val.div(other.val).floor());
                // check for negative 0
                if ((result == 0.0) && (other.valueOf() < 0)) {
                  result = "-0.0";
                }
                return new batavia.types.Float(result);
            } else {
                throw new batavia.builtins.ZeroDivisionError("float divmod()");
            }

        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Int(this.val.floor());
            } else {
                throw new batavia.builtins.ZeroDivisionError("integer division or modulo by zero");
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__truediv__ = function(other) {
        // if it is dividing by another int, we can allow both to be bigger than floats
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (other.val.isZero()) {
                throw new batavia.builtins.ZeroDivisionError("division by zero");
            }
            var result = this.val.div(other.val);
            // check for negative 0
            if ((other.val.lt(0)) && result.isZero()) {
              result = "-0.0";
            }
            return new batavia.types.Float(parseFloat(result));
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            if (other.valueOf()) {
                var result = parseFloat(this.val.valueOf()) / other.val;
                // check for negative 0
                if ((other.valueOf() < 0) && (result == 0)) {
                  result = "-0.0";
                }
                return new batavia.types.Float(parseFloat(result));
            } else if (batavia.isinstance(other, batavia.types.Float)) {
                throw new batavia.builtins.ZeroDivisionError("float division by zero");
            }
            throw new batavia.builtins.ZeroDivisionError("division by zero");
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new batavia.types.Float(parseFloat(this.val));
            } else {
                throw new batavia.builtins.ZeroDivisionError("division by zero");
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__mul__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.val.mul(other.val));
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            return new batavia.types.Float(parseFloat(this.val) * other.val);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.val.mul(other.valueOf() ? 1 : 0));
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
            if (!other.val.isZero()) {
                return new Int(this.val.mod(other.val).add(other.val).mod(other.val));
            } else {
                throw new batavia.builtins.ZeroDivisionError("integer division or modulo by zero");
            }
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            if (other.valueOf()) {
                return new batavia.types.Float(euclidean_mod(parseFloat(this.val), other.val));
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
            return new Int(this.val.add(other.val));
        } else if (batavia.isinstance(other, batavia.types.Float)) {

            return new batavia.types.Float(parseFloat(this.val) + other.val);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.val.add(other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__sub__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.val.sub(other.val));
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            return new batavia.types.Float(parseFloat(this.val) - other.val);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.val.sub(other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__getitem__ = function(index) {
        throw new batavia.builtins.TypeError("'int' object is not subscriptable")
    };

    Int.prototype.__lshift__ = function(other) {
        // TODO: this is shouldn't rely on multiplication
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (other.valueOf() < 0) {
                throw new batavia.builtins.ValueError("negative shift count");
            } else {
                return new Int(this.val.mul(new batavia.vendored.BigNumber(2).pow(other.valueOf())));
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
              return new Int(this.val.mul(2));
            } else {
              return this;
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for <<: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__rshift__ = function(other) {
        // TODO: this is shouldn't rely on division
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (other.valueOf() < 0) {
                throw new batavia.builtins.ValueError("negative shift count");
            } else {
                return new Int(this.val.div(new batavia.vendored.BigNumber(2).pow(other.valueOf())).floor());
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.val.div(other.valueOf() ? 2 : 1).floor());;
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
