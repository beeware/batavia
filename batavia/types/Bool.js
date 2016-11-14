
module.exports = {
    Bool: function() {
        /*************************************************************************
         * Modify Boolean to behave like a Python bool
         *************************************************************************/
        var types = require('./_index');

        Boolean.prototype.__class__ = new types.Type('bool');

        /**************************************************
         * Type conversions
         **************************************************/

        Boolean.prototype.__bool__ = function() {
            return this.valueOf();
        };

        Boolean.prototype.__repr__ = function(args, kwargs) {
            return this.__str__();
        };

        Boolean.prototype.__str__ = function(args, kwargs) {
            if (this.valueOf()) {
                return "True";
            } else {
                return "False";
            }
        };

        Boolean.prototype.__float__ = function() {
            return new types.Float(this.valueOf() ? 1.0 : 0.0);
        };

        /**************************************************
         * Comparison operators
         **************************************************/

        Boolean.prototype.__lt__ = function(other) {
            return this.valueOf() < other;
        };

        Boolean.prototype.__le__ = function(other) {
            return this.valueOf() <= other;
        };

        Boolean.prototype.__eq__ = function(other) {
            return this.valueOf() == other;
        };

        Boolean.prototype.__ne__ = function(other) {
            if (batavia.isinstance(other, types.Str)) {
                    return types.Bool(true);
            }
            return this.valueOf() != other;
        };

        Boolean.prototype.__gt__ = function(other) {

          var invalid_types = [
            types.Bytearray,
            types.Bytes,
            types.Complex,
            types.Dict,
            types.FrozenSet,
            types.List,
            types.NoneType,
            types.NotImplementedType,
            types.Range,
            types.Set,
            types.Slice,
            types.Str,
            types.Tuple,
            types.Type,
          ];

          if (batavia.isinstance(other, invalid_types)) {
              throw new batavia.builtins.TypeError('unorderable types: bool() > ' + batavia.type_name(other) + '()');
            }

            return this.valueOf() > other;
        };

        Boolean.prototype.__ge__ = function(other) {
            return this.valueOf() >= other;
        };

        Boolean.prototype.__contains__ = function(other) {
            return false;
        };


        /**************************************************
         * Unary operators
         **************************************************/

        Boolean.prototype.__pos__ = function() {
            return +this.valueOf();
        };

        Boolean.prototype.__neg__ = function() {
            return -this.valueOf();
        };

        Boolean.prototype.__not__ = function() {
            return types.Bool(!this.valueOf());
        };

        Boolean.prototype.__invert__ = function() {
            return ~this.valueOf();
        };

        Boolean.prototype.__int__ = function() {
            if (this.valueOf()) {
                return new types.Int(1);
            } else {
                return new types.Int(0);
            }
        };

        /**************************************************
         * Binary operators
         **************************************************/

        Boolean.prototype.__pow__ = function(other) {
            if (batavia.isinstance(other, types.Bool)) {
                if (this.valueOf() && other.valueOf()) {
                    return new types.Int(1);
                } else if (this.valueOf()) {
                    return new types.Int(1);
                } else if (other.valueOf()) {
                    return new types.Int(0);
                } else {
                    return new types.Int(1);
                }
            } else if (batavia.isinstance(other, [types.Float, types.Int])) {
                if (this.valueOf()) {
                    if (batavia.isinstance(other, types.Int) && other.__ge__(new types.Float(0.0))) {
                        return new types.Int(Math.pow(1, other.valueOf()));
                    } else {
                        return new types.Float(Math.pow(1.0, other.valueOf()));
                    }
                } else {
                    if (other.__lt__(new types.Float(0.0))) {
                        throw new batavia.builtins.ZeroDivisionError("0.0 cannot be raised to a negative power");
                    } else if (batavia.isinstance(other, types.Int)) {
                        return new types.Int(Math.pow(0, other.valueOf()));
                    } else {
                        return new types.Float(Math.pow(0.0, other.valueOf()));
                    }
                }
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for pow: 'bool' and '" + batavia.type_name(other) + "'");
            }
        };

        Boolean.prototype.__div__ = function(other) {
            return this.__truediv__(other);
        };

        Boolean.prototype.__floordiv__ = function(other) {
            if (batavia.isinstance(other, types.Bool)) {
                if (!other.valueOf()) {
                    throw new batavia.builtins.ZeroDivisionError("integer division or modulo by zero");
                } else if (this.valueOf() && other.valueOf()) {
                    return new types.Int(1);
                } else {
                    return new types.Int(0);
                }
            } else if (batavia.isinstance(other, [types.Float, types.Int])) {
                var thisValue;
                var message = "";

                if (batavia.isinstance(other, types.Int)) {
                    thisValue = this.valueOf() ? 1 : 0;
                    message = "integer division or modulo by zero";
                } else {
                    thisValue = this.valueOf() ? 1.0 : 0.0;
                    message = "float divmod()";
                }

                var roundedVal = Math.floor(thisValue / other);

                if (other === 0) {
                    throw new batavia.builtins.ZeroDivisionError(message);
                } else if (batavia.isinstance(other, types.Int)) {
                    return new types.Int(roundedVal);
                } else {
                    return new types.Float(roundedVal);
                }
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'bool' and '" + batavia.type_name(other) + "'");
            }
        };

        Boolean.prototype.__truediv__ = function(other) {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'bool' and '" + batavia.type_name(other) + "'");
        };

        Boolean.prototype.__mul__ = function(other) {
            if (batavia.isinstance(other, types.Bool)) {
                if (this.valueOf() && other.valueOf()) {
                    return new types.Int(1);
                } else {
                    return new types.Int(0);
                }
            } else if (batavia.isinstance(other, types.Float)) {
                return new types.Float((this.valueOf() ? 1.0 : 0.0) * other.valueOf());
            } else if (batavia.isinstance(other, types.Int)) {
                return new types.Int((this.valueOf() ? 1 : 0) * other.valueOf());
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'bool' and '" + batavia.type_name(other) + "'");
            }};

        Boolean.prototype.__mod__ = function(other) {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for %: 'bool' and '" + batavia.type_name(other) + "'");
        };

        Boolean.prototype.__add__ = function(other) {
            if (batavia.isinstance(other, types.Bool)) {
                if (this.valueOf() && other.valueOf()) {
                    return new types.Int(2);
                } else if (this.valueOf() || other.valueOf()) {
                    return new types.Int(1);
                } else {
                    return new types.Int(0);
                }
            } else if (batavia.isinstance(other, types.Float)) {
                return new types.Float((this.valueOf() ? 1.0 : 0.0) + other.valueOf());
            } else if (batavia.isinstance(other, types.Int)) {
                return new types.Int(other.val.add(this.valueOf() ? 1 : 0));
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'bool' and '" + batavia.type_name(other) + "'");
            }
        };

        Boolean.prototype.__sub__ = function(other) {
            if (batavia.isinstance(other, types.Bool)) {
                if (this.valueOf() && other.valueOf()) {
                    return new types.Int(0);
                } else if (this.valueOf()) {
                    return new types.Int(1);
                } else if (other.valueOf()) {
                    return new types.Int(-1);
                } else {
                    return new types.Int(0);
                }
            } else if (batavia.isinstance(other, types.Float)) {
                return new types.Float((this.valueOf() ? 1.0 : 0.0) - other.valueOf());
            } else if (batavia.isinstance(other, types.Int)) {
                return new types.Int(other.val.sub(this.valueOf() ? 1 : 0).neg());
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'bool' and '" + batavia.type_name(other) + "'");
            }
        };

        Boolean.prototype.__getitem__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__getitem__ has not been implemented");
        };

        Boolean.prototype.__lshift__ = function(other) {
            if (batavia.isinstance(other, types.Bool)) {
                if (this.valueOf() && other.valueOf()) {
                    return new types.Int(2);
                } else if (this.valueOf()) {
                    return new types.Int(1);
                } else if (other.valueOf()) {
                    return new types.Int(0);
                } else {
                    return new types.Int(0);
                }
            } else if (batavia.isinstance(other, types.Int)) {
                return new types.Int((this.valueOf() ? 1 : 0) << other.valueOf());
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for <<: 'bool' and '" + batavia.type_name(other) + "'");
            }};

        Boolean.prototype.__rshift__ = function(other) {
            if (batavia.isinstance(other, types.Bool)) {
                if (this.valueOf() && !other.valueOf()) {
                    return new types.Int(1);
                } else {
                    return new types.Int(0);
                }
            } else if (batavia.isinstance(other, types.Int)) {
                return new types.Int((this.valueOf() ? 1 : 0) >> other.valueOf());
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for >>: 'bool' and '" + batavia.type_name(other) + "'");
            }};

        Boolean.prototype.__and__ = function(other) {
            if (batavia.isinstance(other, types.Int)) {
                return this.__int__().__and__(other);
            } else if (batavia.isinstance(other, types.Bool)) {
                return new Boolean((this.valueOf() ? 1 : 0) & (other.valueOf() ? 1 : 0));
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for &: 'bool' and '" + batavia.type_name(other) + "'");
            }
        };

        Boolean.prototype.__xor__ = function(other) {
            if (batavia.isinstance(other, types.Int)) {
                return this.__int__().__xor__(other);
            } else if (batavia.isinstance(other, types.Bool)) {
                return new Boolean((this.valueOf() ? 1 : 0) ^ (other.valueOf() ? 1 : 0));
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for ^: 'bool' and '" + batavia.type_name(other) + "'");
            }
        };

        Boolean.prototype.__or__ = function(other) {
            if (batavia.isinstance(other, types.Int)) {
                return this.__int__().__or__(other);
            } else if (batavia.isinstance(other, types.Bool)) {
                return new Boolean((this.valueOf() ? 1 : 0) | (other.valueOf() ? 1 : 0));
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for |: 'bool' and '" + batavia.type_name(other) + "'");
            }
        };

        Boolean.prototype.__ge__ = function(other) {
            if (batavia.isinstance(other, types.Float)) {
                return new types.Float((this.valueOf() ? 1.0 : 0.0) >= other.valueOf());
            } else if (batavia.isinstance(other, types.Int)) {
                return this.__int__().__ge__(other);
            } else if (batavia.isinstance(other, types.Bool)) {
                return new Boolean((this.valueOf() ? 1 : 0) >= (other.valueOf() ? 1 : 0));
            } else if (batavia.isbataviainstance(other)) {
                throw new batavia.builtins.TypeError("unorderable types: bool() >= " + batavia.type_name(other) + "()");
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for |: 'bool' and '" + batavia.type_name(other) + "'");
            }
        };

        Boolean.prototype.__le__ = function(other) {
            if (batavia.isinstance(other, types.Float)) {
                return new types.Float((this.valueOf() ? 1.0 : 0.0) <= other.valueOf());
            } else if (batavia.isinstance(other, types.Int)) {
                return this.__int__().__le__(other);
            } else if (batavia.isinstance(other, types.Bool)) {
                return new Boolean((this.valueOf() ? 1 : 0) <= (other.valueOf() ? 1 : 0));
            } else if (batavia.isbataviainstance(other)) {
                throw new batavia.builtins.TypeError("unorderable types: bool() <= " + batavia.type_name(other) + "()");
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for |: 'bool' and '" + batavia.type_name(other) + "'");
            }
        };

        Boolean.prototype.__lt__ = function(other) {
            if (batavia.isinstance(other, types.Float)) {
                return new types.Float((this.valueOf() ? 1.0 : 0.0) < other.valueOf());
            } else if (batavia.isinstance(other, types.Int)) {
                return this.__int__().__lt__(other);
            } else if (batavia.isinstance(other, types.Bool)) {
                int_one = new types.Int(1);
                int_zero= new types.Int(0);

                return (this.valueOf() ? int_one : int_zero) < (other.valueOf() ? int_one : int_zero);
            } else if (batavia.isbataviainstance(other)) {
                throw new batavia.builtins.TypeError("unorderable types: bool() < " + batavia.type_name(other) + "()");
            } else {
                throw new batavia.builtins.TypeError("unsupported operand type(s) for |: 'bool' and '" + batavia.type_name(other) + "'");
            }
        };

        /**************************************************
         * Inplace operators
         **************************************************/

        Boolean.prototype.__ifloordiv__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__ifloordiv__ has not been implemented");
        };

        Boolean.prototype.__itruediv__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__itruediv__ has not been implemented");
        };

        Boolean.prototype.__iadd__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__iadd__ has not been implemented");
        };

        Boolean.prototype.__isub__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__isub__ has not been implemented");
        };

        Boolean.prototype.__imul__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__imul__ has not been implemented");
        };

        Boolean.prototype.__imod__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__imod__ has not been implemented");
        };

        Boolean.prototype.__ipow__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__ipow__ has not been implemented");
        };

        Boolean.prototype.__ilshift__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__ilshift__ has not been implemented");
        };

        Boolean.prototype.__irshift__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__irshift__ has not been implemented");
        };

        Boolean.prototype.__iand__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__iand__ has not been implemented");
        };

        Boolean.prototype.__ixor__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__ixor__ has not been implemented");
        };

        Boolean.prototype.__ior__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Boolean.__ior__ has not been implemented");
        };

        /**************************************************
         * Methods
         **************************************************/

        Boolean.prototype.copy = function() {
            return this.valueOf();
        };

        Boolean.prototype.__trunc__ = function() {
            if (this.valueOf()) {
                return new types.Int(1);
            }
            return new types.Int(0);
        };

        return Boolean;
    }()
}
