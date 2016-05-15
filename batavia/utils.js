
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

String.prototype.__repr__ = function(args, kwargs) {
    return "'" + this.toString() + "'";
};


String.prototype.__iter__ = function() {
    return new batavia.core.str_iterator(this);
};

batavia.core.str_iterator = function (data) {
    Object.call(this);
    this.index = 0;
    this.data = data;
};

batavia.core.str_iterator.prototype = Object.create(Object.prototype);

batavia.core.str_iterator.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw new batavia.builtins.StopIteration();
    }
    this.index++;
    return retval;
};

batavia.core.str_iterator.prototype.__str__ = function() {
    return "<str_iterator object at 0x99999999>";
};
/*************************************************************************
 * A Python dictionary type
 *************************************************************************/

batavia.core.Dict = function(args, kwargs) {
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

batavia.core.Dict.prototype.toString = function () {
    return this.__str__();
};

batavia.core.Dict.prototype.__str__ = function () {
    var result = "{", values = [];
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            values.push(batavia.builtins.repr([key], null) + ": " + batavia.builtins.repr([this[key]], null));
        }
    }
    result += values.join(', ');
    result += "}";
    return result;
};

/*************************************************************************
 * A Python List type
 *************************************************************************/

batavia.core.List = function() {
    function List() {
        if (arguments.length === 0) {
            this.push.apply(this);
        } else if (arguments.length === 1) {
            this.push.apply(this, arguments[0]);
        } else {
            throw new batavia.builtins.TypeError('list() takes at most 1 argument (' + arguments.length + ' given)');
        }
    }

    function Array() {
    }

    Array.prototype = [];

    List.prototype = new Array;
    List.prototype.length = 0;

    List.prototype.__len__ = function () {
        return this.length;
    };

    List.prototype.append = function(value) {
        this.push(value);
    };

    List.prototype.extend = function(values) {
        if (values.length > 0) {
            this.push.apply(this, values);
        }
    };

    List.prototype.toString = function() {
        return this.__str__();
    };

    List.prototype.__repr__ = function() {
        return this.__str__();
    };

    List.prototype.__str__ = function() {
        return '[' + this.map(function(obj) {
                return batavia.builtins.repr([obj], null);
            }).join(', ') + ']';
    };

    List.prototype.__iter__ = function() {
        return new batavia.core.list_iterator(this);
    };

    List.prototype.constructor = List;
    return List;
}();


batavia.core.list_iterator = function (data) {
    Object.call(this);
    this.index = 0;
    this.data = data;
};

batavia.core.list_iterator.prototype = Object.create(Object.prototype);

batavia.core.list_iterator.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw new batavia.builtins.StopIteration();
    }
    this.index++;
    return retval;
};

batavia.core.list_iterator.prototype.__str__ = function() {
    return "<list_iterator object at 0x99999999>";
};

/*************************************************************************
 * A Python Set type
 *************************************************************************/

batavia.core.Set = function(args, kwargs) {
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


batavia.core.Set.prototype.toString = function() {
    return this.__str__();
};

batavia.core.Set.prototype.__str__ = function() {
    var result = "{", values = [];
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            values.push(batavia.builtins.repr(key));
        }
    }
    result += values.join(', ');
    result += "}";
    return result;
};

batavia.core.Set.prototype.__iter__ = function() {
    return new batavia.core.set_iterator(this);
};

batavia.core.set_iterator = function (data) {
    Object.call(this);
    this.index = 0;
    this.data = data;
};

batavia.core.set_iterator.prototype = Object.create(Object.prototype);

batavia.core.set_iterator.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw new batavia.builtins.StopIteration();
    }
    this.index++;
    return retval;
};

batavia.core.set_iterator.prototype.__str__ = function() {
    return "<set_iterator object at 0x99999999>";
};

/*************************************************************************
 * A Python FrozenSet type
 *************************************************************************/

batavia.core.FrozenSet = function(args, kwargs) {
    batavia.core.Set.call(this, args, kwargs);
};

batavia.core.FrozenSet.prototype = Object.create(batavia.core.Set.prototype);

/*************************************************************************
 * A Python Tuple type
 *************************************************************************/

batavia.core.Tuple = function() {
    function Tuple(length){
        if (arguments.length === 0) {
            this.push.apply(this);
        } else if (arguments.length === 1) {
            this.push.apply(this, arguments[0]);
        } else {
            throw new batavia.builtins.TypeError('tuple() takes at most 1 argument (' + arguments.length + ' given)');
        }

    }

    function Array() {
    }

    Array.prototype = [];

    Tuple.prototype = new Array;
    Tuple.prototype.length = 0;

    Tuple.prototype.__len__ = function () {
        return this.length;
    };

    Tuple.prototype.toString = function() {
        return this.__str__();
    };

    Tuple.prototype.__str__ = function() {
        return '(' + this.map(function(obj) {
                return batavia.builtins.repr([obj], null);
            }).join(', ') + ')';
    };

    Tuple.prototype.__iter__ = function() {
        return new batavia.core.tuple_iterator(this);
    };

    Tuple.prototype.constructor = Tuple;
    return Tuple;
}();


batavia.core.tuple_iterator = function (data) {
    Object.call(this);
    this.index = 0;
    this.data = data;
};

batavia.core.tuple_iterator.prototype = Object.create(Object.prototype);

batavia.core.tuple_iterator.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw new batavia.builtins.StopIteration();
    }
    this.index++;
    return retval;
};

batavia.core.tuple_iterator.prototype.__str__ = function() {
    return "<tuple_iterator object at 0x99999999>";
};

/*************************************************************************
 * An implementation of range()
 *************************************************************************/

batavia.core.range = function(start, stop, step) {
    this.start = start;
    this.stop = stop;
    this.step = step || 1;

    if (this.stop === undefined) {
        this.start = 0;
        this.stop = start;
    }
};

batavia.core.range.prototype.toString = function() {
    return this.__str__();
};

batavia.core.range.prototype.__str__ = function() {
    if (this.step) {
        return '(' + this.start + ', ' + this.stop + ', ' + this.step + ')';
    } else {
        return '(' + this.start + ', ' + this.stop + ')';
    }
};


batavia.core.range.prototype.__iter__ = function() {
    return new batavia.core.range_iterator(this);
};


batavia.core.range_iterator = function (data) {
    Object.call(this);
    this.data = data;
    this.index = this.data.start;
};

batavia.core.range_iterator.prototype = Object.create(Object.prototype);

batavia.core.range_iterator.prototype.__next__ = function() {
    var retval = this.index;
    if (this.index < this.data.stop) {
        this.index = this.index + this.data.step;
        return retval;
    }
    throw new batavia.builtins.StopIteration();
};

batavia.core.range_iterator.prototype.__str__ = function() {
    return "<range_iterator object at 0x99999999>";
};
/*************************************************************************
 * Operator defintions that match Python-like behavior.
 *************************************************************************/

function datatype(data) {
	var type;
	switch(typeof(data)) {
		case "number":
			type = "int";
			return type;
			break;
		case "boolean":
			type = "bool";
			return type;
			break;
		case "string":
			return "string"
	}
	return type;
}

batavia.operators = {
    // UNARY operators
    POSITIVE: function(a) {
        if (typeof a === 'string') {
            throw new batavia.builtins.TypeError("bad operand type for unary +: 'str'");
        } else {
            return +a;
        }
    },
    NEGATIVE: function(a) {
        if (typeof a === 'string') {
            throw new batavia.builtins.TypeError("bad operand type for unary -: 'str'");
        } else {
            return -a;
        }
    },
    NOT: function(a) {
        return !a;
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
            result = new batavia.core.List();
            if (b instanceof Array) {
                throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'list'");
            } else {
                for (i = 0; i < b; i++) {
                    result.extend(a);
                }
            }
        } else if (b === null){
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'NoneType'");
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
        var atype = datatype(a);
		var btype = datatype(b);
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
            throw new batavia.builtins.TypeError("Can't convert 'list' object to str implicitly");
        } else if (b === null){
            throw new batavia.builtins.TypeError("Can't convert 'NoneType' object to str implicitly");
        }
        else if (typeof(a) == 'string') {
			if (typeof(b) != 'string') {
				throw new batavia.builtins.TypeError("Can't convert '" + btype + "' object to str implicitly");	//a is str, b not str
			}
			else {
				result = a + b  //a and b is string
			}
		}
		else if (typeof(b) == 'string') {
			throw new batavia.builtins.TypeError("unsupported operand type(s) for +: '" + atype + "' and 'str'"); //a is str, b not str
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
    }
};


batavia.comparisons = [
    function (x, y) {  // <
        return x < y;
    },
    function (x, y) {  // <=
        return x <= y;
    },
    function (x, y) {  // ==
        return x == y;
    },
    function (x, y) {  // !=
        return x != y;
    },
    function (x, y) {  // >
        return x > y;
    },
    function (x, y) {  // >=
        return x >= y;
    },
    function (x, y) {  // in
        return x in y;
    },
    function (x, y) {  // not in
        return !(x in y);
    },
    function (x, y) {  // is
        return x === y;
    },
    function (x, y) {  // is not
        return x !== y;
    },
    function (x, y) {  // exception match
        if (y instanceof Array) {
            for (var i in y) {
                if (x === y[i]) {
                    return true;
                }
            }
            return false;
        } else {
            return x === y;
        }
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
            'f_locals': locals || new batavia.core.Dict()
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
