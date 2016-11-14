
/*************************************************************************
 * A Python complex type
 *************************************************************************/

module.exports = {
    Complex: function() {
        // Polyfill below from
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Polyfill_for_non-ES6_browsers
        if (!Object.is) {
          Object.is = function(x, y) {
            // SameValue algorithm
            if (x === y) { // Steps 1-5, 7-10
              // Steps 6.b-6.e: +0 != -0
              return x !== 0 || 1 / x === 1 / y;
            } else {
              // Step 6.a: NaN == NaN
              return x !== x && y !== y;
            }
          };
        }
        function part_from_str(s) {
            if (s && s.valueOf() == "-0") {
                // console.log("there");
                return new batavia.types.Float(-0);
            } else if (s) {
                // console.log("part_from_str: " + s);
                return new batavia.types.Float(s);
            } else {
                return new batavia.types.Float(0);
            }
        }
        function part_to_str(x) {
            var x_str;
            if (x) {
                x_str = x.valueOf().toString();
                var abs_len = Math.abs(x.valueOf()).toString().length;
                if (abs_len >= 19) {
                    // force conversion to scientific
                    var new_str = x.valueOf().toExponential();
                    if (new_str.length < x_str.length) {
                        x_str = new_str;
                    }
                }
            } else if (Object.is(x, -0)) {
                x_str = '-0';
            } else {
                x_str = '0';
            }
            return x_str;
        }
        function Complex(re, im) {
            // console.log(100000, re, im);
            if (batavia.isinstance(re, batavia.types.Str)) {
                // console.log(1000, re, im);
                var regex = /^\(?(-?[\d.]+)?([+-])?(?:([\d.]+)j)?\)?$/i;
                var match = regex.exec(re);
                if (match == null || re == "") {
                    throw new batavia.builtins.ValueError("complex() arg is a malformed string");
                }
                this.real = parseFloat(part_from_str(match[1]));
                this.imag = parseFloat(part_from_str(match[3]));
                if (match[2] == '-') {
                    this.imag = -this.imag;
                }
            } else if (!batavia.isinstance(re, [batavia.types.Float, batavia.types.Int, batavia.types.Bool, batavia.types.Complex])) {
                throw new batavia.builtins.TypeError(
                    "complex() argument must be a string, a bytes-like object or a number, not '" + batavia.type_name(re) + "'"
                );
            } else if (!batavia.isinstance(im, [batavia.types.Float, batavia.types.Int, batavia.types.Bool, batavia.types.Complex])) {
                throw new batavia.builtins.TypeError(
                    "complex() argument must be a string, a bytes-like object or a number, not '" + batavia.type_name(im) + "'"
                );
            } else if (typeof re == 'number' && typeof im == 'number') {
                this.real = re;
                this.imag = im;
            } else if (batavia.isinstance(re, [batavia.types.Float, batavia.types.Int, batavia.types.Bool]) &&
                batavia.isinstance(im, [batavia.types.Float, batavia.types.Int, batavia.types.Bool])) {
                // console.log(2000, re, im);
                this.real = re.__float__().valueOf();
                this.imag = im.__float__().valueOf();
            } else if (batavia.isinstance(re, batavia.types.Complex) && !im) {
                // console.log(3000, re, im);
                this.real = re.real;
                this.imag = re.imag;
            } else {
                throw new batavia.builtins.NotImplementedError("Complex initialization from complex argument(s) has not been implemented");
            }
        }

        Complex.prototype = Object.create(Object.prototype);
        Complex.prototype.__class__ = new batavia.types.Type('complex');

        /**************************************************
         * Javascript compatibility methods
         **************************************************/

        Complex.prototype.toString = function() {
            return this.__str__();
        };

        /**************************************************
         * Type conversions
         **************************************************/

        Complex.prototype.__bool__ = function() {
            return Boolean(this.real || this.imag);
        };

        Complex.prototype.__repr__ = function() {
            return this.__str__();
        };

        Complex.prototype.__str__ = function() {
            if (this.real.valueOf() || Object.is(this.real, -0)) {
                return "(" + part_to_str(this.real) + (this.imag >= 0 ? "+" : "-") + part_to_str(Math.abs(this.imag)) + "j)";
            } else {
                return part_to_str(this.imag) + "j";
            }
        };

        /**************************************************
         * Comparison operators
         **************************************************/

        Complex.prototype.__lt__ = function(other) {
            throw new batavia.builtins.TypeError("unorderable types: complex() < " + batavia.type_name(other) + "()");
        };

        Complex.prototype.__le__ = function(other) {
            throw new batavia.builtins.TypeError("unorderable types: complex() <= " + batavia.type_name(other) + "()");
        };

        Complex.prototype.__eq__ = function(other) {
            if (other !== null && !batavia.isinstance(other, batavia.types.Str)) {
                if (batavia.isinstance(other, batavia.types.Complex)) {
                    return this.real.valueOf() == other.real.valueOf() && this.imag.valueOf() == other.imag.valueOf();
                }
                var val;
                if (batavia.isinstance(other, batavia.types.Bool)) {
                    val = other.valueOf() ? 1.0 : 0.0;
                } else {
                    val = other.valueOf();
                }
                return this.real === val && this.imag == 0;
            }
            return false;
        };

        Complex.prototype.__ne__ = function(other) {
            return !this.__eq__(other);
        };

        Complex.prototype.__gt__ = function(other) {
            throw new batavia.builtins.TypeError("unorderable types: complex() > " + batavia.type_name(other) + "()");
        };

        Complex.prototype.__ge__ = function(other) {
            throw new batavia.builtins.TypeError("unorderable types: complex() >= " + batavia.type_name(other) + "()");
        };


        /**************************************************
         * Unary operators
         **************************************************/

        Complex.prototype.__pos__ = function() {
            return new Complex(this.real, this.imag);
        };

        Complex.prototype.__neg__ = function() {
            return new Complex(-this.real, -this.imag);
        };

        Complex.prototype.__not__ = function() {
            return !this.__bool__();
        };

        Complex.prototype.__invert__ = function() {
            throw new batavia.builtins.TypeError("bad operand type for unary ~: 'complex'");
        };

        Complex.prototype.__abs__ = function() {
            return new batavia.types.Float(Math.sqrt(this.real * this.real + this.imag * this.imag));
        };

        /**************************************************
         * Binary operators
         **************************************************/

        Complex.prototype.__pow__ = function(other) {
            // http://mathworld.wolfram.com/ComplexExponentiation.html
            throw new batavia.builtins.NotImplementedError(
                "Complex.__pow__ has not been implemented yet; if you need it, you need to reevaluate your life-choices."
            );
        };

        function __div__(x, y, inplace) {
            if (batavia.isinstance(y, batavia.types.Int)) {
                if (!y.val.isZero()) {
                    return new Complex(x.real / y.__float__().val, x.imag / y.__float__().val);
                } else {
                    throw new batavia.builtins.ZeroDivisionError("complex division by zero");
                }
            } else if (batavia.isinstance(y, batavia.types.Float)) {
                if (y.valueOf()) {
                    return new Complex(x.real / y.valueOf(), x.imag / y.valueOf());
                } else {
                    throw new batavia.builtins.ZeroDivisionError("complex division by zero");
                }
            } else if (batavia.isinstance(y, batavia.types.Bool)) {
                if (y.valueOf()) {
                    return new Complex(x.real, x.imag);
                } else {
                    throw new batavia.builtins.ZeroDivisionError("complex division by zero");
                }
            } else if (batavia.isinstance(y, batavia.types.Complex)) {
                var den = Math.pow(y.real, 2) + Math.pow(y.imag, 2);
                var num_real = x.real * y.real + x.imag * y.imag;
                var num_imag = x.imag * y.real - x.real * y.imag;
                var real = num_real / den;
                var imag = num_imag / den;
                return new Complex(real, imag);
            } else {
                throw new batavia.builtins.TypeError(
                    "unsupported operand type(s) for /" + (inplace ? "=" : "") + ": 'complex' and '" + batavia.type_name(y) + "'"
                );
            }
        }

        Complex.prototype.__div__ = function(other) {
            return this.__truediv__(other);
        };

        Complex.prototype.__floordiv__ = function(other) {
            throw new batavia.builtins.TypeError("can't take floor of complex number.");
        };

        Complex.prototype.__truediv__ = function(other) {
            return __div__(this, other);
        };

        function __mul__(x, y, inplace) {
            if (batavia.isinstance(y, batavia.types.Int)) {
                if (!y.val.isZero()) {
                    return new Complex(x.real * y.__float__().val, x.imag * y.__float__().val);
                } else {
                    return new Complex(0, 0);
                }
            } else if (batavia.isinstance(y, batavia.types.Float)) {
                if (y.valueOf()) {
                    return new Complex(x.real * y.valueOf(), x.imag * y.valueOf());
                } else {
                    return new Complex(0, 0);
                }
            } else if (batavia.isinstance(y, batavia.types.Bool)) {
                if (y.valueOf()) {
                    return new Complex(x.real, x.imag);
                } else {
                    return new Complex(0, 0);
                }
            } else if (batavia.isinstance(y, batavia.types.Complex)) {
                return new Complex(x.real * y.real - x.imag * y.imag, x.real * y.imag + x.imag * y.real);
            } else if (batavia.isinstance(y, [batavia.types.List, batavia.types.Str, batavia.types.Tuple])) {
                throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'complex'");
            } else {
                throw new batavia.builtins.TypeError(
                    "unsupported operand type(s) for *" + (inplace ? "=" : "") + ": 'complex' and '" + batavia.type_name(y) + "'"
                );
            }
        }

        Complex.prototype.__mul__ = function(other) {
            return __mul__(this, other);
        };

        Complex.prototype.__mod__ = function(other) {
            throw new batavia.builtins.TypeError("can't mod complex numbers.");
        };

        function __add__(x, y, inplace) {
            if (batavia.isinstance(y, batavia.types.Int)) {
                return new Complex(x.real + y.__float__().val, x.imag);
            } else if (batavia.isinstance(y, batavia.types.Float)) {
                return new Complex(x.real + y.valueOf(), x.imag);
            } else if (batavia.isinstance(y, batavia.types.Bool)) {
                return new Complex(x.real + (y.valueOf() ? 1.0 : 0.0), x.imag);
            } else if (batavia.isinstance(y, batavia.types.Complex)) {
                return new Complex(x.real + y.real, x.imag + y.imag);
            } else {
                throw new batavia.builtins.TypeError(
                    "unsupported operand type(s) for +" + (inplace ? "=" : "") + ": 'complex' and '" + batavia.type_name(y) + "'"
                );
            }
        }

        Complex.prototype.__add__ = function(other) {
            return __add__(this, other);
        };

        function __sub__(x, y, inplace) {
            if (batavia.isinstance(y, batavia.types.Int)) {
                return new Complex(x.real - y.__float__().val, x.imag);
            } else if (batavia.isinstance(y, batavia.types.Float)) {
                return new Complex(x.real - y.valueOf(), x.imag);
            } else if (batavia.isinstance(y, batavia.types.Bool)) {
                return new Complex(x.real - (y.valueOf() ? 1.0 : 0.0), x.imag);
            } else if (batavia.isinstance(y, batavia.types.Complex)) {
                return new Complex(x.real - y.real, x.imag - y.imag);
            } else {
                throw new batavia.builtins.TypeError(
                    "unsupported operand type(s) for -" + (inplace ? "=" : "") + ": 'complex' and '" + batavia.type_name(y) + "'"
                );
            }
        }

        Complex.prototype.__sub__ = function(other) {
            return __sub__(this, other);
        };

        Complex.prototype.__getitem__ = function(other) {
            throw new batavia.builtins.TypeError("'complex' object is not subscriptable")
        };

        Complex.prototype.__lshift__ = function(other) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for <<: 'complex' and '" + batavia.type_name(other) + "'"
            );
        };

        Complex.prototype.__rshift__ = function(other) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for >>: 'complex' and '" + batavia.type_name(other) + "'"
            );
        };

        Complex.prototype.__and__ = function(other) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for &: 'complex' and '" + batavia.type_name(other) + "'"
            );
        };

        Complex.prototype.__xor__ = function(other) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for ^: 'complex' and '" + batavia.type_name(other) + "'"
            );
        };

        Complex.prototype.__or__ = function(other) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for |: 'complex' and '" + batavia.type_name(other) + "'"
            );
        };

        /**************************************************
         * Inplace operators
         **************************************************/

        Complex.prototype.__ifloordiv__ = function(other) {
            throw new batavia.builtins.TypeError("can't take floor of complex number.");
        };

        Complex.prototype.__itruediv__ = function(other) {
            return __div__(this, other, true);
        };

        Complex.prototype.__iadd__ = function(other) {
            return __add__(this, other, true);
        };

        Complex.prototype.__isub__ = function(other) {
            return __sub__(this, other, true);
        };

        Complex.prototype.__imul__ = function(other) {
            return __mul__(this, other, true);
        };

        Complex.prototype.__imod__ = function(other) {
            throw new batavia.builtins.TypeError("can't mod complex numbers.");
        };

        Complex.prototype.__ipow__ = function(other) {
            throw new batavia.builtins.NotImplementedError("Complex.__ipow__ has not been implemented");
        };

        Complex.prototype.__ilshift__ = function(other) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for <<=: 'complex' and '" + batavia.type_name(other) + "'"
            );
        };

        Complex.prototype.__irshift__ = function(other) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for >>=: 'complex' and '" + batavia.type_name(other) + "'"
            );
        };

        Complex.prototype.__iand__ = function(other) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for &=: 'complex' and '" + batavia.type_name(other) + "'"
            );
        };

        Complex.prototype.__ixor__ = function(other) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for ^=: 'complex' and '" + batavia.type_name(other) + "'"
            );
        };

        Complex.prototype.__ior__ = function(other) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for |=: 'complex' and '" + batavia.type_name(other) + "'"
            );
        };

        /**************************************************
         * Methods
         **************************************************/

        Complex.prototype.add = function(v) {
            this[v] = null;
        };

        Complex.prototype.copy = function() {
            return new Complex(this);
        };

        Complex.prototype.remove = function(v) {
            delete this[v];
        };

        Complex.prototype.update = function(values) {
            for (var value in values) {
                if (values.hasOwnProperty(value)) {
                    this[values[value]] = null;
                }
            }
        };

        /**************************************************/

        return Complex;
    }()
}
