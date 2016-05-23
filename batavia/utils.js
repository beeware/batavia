
function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}


/*************************************************************************
 * Operator defintions that match Python-like behavior.
 *************************************************************************/

batavia.isinstance = function(obj, type) {
    if (type instanceof Array) {
        for (var t in type) {
            if (batavia.isinstance(obj, type[t])) {
                return true;
            }
        }
        return false;
    } else {
        switch (typeof obj) {
            case 'boolean':
                return type === batavia.types.Bool;
            case 'number':
                return type === batavia.types.Int;
            case 'string':
                return type === batavia.types.Str;
            case 'object':
                return obj instanceof type;
            default:
                return false;
        }
    }
};


batavia.operators = {
    // UNARY operators
    POSITIVE: function(a) {
        if (batavia.isinstance(a, batavia.types.Str)) {
            throw new batavia.builtins.TypeError("bad operand type for unary +: 'str'");
        } else if (batavia.isinstance(a, batavia.types.Float)) {
            return new batavia.types.Float(+a.valueOf());
        } else {
            return +a;
        }
    },
    NEGATIVE: function(a) {
        if (batavia.isinstance(a, batavia.types.Str)) {
            throw new batavia.builtins.TypeError("bad operand type for unary -: 'str'");
        } else if (batavia.isinstance(a, batavia.types.Float)) {
            return new batavia.types.Float(-a.valueOf());
        } else {
            return -a;
        }
    },
    NOT: function(a) {
        return a === null ? true : !a.valueOf();
    },
    CONVERT: function(a) {
        throw new batavia.builtins.NotImplementedError('Unary convert not implemented');
    },
    INVERT: function(a) {
        throw new batavia.builtins.NotImplementedError('Unary invert not implemented');
    },

    // BINARY/INPLACE operators
    POWER: function(a, b) {
        return Math.pow(a, b);
    },
    MULTIPLY: function(a, b) {
        var result, i, aType, bType;

        // If one of the two objects is a list, move it into the first position.
        if (batavia.isinstance(b, [batavia.types.List, batavia.types.Tuple, batavia.types.Str]) &&
                !batavia.isinstance(a, [batavia.types.List, batavia.types.Tuple, batavia.types.Str]))  {
            var c = b;
            b = a;
            a = c;
        }

        if (batavia.isinstance(a, [batavia.types.List, batavia.types.Tuple, batavia.types.Str])) {
            if (b === null) {
                throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'NoneType'");
            }

            result = new batavia.types.List();
            if (batavia.isinstance(b, [batavia.types.Int, batavia.types.Bool])) {
                for (i = 0; i < b; i++) {
                    result.extend(a);
                }
            } else {
                bType = batavia.type_name(b);
                throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type '" + bType + "'");
            }
        } else if (a !== null && b !== null &&
                    batavia.isinstance(a, [batavia.types.Int, batavia.types.Float, batavia.types.Bool]) &&
                    batavia.isinstance(b, [batavia.types.Int, batavia.types.Float, batavia.types.Bool])
                ) {
            if (batavia.isinstance(a, batavia.types.Float) || batavia.isinstance(b, batavia.types.Float)) {
                result = new batavia.types.Float(a*b);
            } else {
                result = a * b;
            }
        } else {
            aType = batavia.type_name(a);
            bType = batavia.type_name(b);
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: '" + aType + "' and '" + bType + "'");
        }
        return result;
    },
    DIVIDE: function(a, b) {
        return batavia.operators.TRUE_DIVIDE(a,b);
    },
    FLOOR_DIVIDE: function(a, b) {
        try {
            return new batavia.types.Float(Math.floor(batavia.operators.TRUE_DIVIDE(a, b).valueOf()));
        } catch (err) {
            if (err instanceof batavia.builtins.TypeError) {
                err.msg = err.msg.replace("/", "//");
            } else if (err instanceof batavia.builtins.ZeroDivisionError) {
                err.msg = err.msg.replace("division by zero", "divmod()");
            }
            throw err;
        }
    },
    TRUE_DIVIDE: function(a, b) {
        var result, aType, bType;

        if (a !== null && b !== null &&
                    batavia.isinstance(a, [batavia.types.Int, batavia.types.Float, batavia.types.Bool]) &&
                    batavia.isinstance(b, [batavia.types.Int, batavia.types.Float, batavia.types.Bool])
                ) {

            if (b.valueOf() === 0 || b === false) {
                aType = batavia.type_name(a);
                throw new batavia.builtins.ZeroDivisionError(aType + " division by zero");
            }

            if (batavia.isinstance(a, batavia.types.Float) || batavia.isinstance(b, batavia.types.Float)) {
                result = new batavia.types.Float(a/b);
            } else {
                result = a / b;
            }
        } else {
            aType = batavia.type_name(a);
            bType = batavia.type_name(b);
            throw new batavia.builtins.TypeError("unsupported operand type(s) for /: '" + aType + "' and '" + bType + "'");
        }
        return result;
    },
    MODULO: function(a, b) {
        if (batavia.isinstance(a, batavia.types.Str)) {
            if (batavia.isinstance(a, [batavia.types.List, batavia.types.Tuple])) {
                return batavia._substitute(a, b);
            // } else if (b instanceof Object && !(b instanceof batavia.types.Float)) {
            //     // TODO Handle %(key)s format.
            } else {
                return batavia._substitute(a, [b]);
            }
        } else {
            return a % b;
        }
    },
    ADD: function(a, b) {
        var result, i, aType, bType;
        if (batavia.isinstance(a, batavia.types.List)) {
            if (batavia.isinstance(b, batavia.types.List)) {
                result = [];
                result.extend(a);
                result.extend(b);
            } else {
                bType = batavia.type_name(b);
                throw new batavia.builtins.TypeError('can only concatenate list (not "' + bType + '") to list');
            }
        } else if (batavia.isinstance(a, batavia.types.Str)) {
            if (batavia.isinstance(b, batavia.types.Str)) {
                return a + b;
            } else {
                bType = batavia.type_name(b);
                throw new batavia.builtins.TypeError("Can't convert '" + bType + "' object to str implicitly");
            }
        } else if (batavia.isinstance(b, batavia.types.Str) === true) {
            aType = batavia.type_name(a);
            throw new batavia.builtins.TypeError("unsupported operand type(s) for +: '" + aType + "' and 'str'");
        } else if (a !== null && b !== null &&
                    batavia.isinstance(a, [batavia.types.Int, batavia.types.Float, batavia.types.Bool]) &&
                    batavia.isinstance(b, [batavia.types.Int, batavia.types.Float, batavia.types.Bool])
                ) {
            if (batavia.isinstance(a, batavia.types.Float) || batavia.isinstance(b, batavia.types.Float)) {
                result = new batavia.types.Float(a + b);
            } else {
                result = a + b;
            }
        } else {
            aType = batavia.type_name(a);
            bType = batavia.type_name(b);
            throw new batavia.builtins.TypeError("unsupported operand type(s) for +: '" + aType + "' and '" + bType + "'");
        }
        return result;
    },
    SUBTRACT: function(a, b) {
        var aType, bType;
        if (a !== null && b !== null &&
                    batavia.isinstance(a, [batavia.types.Int, batavia.types.Float, batavia.types.Bool]) &&
                    batavia.isinstance(b, [batavia.types.Int, batavia.types.Float, batavia.types.Bool])
                ) {
            if (a instanceof batavia.types.Float || b instanceof batavia.types.Float) {
                result = new batavia.types.Float(a - b);
            } else {
                result = a - b;
            }
        } else {
            aType = batavia.type_name(a);
            bType = batavia.type_name(b);
            throw new batavia.builtins.TypeError("unsupported operand type(s) for -: '" + aType + "' and '" + bType + "'");
        }
        return result;
    },
    SUBSCR: function(a, b) {
        if (batavia.isinstance(b, batavia.types.Dict)) {
            var start, stop, step, result;
            if (b.start === null) {
                start = 0;
            }
            if (b.stop === null) {
                stop = a.length;
            }
            if (b.step === 1) {
                result = a.slice(start, stop);
            } else {
                result = [];
                for (var i = start; i < stop; i += b.step) {
                    result.push(a[i]);
                }
            }
            return result;
        } else {
            return a[b];
        }
    },
    LSHIFT: function(a, b) {
        return a << b;
    },
    RSHIFT: function(a, b) {
        return a >> b;
    },
    AND: function(a, b) {
        return a & b;
    },
    XOR: function(a, b) {
        return a ^ b;
    },
    OR: function(a, b) {
        return a | b;
    }
};


/*************************************************************************
 * sprintf() implementation
 *************************************************************************/

batavia._substitute = function(format, args) {
    var results = [];

    /* This is the general form regex for a sprintf-like string. */
    var re = /\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/g;
    var match;
    var lastIndex = 0;
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];

        match = re.exec(format);
        if (match) {
            switch (match[8]) {
                case "b":
                    arg = arg.toString(2);
                break;
                case "c":
                    arg = String.fromCharCode(arg);
                break;
                case "d":
                case "i":
                    arg = parseInt(arg, 10);
                break;
                case "j":
                    arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6], 10) : 0);
                break;
                case "e":
                    arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
                break;
                case "f":
                    arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                break;
                case "g":
                    arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg);
                break;
                case "o":
                    arg = arg.toString(8);
                break;
                case "s":
                    arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
                break;
                case "u":
                    arg = arg >>> 0;
                break;
                case "x":
                    arg = arg.toString(16);
                break;
                case "X":
                    arg = arg.toString(16).toUpperCase();
                break;
            }

            results.push(format.slice(lastIndex, match.index));
            lastIndex = re.lastIndex;
            results.push(arg);
        } else {
            throw new batavia.builtins.TypeError('not all arguments converted during string formatting');
        }
    }
    // Push the rest of the string.
    results.push(format.slice(re.lastIndex));
    return results.join('');
};

/*************************************************************************
 * Class construction
 *************************************************************************/
batavia.make_class = function(args, kwargs) {
    var func = args[0];
    var name = args[1];
    var bases = kwargs.bases || args[2];
    var metaclass = kwargs.metaclass || args[3];
    var kwds = kwargs.kwds || args[4] || [];

    // Create a locals context, and run the class function in it.
    var locals = new batavia.types.Dict();
    var retval = func.__call__.apply(this, [[], [], locals]);

    // Now construct the class, based on the constructed local context.
    var klass = function(vm, args, kwargs) {
        if (this.__init__) {
            this.__init__.__self__ = this;
            this.__init__.__call__.apply(vm, [args, kwargs]);
        }
    };

    for (var attr in locals) {
        if (locals.hasOwnProperty(attr)) {
            klass.prototype[attr] = locals[attr];
        }
    }

    var PyObject = function(vm, klass) {
        var __new__ = function(args, kwargs) {
            return new klass(vm, args, kwargs);
        };
        __new__.__python__ = true;
        return __new__;
    }(this, klass);

    return PyObject;
};

/*************************************************************************
 * callable construction
 *************************************************************************/

batavia.make_callable = function(func) {
    var fn = function(args, kwargs, locals) {
        var retval;
        var callargs = batavia.modules.inspect.getcallargs(func, args, kwargs);

        var frame = this.make_frame({
            'code': func.__code__,
            'callargs': callargs,
            'f_globals': func.__globals__,
            'f_locals': locals || new batavia.types.Dict()
        });

        if (func.__code__.co_flags & batavia.modules.dis.CO_GENERATOR) {
            gen = new batavia.core.Generator(frame, this);
            frame.generator = gen;
            retval = gen;
        } else {
            retval = this.run_frame(frame);
        }
        return retval;
    };
    fn.__python__ = true;
    return fn;
};
