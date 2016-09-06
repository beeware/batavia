
batavia.modules.math = {
    __doc__: "",
    __file__: "math.js",
    __name__: "math",
    __package__: "",
    e: new batavia.types.Float(Math.E),
    nan: new batavia.types.Float(NaN),
    pi: new batavia.types.Float(Math.PI),
    inf: new batavia.types.Float(Infinity),

    _checkFloat: function(x) {
        if (batavia.isinstance(x, batavia.types.Complex)) {
            throw new batavia.builtins.TypeError("can't convert complex to float");
        } else if (!batavia.isinstance(x, [batavia.types.Bool, batavia.types.Float, batavia.types.Int])) {
            throw new batavia.builtins.TypeError('a float is required');
        }
    },

    acos: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.acos(x.__float__().val));
    },

    acosh: function(x) {
        batavia.modules.math._checkFloat(x);
        var result = Math.acosh(x.__float__().val);
        if (!isFinite(result)) {
            throw new batavia.builtins.ValueError("math domain error");
        }
        return new batavia.types.Float(result);
    },

    asin: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.asin(x.__float__().val));
    },

    asinh: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.asinh(x.__float__().val));
    },

    atan: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.atan(x.__float__().val));
    },

    atan2: function(y, x) {
        batavia.modules.math._checkFloat(y);
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.atan2(y.__float__().val, x.__float__().val));
    },

    atanh: function(x) {
        batavia.modules.math._checkFloat(x);
        var result = Math.atanh(x.__float__().val);
        if (!isFinite(result)) {
            throw new batavia.builtins.ValueError("math domain error");
        }
        return new batavia.types.Float(Math.atanh(x.__float__().val));
    },

    ceil: function(x) {
        if (batavia.isinstance(x, batavia.types.Int)) {
            return x;
        }
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Int(Math.ceil(x.__float__().val));
    },

    copysign: function() {
        throw new batavia.builtins.NotImplementedError("math.copysign has not been implemented");
    },

    cos: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.cos(x.__float__().val));
    },

    cosh: function(x) {
        batavia.modules.math._checkFloat(x);
        var result = Math.cosh(x.__float__().val);
        if (!isFinite(result)) {
            throw new batavia.builtins.OverflowError("math range error");
        }
        return new batavia.types.Float(Math.cosh(x.__float__().val));
    },

    degrees: function() {
        throw new batavia.builtins.NotImplementedError("math.degrees has not been implemented");
    },

    erf: function() {
        throw new batavia.builtins.NotImplementedError("math.erf has not been implemented");
    },

    erfc: function() {
        throw new batavia.builtins.NotImplementedError("math.erfc has not been implemented");
    },

    exp: function(x) {
        batavia.modules.math._checkFloat(x);
        var result = Math.exp(x.__float__().val);
        if (!isFinite(result)) {
            throw new batavia.builtins.OverflowError("math range error");
        }
        return new batavia.types.Float(result);
    },

    expm1: function(x) {
        batavia.modules.math._checkFloat(x);
        var result = Math.expm1(x.__float__().val);
        if (!isFinite(result)) {
            throw new batavia.builtins.OverflowError("math range error");
        }
        return new batavia.types.Float(Math.expm1(x.__float__().val));
    },

    fabs: function() {
        throw new batavia.builtins.NotImplementedError("math.fabs has not been implemented");
    },

    factorial: function() {
        throw new batavia.builtins.NotImplementedError("math.factorial has not been implemented");
    },

    floor: function(x) {
        if (batavia.isinstance(x, batavia.types.Int)) {
            return x;
        }
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Int(Math.floor(x.__float__().val));
    },

    fmod: function() {
        throw new batavia.builtins.NotImplementedError("math.fmod has not been implemented");
    },

    frexp: function() {
        throw new batavia.builtins.NotImplementedError("math.frexp has not been implemented");
    },

    fsum: function() {
        throw new batavia.builtins.NotImplementedError("math.fsum has not been implemented");
    },

    gamma: function() {
        throw new batavia.builtins.NotImplementedError("math.gamma has not been implemented");
    },

    gcd: function() {
        throw new batavia.builtins.NotImplementedError("math.gcd has not been implemented");
    },

    hypot: function(x, y) {
        batavia.modules.math._checkFloat(x);
        batavia.modules.math._checkFloat(y);
        return new batavia.types.Float(Math.hypot(x.__float__().val, y.__float__().val));
    },

    isclose: function() {
        throw new batavia.builtins.NotImplementedError("math.isclose has not been implemented");
    },

    isfinite: function() {
        throw new batavia.builtins.NotImplementedError("math.isfinite has not been implemented");
    },

    isinf: function() {
        throw new batavia.builtins.NotImplementedError("math.isinf has not been implemented");
    },

    isnan: function() {
        throw new batavia.builtins.NotImplementedError("math.isnan has not been implemented");
    },

    ldexp: function() {
        throw new batavia.builtins.NotImplementedError("math.ldexp has not been implemented");
    },

    lgamma: function() {
        throw new batavia.builtins.NotImplementedError("math.lgamma has not been implemented");
    },

    log: function(x, base) {
        batavia.modules.math._checkFloat(x);
        if (base == null) {
            return new batavia.types.Float(Math.log(x.__float__().val));
        }
        batavia.modules.math._checkFloat(base);
        return new batavia.types.Float(Math.log(x.__float__().val) / Math.log(base.__float__().val));
    },

    log10: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.log10(x.__float__().val));
    },

    log1p: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.log1p(x.__float__().val));
    },

    log2: function(x) {
        batavia.modules.math._checkFloat(x);
        var result = Math.log2(x.__float__().val);
        if (!isFinite(result)) {
            throw new batavia.builtins.ValueError("math domain error");
        }
        return new batavia.types.Float(Math.log2(x.__float__().val));
    },

    modf: function() {
        throw new batavia.builtins.NotImplementedError("math.modf has not been implemented");
    },

    pow: function(x, y) {
        batavia.modules.math._checkFloat(x);
        batavia.modules.math._checkFloat(y);
        return new batavia.types.Float(Math.pow(x.__float__().val, y.__float__().val));
    },

    radians: function() {
        throw new batavia.builtins.NotImplementedError("math.radians has not been implemented");
    },

    sin: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.sin(x.__float__().val));
    },

    sinh: function(x) {
      batavia.modules.math._checkFloat(x);
      var result = Math.sinh(x.__float__().val);
      if (!isFinite(result)) {
          throw new batavia.builtins.OverflowError("math range error");
      }
      return new batavia.types.Float(result);
    },

    sqrt: function(x) {
        batavia.modules.math._checkFloat(x);
        var result = Math.sqrt(x.__float__().val);
        if (!isFinite(result)) {
            throw new batavia.builtins.ValueError("math domain error");
        }
        return new batavia.types.Float(result);
    },

    tan: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.tan(x.__float__().val));
    },

    tanh: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.tanh(x.__float__().val));
    },

    trunc: function(x) {
        batavia.modules.math._checkFloat(x);
        return new batavia.types.Float(Math.trunc(x.__float__().val));
    },
};
