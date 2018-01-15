// docstrings taken from Python 3, which falls under this license:
// https://docs.python.org/3/license.html
//
import { Buffer } from 'buffer'
import BigNumber from 'bignumber.js'

import { iter_for_each } from '../core/callables'
import { BataviaError, OverflowError, TypeError, ValueError, ZeroDivisionError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as builtins from '../builtins'
import { isinstance } from '../types'
import Bool from '../types/Bool'
import Complex from '../types/Complex'
import Float from '../types/Float'
import Int from '../types/Int'
import Tuple from '../types/Tuple'

export var math = {
    '__doc__': '',
    '__file__': 'batavia/modules/math.js',
    '__name__': 'math',
    '__package__': '',

    'e': new Float(Math.E),
    'nan': new Float(NaN),
    'pi': new Float(Math.PI),
    'inf': new Float(Infinity)
}

var _checkFloat = function(x) {
    if (isinstance(x, Complex)) {
        throw new TypeError("can't convert complex to float")
    } else if (!isinstance(x, [Bool, Float, Int])) {
        throw new TypeError('a float is required')
    }
}

math.acos = function(x) {
    _checkFloat(x)
    return new Float(Math.acos(x.__float__().val))
}
math.acos.__doc__ = 'acos(x)\n\nReturn the arc cosine (measured in radians) of x.'

math.acosh = function(x) {
    _checkFloat(x)
    var result = Math.acosh(x.__float__().val)
    if (!isFinite(result)) {
        throw new ValueError('math domain error')
    }
    return new Float(result)
}
math.acosh.__doc__ = 'acosh(x)\n\nReturn the inverse hyperbolic cosine of x.'

math.asin = function(x) {
    _checkFloat(x)
    return new Float(Math.asin(x.__float__().val))
}
math.asin.__doc__ = 'asin(x)\n\nReturn the arc sine (measured in radians) of x.'

math.asinh = function(x) {
    _checkFloat(x)
    return new Float(Math.asinh(x.__float__().val))
}
math.asinh.__doc__ = 'asinh(x)\n\nReturn the inverse hyperbolic sine of x.'

math.atan = function(x) {
    _checkFloat(x)
    return new Float(Math.atan(x.__float__().val))
}
math.atan.__doc__ = 'atan(x)\n\nReturn the arc tangent (measured in radians) of x.'

math.atan2 = function(y, x) {
    _checkFloat(x)
    var xx = x.__float__().val
    _checkFloat(y)
    var yy = y.__float__().val
    return new Float(Math.atan2(yy, xx))
}
math.atan2.__doc__ = 'atan2(y, x)\n\nReturn the arc tangent (measured in radians) of y/x.\nUnlike atan(y/x), the signs of both x and y are considered.'

math.atanh = function(x) {
    _checkFloat(x)
    var result = Math.atanh(x.__float__().val)
    if (!isFinite(result)) {
        throw new ValueError('math domain error')
    }
    return new Float(Math.atanh(x.__float__().val))
}
math.atanh.__doc__ = 'atanh(x)\n\nReturn the inverse hyperbolic tangent of x.'

math.ceil = function(x) {
    if (isinstance(x, Int)) {
        return x
    }
    _checkFloat(x)
    return new Int(Math.ceil(x.__float__().val))
}
math.ceil.__doc__ = 'ceil(x)\n\nReturn the ceiling of x as an int.\nThis is the smallest integral value >= x.'

math.copysign = function(x, y) {
    _checkFloat(y)
    var yy = y.__float__().val
    _checkFloat(x)
    var xx = x.__float__().val
    if ((xx >= 0) !== (yy >= 0)) {
        return x.__float__().__neg__()
    }
    return x.__float__()
}
math.copysign.__doc__ = 'copysign(x, y)\n\nReturn a float with the magnitude (absolute value) of x but the sign \nof y. On platforms that support signed zeros, copysign(1.0, -0.0) \nreturns -1.0.\n'

math.cos = function(x) {
    _checkFloat(x)
    return new Float(Math.cos(x.__float__().val))
}
math.cos.__doc__ = 'cos(x)\n\nReturn the cosine of x (measured in radians).'

math.cosh = function(x) {
    _checkFloat(x)
    var result = Math.cosh(x.__float__().val)
    if (!isFinite(result)) {
        throw new OverflowError('math range error')
    }
    return new Float(Math.cosh(x.__float__().val))
}
math.cosh.__doc__ = 'cosh(x)\n\nReturn the hyperbolic cosine of x.'

math.degrees = function(x) {
    _checkFloat(x)
    // multiply by 180 / math.pi
    return new Float(x.__float__().val * 57.295779513082322865)
}
math.degrees.__doc__ = 'degrees(x)\n\nConvert angle x from radians to degrees.'

// taylor series expansion for erf(x)
var _erf_series = function(x) {
    // From CPython docs:
    //
    // erf(x) = x*exp(-x*x)/sqrt(pi) * [
    //                    2/1 + 4/3 x**2 + 8/15 x**4 + 16/105 x**6 + ...]
    // x**(2k-2) here is 4**k*factorial(k)/factorial(2*k)
    var y = 2.0
    var num = 4
    var denom = 2
    var xk = 1
    // CPython uses 25 terms.
    for (var i = 2; i < 26; i++) {
        num *= 4
        num *= i
        for (var j = 2 * (i - 1) + 1; j <= 2 * i; j++) {
            denom *= j
        }
        xk *= x * x
        y += xk * num / denom
    }
    return y * x * Math.exp(-x * x) / Math.sqrt(Math.PI)
}

// continued fraction expansion of 1 - erf(x)
var _erfc_cfrac = function(x) {
    // From CPython docs:
    //
    // erfc(x) = x*exp(-x*x)/sqrt(pi) * [1/(0.5 + x**2 -) 0.5/(2.5 + x**2 - )
    //                               3.0/(4.5 + x**2 - ) 7.5/(6.5 + x**2 - ) ...]
    //
    //    after the first term, the general term has the form:
    //
    //       k*(k-0.5)/(2*k+0.5 + x**2 - ...).

    if (x > 30.0) {
        return 0.0
    }

    var p_n = 1
    var p_n_1 = 0.0
    var q_n = 0.5 + x * x
    var q_n_1 = 1.0
    var a = 0.0
    var coeff = 0.5

    // CPython uses 50 terms.
    for (var k = 0; k < 50; k++) {
        a += coeff
        coeff += 2
        var b = coeff + x * x

        var t = p_n
        p_n = b * p_n - a * p_n_1
        p_n_1 = t

        t = q_n
        q_n = b * q_n - a * q_n_1
        q_n_1 = t
    }
    return p_n / q_n * x * Math.exp(-x * x) / Math.sqrt(Math.PI)
}

math.erf = function(x) {
    _checkFloat(x)
    var xx = x.__float__().val
    // Save the sign of x
    var sign = 1
    if (xx < 0) {
        sign = -1
    }
    xx = Math.abs(x)

    var result
    if (xx < 1.5) {
        result = _erf_series(xx)
    } else {
        result = 1.0 - _erfc_cfrac(xx)
    }
    return new Float(sign * result)
}
math.erf.__doc__ = 'erf(x)\n\nError function at x.'

math.erfc = function(x) {
    _checkFloat(x)
    return new Float(1.0 - math.erf(x).val)
}
math.erfc.__doc__ = 'erfc(x)\n\nComplementary error function at x.'

math.exp = function(x) {
    _checkFloat(x)
    var result = Math.exp(x.__float__().val)
    if (!isFinite(result)) {
        throw new OverflowError('math range error')
    }
    return new Float(result)
}
math.exp.__doc__ = 'exp(x)\n\nReturn e raised to the power of x.'

math.expm1 = function(x) {
    _checkFloat(x)
    var result = Math.expm1(x.__float__().val)
    if (!isFinite(result)) {
        throw new OverflowError('math range error')
    }
    return new Float(Math.expm1(x.__float__().val))
}
math.expm1.__doc__ = 'expm1(x)\n\nReturn exp(x)-1.\nThis function avoids the loss of precision involved in the direct evaluation of exp(x)-1 for small x.'

math.fabs = function(x) {
    _checkFloat(x)
    return new Float(Math.abs(x.__float__().val))
}
math.fabs.__doc__ = 'fabs(x)\n\nReturn the absolute value of the float x.'

// efficiently multiply all of the bignumbers in the list together, returning the product
var _mul_list = function(l, start, end) {
    var len = end - start + 1
    if (len === 0) {
        return new BigNumber(1)
    } else if (len === 1) {
        return l[start]
    } else if (len === 2) {
        return l[start].mul(l[start + 1])
    } else if (len === 3) {
        return l[start].mul(l[start + 1]).mul(l[start + 2])
    }

    // split into halves and recurse
    var mid = Math.round(start + len / 2)
    var a = _mul_list(l, start, mid)
    var b = _mul_list(l, mid + 1, end)
    return a.mul(b)
}

math.factorial = function(x) {
    var num

    if (isinstance(x, Int)) {
        num = x.val
    } else if (isinstance(x, Float)) {
        if (!x.is_integer().valueOf()) {
            throw new ValueError('factorial() only accepts integral values')
        }
        num = new BigNumber(x.valueOf())
    } else if (isinstance(x, Bool)) {
        return new Int(1)
    } else if (isinstance(x, Complex)) {
        throw new TypeError("can't convert complex to int")
    } else if (x === null) {
        throw new TypeError('an integer is required (got type NoneType)')
    } else {
        throw new TypeError('an integer is required (got type ' + x.__class__.__name__ + ')')
    }

    if (num.isNegative()) {
        throw new ValueError('factorial() not defined for negative values')
    }

    if (num.isZero()) {
        return new Int(1)
    }

    // a basic pyramid multiplication
    var nums = []
    while (!num.isZero()) {
        nums.push(num)
        num = num.sub(1)
    }
    return new Int(_mul_list(nums, 0, nums.length - 1))
}
math.factorial.__doc__ = 'factorial(x) -> Integral\n\nFind x!. Raise a ValueError if x is negative or non-integral.'

math.floor = function(x) {
    if (isinstance(x, Int)) {
        return x
    }
    _checkFloat(x)
    return new Int(Math.floor(x.__float__().val))
}
math.floor.__doc__ = 'floor(x)\n\nReturn the floor of x as an int.\nThis is the largest integral value <= x.'

math.fmod = function(x, y) {
    _checkFloat(y)
    var yy = y.__float__().val
    _checkFloat(x)
    var xx = x.__float__().val
    if (yy === 0.0) {
        throw new ValueError('math domain error')
    }
    return new Float(xx % yy)
}
math.fmod.__doc__ = 'fmod(x, y)\n\nReturn fmod(x, y), according to platform C.  x % y may differ.'

math.frexp = function(x) {
    _checkFloat(x)
    var xx = x.__float__().val
    // check for 0, -0, NaN, Inf, -Inf
    if (xx === 0 || !isFinite(xx)) {
        return new Tuple([x.__float__(), new Int(0)])
    }
    var buff = Buffer.alloc(8)
    buff.writeDoubleLE(x, 0)
    var a = buff.readUInt32LE(0)
    var b = buff.readUInt32LE(4)
    var exp = ((b >> 20) & 0x7ff) - 1022
    var num
    // check for denormal number
    if (exp === -1022) {
        // each leading zero increases the exponent
        num = (b & 0xfffff) * 4294967296 + a
        while ((num !== 0) && (num < 0x8000000000000)) {
            exp--
            num *= 2
        }
        num = num / 0x10000000000000
    } else {
        num = 0x10000000000000 + (b & 0xfffff) * 4294967296 + a
        num = num / 0x20000000000000
    }
    if (b >> 31) {
        num = -num
    }
    return new Tuple([new Float(num), new Int(exp)])
}
math.frexp.__doc__ = 'frexp(x)\n\nReturn the mantissa and exponent of x, as pair (m, e).\nm is a float and e is an int, such that x = m * 2.**e.\nIf x is 0, m and e are both 0.  Else 0.5 <= abs(m) < 1.0.'

math.fsum = function(iterable) {
    var iterobj = builtins.iter(iterable)
    var sum = 0.0
    iter_for_each(iterobj, function(val) {
        if (!isinstance(val, [Bool, Float, Int])) {
            throw new TypeError('a float is required')
        }
        sum += val.__float__().val
    })
    return new Float(sum)
}
math.fsum.__doc__ = 'fsum(iterable)\n\nReturn an accurate floating point sum of values in the iterable.\nAssumes IEEE-754 floating point arithmetic.'

math.gamma = function(x) {
    // adapted from public domain code at http://picomath.org/javascript/gamma.js.html

    _checkFloat(x)
    var xx = x.__float__().val

    if (xx <= 0.0) {
        if (Number.isInteger(xx)) {
            throw new ValueError('math domain error')
        }
        // analytic continuation using reflection formula
        // gamma(z) * gamma(1-z) = pi / sin(pi * z)
        return new Float(Math.PI / Math.sin(Math.PI * xx) / math.gamma(new Float(1 - xx)))
    }

    // Split the function domain into three intervals:
    // (0, 0.001), [0.001, 12), and (12, infinity)

    // /////////////////////////////////////////////////////////////////////////
    // First interval: (0, 0.001)
    //
    // For small x, 1/Gamma(x) has power series x + gamma x^2  - ...
    // So in this range, 1/Gamma(x) = x + gamma x^2 with error on the order of x^3.
    // The relative error over this interval is less than 6e-7.

    var gamma = 0.577215664901532860606512090 // Euler's gamma constant

    if (xx < 0.001) {
        return new Float(1.0 / (x * (1.0 + gamma * x)))
    }

    // /////////////////////////////////////////////////////////////////////////
    // Second interval: [0.001, 12)

    if (xx < 12.0) {
        // The algorithm directly approximates gamma over (1,2) and uses
        // reduction identities to reduce other arguments to this interval.
        var y = xx
        var n = 0
        var arg_was_less_than_one = (y < 1.0)

        // Add or subtract integers as necessary to bring y into (1,2)
        // Will correct for this below
        if (arg_was_less_than_one) {
            y += 1.0
        } else {
            n = Math.floor(y) - 1 // will use n later
            y -= n
        }

        // numerator coefficients for approximation over the interval (1,2)
        var p =
            [
                -1.71618513886549492533811E+0,
                2.47656508055759199108314E+1,
                -3.79804256470945635097577E+2,
                6.29331155312818442661052E+2,
                8.66966202790413211295064E+2,
                -3.14512729688483675254357E+4,
                -3.61444134186911729807069E+4,
                6.64561438202405440627855E+4
            ]
        // denominator coefficients for approximation over the interval (1,2)
        var q =
            [
                -3.08402300119738975254353E+1,
                3.15350626979604161529144E+2,
                -1.01515636749021914166146E+3,
                -3.10777167157231109440444E+3,
                2.25381184209801510330112E+4,
                4.75584627752788110767815E+3,
                -1.34659959864969306392456E+5,
                -1.15132259675553483497211E+5
            ]

        var num = 0.0
        var den = 1.0

        var z = y - 1
        var i

        for (i = 0; i < 8; i++) {
            num = (num + p[i]) * z
            den = den * z + q[i]
        }
        var result = num / den + 1.0

        // Apply correction if argument was not initially in (1,2)
        if (arg_was_less_than_one) {
            // Use identity gamma(z) = gamma(z+1)/z
            // The variable "result" now holds gamma of the original y + 1
            // Thus we use y-1 to get back the orginal y.
            result /= (y - 1.0)
        } else {
            // Use the identity gamma(z+n) = z*(z+1)* ... *(z+n-1)*gamma(z)
            for (i = 0; i < n; i++) {
                result *= y++
            }
        }

        return new Float(result)
    }

    // /////////////////////////////////////////////////////////////////////////
    // Third interval: [12, infinity)

    if (xx > 171.624) {
        // Correct answer too large to display.
        throw new OverflowError('math range error')
    }

    return math.exp(math.lgamma(x))
}
math.gamma.__doc__ = 'gamma(x)\n\nGamma function at x.'

math.gcd = function(x, y) {
    if (!isinstance(x, [Bool, Int])) {
        throw new TypeError("'" + type_name(x) + "' object cannot be interpreted as an integer")
    }
    if (!isinstance(y, [Bool, Int])) {
        throw new TypeError("'" + type_name(y) + "' object cannot be interpreted as an integer")
    }
    var xx = x.__trunc__().val.abs()
    var yy = y.__trunc__().val.abs()
    if (xx.isZero()) {
        return y.__trunc__().__abs__()
    } else if (yy.isZero()) {
        return x.__trunc__().__abs__()
    }
    // Standard modulo Euclidean algorithm.
    // TODO: when our binary shifts are more efficient, switch to binary Euclidean algorithm.
    while (!yy.isZero()) {
        var t = yy
        yy = xx.mod(yy)
        xx = t
    }
    return new Int(xx)
}
math.gcd.__doc__ = 'gcd(x, y) -> int\n\ngreatest common divisor of x and y'

math.hypot = function(x, y) {
    _checkFloat(y)
    var yy = y.__float__().val
    _checkFloat(x)
    var xx = x.__float__().val
    return new Float(Math.hypot(xx, yy))
}
math.hypot.__doc__ = 'hypot(x, y)\n\nReturn the Euclidean distance, sqrt(x*x + y*y).'

math.isclose = function(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (args.length === 0) {
        throw new TypeError("Required argument 'a' (pos 1) not found")
    }
    if (args.length === 1) {
        throw new TypeError("Required argument 'b' (pos 2) not found")
    }
    if (args.length > 2) {
        throw new TypeError('Function takes at most 2 positional arguments (' + args.length + ' given)')
    }
    var rel_tol = 1e-09
    if ('rel_tol' in kwargs) {
        if (!isinstance(kwargs.rel_tol, [Bool, Float, Int])) {
            throw new TypeError('a float is required')
        }
        rel_tol = kwargs.rel_tol.__float__().val
    }
    var abs_tol = 0.0
    if ('abs_tol' in kwargs) {
        if (!isinstance(kwargs.abs_tol, [Bool, Float, Int])) {
            throw new TypeError('a float is required')
        }
        abs_tol = kwargs.abs_tol.__float__().val
    }

    if (abs_tol < 0.0 || rel_tol < 0.0) {
        throw new ValueError('tolerances must be non-negative')
    }

    var a = args[0].__float__().val
    var b = args[1].__float__().val
    if (a === b) {
        return new Bool(true)
    }
    if ((a === Infinity) || (a === -Infinity) || (b === Infinity) || (b === -Infinity)) {
        return new Bool(false)
    }
    if (isNaN(a) || isNaN(b)) {
        return new Bool(false)
    }
    var delta = Math.abs(a - b)
    if ((delta <= abs_tol) ||
        (delta <= Math.abs(rel_tol * a)) ||
        (delta <= Math.abs(rel_tol * a))) {
        return new Bool(true)
    }
    return new Bool(false)
}
math.isclose.$pyargs = true
math.isclose.__doc__ = 'is_close(a, b, *, rel_tol=1e-9, abs_tol=0.0) -> bool\n\nDetermine whether two floating point numbers are close in value.\n\n   rel_tol\n       maximum difference for being considered "close", relative to the\n       magnitude of the input values\n    abs_tol\n       maximum difference for being considered "close", regardless of the\n       magnitude of the input values\n\nReturn True if a is close in value to b, and False otherwise.\n\nFor the values to be considered close, the difference between them\nmust be smaller than at least one of the tolerances.\n\n-inf, inf and NaN behave similarly to the IEEE 754 Standard.  That\nis, NaN is not close to anything, even itself.  inf and -inf are\nonly close to themselves.'

math.isfinite = function(x) {
    _checkFloat(x)
    return new Bool(isFinite(x.__float__().val))
}
math.isfinite.__doc__ = 'isfinite(x) -> bool\n\nReturn True if x is neither an infinity nor a NaN, and False otherwise.'

math.isinf = function(x) {
    _checkFloat(x)
    var xx = x.__float__().val
    return new Bool(xx === Infinity || xx === -Infinity)
}
math.isinf.__doc__ = 'isinf(x) -> bool\n\nReturn True if x is a positive or negative infinity, and False otherwise.'

math.isnan = function(x) {
    _checkFloat(x)
    var xx = x.__float__().val
    return new Bool(isNaN(xx))
}
math.isnan.__doc__ = 'isnan(x) -> bool\n\nReturn True if x is a NaN (not a number), and False otherwise.'

math.ldexp = function(x, i) {
    _checkFloat(x)
    var xx = x.__float__()
    if (!isinstance(i, [Bool, Int])) {
        throw new TypeError('Expected an int as second argument to ldexp.')
    }
    if (xx.val === 0.0) {
        return xx
    }
    var ii = i.__trunc__().val
    if (ii.lt(-1022 - 53)) {
        ii = -1022 - 53
    } else {
        ii = ii.valueOf()
    }
    var result = x.__float__().val * Math.pow(2, ii)
    if (!isFinite(result)) {
        throw new OverflowError('math range error')
    }
    return new Float(result)
}
math.ldexp.__doc__ = 'ldexp(x, i)\n\nReturn x * (2**i).'

math.lgamma = function(x) {
    // adapted from public domain code at http://picomath.org/javascript/gamma.js.html

    _checkFloat(x)
    var xx = x.__float__().val

    if (xx <= 0.0) {
        if (Number.isInteger(xx)) {
            throw new ValueError('math domain error')
        }
        // analytic continuation using reflection formula
        // gamma(z) * gamma(1-z) = pi / sin(pi * z)
        // lgamma(z) + lgamma(1-z) = log(pi / sin |pi * z|)
        return new Float(Math.log(Math.abs(Math.PI / Math.sin(Math.PI * xx))) - math.lgamma(new Float(1 - xx)))
    }

    if (xx < 12.0) {
        var gx = math.gamma(x).val
        return new Float(Math.log(Math.abs(gx)))
    }

    // Abramowitz and Stegun 6.1.41
    // Asymptotic series should be good to at least 11 or 12 figures
    // For error analysis, see Whittiker and Watson
    // A Course in Modern Analysis (1927), page 252

    var c =
        [
            1.0 / 12.0,
            -1.0 / 360.0,
            1.0 / 1260.0,
            -1.0 / 1680.0,
            1.0 / 1188.0,
            -691.0 / 360360.0,
            1.0 / 156.0,
            -3617.0 / 122400.0
        ]
    var z = 1.0 / (xx * xx)
    var sum = c[7]
    for (var i = 6; i >= 0; i--) {
        sum *= z
        sum += c[i]
    }
    var series = sum / xx

    var halfLogTwoPi = 0.91893853320467274178032973640562
    var logGamma = (xx - 0.5) * Math.log(xx) - xx + halfLogTwoPi + series
    return new Float(logGamma)
}
math.lgamma.__doc__ = 'lgamma(x)\n\nNatural logarithm of absolute value of Gamma function at x.'

math.log = function(x, base) {
    if (x === null) {
        throw new TypeError('a float is required')
    }

    // special case if both arguments are very large integers
    if (isinstance(x, Int) &&
        isinstance(base, Int)) {
        return _log2_int(x).__div__(_log2_int(base))
    }

    // special case if x is bool it should behave like integer
    if (isinstance(x, Bool)) {
        if (x.valueOf()) {
            x = new Int(1)
        } else {
            x = new Int(0)
        }
    }

    // special base is bool it should behave like integer
    if (isinstance(base, Bool)) {
        if (base.valueOf()) {
            base = new Int(1)
        } else {
            base = new Int(0)
        }
    }

    _checkFloat(x)
    if (x.__le__(new Float(0.0))) {
        throw new ValueError('math domain error')
    }
    if (x.__eq__(new Float(1.0)) && isinstance(base, Int) && base.val.gt(1)) {
        return new Float(0.0)
    }
    if (typeof base !== 'undefined') {
        _checkFloat(base)
        if (base.__le__(new Float(0.0))) {
            throw new ValueError('math domain error')
        }
        var lg_base
        if (isinstance(base, Int)) {
            lg_base = _log2_int(base).val
        } else {
            var bb = base.__float__().val
            if (bb <= 0.0) {
                throw new ValueError('math domain error')
            }
            lg_base = Math.log2(bb)
        }
        if (lg_base === 0.0) {
            throw new ZeroDivisionError('float division by zero')
        }
        return new Float(math.log2(x).val / lg_base)
    }

    if (isinstance(x, Int)) {
        if (x.val.isZero() || x.val.isNeg()) {
            throw new ValueError('math domain error')
        }
        if (x.__ge__(Int.prototype.MAX_FLOAT)) {
            return _log2_int(x).__mul__(new Float(0.6931471805599453))
        }
    }
    return new Float(Math.log(x.__float__().val))
}
math.log.__doc__ = 'log(x[, base])\n\nReturn the logarithm of x to the given base.\nIf the base not specified, returns the natural logarithm (base e) of x.'

math.log10 = function(x) {
    _checkFloat(x)
    if (isinstance(x, Int)) {
        if (x.val.isZero() || x.val.isNeg()) {
            throw new ValueError('math domain error')
        }
        if (x.__ge__(Int.prototype.MAX_FLOAT)) {
            return _log2_int(x) * 0.30102999566398114
        }
    }
    var xx = x.__float__().val
    if (xx <= 0.0) {
        throw new ValueError('math domain error')
    }
    return new Float(Math.log10(xx))
}
math.log10.__doc__ = 'log10(x)\n\nReturn the base 10 logarithm of x.'

math.log1p = function(x) {
    _checkFloat(x)
    var xx = x.__float__().val
    if (xx <= -1.0) {
        throw new ValueError('math domain error')
    }
    return new Float(Math.log1p(xx))
}
math.log1p.__doc__ = 'log1p(x)\n\nReturn the natural logarithm of 1+x (base e).\nThe result is computed in a way which is accurate for x near zero.'

// compute log2 of the (possibly large) integer argument
var _log2_int = function(x) {
    if (x.val.isNeg() || x.val.isZero()) {
        throw new ValueError('math domain error')
    }
    var bits = x._bits()
    if (bits.length < 54) {
        return new Float(Math.log2(x.__float__().val))
    }
    // express x as M * (2**exp) where 0 <= M < 1.0
    var exp = bits.length
    bits = bits.slice(0, 54)
    var num = new BigNumber(bits.join('') || 0, 2).valueOf()
    num = num / 18014398509481984.0
    return new Float(Math.log2(num) + exp)
}

math.log2 = function(x) {
    _checkFloat(x)
    if (isinstance(x, Int)) {
        return _log2_int(x)
    }
    var result = Math.log2(x.__float__().val)
    if (!isFinite(result)) {
        throw new ValueError('math domain error')
    }
    return new Float(Math.log2(x.__float__().val))
}
math.log2.__doc__ = 'log2(x)\n\nReturn the base 2 logarithm of x.'

math.modf = function(x) {
    _checkFloat(x)
    var xx = x.__float__().val
    var frac = xx % 1
    var int = Math.round(xx - frac)
    return new Tuple([new Float(frac),
        new Float(int)])
}
math.modf.__doc__ = 'modf(x)\n\nReturn the fractional and integer parts of x.  Both results carry the sign\nof x and are floats.'

math.pow = function(x, y) {
    _checkFloat(y)
    var yy = y.__float__().val
    _checkFloat(x)
    var xx = x.__float__().val
    var result = Math.pow(x, y)
    if (xx < 0 && !Number.isInteger(yy) && yy !== 0.0) {
        throw new ValueError('math domain error')
    }
    if (xx === 0.0 && yy < 0.0) {
        throw new ValueError('math domain error')
    }
    if (!isFinite(result)) {
        throw new OverflowError('math range error')
    }
    return new Float(result)
}
math.pow.__doc__ = 'pow(x, y)\n\nReturn x**y (x to the power of y).'

math.radians = function(x) {
    _checkFloat(x)
    // multiply by math.pi / 180
    return new Float(x.__float__().val * 0.017453292519943295)
}
math.radians.__doc__ = 'radians(x)\n\nConvert angle x from degrees to radians.'

math.sin = function(x) {
    _checkFloat(x)
    return new Float(Math.sin(x.__float__().val))
}
math.sin.__doc__ = 'sin(x)\n\nReturn the sine of x (measured in radians).'

math.sinh = function(x) {
    _checkFloat(x)
    var result = Math.sinh(x.__float__().val)
    if (!isFinite(result)) {
        throw new OverflowError('math range error')
    }
    return new Float(result)
}
math.sinh.__doc__ = 'sinh(x)\n\nReturn the hyperbolic sine of x.'

math.sqrt = function(x) {
    _checkFloat(x)
    var result = Math.sqrt(x.__float__().val)
    if (!isFinite(result)) {
        throw new ValueError('math domain error')
    }
    return new Float(result)
}
math.sqrt.__doc__ = 'sqrt(x)\n\nReturn the square root of x.'

math.tan = function(x) {
    _checkFloat(x)
    return new Float(Math.tan(x.__float__().val))
}
math.tan.__doc__ = 'tan(x)\n\nReturn the tangent of x (measured in radians).'

math.tanh = function(x) {
    _checkFloat(x)
    return new Float(Math.tanh(x.__float__().val))
}
math.tanh.__doc__ = 'tanh(x)\n\nReturn the hyperbolic tangent of x.'

math.trunc = function(x) {
    if (x === null) {
        throw new TypeError("type NoneType doesn't define __trunc__ method")
    } else if (!x.__trunc__) {
        throw new TypeError('type ' + type_name(x) + " doesn't define __trunc__ method")
    }
    return x.__trunc__()
}
math.trunc.__doc__ = 'trunc(x:Real) -> Integral\n\nTruncates x to the nearest Integral toward 0. Uses the __trunc__ magic method.'
