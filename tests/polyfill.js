// A polyfill for the lack of Function.bind on PhantomJS 1.8
// which is the default PhantomJS on Ubuntu 12.04 and 14.04
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(
            this instanceof fNOP && oThis ? this : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments))
          );
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

// A polyfill for the lack of ES6+ Math functions.
// From https://github.com/MaxArt2501/es6-math.
// The MIT License (MIT)
//
// Copyright (c) 2014-2015 Massimo Artizzu (MaxArt2501)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else factory();
})(function() {
    "use strict";
    // x | 0 is the simplest way to implement ToUint32(x)
    var M = Math,
        N = Number,
        prop, def = Object.defineProperty,
        mathXtra = {
            // Hyperbolic functions
            sinh: function sinh(x) {
                // If -0, must return -0.
                if (x === 0) return x;
                var exp = M.exp(x);
                return exp/2 - .5/exp;
            },
            cosh: function cosh(x) {
                var exp = M.exp(x);
                return exp/2 + .5/exp;
            },
            tanh: function tanh(x) {
                // If -0, must return -0.
                if (x === 0) return x;
                // Mathematically speaking, the formulae are equivalent.
                // But computationally, it's better to make exp tend to 0
                // rather than +Infinity
                if (x < 0) {
                    var exp = M.exp(2 * x);
                    return (exp - 1) / (exp + 1);
                } else {
                    var exp = M.exp(-2 * x);
                    return (1 - exp) / (1 + exp);
                }
            },
            asinh: function asinh(x) {
                return x === -Infinity ? -Infinity : M.log(x + M.sqrt(x * x + 1));
            },
            acosh: function acosh(x) {
                return x >= 1 ? M.log(x + M.sqrt(x * x - 1)) : NaN;
            },
            atanh: function atanh(x) {
                return x >= -1 && x <= 1 ? M.log((1 + x) / (1 - x)) / 2 : NaN;
            },

            // Exponentials and logarithms
            expm1: function expm1(x) {
                // If -0, must return -0. But Math.exp(-0) - 1 yields +0.
                return x === 0 ? x : M.exp(x) - 1;
            },
            log10: function log10(x) {
                return M.log(x) / M.LN10;
            },
            log2: function log2(x) {
                return M.log(x) / M.LN2;
            },
            log1p: function log1p(x) {
                // If -0, must return -0. But Math.log(1 + -0) yields +0.
                return x === 0 ? x : M.log(1 + x);
            },

            // Various
            sign: function sign(x) {
                // If -0, must return -0.
                return isNaN(x) ? NaN : x < 0 ? -1 : x > 0 ? 1 : +x;
            },
            cbrt: function cbrt(x) {
                // If -0, must return -0.
                return x === 0 ? x : x < 0 ? -M.pow(-x, 1/3) : M.pow(x, 1/3);
            },
            hypot: function hypot(value1, value2) { // Must have a length of 2
                for (var i = 0, s = 0, args = arguments; i < args.length; i++)
                    s += args[i] * args[i];
                return M.sqrt(s);
            },

            // Rounding and 32-bit operations
            trunc: function trunc(x) {
                return x === 0 ? x : x < 0 ? M.ceil(x) : M.floor(x);
            },
            fround: typeof Float32Array === "function"
                    ? (function(arr) {
                        return function fround(x) { return arr[0] = x, arr[0]; };
                    })(new Float32Array(1))
                    : function fround(x) { return x; },

            clz32: function clz32(x) {
                if (x === -Infinity) return 32;
                if (x < 0 || (x |= 0) < 0) return 0;
                if (!x) return 32;
                var i = 31;
                while (x >>= 1) i--;
                return i;
            },
            imul: function imul(x, y) {
                return (x | 0) * (y | 0) | 0;
            }
        },
        numXtra = {
            isNaN: function isNaN(x) {
                // NaN is the only Javascript object such that x !== x
                // The control on the type is for eventual host objects
                return typeof x === "number" && x !== x;
            },
            isFinite: function isFinite(x) {
                return typeof x === "number" && x === x && x !== Infinity && x !== -Infinity;
            },
            isInteger: function isInteger(x) {
                return typeof x === "number" && x !== Infinity && x !== -Infinity && M.floor(x) === x;
            },
            isSafeInteger: function isSafeInteger(x) {
                return typeof x === "number" && x > -9007199254740992 && x < 9007199254740992 && M.floor(x) === x;
            },
            parseFloat: parseFloat,
            parseInt: parseInt
        },
        numConsts = {
            EPSILON: 2.2204460492503130808472633361816e-16,
            MAX_SAFE_INTEGER: 9007199254740991,
            MIN_SAFE_INTEGER: -9007199254740991
        };

    for (prop in mathXtra)
        if (typeof M[prop] !== "function")
            M[prop] = mathXtra[prop];

    for (prop in numXtra)
        if (typeof N[prop] !== "function")
            N[prop] = numXtra[prop];

    try {
        prop = {};
        def(prop, 0, {});
        for (prop in numConsts)
            if (!(prop in N))
                def(N, prop, {value: numConsts[prop]});
    } catch (e) {
        for (prop in numConsts)
            if (!(prop in N))
                N[prop] = numConsts[prop];
    }
});
