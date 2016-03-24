
function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

/*************************************************************************
 * Modify String to behave like a Python String
 *************************************************************************/

String.prototype.startswith = function (str) {
    return this.slice(0, str.length) === str;
};

/*************************************************************************
 * Modify Object to behave like a Python Dictionary
 *************************************************************************/

batavia.core.Dict = function(args) {
    Object.call(this);
    if (args) {
        this.update(args);
    }
};

batavia.core.Dict.prototype = Object.create(Object.prototype);

batavia.core.Dict.prototype.update = function(values) {
    for (var key in values) {
        if (values.hasOwnProperty(key)) {
            this[key] = values[key];
        }
    }
};

batavia.core.Dict.prototype.copy = function() {
    return new batavia.core.Dict(this);
};

batavia.core.Dict.prototype.items = function() {
    var result = [];
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            result.push([key, this[key]]);
        }
    }
    return result;
};


/*************************************************************************
 * Modify Array to behave like a Python List
 *************************************************************************/

Array.prototype.append = function(value) {
    this.push(value);
};

Array.prototype.extend = function(values) {
    if (values.length > 0) {
        this.push.apply(this, values);
    }
};

/*************************************************************************
 * Subclass Object to provide a Set object
 *************************************************************************/

batavia.core.Set = function(args) {
    Object.call(this);
    if (args) {
        this.update(args);
    }
};

batavia.core.Set.prototype = Object.create(Object.prototype);

batavia.core.Set.prototype.add = function(v) {
    this[v] = null;
};

batavia.core.Set.prototype.remove = function(v) {
    delete this[v];
};

batavia.core.Set.prototype.update = function(values) {
    for (var value in values) {
        if (values.hasOwnProperty(value)) {
            this[values[value]] = null;
        }
    }
};

/*************************************************************************
 * An implementation of iter()
 *************************************************************************/

function iter(data) {
    // if data is already iterable, just return it.
    if (data.__next__) {
        return data;
    }
    return new Iterable(data);
}

function Iterable(data) {
    this.index = 0;
    this.data = data;
}

Iterable.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw new batavia.builtins.StopIteration();
    }
    this.index++;
    return retval;
};

function next(iterator) {
    return iterator.__next__();
}

/*************************************************************************
 * An implementation of range()
 *************************************************************************/

function _range(start, stop, step) {
    this.start = start;
    this.stop = stop;
    this.step = step || 1;

    if (this.stop === undefined) {
        this.start = 0;
        this.stop = start;
    }

    this.i = this.start;
}

_range.prototype.__next__ = function() {
    var retval = this.i;
    if (this.i < this.stop) {
        this.i = this.i + this.step;
        return retval;
    }
    throw new batavia.builtins.StopIteration();
};

function range(start, stop, step) {
    return new _range(start, stop, step);
}


/*************************************************************************
 * Operator defintions that match Python-like behavior.
 *************************************************************************/

batavia.operators = {
    // UNARY operators
    POSITIVE: function(a) {
        return +x;
    },
    NEGATIVE: function(a) {
        return -x;
    },
    NOT: function(a) {
        return !x;
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
        var result, i;
        if (a instanceof Array) {
            result = [];
            if (b instanceof Array) {
                throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'list'");
            } else {
                for (i = 0; i < b; i++) {
                    result.extend(a);
                }
            }
        } else if (b instanceof Array) {
            result = [];
            for (i = 0; i < a; i++) {
                result.extend(b);
            }
        }
        else {
            result = a * b;
        }
        return result;
    },
    DIVIDE: function(a, b) {
        return Math.floor(a / b);
    },
    FLOOR_DIVIDE: function(a, b) {
        return Math.floor(a / b);
    },
    TRUE_DIVIDE: function(a, b) {
        return a / b;
    },
    MODULO: function(a, b) {
        if (typeof a === 'string') {
            if (b instanceof Array) {
                return batavia._substitute(a, b);
            } else if (b instanceof Object) {
                // TODO Handle %(key)s format.
            } else {
                return batavia._substitute(a, [b]);
            }
        } else {
            return a % b;
        }
    },
    ADD: function(a, b) {
        var result, i;
        if (a instanceof Array) {
            if (b instanceof Array) {
                result = [];
                result.extend(a);
                result.extend(b);
            } else {
                throw new batavia.builtins.TypeError('can only concatenate list (not "' + (typeof b) + '") to list');
            }
        } else if (b instanceof Array) {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for +: '" + (typeof a) + "' and 'list'");
        }
        else {
            result = a + b;
        }
        return result;
    },
    SUBTRACT: function(a, b) {
        return a - b;
    },
    SUBSCR: function(a, b) {
        if (b instanceof Object) {
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
    },
};

batavia.comparisons = [
    function (x, y) {
        return x < y;
    },
    function (x, y) {
        return x <= y;
    },
    function (x, y) {
        return x == y;
    },
    function (x, y) {
        return x != y;
    },
    function (x, y) {
        return x > y;
    },
    function (x, y) {
        return x >= y;
    },
    function (x, y) {
        return x in y;
    },
    function (x, y) {
        return !(x in y);
    },
    function (x, y) {
        return x === y;
    },
    function (x, y) {
        return x !== y;
    },
    function (x, y) {
        return false;
    },
];


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
    var locals = new batavia.core.Dict();
    var retval = func.__call__.apply(this, [[], [], locals]);

    // Now construct the class, based on the constructed local context.
    var klass = function(vm, args, kwargs) {
        if (this.__init__) {
            for (var attr in Object.getPrototypeOf(this)) {
                if (this[attr].__call__) {
                    this[attr].__self__ = this;
                }
            }
            this.__init__.__call__.apply(vm, [args, kwargs]);
        }
    };

    for (var attr in locals) {
        if (locals.hasOwnProperty(attr)) {
            klass.prototype[attr] = locals[attr];
        }
    }

    var PyObject = function(vm, klass) {
        var constructor = function(args, kwargs) {
            return new klass(vm, args, kwargs);
        };
        constructor.__python__ = true;
        return constructor;
    }(this, klass);

    return PyObject;
};

/*************************************************************************
 * callable construction
 *************************************************************************/

batavia.make_callable = function(func) {
    var fn = function(args, kwargs, locals) {
        var callargs = batavia.modules.inspect.getcallargs(func, args, kwargs);

        var frame = this.make_frame({
            'code': func.__code__,
            'callargs': callargs,
            'f_globals': func.__globals__,
            'f_locals': locals || new batavia.core.Dict(),
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
