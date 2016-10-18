
/*************************************************************************
 * A Python int type
 *************************************************************************/

batavia.types.Int = function() {
    function Int(val) {
        Object.call(this);
        this.val = new batavia.vendored.BigNumber(val);
    }

    var MIN_FLOAT = new Int("-179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791");
    var REASONABLE_SHIFT = new Int("8192");
    var MAX_SHIFT = new Int("9223372036854775807");
    var MAX_INT = new Int("9223372036854775807")
    var MIN_INT = new Int("-9223372036854775808")

    Int.prototype = Object.create(Object.prototype);
    Int.prototype.__class__ = new batavia.types.Type('int');

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Int.prototype.int32 = function() {
      if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
          throw new batavia.builtins.IndexError("cannot fit 'int' into an index-sized integer");
      }
      return parseInt(this.valueOf());
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
        return !this.val.isZero();
    };

    Int.prototype.__repr__ = function() {
        return this.__str__();
    };

    Int.prototype.__str__ = function() {
        return this.val.toFixed(0);
    };

    var can_float = function(num) {
        return !(num.gt(batavia.MAX_FLOAT.val) || num.lt(MIN_FLOAT.val));
    };

    Int.prototype.__float__ = function() {
        if (!can_float(this.val)) {
            throw new batavia.builtins.OverflowError("int too large to convert to float");
        }
        return new batavia.types.Float(parseFloat(this.val));
    };

    Int.prototype.__int__ = function() {
        return this;
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
            } else if (batavia.isinstance(other, batavia.types.Bool)) {
                return this.val.lt(other ? 1 : 0);
            } else if (batavia.isinstance(other, batavia.types.Int)) {
                return this.val.lt(other.val);
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
            } else if (batavia.isinstance(other, batavia.types.Bool)) {
                return this.val.lte(other ? 1 : 0);
            } else if (batavia.isinstance(other, batavia.types.Int)) {
                return this.val.lte(other.val);
            } else {
                return this.val.lte(other.valueOf());
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: int() <= NoneType()");
        }
    };

    Int.prototype.__eq__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.Float, batavia.types.Int])) {
          return this.val.eq(other.val);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
          return this.val.eq(other ? 1 : 0);
        } else {
          return false;
        }
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
            } else if (batavia.isinstance(other, batavia.types.Bool)) {
                return this.val.gt(other ? 1 : 0);
            } else if (batavia.isinstance(other, batavia.types.Int)) {
                return this.val.gt(other.val);
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
                        batavia.types.Range, batavia.types.Set, batavia.types.Slice, batavia.types.Complex
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: int() >= " + batavia.type_name(other) + "()");
            } else if (batavia.isinstance(other, batavia.types.Bool)) {
                return this.val.gte(other ? 1 : 0);
            } else if (batavia.isinstance(other, batavia.types.Int)) {
                return this.val.gte(other.val);
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

    Int.prototype.__abs__ = function() {
        return new Int(this.val.abs());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Int.prototype.__pow__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return this;
            } else {
                return new Int(1);
            }
        } else if (batavia.isinstance(other, batavia.types.Int)) {
            if (other.val.isNegative()) {
                return this.__float__().__pow__(other);
            } else {
                var y = other.val.toString(2).split('');
                var result = new batavia.vendored.BigNumber(1);
                var base = this.val.add(0);
                while (y.length > 0) {
                  var bit = y.pop();
                  if (bit == 1) {
                    result = result.mul(base);
                  }
                  base = base.mul(base);
                }
                return new Int(result);
            }
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            return this.__float__().__pow__(other);
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
                var quo = this.val.div(other.val);
                var quo_floor = quo.floor();
                var rem = this.val.mod(other.val);

                if (rem.isZero()) {
                  return new Int(quo_floor);
                }
                // we have a fraction leftover
                // check if it is too small for bignumber.js to detect
                if (quo.isInt() && quo.isNegative()) {
                  return new Int(quo.sub(1));
                }
                return new Int(quo_floor);
            } else {
                throw new batavia.builtins.ZeroDivisionError("integer division or modulo by zero");
            }
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            var f = this.__float__();
            if (other.valueOf()) {
                return f.__floordiv__(other);
            } else {
                throw new batavia.builtins.ZeroDivisionError("float divmod()");
            }

        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return new Int(this.val.floor());
            } else {
                throw new batavia.builtins.ZeroDivisionError("integer division or modulo by zero");
            }
        } else if (batavia.isinstance(other, batavia.types.Complex)) {
            throw new batavia.builtins.TypeError("can't take floor of complex number.");
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
            if (!can_float(result)) {
                throw new batavia.builtins.OverflowError("integer division result too large for a float");
            }
            // check for negative 0
            if (other.val.lt(0) && result.isZero()) {
                return new batavia.types.Float(parseFloat("-0.0"));
            }
            return new Int(result).__float__();
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            return this.__float__().__div__(other);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return this.__truediv__(new Int(other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__mul__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.val.mul(other.val));
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            return this.__float__().__mul__(other.val);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.val.mul(other.valueOf() ? 1 : 0));
        } else if (batavia.isinstance(other, batavia.types.List)) {
            if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
                throw new batavia.builtins.OverflowError("cannot fit 'int' into an index-sized integer");
            }
            if ((other.length == 0) || (this.valueOf() < 0)) {
                return new batavia.types.List();
            }
            if (this.valueOf() > 4294967295) {
                throw new batavia.builtins.MemoryError("");
            }
            result = new batavia.types.List();
            for (var i = 0; i < this.valueOf(); i++) {
                result.extend(other);
            }
            return result;
        } else if (batavia.isinstance(other, batavia.types.Str)) {
            if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
                throw new batavia.builtins.OverflowError("cannot fit 'int' into an index-sized integer");
            }
            if (this.val.isNegative()) {
                return '';
            }
            var size = this.val.mul(other.length);
            if (size.gt(MAX_INT.val)) {
                throw new batavia.builtins.OverflowError("repeated string is too long");
            }
            if (other.length == 0) {
                return '';
            }
            if ((this.valueOf() > 4294967295) || (this.valueOf() < -4294967296)) {
                throw new batavia.builtins.MemoryError("");
            }

            result = '';
            for (var i = 0; i < this.valueOf(); i++) {
                result += other.valueOf();
            }
            return result;
        } else if (batavia.isinstance(other, batavia.types.Tuple)) {
            if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
                throw new batavia.builtins.OverflowError("cannot fit 'int' into an index-sized integer");
            }
            if ((other.length == 0) || (this.valueOf() < 0)) {
                return new batavia.types.Tuple();
            }
            if (this.valueOf() > 4294967295) {
                throw new batavia.builtins.MemoryError("");
            }
            result = new batavia.types.Tuple();
            for (var i = 0; i < this.valueOf(); i++) {
                result.__add__(other);
            }
            return result;
        } else if (batavia.isinstance(other, batavia.types.Complex)) {
            if (this.val.gt(MAX_INT.val) || this.val.lt(MIN_INT.val)) {
                throw new batavia.builtins.OverflowError("int too large to convert to float");
            }
            else {
                return new batavia.types.Complex(this.val.mul(other.real).toNumber(), this.val.mul(other.imag).toNumber());
            }

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
            var f = this.__float__();
            if (other.valueOf()) {
                return f.__mod__(other);
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
            return this.__float__().__add__(other);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.val.add(other.valueOf() ? 1 : 0));
        } else if (batavia.isinstance(other, batavia.types.Complex)) {
            if (this.__float__() > batavia.MAX_FLOAT || this.__float__() < batavia.MIN_FLOAT) {
                throw new batavia.builtins.OverflowError("int too large to convert to float");
            } else {
                return new batavia.types.Complex(this.val.add(other.real).toNumber(), other.imag);
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__sub__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            return new Int(this.val.sub(other.val));
        } else if (batavia.isinstance(other, batavia.types.Float)) {
            return this.__float__().__sub__(other);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            return new Int(this.val.sub(other.valueOf() ? 1 : 0));
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__getitem__ = function(index) {
        throw new batavia.builtins.TypeError("'int' object is not subscriptable")
    };

    /**************************************************
     * Bitshift and logical ops
     **************************************************/

    // converts this integer to an binary array for efficient bit operations
    // BUG: javascript bignumber is incredibly inefficient for bit operations
    var toArray = function(self) {
        return self.val.abs().toString(2).split('').map(function (x) { return x - '0' });
    };

    Int.prototype._bits = function() {
        return toArray(this);
    }

    // convert a binary array back into an int
    var fromArray = function(arr) {
        return new Int(new batavia.vendored.BigNumber(arr.join('') || 0, 2));
    };
    // return j with the sign inverted if i is negative.
    var fixSign = function(i, j) {
        if (i.val.isNeg()) {
            return j.__neg__();
        }
        return j;
    };
    // invert the bits of an array
    var invert = function(arr) {
      return arr.map(function(x) { return 1 - x; });
    };
    // add 1 to the bit array
    var plusOne = function(arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == 0) {
                arr[i] = 1;
                return;
            }
            arr[i] = 0;
        }
        arr.reverse();
        arr.push(1);
        arr.reverse();
    };
    // convert the int to an array, and negative ints to their
    // twos complement representation
    var twos_complement = function(n) {
        var arr = toArray(n);
        if (n.val.isNeg()) {
            arr = invert(arr);
            plusOne(arr);
        }
        return arr;
    };
    // extend a to be at least b bits long (by prepending zeros or ones)
    var extend = function(a, b, ones) {
        if (a.length >= b.length) {
          return;
        }
        a.reverse();
        while (a.length < b.length) {
          if (ones) {
            a.push(1);
          } else {
            a.push(0);
          }
        }
        a.reverse();
    };

    Int.prototype.__lshift__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            // Anything beyond ~8192 bits is too inefficient to convert to a binary array
            // due to Bignumber.js.
            if (other.val.gt(REASONABLE_SHIFT.val)) {
                throw new batavia.builtins.OverflowError("batavia: shift too large");
            }
            if (other.val.gt(MAX_SHIFT.val)) {
                throw new batavia.builtins.OverflowError("Python int too large to convert to C ssize_t");
            }
            if (other.valueOf() < 0) {
                throw new batavia.builtins.ValueError("negative shift count");
            }
            var arr = toArray(this);
            for (var i = 0; i < other.valueOf(); i++) {
                arr.push(0);
            }
            return fixSign(this, new Int(fromArray(arr)));
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
              return this.__lshift__(new Int(1));
            } else {
              return this;
            }
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for <<: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__rshift__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (this.val.isNegative()) {
                return this.__invert__().__rshift__(other).__invert__();
            }
            // Anything beyond ~8192 bits is too inefficient to convert to a binary array
            // due to Bignumber.js.
            if (other.val.gt(MAX_INT.val) || other.val.lt(MIN_INT.val)) {
                throw new batavia.builtins.OverflowError("Python int too large to convert to C ssize_t");
            }
            if (other.val.gt(REASONABLE_SHIFT.val)) {
                throw new batavia.builtins.ValueError("batavia: shift too large");
            }
            if (other.val.isNegative()) {
                throw new batavia.builtins.ValueError("negative shift count");
            }
            if (this.val.isZero()) {
                return this;
            }
            var arr = toArray(this);
            if (other.val.gt(arr.length)) {
                return new Int(0);
            }
            return fixSign(this, fromArray(arr.slice(0, arr.length - other.valueOf())));
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
              return this.__rshift__(new Int(1));
            }
            return this;
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for >>: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__and__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            var a = twos_complement(this);
            var b = twos_complement(other);
            extend(a, b, this.val.isNeg());
            extend(b, a, other.val.isNeg());
            var i = a.length - 1;
            var j = b.length - 1;
            var arr = [];
            while (i >= 0 && j >= 0) {
                arr.push(a[i] & b[j]);
                i--;
                j--;
            }
            arr.reverse();
            if (this.val.isNeg() && other.val.isNeg()) {
                arr = invert(arr);
                return fromArray(arr).__add__(new Int(1)).__neg__();
            }
            return fromArray(arr);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return this.__and__(new Int(1));
            }
            return new Int(0);
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for &: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__xor__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            if (this.val.isNeg()) {
               return this.__invert__().__xor__(other).__invert__();
            }
            if (other.val.isNeg()) {
              return this.__xor__(other.__invert__()).__invert__();
            }
            var a = twos_complement(this);
            var b = twos_complement(other);
            extend(a, b);
            extend(b, a);
            var i = a.length - 1;
            var j = b.length - 1;
            var arr = [];
            while (i >= 0 && j >= 0) {
                arr.push(a[i] ^ b[j]);
                i--;
                j--;
            }
            arr.reverse();
            return fromArray(arr);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return this.__xor__(new Int(1));
            }
            return this;
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for ^: 'int' and '" + batavia.type_name(other) + "'");
        }
    };

    Int.prototype.__or__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
          if (this.val.eq(other.val)) {
              return this;
          }
          if (this.val.eq(-1) || other.val.eq(-1)) {
              return new Int(-1);
          }
          if (this.val.isZero()) {
              return other;
          }
          var a = twos_complement(this);
          var b = twos_complement(other);
          extend(a, b, this.val.isNeg());
          extend(b, a, other.val.isNeg());
          var i = a.length - 1;
          var j = b.length - 1;
          var arr = [];
          while (i >= 0 && j >= 0) {
              arr.push(a[i] | b[j]);
              i--;
              j--;
          }
          arr.reverse();
          if (this.val.isNeg() || other.val.isNeg()) {
              arr = invert(arr);
              return fromArray(arr).__add__(new Int(1)).__neg__();
          }
          return fromArray(arr);
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return this.__or__(new Int(1));
            }
            return this;
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

    Int.prototype.__trunc__ = function() {
        return this;
    };

    /**************************************************/

    return Int;
}();

batavia.MAX_FLOAT = new batavia.types.Int("179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791");
