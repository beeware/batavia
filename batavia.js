
fixedConsoleLog = function(msg) {
    console.log.call(console, msg);
};

var batavia = {
    stdout: fixedConsoleLog,
    stderr: fixedConsoleLog,
    core: {},
    modules: {},
    builtins: {}
};


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
/*
 * opcode module - potentially shared between dis and other modules which
 * operate on bytecodes (e.g. peephole optimizers).
 */

batavia.modules.dis = {
    CO_GENERATOR: 32,  // flag for "this code uses yield"

    hasconst: new batavia.core.Set(),
    hasname: new batavia.core.Set(),
    hasjrel: new batavia.core.Set(),
    hasjabs: new batavia.core.Set(),
    haslocal: new batavia.core.Set(),
    hascompare: new batavia.core.Set(),
    hasfree: new batavia.core.Set(),
    hasnargs: new batavia.core.Set(),

    opmap: null,
    opname: [],

    unary_ops: new batavia.core.Set(),
    binary_ops: new batavia.core.Set(),
    inplace_ops: new batavia.core.Set(),
    // slice_ops: new batavia.core.Set(),

    def_op: function(name, op) {
        batavia.modules.dis.opname[op] = name;
        batavia.modules.dis.opmap[name] = op;
    },

    def_unary_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.unary_ops.add(op);
    },

    def_binary_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.binary_ops.add(op);
    },

    def_inplace_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.inplace_ops.add(op);
    },

    // def_slice_op: function(name, op) {
    //     batavia.modules.dis.def_op(name, op);
    //     batavia.modules.dis.slice_ops.add(op);
    // },

    name_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.hasname.add(op);
    },

    jrel_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.hasjrel.add(op);
    },

    jabs_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.hasjabs.add(op);
    },

    init: function() {
        if (batavia.modules.dis.opmap !== null) {
            // Already initialized
            return;
        }

        batavia.modules.dis.opmap = {};

        // Prime the opname list with all possible opnames
        for (var op=0; op < 256; op++) {
            batavia.modules.dis.opname.push('<' + op + '>');
        }

        // Register the known opnames
        batavia.modules.dis.def_op('POP_TOP', 1);
        batavia.modules.dis.def_op('ROT_TWO', 2);
        batavia.modules.dis.def_op('ROT_THREE', 3);
        batavia.modules.dis.def_op('DUP_TOP', 4);
        batavia.modules.dis.def_op('DUP_TOP_TWO', 5);

        batavia.modules.dis.def_op('NOP', 9);
        batavia.modules.dis.def_unary_op('UNARY_POSITIVE', 10);
        batavia.modules.dis.def_unary_op('UNARY_NEGATIVE', 11);
        batavia.modules.dis.def_unary_op('UNARY_NOT', 12);

        batavia.modules.dis.def_unary_op('UNARY_INVERT', 15);

        batavia.modules.dis.def_binary_op('BINARY_POWER', 19);
        batavia.modules.dis.def_binary_op('BINARY_MULTIPLY', 20);

        batavia.modules.dis.def_binary_op('BINARY_MODULO', 22);
        batavia.modules.dis.def_binary_op('BINARY_ADD', 23);
        batavia.modules.dis.def_binary_op('BINARY_SUBTRACT', 24);
        batavia.modules.dis.def_binary_op('BINARY_SUBSCR', 25);
        batavia.modules.dis.def_binary_op('BINARY_FLOOR_DIVIDE', 26);
        batavia.modules.dis.def_binary_op('BINARY_TRUE_DIVIDE', 27);
        batavia.modules.dis.def_inplace_op('INPLACE_FLOOR_DIVIDE', 28);
        batavia.modules.dis.def_inplace_op('INPLACE_TRUE_DIVIDE', 29);

        batavia.modules.dis.def_op('STORE_MAP', 54);
        batavia.modules.dis.def_inplace_op('INPLACE_ADD', 55);
        batavia.modules.dis.def_inplace_op('INPLACE_SUBTRACT', 56);
        batavia.modules.dis.def_inplace_op('INPLACE_MULTIPLY', 57);

        batavia.modules.dis.def_inplace_op('INPLACE_MODULO', 59);
        batavia.modules.dis.def_op('STORE_SUBSCR', 60);
        batavia.modules.dis.def_op('DELETE_SUBSCR', 61);
        batavia.modules.dis.def_binary_op('BINARY_LSHIFT', 62);
        batavia.modules.dis.def_binary_op('BINARY_RSHIFT', 63);
        batavia.modules.dis.def_binary_op('BINARY_AND', 64);
        batavia.modules.dis.def_binary_op('BINARY_XOR', 65);
        batavia.modules.dis.def_binary_op('BINARY_OR', 66);
        batavia.modules.dis.def_inplace_op('INPLACE_POWER', 67);
        batavia.modules.dis.def_op('GET_ITER', 68);

        batavia.modules.dis.def_op('PRINT_EXPR', 70);
        batavia.modules.dis.def_op('LOAD_BUILD_CLASS', 71);
        batavia.modules.dis.def_op('YIELD_FROM', 72);

        batavia.modules.dis.def_inplace_op('INPLACE_LSHIFT', 75);
        batavia.modules.dis.def_inplace_op('INPLACE_RSHIFT', 76);
        batavia.modules.dis.def_inplace_op('INPLACE_AND', 77);
        batavia.modules.dis.def_inplace_op('INPLACE_XOR', 78);
        batavia.modules.dis.def_inplace_op('INPLACE_OR', 79);
        batavia.modules.dis.def_op('BREAK_LOOP', 80);
        batavia.modules.dis.def_op('WITH_CLEANUP', 81);

        batavia.modules.dis.def_op('RETURN_VALUE', 83);
        batavia.modules.dis.def_op('IMPORT_STAR', 84);

        batavia.modules.dis.def_op('YIELD_VALUE', 86);
        batavia.modules.dis.def_op('POP_BLOCK', 87);
        batavia.modules.dis.def_op('END_FINALLY', 88);
        batavia.modules.dis.def_op('POP_EXCEPT', 89);

        batavia.modules.dis.HAVE_ARGUMENT = 90;              // Opcodes from here have an argument:

        batavia.modules.dis.name_op('STORE_NAME', 90);       // Index in name list
        batavia.modules.dis.name_op('DELETE_NAME', 91);      // ""
        batavia.modules.dis.def_op('UNPACK_SEQUENCE', 92);   // Number of tuple items
        batavia.modules.dis.jrel_op('FOR_ITER', 93);
        batavia.modules.dis.def_op('UNPACK_EX', 94);
        batavia.modules.dis.name_op('STORE_ATTR', 95);       // Index in name list
        batavia.modules.dis.name_op('DELETE_ATTR', 96);      // ""
        batavia.modules.dis.name_op('STORE_GLOBAL', 97);     // ""
        batavia.modules.dis.name_op('DELETE_GLOBAL', 98);    // ""
        batavia.modules.dis.def_op('LOAD_CONST', 100);       // Index in const list
        batavia.modules.dis.hasconst.add(100);
        batavia.modules.dis.name_op('LOAD_NAME', 101);       // Index in name list
        batavia.modules.dis.def_op('BUILD_TUPLE', 102);      // Number of tuple items
        batavia.modules.dis.def_op('BUILD_LIST', 103);       // Number of list items
        batavia.modules.dis.def_op('BUILD_SET', 104);        // Number of set items
        batavia.modules.dis.def_op('BUILD_MAP', 105);        // Number of dict entries (upto 255)
        batavia.modules.dis.name_op('LOAD_ATTR', 106);       // Index in name list
        batavia.modules.dis.def_op('COMPARE_OP', 107);       // Comparison operator
        batavia.modules.dis.hascompare.add(107);
        batavia.modules.dis.name_op('IMPORT_NAME', 108);     // Index in name list
        batavia.modules.dis.name_op('IMPORT_FROM', 109);     // Index in name list

        batavia.modules.dis.jrel_op('JUMP_FORWARD', 110);    // Number of bytes to skip
        batavia.modules.dis.jabs_op('JUMP_IF_FALSE_OR_POP', 111); // Target byte offset from beginning of code
        batavia.modules.dis.jabs_op('JUMP_IF_TRUE_OR_POP', 112);  // ""
        batavia.modules.dis.jabs_op('JUMP_ABSOLUTE', 113);        // ""
        batavia.modules.dis.jabs_op('POP_JUMP_IF_FALSE', 114);    // ""
        batavia.modules.dis.jabs_op('POP_JUMP_IF_TRUE', 115);     // ""

        batavia.modules.dis.name_op('LOAD_GLOBAL', 116);     // Index in name list

        batavia.modules.dis.jabs_op('CONTINUE_LOOP', 119);   // Target address
        batavia.modules.dis.jrel_op('SETUP_LOOP', 120);      // Distance to target address
        batavia.modules.dis.jrel_op('SETUP_EXCEPT', 121);    // ""
        batavia.modules.dis.jrel_op('SETUP_FINALLY', 122);   // ""

        batavia.modules.dis.def_op('LOAD_FAST', 124);        // Local variable number
        batavia.modules.dis.haslocal.add(124);
        batavia.modules.dis.def_op('STORE_FAST', 125);       // Local variable number
        batavia.modules.dis.haslocal.add(125);
        batavia.modules.dis.def_op('DELETE_FAST', 126);      // Local variable number
        batavia.modules.dis.haslocal.add(126);

        batavia.modules.dis.def_op('RAISE_VARARGS', 130);    // Number of raise arguments (1, 2, or 3);
        batavia.modules.dis.def_op('CALL_FUNCTION', 131);    // #args + (#kwargs << 8);
        batavia.modules.dis.hasnargs.add(131);
        batavia.modules.dis.def_op('MAKE_FUNCTION', 132);    // Number of args with default values
        batavia.modules.dis.def_op('BUILD_SLICE', 133);      // Number of items
        batavia.modules.dis.def_op('MAKE_CLOSURE', 134);
        batavia.modules.dis.def_op('LOAD_CLOSURE', 135);
        batavia.modules.dis.hasfree.add(135);
        batavia.modules.dis.def_op('LOAD_DEREF', 136);
        batavia.modules.dis.hasfree.add(136);
        batavia.modules.dis.def_op('STORE_DEREF', 137);
        batavia.modules.dis.hasfree.add(137);
        batavia.modules.dis.def_op('DELETE_DEREF', 138);
        batavia.modules.dis.hasfree.add(138);

        batavia.modules.dis.def_op('CALL_FUNCTION_VAR', 140);     // #args + (#kwargs << 8);
        batavia.modules.dis.hasnargs.add(140);
        batavia.modules.dis.def_op('CALL_FUNCTION_KW', 141);      // #args + (#kwargs << 8);
        batavia.modules.dis.hasnargs.add(141);
        batavia.modules.dis.def_op('CALL_FUNCTION_VAR_KW', 142);  // #args + (#kwargs << 8);
        batavia.modules.dis.hasnargs.add(142);

        batavia.modules.dis.jrel_op('SETUP_WITH', 143);

        batavia.modules.dis.def_op('LIST_APPEND', 145);
        batavia.modules.dis.def_op('SET_ADD', 146);
        batavia.modules.dis.def_op('MAP_ADD', 147);

        batavia.modules.dis.def_op('LOAD_CLASSDEREF', 148);
        batavia.modules.dis.hasfree.add(148);

        batavia.modules.dis.def_op('EXTENDED_ARG', 144);
        batavia.modules.dis.EXTENDED_ARG = 144;
    }
};

/*
 * Javascript DOM module.
 *
 * This is a wrapper to allow Python code to access DOM objects and methods.
 */


batavia.modules.dom = {
    'window': window,
    'parent': parent,
    'top': top,
    'navigator': navigator,
    'frames': frames,
    'location': location,
    'history': history,
    'document': document,
    'batavia': batavia
};

// Register the DOM module as a builtin.
batavia.builtins.dom = batavia.modules.dom;

/*************************************************************************
 * Marshal
 * This module contains functions that can read and write Python values in
 * a binary format. The format is specific to Python, but independent of
 * machine architecture issues.

 * Not all Python object types are supported; in general, only objects
 * whose value is independent from a particular invocation of Python can be
 * written and read by this module. The following types are supported:
 * None, integers, floating point numbers, strings, bytes, bytearrays,
 * tuples, lists, sets, dictionaries, and code objects, where it
 * should be understood that tuples, lists and dictionaries are only
 * supported as long as the values contained therein are themselves
 * supported; and recursive lists and dictionaries should not be written
 * (they will cause infinite loops).
 *
 * Variables:
 *
 * version -- indicates the format that the module uses. Version 0 is the
 *     historical format, version 1 shares interned strings and version 2
 *     uses a binary format for floating point numbers.
 *     Version 3 shares common object references (New in version 3.4).
 *
 * Functions:
 *
 * dumps() -- write value to a string

 *************************************************************************/

batavia.modules.marshal = {

    /* High water mark to determine when the marshalled object is dangerously deep
     * and risks coring the interpreter.  When the object stack gets this deep,
     * raise an exception instead of continuing.
     * On Windows debug builds, reduce this value.
     * iOS also requires a reduced value.
     */
    MAX_MARSHAL_STACK_DEPTH: 1500,

    TYPE_null: '0'.charCodeAt(),
    TYPE_NONE: 'N'.charCodeAt(),
    TYPE_FALSE: 'F'.charCodeAt(),
    TYPE_TRUE: 'T'.charCodeAt(),
    TYPE_STOPITER: 'S'.charCodeAt(),
    TYPE_ELLIPSIS: '.'.charCodeAt(),
    TYPE_INT: 'i'.charCodeAt(),
    TYPE_FLOAT: 'f'.charCodeAt(),
    TYPE_BINARY_FLOAT: 'g'.charCodeAt(),
    TYPE_COMPLEX: 'x'.charCodeAt(),
    TYPE_BINARY_COMPLEX: 'y'.charCodeAt(),
    TYPE_LONG: 'l'.charCodeAt(),
    TYPE_STRING: 's'.charCodeAt(),
    TYPE_INTERNED: 't'.charCodeAt(),
    TYPE_REF: 'r'.charCodeAt(),
    TYPE_TUPLE: '('.charCodeAt(),
    TYPE_LIST: '['.charCodeAt(),
    TYPE_DICT: '{'.charCodeAt(),
    TYPE_CODE: 'c'.charCodeAt(),
    TYPE_UNICODE: 'u'.charCodeAt(),
    TYPE_UNKNOWN: '?'.charCodeAt(),
    TYPE_SET: '<'.charCodeAt(),
    TYPE_FROZENSET: '>'.charCodeAt(),
    FLAG_REF: 0x80,  // with a type, add obj to index

    TYPE_ASCII: 'a'.charCodeAt(),
    TYPE_ASCII_INTERNED: 'A'.charCodeAt(),
    TYPE_SMALL_TUPLE: ')'.charCodeAt(),
    TYPE_SHORT_ASCII: 'z'.charCodeAt(),
    TYPE_SHORT_ASCII_INTERNED: 'Z'.charCodeAt(),

    /* We assume that Python ints are stored internally in base some power of
       2**15; for the sake of portability we'll always read and write them in base
       exactly 2**15. */

    PyLong_MARSHAL_SHIFT: 15,
// #define PyLong_MARSHAL_BASE ((short)1 << PyLong_MARSHAL_SHIFT)
// #define PyLong_MARSHAL_MASK (PyLong_MARSHAL_BASE - 1)
// #if PyLong_SHIFT % PyLong_MARSHAL_SHIFT != 0
// #error "PyLong_SHIFT must be a multiple of PyLong_MARSHAL_SHIFT"
// #endif
// #define PyLong_MARSHAL_RATIO (PyLong_SHIFT / PyLong_MARSHAL_SHIFT)

// #define W_TYPE(t, p) do { \
//     w_byte((t) | flag, (p)); \
// } while(0)

    SIZE32_MAX: Math.pow(2, 32),

    r_string: function(vm, n, p)
    {
        return p.fread(n);

        // var read = -1;
        // var res;

        // if (p.ptr !== null) {
        //     /* Fast path for loads() */
        //     res = p.ptr;
        //     var left = p.end - p.ptr;
        //     if (left < n) {
        //         vm.PyErr_SetString(batavia.builtins.EOFError,
        //                         "marshal data too short");
        //         return null;
        //     }
        //     p.ptr += n;
        //     return res;
        // }
        // if (p.buf === null) {
        //     p.buf = PyMem_MALLOC(n);
        //     if (p.buf === null) {
        //         PyErr_NoMemory();
        //         return null;
        //     }
        //     p.buf_size = n;
        // }
        // else if (p.buf_size < n) {
        //     p.buf = PyMem_REALLOC(p.buf, n);
        //     if (p.buf === null) {
        //         PyErr_NoMemory();
        //         return null;
        //     }
        //     p.buf_size = n;
        // }

        // if (!p.readable) {
        //     assert(p.fp !== null);
        //     read = fread(p.buf, 1, n, p.fp);
        // }
        // else {
        //     _Py_IDENTIFIER(readinto);
        //     var mview;
        //     var buf;

        //     if (PyBuffer_FillInfo(buf, null, p.buf, n, 0, PyBUF_CONTIG) == -1) {
        //         return null;
        //     }
        //     mview = PyMemoryView_FromBuffer(buf);
        //     if (mview === null)
        //         return null;

        //     res = _PyObject_CallMethodId(p.readable, PyId_readinto, "N", mview);
        //     if (res !== null) {
        //         read = PyNumber_AsSsize_t(res, batavia.builtins.ValueError);
        //     }
        // }
        // if (read != n) {
        //     if (!vm.PyErr_Occurred()) {
        //         if (read > n)
        //             vm.PyErr_Format(batavia.builtins.ValueError,
        //                          "read() returned too much data: " +
        //                          "%zd bytes requested, %zd returned",
        //                          n, read);
        //         else
        //             vm.PyErr_SetString(batavia.builtins.EOFError,
        //                             "EOF read where not expected");
        //     }
        //     return null;
        // }
        // return p.buf;
    },

    r_byte: function(vm, p)
    {
        return p.getc();
    },

    r_short: function(vm, p)
    {
        var x = p.getc();
        x |= p.getc() << 8;

        /* Sign-extension, in case short greater than 16 bits */
        x |= -(x & 0x8000);
        return x;
    },

    r_long: function(vm, p) {
        var x;
        x = p.getc();
        x |= p.getc() << 8;
        x |= p.getc() << 16;
        x |= p.getc() << 24;

        /* Sign extension for 64-bit machines */
        x |= -(x & 0x80000000);
        return x;
    },

    // r_PyLong: function(vm, p) {
    //     var ob;
    //     var n, size, i;
    //     var j, md, shorts_in_top_digit;
    //     var d;

    //     n = r_long(p);
    //     if (vm.PyErr_Occurred())
    //         return null;
    //     if (n === 0) {
    //         return _PyLong_New(0);
    //     }
    //     if (n < -batavia.modules.marshal.SIZE32_MAX || n > batavia.modules.marshal.SIZE32_MAX) {
    //         vm.PyErr_SetString(batavia.builtins.ValueError,
    //                        "bad marshal data (long size out of range)");
    //         return null;
    //     }

    //     size = 1 + (Math.abs(n) - 1) / PyLong_MARSHAL_RATIO;
    //     shorts_in_top_digit = 1 + (Math.abs(n) - 1) % PyLong_MARSHAL_RATIO;
    //     ob = _PyLong_New(size);
    //     if (ob === null)
    //         return null;

    //     //FIXME Py_SIZE(ob) = n > 0 ? size : -size;

    //     for (i = 0; i < size-1; i++) {
    //         d = 0;
    //         for (j=0; j < PyLong_MARSHAL_RATIO; j++) {
    //             md = r_short(p);
    //             if (vm.PyErr_Occurred()) {
    //                 return null;
    //             }
    //             if (md < 0 || md > PyLong_MARSHAL_BASE) {
    //                 goto bad_digit;
    //             }
    //             d += (digit)md << j*PyLong_MARSHAL_SHIFT;
    //         }
    //         ob.ob_digit[i] = d;
    //     }

    //     d = 0;
    //     for (j=0; j < shorts_in_top_digit; j++) {
    //         md = r_short(p);
    //         if (vm.PyErr_Occurred()) {
    //             return null;
    //         }
    //         if (md < 0 || md > PyLong_MARSHAL_BASE)
    //             goto bad_digit;
    //         /* topmost marshal digit should be nonzero */
    //         if (md === 0 && j == shorts_in_top_digit - 1) {
    //             vm.PyErr_SetString(batavia.builtins.ValueError,
    //                 "bad marshal data (unnormalized long data)");
    //             return null;
    //         }
    //         d += (digit)md << j*PyLong_MARSHAL_SHIFT;
    //     }
    //     if (vm.PyErr_Occurred()) {
    //         return null;
    //     }
    //     /* top digit should be nonzero, else the resulting PyLong won't be
    //        normalized */
    //     ob.ob_digit[size-1] = d;
    //     return (var )ob;
    //   bad_digit:
    //     vm.PyErr_SetString(batavia.builtins.ValueError,
    //                     "bad marshal data (digit out of range in long)");
    //     return null;
    // },

    /* allocate the reflist index for a new object. Return -1 on failure */
    r_ref_reserve: function(vm, flag, p) {
        if (flag) { /* currently only FLAG_REF is defined */
            var idx = p.refs.length;
            if (idx >= 0x7ffffffe) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (index list too large)");
                return -1;
            }
            if (p.refs.push(null) < 0) {
                return -1;
            }
            return idx;
        } else {
            return 0;
        }
    },

    /* insert the new object 'o' to the reflist at previously
     * allocated index 'idx'.
     * 'o' can be null, in which case nothing is done.
     * if 'o' was non-null, and the function succeeds, 'o' is returned.
     * if 'o' was non-null, and the function fails, 'o' is released and
     * null returned. This simplifies error checking at the call site since
     * a single test for null for the function result is enoug,h.
     */
    r_ref_insert: function(vm, o, idx, flag, p) {
        if (o !== null && flag) { /* currently only FLAG_REF is defined */
            var tmp = p.refs[idx];
            p.refs[idx] = o;
        }
        return o;
    },

    /* combination of both above, used when an object can be
     * created whenever it is seen in the file, as opposed to
     * after having loaded its sub-objects.,
     */
    r_ref: function(vm, o, flag, p) {
        assert(flag & batavia.modules.marshal.FLAG_REF);
        if (o === null) {
            return null;
        }
        if (p.refs.push(o) < 0) {
            return null;
        }
        return o;
    },

    r_object: function(vm, p) {
        /* null is a valid return value, it does not necessarily means that
           an exception is set. */
        var retval, v;
        var idx = 0;
        var i, n;
        var ptr;
        var type, code = batavia.modules.marshal.r_byte(vm, p);
        var flag, is_interned = 0;

        if (code === batavia.core.PYCFile.EOF) {
            vm.PyErr_SetString(batavia.builtins.EOFError,
                            "EOF read where object expected");
            return null;
        }

        p.depth++;

        if (p.depth > batavia.modules.marshal.MAX_MARSHAL_STACK_DEPTH) {
            p.depth--;
            vm.PyErr_SetString(batavia.builtins.ValueError, "recursion limit exceeded");
            return null;
        }

        flag = code & batavia.modules.marshal.FLAG_REF;
        type = code & ~batavia.modules.marshal.FLAG_REF;

        // console.log.info("R_OBJECT " + type + ' ' + flag);
        switch (type) {

        case batavia.modules.marshal.TYPE_null:
            retval = null;
            // console.log.info('TYPE_NULL ');
            break;

        case batavia.modules.marshal.TYPE_NONE:
            retval = null;
            // console.log.info('TYPE_NONE ' + retval);
            break;

        case batavia.modules.marshal.TYPE_STOPITER:
            retval = batavia.builtins.StopIteration;
            // console.log.info('TYPE_STOPITER');
            break;

        case batavia.modules.marshal.TYPE_ELLIPSIS:
            retval = batavia.VirtualMachine.Py_Ellipsis;
            // console.log.info('TYPE_ELLIPSIS');
            break;

        case batavia.modules.marshal.TYPE_FALSE:
            retval = false;
            // console.log.info('TYPE_FALSE');
            break;

        case batavia.modules.marshal.TYPE_TRUE:
            retval = true;
            // console.log.info('TYPE_TRUE');
            break;

        case batavia.modules.marshal.TYPE_INT:
            retval = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_INT ' + retval);
            if (vm.PyErr_Occurred()) {
                break;
            }
            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_LONG:
            retval = batavia.modules.marshal.r_PyLong(vm, p);
            // console.log.info('TYPE_LONG ' + retval);
            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_FLOAT:
            n = batavia.modules.marshal.r_byte(vm, p);
            buf = batavia.modules.marshal.r_string(vm, p, n);
            retval = parseFloat(buf);
            // console.log.info('TYPE_FLOAT ' + retval);
            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_BINARY_FLOAT:
            buf = p.fread(8);

            var sign;
            var e;
            var fhi, flo;
            var incr = 1;

            /* First byte */
            sign = (buf.charCodeAt(7) >> 7) & 1;
            e = (buf.charCodeAt(7) & 0x7F) << 4;

            /* Second byte */
            e |= (buf.charCodeAt(6) >> 4) & 0xF;
            fhi = (buf.charCodeAt(6) & 0xF) << 24;

            if (e == 2047) {
                throw "can't unpack IEEE 754 special value on non-IEEE platform";
            }

            /* Third byte */
            fhi |= buf.charCodeAt(5) << 16;

            /* Fourth byte */
            fhi |= buf.charCodeAt(4)  << 8;

            /* Fifth byte */
            fhi |= buf.charCodeAt(3);

            /* Sixth byte */
            flo = buf.charCodeAt(2) << 16;

            /* Seventh byte */
            flo |= buf.charCodeAt(1) << 8;

            /* Eighth byte */
            flo |= buf.charCodeAt(0);

            retval = fhi + flo / 16777216.0; /* 2**24 */
            retval /= 268435456.0; /* 2**28 */

            if (e === 0) {
                e = -1022;
            } else {
                retval += 1.0;
                e -= 1023;
            }
            retval = retval * Math.pow(2, e);

            if (sign) {
                retval = -retval;
            }
            // console.log.info('TYPE_BINARY_FLOAT ' + retval);

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_COMPLEX:
            // console.log.info('TYPE_COMPLEX ' + retval);
        //     {
        //     char buf[256], *ptr;
        //     Py_complex c;
        //     n = batavia.modules.marshal.r_byte(vm, p);
        //     if (n == EOF) {
        //         vm.PyErr_SetString(batavia.builtins.EOFError,
        //             "EOF read where object expected");
        //         break;
        //     }
        //     ptr = r_string(n, p);
        //     if (ptr === null)
        //         break;
        //     memcpy(buf, ptr, n);
        //     buf[n] = '\0';
        //     c.real = PyOS_string_to_double(buf, null, null);
        //     if (c.real == -1.0 && vm.PyErr_Occurred())
        //         break;
        //     n = batavia.modules.marshal.r_byte(vm, p);
        //     if (n == EOF) {
        //         vm.PyErr_SetString(batavia.builtins.EOFError,
        //             "EOF read where object expected");
        //         break;
        //     }
        //     ptr = r_string(n, p);
        //     if (ptr === null)
        //         break;
        //     memcpy(buf, ptr, n);
        //     buf[n] = '\0';
        //     c.imag = PyOS_string_to_double(buf, null, null);
        //     if (c.imag == -1.0 && vm.PyErr_Occurred())
        //         break;
        //     retval = PyComplex_FromCComplex(c);
        //     Marsha.r_ref(vm, retval, flag, p);
            break;

        case batavia.modules.marshal.TYPE_BINARY_COMPLEX:
            // console.log.info('TYPE_COMPLEX ' + retval);
        //         unsigned char *buf;
        //         Py_complex c;
        //         buf = batavia.modules.marshal.r_string(vm, 8, p);
        //         if (buf === null)
        //             break;
        //         c.real = _PyFloat_Unpack8(buf, 1);
        //         if (c.real == -1.0 && vm.PyErr_Occurred())
        //             break;
        //         buf = batavia.modules.marshal.r_string(vm, 8, p);
        //         if (buf === null)
        //             break;
        //         c.imag = _PyFloat_Unpack8(buf, 1);
        //         if (c.imag == -1.0 && vm.PyErr_Occurred())
        //             break;
        //         retval = PyComplex_FromCComplex(c);
        //         Marsha.r_ref(vm, retval, flag, p);
                break;

        case batavia.modules.marshal.TYPE_STRING:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_STRING ' + n);
            if (vm.PyErr_Occurred()) {
                break;
            }
            if (n < 0 || n > batavia.modules.marshal.SIZE32_MAX) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (string size out of range)");
                break;
            }
            retval = batavia.modules.marshal.r_string(vm, n, p);

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_ASCII_INTERNED:
        case batavia.modules.marshal.TYPE_ASCII:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_ASCII ' + n);
            if (n === batavia.core.PYCFile.EOF) {
                vm.PyErr_SetString(batavia.builtins.EOFError,
                    "EOF read where object expected");
                break;
            }
            retval = batavia.modules.marshal.r_string(vm, n, p);

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_SHORT_ASCII_INTERNED:
        case batavia.modules.marshal.TYPE_SHORT_ASCII:
            n = batavia.modules.marshal.r_byte(vm, p);
            // console.log.info('TYPE_SHORT_ASCII ' + n);
            if (n === batavia.core.PYCFile.EOF) {
                vm.PyErr_SetString(batavia.builtins.EOFError,
                    "EOF read where object expected");
                break;
            }
            retval = batavia.modules.marshal.r_string(vm, n, p);

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_INTERNED:
        case batavia.modules.marshal.TYPE_UNICODE:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_UNICODE ' + n);
            if (n === batavia.core.PYCFile.EOF) {
                vm.PyErr_SetString(batavia.builtins.EOFError,
                    "EOF read where object expected");
                break;
            }
            retval = batavia.modules.marshal.r_string(vm, n, p);

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_SMALL_TUPLE:
            n = batavia.modules.marshal.r_byte(vm, p);
            // console.log.info('TYPE_SMALL_TUPLE ' + n);
            if (vm.PyErr_Occurred()) {
                break;
            }
            retval = new batavia.core.Tuple(new Array(n));

            for (i = 0; i < n; i++) {
                retval[i] = batavia.modules.marshal.r_object(vm, p);
            }

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_TUPLE:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_TUPLE ' + n);
            if (vm.PyErr_Occurred()) {
                break;
            }
            if (n < 0 || n > batavia.modules.marshal.SIZE32_MAX) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (tuple size out of range)");
                break;
            }
            retval = new batavia.core.Tuple(new Array(n));

            for (i = 0; i < n; i++) {
                retval[i] = batavia.modules.marshal.r_object(vm, p);
            }

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_LIST:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_LIST ' + n);
            if (vm.PyErr_Occurred()) {
                break;
            }
            if (n < 0 || n > batavia.modules.marshal.SIZE32_MAX) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (list size out of range)");
                break;
            }
            retval = new batavia.core.List(new Array(n));
            for (i = 0; i < n; i++) {
                retval[n] = batavia.modules.marshal.r_object(vm, p);
            }

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_DICT:
            // console.log.info('TYPE_DICT ' + n);
            retval = batavia.core.Dict();
            for (;;) {
                var key, val;
                key = r_object(p);
                if (key === undefined)
                    break;
                val = r_object(p);
                if (val === undefined) {
                    break;
                }
                retval[key] = val;
            }
            if (vm.PyErr_Occurred()) {
                retval = null;
            }

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_SET:
        case batavia.modules.marshal.TYPE_FROZENSET:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_FROZENSET ' + n);
            if (vm.PyErr_Occurred()) {
                break;
            }
            if (n < 0 || n > batavia.modules.marshal.SIZE32_MAX) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (set size out of range)");
                break;
            }
            if (type == batavia.modules.marshal.TYPE_SET) {
                retval = batavia.core.Set(null);
                if (flag) {
                   batavia.modules.marshal.r_ref(vm, retval, flag, p);
                }
            } else {
                retval = batavia.core.FrozenSet(null);
                /* must use delayed registration of frozensets because they must
                 * be init with a refcount of 1
                 */
                idx = batavia.modules.marshal.r_ref_reserve(flag, p);
                if (idx < 0) {
                    Py_CLEAR(v); /* signal error */
                }
            }

            for (i = 0; i < n; i++) {
                retval.add(r_object(p));
            }

            if (type != batavia.modules.marshal.TYPE_SET) {
                retval = batavia.modules.marshal.r_ref_insert(retval, idx, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_CODE:
            var argcount;
            var kwonlyargcount;
            var nlocals;
            var stacksize;
            var flags;
            var consts;
            var names;
            var varnames;
            var freevars;
            var cellvars;
            var filename;
            var name;
            var firstlineno;
            var lnotab;

            idx = batavia.modules.marshal.r_ref_reserve(vm, flag, p);
            if (idx < 0) {
                break;
            }

            v = null;

            argcount = batavia.modules.marshal.r_long(vm, p);
            kwonlyargcount = batavia.modules.marshal.r_long(vm, p);
            nlocals = batavia.modules.marshal.r_long(vm, p);
            stacksize = batavia.modules.marshal.r_long(vm, p);
            flags = batavia.modules.marshal.r_long(vm, p);
            code = batavia.modules.marshal.r_object(vm, p);
            consts = batavia.modules.marshal.r_object(vm, p);
            names = batavia.modules.marshal.r_object(vm, p);
            varnames = batavia.modules.marshal.r_object(vm, p);
            freevars = batavia.modules.marshal.r_object(vm, p);
            cellvars = batavia.modules.marshal.r_object(vm, p);
            filename = batavia.modules.marshal.r_object(vm, p);
            name = batavia.modules.marshal.r_object(vm, p);
            firstlineno = batavia.modules.marshal.r_long(vm, p);
            lnotab = batavia.modules.marshal.r_object(vm, p);

            if (filename) {
                p.current_filename = filename;
            }

            v = new batavia.core.Code({
                argcount: argcount,
                kwonlyargcount: kwonlyargcount,
                nlocals: nlocals,
                stacksize: stacksize,
                flags: flags,
                code: code.split('').map(function (b) { return b.charCodeAt(); }),
                consts: consts,
                names: names,
                varnames: varnames,
                freevars: freevars,
                cellvars: cellvars,
                filename: filename,
                name: name,
                firstlineno: firstlineno,
                lnotab: lnotab
            });
            v = batavia.modules.marshal.r_ref_insert(vm, v, idx, flag, p);

            retval = v;
            break;

        case batavia.modules.marshal.TYPE_REF:
            n = batavia.modules.marshal.r_long(vm, p);
            if (n < 0 || n >= p.refs.length) {
                if (n == -1 && vm.PyErr_Occurred())
                    break;
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (invalid reference)");
                break;
            }
            v = p.refs[n];
            if (v === null) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (invalid reference)");
                break;
            }
            retval = v;
            break;

        default:
            /* Bogus data got written, which isn't ideal.
               This will let you keep working and recover. */
            vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (unknown type code '" + type + "')");
            break;

        }
        p.depth--;
        return retval;
    },

    read_object: function(vm, p) {
        var v;
        if (vm.PyErr_Occurred()) {
            console.log("readobject called with exception set\n");
            return null;
        }
        v = batavia.modules.marshal.r_object(vm, p);

        if (v === null && !vm.PyErr_Occurred()) {
            vm.PyErr_SetString(batavia.builtins.TypeError, "null object in marshal data for object");
        }
        return v;
    },

    /*
     * load_pyc(bytes)
     *
     * Load a Base64 encoded Convert the bytes object to a value. If no valid value is found, raise\n\
     * EOFError, ValueError or TypeError. Extra characters in the input are\n\
     * ignored."
     */

    load_pyc: function(vm, payload) {
        if (payload === null || payload.length === 0) {
            throw new batavia.builtins.BataviaError('Empty PYC payload');
        } else if (payload.startswith('ERROR:')) {
            throw new batavia.builtins.BataviaError('Traceback (most recent call last):\n' + payload.slice(6).split('\\n').join('\n'));
        }
        return batavia.modules.marshal.read_object(vm, new batavia.core.PYCFile(atob(payload)));
    }
};

batavia.modules.inspect = {
    FullArgSpec: function(kwargs) {
        this.args = kwargs.args || [];
        this.varargs = kwargs.getcallargs;
        this.varkw = kwargs.varkw;
        this.defaults = kwargs.defaults || {};
        this.kwonlyargs = kwargs.kwonlyargs || [];
        this.kwonlydefaults = kwargs.kwonlydefaults || {};
        this.annotations = kwargs.annotations || {};
    },

    _signature_get_user_defined_method: function(cls, method_name) {
        // try:
        //     meth = getattr(cls, method_name)
        // catch (err) {
        //     return
        // }
        // else {
        //     if not isinstance(meth, _NonUserDefinedCallables) {
        //         // # Once '__signature__' will be added to 'C'-level
        //         // callables, this check won't be necessary
        //         return meth
        //     }
        // }
    },

    _signature_bound_method: function(sig) {
        // Internal helper to transform signatures for unbound
        // functions to bound methods

        var params = sig.parameters.values();

        if (!params || params[0].kind in (_VAR_KEYWORD, _KEYWORD_ONLY)) {
            throw new batavia.builtins.ValueError('invalid method signature');
        }

        var kind = params[0].kind;
        if (kind in (_POSITIONAL_OR_KEYWORD, _POSITIONAL_ONLY)) {
            // Drop first parameter:
            // '(p1, p2[, ...])' -> '(p2[, ...])'
            params = params.slice(1);
        } else {
            if (kind !== _VAR_POSITIONAL) {
                // Unless we add a new parameter type we never
                // get here
                throw new batavia.builtins.ValueError('invalid argument type');
            }
            // It's a var-positional parameter.
            // Do nothing. '(*args[, ...])' -> '(*args[, ...])'
        }

        return sig.replace(parameters=params);
    },

    _signature_internal: function(obj, follow_wrapper_chains, skip_bound_arg) {
        // if (!callable(obj)) {
        //     throw TypeError('{!r} is not a callable object'.format(obj));
        // }

        // if (isinstance(obj, types.MethodType)) {
            // In this case we skip the first parameter of the underlying
            // function (usually `self` or `cls`).
            // sig = batavia.modules.inspect._signature_internal(obj.__func__, follow_wrapper_chains, skip_bound_arg);
            // if (skip_bound_arg) {
            //     return batavia.modules.inspect._signature_bound_method(sig);
            // } else {
            //     return sig;
            // }
        // }

        // // Was this function wrapped by a decorator?
        // if (follow_wrapper_chains) {
        //     obj = unwrap(obj, stop=function(f) { return hasattr(f, "__signature__"); });
        // }

        // try {
        //     sig = obj.__signature__;
        // } catch (err) {
        // } else {
        //     if (sig !== null) {
        //         if (!isinstance(sig, Signature)) {
        //             throw TypeError(
        //                 'unexpected object {!r} in __signature__ ' +
        //                 'attribute'.format(sig));
        //         }
        //         return sig;
        //     }
        // }
        // try {
        //     partialmethod = obj._partialmethod
        // } catch (err) {
        //     pass
        // } else {
        //     if isinstance(partialmethod, functools.partialmethod):
        //         // Unbound partialmethod (see functools.partialmethod)
        //         // This means, that we need to calculate the signature
        //         // as if it's a regular partial object, but taking into
        //         // account that the first positional argument
        //         // (usually `self`, or `cls`) will not be passed
        //         // automatically (as for boundmethods)

        //         wrapped_sig = batavia.modules.inspect._signature_internal(partialmethod.func,
        //                                           follow_wrapper_chains,
        //                                           skip_bound_arg)
        //         sig = batavia.modules.inspect._signature_get_partial(wrapped_sig, partialmethod, (None,))

        //         first_wrapped_param = tuple(wrapped_sig.parameters.values())[0]
        //         new_params = (first_wrapped_param,) + tuple(sig.parameters.values())

        //         return sig.replace(parameters=new_params)

        // if isfunction(obj) or _signature_is_functionlike(obj):
        //     # If it's a pure Python function, or an object that is duck type
        //     # of a Python function (Cython functions, for instance), then:
            return batavia.modules.inspect.Signature.from_function(obj);

        // if _signature_is_builtin(obj):
        //     return batavia.modules.inspect._signature_from_builtin(Signature, obj,
        //                                    skip_bound_arg=skip_bound_arg)

        // if isinstance(obj, functools.partial):
        //     wrapped_sig = batavia.modules.inspect._signature_internal(obj.func,
        //                                       follow_wrapper_chains,
        //                                       skip_bound_arg)
        //     return batavia.modules.inspect._signature_get_partial(wrapped_sig, obj)

        // sig = None
        // if isinstance(obj, type):
        //     // obj is a class or a metaclass

        //     // First, let's see if it has an overloaded __call__ defined
        //     // in its metaclass
        //     call = batavia.modules.inspect._signature_get_user_defined_method(type(obj), '__call__')
        //     if call is not None:
        //         sig = batavia.modules.inspect._signature_internal(call,
        //                                   follow_wrapper_chains,
        //                                   skip_bound_arg)
        //     else:
        //         # Now we check if the 'obj' class has a '__new__' method
        //         new = _signature_get_user_defined_method(obj, '__new__')
        //         if new is not None:
        //             sig = batavia.modules.inspect._signature_internal(new,
        //                                       follow_wrapper_chains,
        //                                       skip_bound_arg)
        //         else:
        //             # Finally, we should have at least __init__ implemented
        //             init = _signature_get_user_defined_method(obj, '__init__')
        //             if init is not None:
        //                 sig = batavia.modules.inspect._signature_internal(init,
        //                                           follow_wrapper_chains,
        //                                           skip_bound_arg)

        //     if sig is None:
        //         # At this point we know, that `obj` is a class, with no user-
        //         # defined '__init__', '__new__', or class-level '__call__'

        //         for base in obj.__mro__[:-1]:
        //             # Since '__text_signature__' is implemented as a
        //             # descriptor that extracts text signature from the
        //             # class docstring, if 'obj' is derived from a builtin
        //             # class, its own '__text_signature__' may be 'None'.
        //             # Therefore, we go through the MRO (except the last
        //             # class in there, which is 'object') to find the first
        //             # class with non-empty text signature.
        //             try:
        //                 text_sig = base.__text_signature__
        //             except AttributeError:
        //                 pass
        //             else:
        //                 if text_sig:
        //                     # If 'obj' class has a __text_signature__ attribute:
        //                     # return a signature based on it
        //                     return _signature_fromstr(Signature, obj, text_sig)

        //         # No '__text_signature__' was found for the 'obj' class.
        //         # Last option is to check if its '__init__' is
        //         # object.__init__ or type.__init__.
        //         if type not in obj.__mro__:
        //             # We have a class (not metaclass), but no user-defined
        //             # __init__ or __new__ for it
        //             if obj.__init__ is object.__init__:
        //                 # Return a signature of 'object' builtin.
        //                 return signature(object)

        // elif not isinstance(obj, _NonUserDefinedCallables):
        //     # An object with __call__
        //     # We also check that the 'obj' is not an instance of
        //     # _WrapperDescriptor or _MethodWrapper to avoid
        //     # infinite recursion (and even potential segfault)
        //     call = _signature_get_user_defined_method(type(obj), '__call__')
        //     if call is not None:
        //         try:
        //             sig = _signature_internal(call,
        //                                       follow_wrapper_chains,
        //                                       skip_bound_arg)
        //         except ValueError as ex:
        //             msg = 'no signature found for {!r}'.format(obj)
        //             raise ValueError(msg) from ex

        // if sig is not None:
        //     # For classes and objects we skip the first parameter of their
        //     # __call__, __new__, or __init__ methods
        //     if skip_bound_arg:
        //         return _signature_bound_method(sig)
        //     else:
        //         return sig

        // if isinstance(obj, types.BuiltinFunctionType):
        //     # Raise a nicer error message for builtins
        //     msg = 'no signature found for builtin function {!r}'.format(obj)
        //     raise ValueError(msg)

        // raise ValueError('callable {!r} is not supported by signature'.format(obj))
    },

    /*
     * Get the names and default values of a callable object's arguments.
     *
     * A tuple of seven things is returned:
     * (args, varargs, varkw, defaults, kwonlyargs, kwonlydefaults annotations).
     * 'args' is a list of the argument names.
     * 'varargs' and 'varkw' are the names of the * and ** arguments or None.
     * 'defaults' is an n-tuple of the default values of the last n arguments.
     * 'kwonlyargs' is a list of keyword-only argument names.
     * 'kwonlydefaults' is a dictionary mapping names from kwonlyargs to defaults.
     * 'annotations' is a dictionary mapping argument names to annotations.
     *
     * The first four items in the tuple correspond to getargspec().
     */
    getfullargspec: function(func) {
        // try {
            // Re: `skip_bound_arg=false`
            //
            // There is a notable difference in behaviour between getfullargspec
            // and Signature: the former always returns 'self' parameter for bound
            // methods, whereas the Signature always shows the actual calling
            // signature of the passed object.
            //
            // To simulate this behaviour, we "unbind" bound methods, to trick
            // batavia.modules.inspect.signature to always return their first parameter ("self",
            // usually)

            // Re: `follow_wrapper_chains=false`
            //
            // getfullargspec() historically ignored __wrapped__ attributes,
            // so we ensure that remains the case in 3.3+

            var sig = batavia.modules.inspect._signature_internal(func, false, false);

            var args = [];
            var varargs = null;
            var varkw = null;
            var kwonlyargs = [];
            var defaults = [];
            var annotations = {};
            var kwdefaults = {};

            if (sig.return_annotation.length > 0) {
                annotations['return'] = sig.return_annotation;
            }

            for (var p in sig.parameters) {
                if (sig.parameters.hasOwnProperty(p)) {
                    var param = sig.parameters[p];

                    if (param.kind === batavia.modules.inspect.Parameter.POSITIONAL_ONLY) {
                        args.push(param.name);
                    } else if (param.kind === batavia.modules.inspect.Parameter.POSITIONAL_OR_KEYWORD) {
                        args.push(param.name);
                        if (param.default !== undefined) {
                            defaults.push(param.default);
                        }
                    } else if (param.kind === batavia.modules.inspect.Parameter.VAR_POSITIONAL) {
                        varargs = param.name;
                    } else if (param.kind === batavia.modules.inspect.Parameter.KEYWORD_ONLY) {
                        kwonlyargs.push(param.name);
                        if (param.default !== undefined) {
                            kwdefaults[param.name] = param.default;
                        }
                    } else if (param.kind === batavia.modules.inspect.Parameter.VAR_KEYWORD) {
                        varkw = param.name;
                    }

                    if (param.annotation !== undefined) {
                        annotations[param.name] = param.annotation;
                    }
                }
            }

            if (kwdefaults.length === 0) {
                // compatibility with 'func.__kwdefaults__'
                kwdefaults = null;
            }

            if (defaults.length === 0) {
                // compatibility with 'func.__defaults__'
                defaults = null;
            }

            return new batavia.modules.inspect.FullArgSpec({
                'args': args,
                'varargs': varargs,
                'varkw': varkw,
                'defaults': defaults,
                'kwonlyargs': kwonlyargs,
                'kwdefaults': kwdefaults,
                'annotations': annotations
            });

        // } catch (ex) {
            // Most of the times 'signature' will raise ValueError.
            // But, it can also raise AttributeError, and, maybe something
            // else. So to be fully backwards compatible, we catch all
            // possible exceptions here, and reraise a TypeError.
            // raise TypeError('unsupported callable') from ex
            // throw TypeError('unsupported callable');
        // }
    },

    _missing_arguments: function(f_name, argnames, pos, values) {
        throw "Missing arguments";
        // var names = [];
        // for (var name in argnames) {
        //     if (!name in values) {
        //         names.push(name);
        //     }
        // }
        // var missing = names.length;
        // if (missing == 1) {
        //     s = names[0];
        // } else if (missing === 2) {
        //     s = "{} and {}".format(*names)
        // } else {
        //     tail = ", {} and {}".format(*names[-2:])
        //     del names[-2:]
        //     s = ", ".join(names) + tail
        // }
        // raise TypeError("%s() missing %i required %s argument%s: %s" %
        //                 (f_name, missing,
        //                   "positional" if pos else "keyword-only",
        //                   "" if missing == 1 else "s", s))
    },

    _too_many: function(f_name, args, kwonly, varargs, defcount, given, values) {
        throw "FIXME: Too many arguments";
        // atleast = len(args) - defcount
        // kwonly_given = len([arg for arg in kwonly if arg in values])
        // if varargs:
        //     plural = atleast != 1
        //     sig = "at least %d" % (atleast,)
        // elif defcount:
        //     plural = True
        //     sig = "from %d to %d" % (atleast, len(args))
        // else:
        //     plural = len(args) != 1
        //     sig = str(len(args))
        // kwonly_sig = ""
        // if kwonly_given:
        //     msg = " positional argument%s (and %d keyword-only argument%s)"
        //     kwonly_sig = (msg % ("s" if given != 1 else "", kwonly_given,
        //                          "s" if kwonly_given != 1 else ""))
        // raise TypeError("%s() takes %s positional argument%s but %d%s %s given" %
        //         (f_name, sig, "s" if plural else "", given, kwonly_sig,
        //          "was" if given == 1 and not kwonly_given else "were"))
    },

    /*
     * Get the mapping of arguments to values.
     *
     * A dict is returned, with keys the function argument names (including the
     * names of the * and ** arguments, if any), and values the respective bound
     * values from 'positional' and 'named'.
     */
    getcallargs: function(func, positional, named) {
        var arg2value = {};

        // if ismethod(func) and func.__self__ is not None:
        if (func.__self__) {
            // implicit 'self' (or 'cls' for classmethods) argument
            positional = [func.__self__].concat(positional);
        }
        var num_pos = positional.length;
        var num_args = func.argspec.args.length;
        var num_defaults = func.argspec.defaults ? func.argspec.defaults.length : 0;

        var i, arg;
        var n = Math.min(num_pos, num_args);
        for (i = 0; i < n; i++) {
            arg2value[func.argspec.args[i]] = positional[i];
        }

        if (func.argspec.varargs) {
            arg2value[varargs] = positional.slice(n);
        }

        var possible_kwargs = new batavia.core.Set();
        possible_kwargs.update(func.argspec.args);
        possible_kwargs.update(func.argspec.kwonlyargs);

        if (func.argspec.varkw) {
            arg2value[func.argspec.varkw] = {};
        }

        for (var kw in named) {
            if (named.hasOwnProperty(kw)) {
                if (!(kw in possible_kwargs)) {
                    if (!func.argspec.varkw) {
                        throw new batavia.builtins.TypeError("%s() got an unexpected keyword argument %r" %
                                    (func.__name__, kw));
                    }
                    arg2value[func.argspec.varkw][kw] = named[kw];
                    continue;
                }
                if (kw in arg2value) {
                    throw new batavia.builtins.TypeError("%s() got multiple values for argument %r" %
                                    (func.__name__, kw));
                }
                arg2value[kw] = named[kw];
            }
        }

        if (num_pos > num_args && (func.argspec.varargs === undefined || func.argspec.varargs.length === 0)) {
            batavia.modules.inspect._too_many(func.__name__, func.argspec.args, func.argspec.kwonlyargs, func.argspec.varargs, num_defaults, num_pos, arg2value);
        }
        if (num_pos < num_args) {
            var req = func.argspec.args.slice(0, num_args - num_defaults);
            for (arg in req) {
                if (req.hasOwnProperty(arg)) {
                    if (!(req[arg] in arg2value)) {
                        batavia.modules.inspect._missing_arguments(func.__name__, req, true, arg2value);
                    }
                }
            }
            for (i = num_args - num_defaults; i < func.argspec.args.length; i++) {
                arg = func.argspec.args[i];
                if (!arg2value.hasOwnProperty(arg)) {
                    arg2value[arg] = func.argspec.defaults[i - num_pos];
                }
            }
        }
        var missing = 0;
        for (var kwarg in func.argspec.kwonlyargs) {
            if (func.argspec.kwonlydefaults.hasOwnProperty(kwarg)) {
                if (!arg2value.hasOwnProperty(kwarg)) {
                    if (func.argspec.kwonlydefaults.hasOwnProperty(kwarg)) {
                        arg2value[kwarg] = func.argspec.kwonlydefaults[kwarg];
                    } else {
                        missing += 1;
                    }
                }
            }
        }
        if (missing) {
            batavia.modules.inspect._missing_arguments(func.__name__, func.argspec.kwonlyargs, false, arg2value);
        }
        return arg2value;
    }
};

batavia.modules.inspect.CO_OPTIMIZED = 0x1;
batavia.modules.inspect.CO_NEWLOCALS = 0x2;
batavia.modules.inspect.CO_VARARGS = 0x4;
batavia.modules.inspect.CO_VARKEYWORDS = 0x8;
batavia.modules.inspect.CO_NESTED = 0x10;
batavia.modules.inspect.CO_GENERATOR = 0x20;
batavia.modules.inspect.CO_NOFREE = 0x40;

/*
Represents a parameter in a function signature.

Has the following public attributes:

* name : str
    The name of the parameter as a string.
* default : object
    The default value for the parameter if specified.  If the
    parameter has no default value, this attribute is set to
    `Parameter.empty`.
* annotation
    The annotation for the parameter if specified.  If the
    parameter has no annotation, this attribute is set to
    `Parameter.empty`.
* kind : str
    Describes how argument values are bound to the parameter.
    Possible values: `Parameter.POSITIONAL_ONLY`,
    `Parameter.POSITIONAL_OR_KEYWORD`, `Parameter.VAR_POSITIONAL`,
    `Parameter.KEYWORD_ONLY`, `Parameter.VAR_KEYWORD`.
*/
batavia.modules.inspect.Parameter = function(kwargs) {
    this.name = kwargs.name;
    this.kind = kwargs.kind;
    this.annotation = kwargs.annotation;
    this.default = kwargs.default;

    // if kind not in (POSITIONAL_ONLY, _POSITIONAL_OR_KEYWORD,
    //                 _VAR_POSITIONAL, _KEYWORD_ONLY, _VAR_KEYWORD):
    //     raise ValueError("invalid value for 'Parameter.kind' attribute")

    // if def is not _empty:
    //     if kind in (_VAR_POSITIONAL, _VAR_KEYWORD):
    //         msg = '{} parameters cannot have def values'.format(kind)
    //         raise ValueError(msg)

    // if name is _empty:
    //     raise ValueError('name is a required attribute for Parameter')

    // if not isinstance(name, str):
    //     raise TypeError("name must be a str, not a {!r}".format(name))

    // if not name.isidentifier():
    //     raise ValueError('{!r} is not a valid parameter name'.format(name))

};

batavia.modules.inspect.Parameter.POSITIONAL_ONLY = 0;
batavia.modules.inspect.Parameter.POSITIONAL_OR_KEYWORD = 1;
batavia.modules.inspect.Parameter.VAR_POSITIONAL = 2;
batavia.modules.inspect.Parameter.KEYWORD_ONLY = 3;
batavia.modules.inspect.Parameter.VAR_KEYWORD = 4;

//    '''Creates a customized copy of the Parameter.'''
batavia.modules.inspect.Parameter.prototype.replace = function(kwargs) {
    var name = kwargs.name || this.name;
    var kind = kwargs.kind || this.kind;
    var annotation = kwargs.annotation || this.annotation;
    var def = kwargs.default || this.default;

    return new batavia.modules.inspect.Paramter(name, kind, def, annotation);
};

    // def __str__(self):
    //     kind = self.kind
    //     formatted = self._name

    //     # Add annotation and default value
    //     if self._annotation is not _empty:
    //         formatted = '{}:{}'.format(formatted,
    //                                    formatannotation(self._annotation))

    //     if self._default is not _empty:
    //         formatted = '{}={}'.format(formatted, repr(self._default))

    //     if kind == _VAR_POSITIONAL:
    //         formatted = '*' + formatted
    //     elif kind == _VAR_KEYWORD:
    //         formatted = '**' + formatted

    //     return formatted

    // def __repr__(self):
    //     return '<{} at {:#x} {!r}>'.format(self.__class__.__name__,
    //                                        id(self), self.name)

    // def __eq__(self, other):
    //     return (issubclass(other.__class__, Parameter) and
    //             self._name == other._name and
    //             self._kind == other._kind and
    //             self._default == other._default and
    //             self._annotation == other._annotation)

    // def __ne__(self, other):
    //     return not self.__eq__(other)

// class BoundArguments:
//     '''Result of `Signature.bind` call.  Holds the mapping of arguments
//     to the function's parameters.

//     Has the following public attributes:

//     * arguments : OrderedDict
//         An ordered mutable mapping of parameters' names to arguments' values.
//         Does not contain arguments' default values.
//     * signature : Signature
//         The Signature object that created this instance.
//     * args : tuple
//         Tuple of positional arguments values.
//     * kwargs : dict
//         Dict of keyword arguments values.
//     '''

//     def __init__(self, signature, arguments):
//         self.arguments = arguments
//         self._signature = signature

//     @property
//     def signature(self):
//         return self._signature

//     @property
//     def args(self):
//         args = []
//         for param_name, param in self._signature.parameters.items():
//             if param.kind in (_VAR_KEYWORD, _KEYWORD_ONLY):
//                 break

//             try:
//                 arg = self.arguments[param_name]
//             except KeyError:
//                 # We're done here. Other arguments
//                 # will be mapped in 'BoundArguments.kwargs'
//                 break
//             else:
//                 if param.kind == _VAR_POSITIONAL:
//                     # *args
//                     args.extend(arg)
//                 else:
//                     # plain argument
//                     args.push(arg)

//         return tuple(args)

//     @property
//     def kwargs(self):
//         kwargs = {}
//         kwargs_started = False
//         for param_name, param in self._signature.parameters.items():
//             if not kwargs_started:
//                 if param.kind in (_VAR_KEYWORD, _KEYWORD_ONLY):
//                     kwargs_started = True
//                 else:
//                     if param_name not in self.arguments:
//                         kwargs_started = True
//                         continue

//             if not kwargs_started:
//                 continue

//             try:
//                 arg = self.arguments[param_name]
//             except KeyError:
//                 pass
//             else:
//                 if param.kind == _VAR_KEYWORD:
//                     # **kwargs
//                     kwargs.update(arg)
//                 else:
//                     # plain keyword argument
//                     kwargs[param_name] = arg

//         return kwargs

//     def __eq__(self, other):
//         return (issubclass(other.__class__, BoundArguments) and
//                 self.signature == other.signature and
//                 self.arguments == other.arguments)

//     def __ne__(self, other):
//         return not self.__eq__(other)


/*
     * A Signature object represents the overall signature of a function.
    It stores a Parameter object for each parameter accepted by the
    function, as well as information specific to the function itself.

    A Signature object has the following public attributes and methods:

    * parameters : OrderedDict
        An ordered mapping of parameters' names to the corresponding
        Parameter objects (keyword-only arguments are in the same order
        as listed in `code.co_varnames`).
    * return_annotation : object
        The annotation for the return type of the function if specified.
        If the function has no annotation for its return type, this
        attribute is set to `Signature.empty`.
    * bind(*args, **kwargs) -> BoundArguments
        Creates a mapping from positional and keyword arguments to
        parameters.
    * bind_partial(*args, **kwargs) -> BoundArguments
        Creates a partial mapping from positional and keyword arguments
        to parameters (simulating 'functools.partial' behavior.)
    */
/* Constructs Signature from the given list of Parameter
 * objects and 'return_annotation'.  All arguments are optional.
 */
batavia.modules.inspect.Signature = function(parameters, return_annotation, __validate_parameters__) {
    this.parameters = {};
    if (parameters !== null) {
        if (__validate_parameters__) {
            // params = OrderedDict()
            // top_kind = _POSITIONAL_ONLY
            // kind_defaults = false

            // for idx, param in enumerate(parameters):
            //     kind = param.kind
            //     name = param.name

            //     if kind < top_kind:
            //         msg = 'wrong parameter order: {!r} before {!r}'
            //         msg = msg.format(top_kind, kind)
            //         raise ValueError(msg)
            //     elif kind > top_kind:
            //         kind_defaults = false
            //         top_kind = kind

            //     if kind in (_POSITIONAL_ONLY, _POSITIONAL_OR_KEYWORD):
            //         if param.default is _empty:
            //             if kind_defaults:
            //                 # No default for this parameter, but the
            //                 # previous parameter of the same kind had
            //                 # a default
            //                 msg = 'non-default argument follows default ' \
            //                       'argument'
            //                 raise ValueError(msg)
            //         else:
            //             # There is a default for this parameter.
            //             kind_defaults = True

            //     if name in params:
            //         msg = 'duplicate parameter name: {!r}'.format(name)
            //         raise ValueError(msg)

            //     params[name] = param
        } else {
            // params = OrderedDict(((param.name, param) for param in parameters));
            for (var p in parameters) {
                if (parameters.hasOwnProperty(p)) {
                    this.parameters[parameters[p].name] = parameters[p];
                }
            }
        }
    }

    this.return_annotation = return_annotation;
};

// batavia.modules.inspect.Signature._parameter_cls = Parameter;
// batavia.modules.inspect.Signature._bound_arguments_cls = BoundArguments;

/*
 * Constructs Signature for the given python function
 */
batavia.modules.inspect.Signature.from_function = function(func) {
    var is_duck_function = false;
    // if (!isfunction(func)) {
    //     if (_signature_is_functionlike(func)) {
    //         is_duck_function = true;
    //     } else {
    //         // If it's not a pure Python function, and not a duck type
    //         // of pure function:
    //         throw TypeError('{!r} is not a Python function'.format(func));
    //     }
    // }

    // Parameter = cls._parameter_cls

    // Parameter information.
    var func_code = func.__code__;
    var pos_count = func_code.co_argcount;
    var arg_names = func_code.co_varnames;
    var positional = arg_names.slice(0, pos_count);
    var keyword_only_count = func_code.co_kwonlyargcount;
    var keyword_only = arg_names.slice(pos_count, pos_count + keyword_only_count);
    var annotations = func.__annotations__;
    var defs = func.__defaults__;
    var kwdefaults = func.__kwdefaults__;

    var pos_default_count;
    if (defs) {
        pos_default_count = defs.length;
    } else {
        pos_default_count = 0;
    }

    var parameters = [];
    var n, name, annotation, def, offset;

    // Non-keyword-only parameters w/o defaults.
    var non_default_count = pos_count - pos_default_count;
    for (n = 0; n < non_default_count; n++) {
        name = positional[n];
        annotation = annotations[name];
        parameters.push(new batavia.modules.inspect.Parameter({
            'name': name,
            'annotation': annotation,
            'kind': batavia.modules.inspect.Parameter.POSITIONAL_OR_KEYWORD
        }));
    }

    // ... w/ defaults.
    for (offset=0, n = non_default_count; n < positional.length; offset++, n++) {
        name = positional[n];
        annotation = annotations[name];
        parameters.push(new batavia.modules.inspect.Parameter({
            'name': name,
            'annotation': annotation,
            'kind': batavia.modules.inspect.Parameter.POSITIONAL_OR_KEYWORD,
            'default': defs[offset]
        }));
    }

    // *args
    if (func_code.co_flags & batavia.modules.inspect.CO_VARARGS) {
        name = arg_names[pos_count + keyword_only_count];
        annotation = annotations[name];
        parameters.push(new batavia.modules.inspect.Parameter({
            'name': name,
            'annotation': annotation,
            'kind': batavia.modules.inspect.Parameter.VAR_POSITIONAL
        }));
    }

    // Keyword-only parameters.
    for (n = 0; n < keyword_only.length; n++) {
        def = null;
        if (kwdefaults !== null) {
            def = kwdefaults[name];
        }

        annotation = annotations[name];
        parameters.push(new batavia.modules.inspect.Parameter({
            'name': name,
            'annotation': annotation,
            'kind': batavia.modules.inspect.Parameter.KEYWORD_ONLY,
            'default': def
        }));
    }

    // **kwargs
    if (func_code.co_flags & batavia.modules.inspect.CO_VARKEYWORDS) {
        var index = pos_count + keyword_only_count;
        if (func_code.co_flags & batavia.modules.inspect.CO_VARARGS) {
            index += 1;
        }

        name = arg_names[index];
        annotation = annotations[name];
        parameters.push(new batavia.modules.inspect.Parameter({
            'name': name,
            'annotation': annotation,
            'kind': batavia.modules.inspect.Parameter.VAR_KEYWORD
        }));
    }

    // Is 'func' is a pure Python function - don't validate the
    //parameters list (for correct order and defaults), it should be OK.
    return new batavia.modules.inspect.Signature(parameters, annotations['return'] || {}, is_duck_function);
};


    // @classmethod
    // def from_builtin(cls, func):
    //     return _signature_from_builtin(cls, func)

    // def replace(self, *, parameters=_void, return_annotation=_void):
    //     '''Creates a customized copy of the Signature.
    //     Pass 'parameters' and/or 'return_annotation' arguments
    //     to override them in the new copy.
    //     '''

    //     if parameters is _void:
    //         parameters = self.parameters.values()

    //     if return_annotation is _void:
    //         return_annotation = self._return_annotation

    //     return type(self)(parameters,
    //                       return_annotation=return_annotation)

    // def __eq__(self, other):
    //     if (not issubclass(type(other), Signature) or
    //                 self.return_annotation != other.return_annotation or
    //                 len(self.parameters) != len(other.parameters)):
    //         return false

    //     other_positions = {param: idx
    //                        for idx, param in enumerate(other.parameters.keys())}

    //     for idx, (param_name, param) in enumerate(self.parameters.items()):
    //         if param.kind == _KEYWORD_ONLY:
    //             try:
    //                 other_param = other.parameters[param_name]
    //             except KeyError:
    //                 return false
    //             else:
    //                 if param != other_param:
    //                     return false
    //         else:
    //             try:
    //                 other_idx = other_positions[param_name]
    //             except KeyError:
    //                 return false
    //             else:
    //                 if (idx != other_idx or
    //                                 param != other.parameters[param_name]):
    //                     return false

    //     return True

    // def __ne__(self, other):
    //     return not self.__eq__(other)

    // def _bind(self, args, kwargs, *, partial=false):
    //     '''Private method.  Don't use directly.'''

    //     arguments = OrderedDict()

    //     parameters = iter(self.parameters.values())
    //     parameters_ex = ()
    //     arg_vals = iter(args)

    //     while True:
    //         # Let's iterate through the positional arguments and corresponding
    //         # parameters
    //         try:
    //             arg_val = next(arg_vals)
    //         except StopIteration:
    //             # No more positional arguments
    //             try:
    //                 param = next(parameters)
    //             except StopIteration:
    //                 # No more parameters. That's it. Just need to check that
    //                 # we have no `kwargs` after this while loop
    //                 break
    //             else:
    //                 if param.kind == _VAR_POSITIONAL:
    //                     # That's OK, just empty *args.  Let's start parsing
    //                     # kwargs
    //                     break
    //                 elif param.name in kwargs:
    //                     if param.kind == _POSITIONAL_ONLY:
    //                         msg = '{arg!r} parameter is positional only, ' \
    //                               'but was passed as a keyword'
    //                         msg = msg.format(arg=param.name)
    //                         raise TypeError(msg) from None
    //                     parameters_ex = (param,)
    //                     break
    //                 elif (param.kind == _VAR_KEYWORD or
    //                                             param.default is not _empty):
    //                     # That's fine too - we have a default value for this
    //                     # parameter.  So, lets start parsing `kwargs`, starting
    //                     # with the current parameter
    //                     parameters_ex = (param,)
    //                     break
    //                 else:
    //                     # No default, not VAR_KEYWORD, not VAR_POSITIONAL,
    //                     # not in `kwargs`
    //                     if partial:
    //                         parameters_ex = (param,)
    //                         break
    //                     else:
    //                         msg = '{arg!r} parameter lacking default value'
    //                         msg = msg.format(arg=param.name)
    //                         raise TypeError(msg) from None
    //         else:
    //             # We have a positional argument to process
    //             try:
    //                 param = next(parameters)
    //             except StopIteration:
    //                 raise TypeError('too many positional arguments') from None
    //             else:
    //                 if param.kind in (_VAR_KEYWORD, _KEYWORD_ONLY):
    //                     # Looks like we have no parameter for this positional
    //                     # argument
    //                     raise TypeError('too many positional arguments')

    //                 if param.kind == _VAR_POSITIONAL:
    //                     # We have an '*args'-like argument, let's fill it with
    //                     # all positional arguments we have left and move on to
    //                     # the next phase
    //                     values = [arg_val]
    //                     values.extend(arg_vals)
    //                     arguments[param.name] = tuple(values)
    //                     break

    //                 if param.name in kwargs:
    //                     raise TypeError('multiple values for argument '
    //                                     '{arg!r}'.format(arg=param.name))

    //                 arguments[param.name] = arg_val

    //     # Now, we iterate through the remaining parameters to process
    //     # keyword arguments
    //     kwargs_param = None
    //     for param in itertools.chain(parameters_ex, parameters):
    //         if param.kind == _VAR_KEYWORD:
    //             # Memorize that we have a '**kwargs'-like parameter
    //             kwargs_param = param
    //             continue

    //         if param.kind == _VAR_POSITIONAL:
    //             # Named arguments don't refer to '*args'-like parameters.
    //             # We only arrive here if the positional arguments ended
    //             # before reaching the last parameter before *args.
    //             continue

    //         param_name = param.name
    //         try:
    //             arg_val = kwargs.pop(param_name)
    //         except KeyError:
    //             # We have no value for this parameter.  It's fine though,
    //             # if it has a default value, or it is an '*args'-like
    //             # parameter, left alone by the processing of positional
    //             # arguments.
    //             if (not partial and param.kind != _VAR_POSITIONAL and
    //                                                 param.default is _empty):
    //                 raise TypeError('{arg!r} parameter lacking default value'. \
    //                                 format(arg=param_name)) from None

    //         else:
    //             if param.kind == _POSITIONAL_ONLY:
    //                 # This should never happen in case of a properly built
    //                 # Signature object (but let's have this check here
    //                 # to ensure correct behaviour just in case)
    //                 raise TypeError('{arg!r} parameter is positional only, '
    //                                 'but was passed as a keyword'. \
    //                                 format(arg=param.name))

    //             arguments[param_name] = arg_val

    //     if kwargs:
    //         if kwargs_param is not None:
    //             // Process our '**kwargs'-like parameter
    //             arguments[kwargs_param.name] = kwargs
    //         else:
    //             raise TypeError('too many keyword arguments')

    //     return self._bound_arguments_cls(self, arguments)

    // def bind(*args, **kwargs):
    //     '''Get a BoundArguments object, that maps the passed `args`
    //     and `kwargs` to the function's signature.  Raises `TypeError`
    //     if the passed arguments can not be bound.
    //     '''
    //     return args[0]._bind(args[1:], kwargs)

    // def bind_partial(*args, **kwargs):
    //     '''Get a BoundArguments object, that partially maps the
    //     passed `args` and `kwargs` to the function's signature.
    //     Raises `TypeError` if the passed arguments can not be bound.
    //     '''
    //     return args[0]._bind(args[1:], kwargs, partial=True)

    // def __str__(self):
    //     result = []
    //     render_pos_only_separator = false
    //     render_kw_only_separator = True
    //     for param in self.parameters.values():
    //         formatted = str(param)

    //         kind = param.kind

    //         if kind == _POSITIONAL_ONLY:
    //             render_pos_only_separator = True
    //         elif render_pos_only_separator:
    //             # It's not a positional-only parameter, and the flag
    //             # is set to 'True' (there were pos-only params before.)
    //             result.push('/')
    //             render_pos_only_separator = false

    //         if kind == _VAR_POSITIONAL:
    //             # OK, we have an '*args'-like parameter, so we won't need
    //             # a '*' to separate keyword-only arguments
    //             render_kw_only_separator = false
    //         elif kind == _KEYWORD_ONLY and render_kw_only_separator:
    //             # We have a keyword-only parameter to render and we haven't
    //             # rendered an '*args'-like parameter before, so add a '*'
    //             # separator to the parameters list ("foo(arg1, *, arg2)" case)
    //             result.push('*')
    //             # This condition should be only triggered once, so
    //             # reset the flag
    //             render_kw_only_separator = false

    //         result.push(formatted)

    //     if render_pos_only_separator:
    //         # There were only positional-only parameters, hence the
    //         # flag was not reset to 'false'
    //         result.push('/')

    //     rendered = '({})'.format(', '.join(result))

    //     if self.return_annotation is not _empty:
    //         anno = formatannotation(self.return_annotation)
    //         rendered += ' -> {}'.format(anno)

    //     return rendered
batavia.modules.sys = {
    'modules': {}
};

batavia.modules.time = {
    clock: function() {
        return new Date().getTime();
    }
};

batavia.core.Block = function(type, handler, level) {
    this.type = type;
    this.handler = handler;
    this.level = level || 0;
};
/*

General builtin format:


// Example: a function that accepts exactly one argument, and no keyword arguments
batavia.builtins.<fn> = function(<args>, <kwargs>) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError("Batavia calling convention not used.")
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("<fn>() doesn't accept keyword arguments.")
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError("<fn>() expected exactly 1 argument (" + args.length + " given)")
    }

    // if the function only works with a specific object type, add a test
    var variable = args[0]

    if (typeof(variable) !== "<type>") {
        throw new batavia.builtins.TypeError(
            "<fn>() expects a <type> (" + typeof(variable) + " given)");
    }

    // actual code goes here
    Javascript.Function.Stuf()
}
batavia.builtins.<fn>.__doc__ = 'docstring from Python 3.4 goes here, for documentation'
*/

batavia.builtins.__import__ = function(args, kwargs) {
    // First, try native modules
    var module = batavia.modules[args[0]];
    // If there's no native module, try for a pre-loaded module.
    if (module === undefined) {
        module = batavia.modules.sys.modules[args[0]];
    }
    // If there still isn't a module, try loading one from the DOM.
    if (module === undefined) {
        // Load requested module
        var name_parts = args[0].split('.');
        var name = name_parts[0];
        try {
            var root_module = batavia.modules.sys.modules[name];
            var payload, code, frame;
            if (root_module === undefined) {
                payload = this.loader(name);
                code = batavia.modules.marshal.load_pyc(this, payload);

                // Convert code object to module
                frame = this.make_frame({
                    'code': code,
                    'f_globals': args[1],
                    'f_locals': new batavia.core.Dict(),
                });
                this.run_frame(frame);

                root_module = new batavia.core.Module(name, frame.f_locals);
                batavia.modules.sys.modules[name] = root_module;
            }

            var sub_module = root_module;
            for (var n = 1; n < name_parts.length; n++) {
                name = name_parts.slice(0, n + 1).join('.');

                var new_sub = batavia.modules.sys.modules[name];
                if (new_sub === undefined) {
                    payload = this.loader(name);
                    code = batavia.modules.marshal.load_pyc(this, payload);

                    // Convert code object to module
                    frame = this.make_frame({
                        'code': code,
                        'f_globals': args[1],
                        'f_locals': new batavia.core.Dict(),
                    });
                    this.run_frame(frame);

                    new_sub = new batavia.core.Module(name, frame.f_locals);
                    sub_module[name_parts[n]] = new_sub;
                    sub_module = new_sub;
                    batavia.modules.sys.modules[name] = sub_module;
                } else {
                    sub_module = new_sub;
                }
            }

            if (args[3] === null) {
                // import <mod>
                module = root_module;
            } else if (args[3][0] === "*") {
                // from <mod> import *
                module = new batavia.core.Module(sub_module.__name__);
                for (name in sub_module) {
                    if (sub_module.hasOwnProperty(name)) {
                        module[name] = sub_module[name];
                    }
                }
            } else {
                // from <mod> import <name>, <name>
                module = new batavia.core.Module(sub_module.__name__);
                for (var sn = 0; sn < args[3].length; sn++) {
                    name = args[3][sn];
                    if (sub_module[name] === undefined) {
                        batavia.builtins.__import__.apply(this, [[sub_module.__name__ + '.' + name, this.frame.f_globals, null, null, null]]);
                    }
                    module[name] = sub_module[name];
                }
            }
        } catch (err) {
            // Native module. Look for a name in the global
            // (window) namespace.
            var root_module = window[name];
            batavia.modules.sys.modules[name] = root_module;

            var sub_module = root_module;
            for (var n = 1; n < name_parts.length; n++) {
                name = name_parts.slice(0, n + 1).join('.');
                sub_module = sub_module[name_parts[n]];
                batavia.modules.sys.modules[name] = sub_module;
            }

            if (args[3] === null) {
                // import <mod>
                module = root_module;
            } else if (args[3][0] === "*") {
                // from <mod> import *
                module = {};
                for (name in sub_module) {
                    if (sub_module.hasOwnProperty(name)) {
                        module[name] = sub_module[name];
                    }
                }
            } else {
                // from <mod> import <name>, <name>
                module = {};
                for (var nn = 0; nn < args[3].length; nn++) {
                    name = args[3][nn];
                    module[name] = sub_module[name];
                }
            }
        }
    }
    return module;
};

batavia.builtins.abs = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("abs() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError('abs() expected exactly 1 argument (' + args.length + ' given)');
    }
    if (args[0] === null) {
        throw new batavia.builtins.TypeError(
            "bad operand type for abs(): 'NoneType'");
    }

    return Math.abs(args[0]);
};
batavia.builtins.abs.__doc__ = 'abs(number) -> number\n\nReturn the absolute value of the argument.';

batavia.builtins.all = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("all() doesn't accept keyword arguments");
    }
    if (args.length === 0) {
        return true;
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError('all() expected exactly 0 or 1 argument (' + args.length + ' given)');
    }

    for (var i in args[0]) {
        if (!args[0][i]) {
           return false;
        }
    }

    return true;
};
batavia.builtins.all.__doc__ = 'all(iterable) -> bool\n\nReturn True if bool(x) is True for all values x in the iterable.\nIf the iterable is empty, return True.';

batavia.builtins.any = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("any() doesn't accept keyword arguments");
    }
    if (args.length === 0) {
        return false;
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError('any() expected exactly 0 or 1 arguments (' + args.length + ' given)');
    }

    for (var i in args[0]) {
        if (args[0][i]) {
           return true;
        }
    }
    return false;
};
batavia.builtins.any.__doc__ = 'any(iterable) -> bool\n\nReturn True if bool(x) is True for any x in the iterable.\nIf the iterable is empty, return False.';

batavia.builtins.bin = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("bin() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError('bin() expected exactly 1 argument (' + args.length + ' given)');
    }

    var variable = args[0];

    if (typeof(variable) !== "number") {
        throw new batavia.builtins.TypeError(
            "bin() expects a number (" + typeof(variable) + " given)");
    }

    return "0b" + variable.toString(2);
};
batavia.builtins.bin.__doc__ = "bin(number) -> string\n\nReturn the binary representation of an integer.\n\n   ";

batavia.builtins.bool = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("bool() doesn't accept keyword arguments");
    }
    if (!args || args.length === 0) {
        return false;
    } else if (args.length != 1) {
        throw new batavia.builtins.TypeError('bool() expected exactly 1 argument (' + args.length + ' given)');
    }

    return !!args[0];
};
batavia.builtins.bool.__doc__ = 'bool(x) -> bool\n\nReturns True when the argument x is true, False otherwise.\nThe builtins True and False are the only two instances of the class bool.\nThe class bool is a subclass of the class int, and cannot be subclassed.';

batavia.builtins.bytearray = function(args, kwargs) {
    throw new batavia.builtins.NotImplementedError(
        "Builtin Batavia function 'bytearray' not implemented");
};
batavia.builtins.bytearray.__doc__ = 'bytearray(iterable_of_ints) -> bytearray\nbytearray(string, encoding[, errors]) -> bytearray\nbytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer\nbytearray(int) -> bytes array of size given by the parameter initialized with null bytes\nbytearray() -> empty bytes array\n\nConstruct an mutable bytearray object from:\n  - an iterable yielding integers in range(256)\n  - a text string encoded using the specified encoding\n  - a bytes or a buffer object\n  - any object implementing the buffer API.\n  - an integer';

batavia.builtins.bytes = function(args, kwargs) {
    throw new batavia.builtins.NotImplementedError(
        "Builtin Batavia function 'bytes' not implemented");
};
batavia.builtins.bytes.__doc__ = 'bytes(iterable_of_ints) -> bytes\nbytes(string, encoding[, errors]) -> bytes\nbytes(bytes_or_buffer) -> immutable copy of bytes_or_buffer\nbytes(int) -> bytes object of size given by the parameter initialized with null bytes\nbytes() -> empty bytes object\n\nConstruct an immutable array of bytes from:\n  - an iterable yielding integers in range(256)\n  - a text string encoded using the specified encoding\n  - any object implementing the buffer API.\n  - an integer';

batavia.builtins.callable = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("callable() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError('callable() expected exactly 1 argument (' + args.length + ' given)');
    }
    if (typeof(args[0]) === "function") {
        return true;
    } else {
        return false;
    }
};
batavia.builtins.callable.__doc__ = 'callable(object) -> bool\n\nReturn whether the object is callable (i.e., some kind of function).\nNote that classes are callable, as are instances of classes with a\n__call__() method.';

batavia.builtins.chr = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("char() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError('char() expected exactly 1 argument (' + args.length + ' given)');
    }
    return String.fromCharCode(args[0]);
};
batavia.builtins.chr.__doc__ = 'chr(i) -> Unicode character\n\nReturn a Unicode string of one character with ordinal i; 0 <= i <= 0x10ffff.';

batavia.builtins.classmethod = function(args, kwargs) {
    throw new batavia.builtins.NotImplementedError(
        "Builtin Batavia function 'classmethod' not implemented");
};
batavia.builtins.classmethod.__doc__ = 'classmethod(function) -> method\n\nConvert a function to be a class method.\n\nA class method receives the class as implicit first argument,\njust like an instance method receives the instance.\nTo declare a class method, use this idiom:\n\n  class C:\n      def f(cls, arg1, arg2, ...): ...\n      f = classmethod(f)\n\nIt can be called either on the class (e.g. C.f()) or on an instance\n(e.g. C().f()).  The instance is ignored except for its class.\nIf a class method is called for a derived class, the derived class\nobject is passed as the implied first argument.\n\nClass methods are different than C++ or Java static methods.\nIf you want those, see the staticmethod builtin.';


batavia.builtins.compile = function(args, kwargs) {
    throw new batavia.builtins.NotImplementedError(
        "Builtin Batavia function 'compile' not implemented");
};
batavia.builtins.compile.__doc__ = "compile(source, filename, mode[, flags[, dont_inherit]]) -> code object\n\nCompile the source (a Python module, statement or expression)\ninto a code object that can be executed by exec() or eval().\nThe filename will be used for run-time error messages.\nThe mode must be 'exec' to compile a module, 'single' to compile a\nsingle (interactive) statement, or 'eval' to compile an expression.\nThe flags argument, if present, controls which future statements influence\nthe compilation of the code.\nThe dont_inherit argument, if non-zero, stops the compilation inheriting\nthe effects of any future statements in effect in the code calling\ncompile; if absent or zero these statements do influence the compilation,\nin addition to any features explicitly specified.";

batavia.builtins.complex = function(args, kwargs) {
    throw new batavia.builtins.NotImplementedError(
        "Builtin Batavia function 'complex' not implemented");
};
batavia.builtins.complex.__doc__ = 'complex(real[, imag]) -> complex number\n\nCreate a complex number from a real part and an optional imaginary part.\nThis is equivalent to (real + imag*1j) where imag defaults to 0.';

batavia.builtins.copyright = function(args, kwargs) {
    console.log("Batavia: Copyright (c) 2015 Russell Keith-Magee. (BSD-3 Licence)\n"+
                "byterun: Copyright (c) 2013, Ned Batchelder. (MIT Licence)");
};
batavia.builtins.copyright.__doc__ = 'interactive prompt objects for printing the license text, a list of\n    contributors and the copyright notice.';

batavia.builtins.credits = function(args, kwargs) {
    console.log("Thanks to all contributors, including those in AUTHORS, for supporting Batavia development. See https://github.com/pybee/batavia for more information");
};
batavia.builtins.credits.__doc__ = 'interactive prompt objects for printing the license text, a list of\n    contributors and the copyright notice.';

batavia.builtins.delattr = function(args, kwargs) {
    if (args) {
        try {
            if (batavia.builtins.getattr(args)) {
                delete args[0][args[1]];
                // False returned by bool(delattr(...)) in the success case
                return false;
            }
        } catch (err) {
            // This is maybe unecessary, but matches the error thrown by python 3.5.1 in this case
            if (err instanceof batavia.builtins.AttributeError) {
                throw new batavia.builtins.AttributeError(args[1]);
            }
            if (err instanceof batavia.builtins.TypeError) {
                throw new batavia.builtins.TypeError("delattr expected 2 arguments, got " + args.length);
            }
        }
    } else {
        throw new batavia.builtins.TypeError("delattr expected 2 arguments, got 0");
    }
};
batavia.builtins.delattr.__doc__ = "delattr(object, name)\n\nDelete a named attribute on an object; delattr(x, 'y') is equivalent to\n``del x.y''.";

batavia.builtins.dict = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (args.length > 1) {
        throw new batavia.builtins.TypeError("dict expected at most 1 arguments, got " + args.length);
    }
    if (typeof args[0] === "number") {
        // floats and integers are all number types in js
        // this approximates float checking, but still thinks that 
        // 1.00000000000000000001 is an integer
        if (args[0].toString().indexOf('.') > 0) {
            throw new batavia.builtins.TypeError("'float' object is not iterable");
        }
        throw new batavia.builtins.TypeError("'int' object is not iterable");
    }
    if (typeof args[0] === "string" || args[0] instanceof String) {
        throw new batavia.builtins.ValueError("dictionary update sequence element #0 has length 1; 2 is required");
    }
    // error handling for iterables
    if (args.length === 1 && args.constructor === Array) {
        // iterate through array to find any errors
        for (i = 0; i < args[0].length; i++) {
            if (args[0][i].length !== 2) {
                // single number in an iterable throws different error
                if (typeof(args[0][i]) === "number") {
                    throw new batavia.builtins.TypeError("cannot convert dictionary update sequence element #" + i + " to a sequence");    
                }
                else {
                    throw new batavia.builtins.ValueError("dictionary update sequence element #" + i + " has length " + args[0][i].length + "; 2 is required");
                }
            }
        }
    }
    // handling keyword arguments and no arguments
    if (args.length === 0 || args[0].length === 0) {
        if (kwargs) {
            return kwargs;
        }
        else {
            return {};
        }
    }    
    // passing a dictionary as argument
    if (args[0].constructor === Object) {
        return args[0];
    }
    // passing a list as argument
    if (args.length === 1) {
        var dict = {};
        for (i = 0; i < args[0].length; i++) {
            var sub_array = args[0][i];
            if (sub_array.length === 2) {
                dict[sub_array[0]] = sub_array[1];
            }
        }
        return dict;
    }
};
batavia.builtins.dict.__doc__ = "dict() -> new empty dictionary\ndict(mapping) -> new dictionary initialized from a mapping object's\n    (key, value) pairs\ndict(iterable) -> new dictionary initialized as if via:\n    d = {}\n    for k, v in iterable:\n        d[k] = v\ndict(**kwargs) -> new dictionary initialized with the name=value pairs\n    in the keyword argument list.  For example:  dict(one=1, two=2)";

batavia.builtins.dir = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("dir() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError('dir() expected exactly 1 argument (' + args.length + ' given)');
    }
    return Object.keys(args[0]);
};
batavia.builtins.dir.__doc__ = "dir([object]) -> list of strings\n\nIf called without an argument, return the names in the current scope.\nElse, return an alphabetized list of names comprising (some of) the attributes\nof the given object, and of attributes reachable from it.\nIf the object supplies a method named __dir__, it will be used; otherwise\nthe default dir() logic is used and returns:\n  for a module object: the module's attributes.\n  for a class object:  its attributes, and recursively the attributes\n    of its bases.\n  for any other object: its attributes, its class's attributes, and\n    recursively the attributes of its class's base classes.";

batavia.builtins.divmod = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("divmod() doesn't accept keyword arguments");
    }
    if (!args || args.length != 2) {
        throw new batavia.builtins.TypeError('divmod() expected exactly 2 argument (' + args.length + ' given)');
    }

    div = Math.floor(args[0]/args[1]);
    rem = args[0] % args[1];
    return new batavia.core.Tuple([div, rem]);
};
batavia.builtins.divmod.__doc__ = 'Return the tuple ((x-x%y)/y, x%y).  Invariant: div*y + mod == x.';

batavia.builtins.enumerate = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("enumerate() doesn't accept keyword arguments");
    }
    var result = [];
    var values = args[0];
    for (i = 0; i < values.length; i++) {
        result.push([i, values[i]]);
    }
    // FIXME this should return a generator, not list
    return result;
};
batavia.builtins.enumerate.__doc__ = 'enumerate(iterable[, start]) -> iterator for index, value of iterable\n\nReturn an enumerate object.  iterable must be another object that supports\niteration.  The enumerate object yields pairs containing a count (from\nstart, which defaults to zero) and a value yielded by the iterable argument.\nenumerate is useful for obtaining an indexed list:\n    (0, seq[0]), (1, seq[1]), (2, seq[2]), ...';

batavia.builtins.eval = function(args, kwargs) {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'eval' not implemented");
};

batavia.builtins.exit = function(args, kwargs) {
    // TODO maybe throw bad errors on exit args code != 0?
    // NOTE You can't actually exit a JavaScript session, so...
    console.log("Goodbye");
};

batavia.builtins.file = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'file' not implemented");
};

batavia.builtins.filter = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'filter' not implemented");
};

batavia.builtins.float = function(args) {
    if (args.length > 1) {
        throw new batavia.builtins.TypeError("float() takes at most 1 argument (" + args.length + " given)");
    }
    if (args.length === 0) {
        return 0.0;
    }

    var toConvert = args[0];

    if (typeof(toConvert) === "string") {
        if (toConvert.search(/[^0-9.]/g) === -1) {
            return parseFloat(toConvert);
        } else {
            if (toConvert === "nan" || toConvert === "+nan" || toConvert === "-nan") {
                return NaN;
            } else if(toConvert === "inf" || toConvert === "+inf") {
                return Infinity;
            } else if(toConvert === "-inf") {
                return -Infinity;
            }
            throw new batavia.builtins.ValueError("could not convert string to float: '" + args[0] + "'");
        }
    } else if(typeof(args[0]) === "number") {
        return args[0].toFixed(1);
    }
};

batavia.builtins.float.__doc__ = 'float([x]) -> Convert a string or a number to floating point.';

batavia.builtins.format = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'format' not implemented");
};

batavia.builtins.frozenset = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'frozenset' not implemented");
};

batavia.builtins.getattr = function(args) {
    if (args) {
        var attr = args[0][args[1]];
        if (attr !== undefined) {
            return attr;
        } else {
            if (args.length === 3) {
                return args[2];
            } else if (args.length === 2) {
                throw new batavia.builtins.AttributeError("'" + args[0] + "' object has no attribute '" + args[1] + "'");
            } else if (args.length < 2) {
                throw new batavia.builtins.TypeError("getattr expected at least 2 arguments, got " + args.length);
            } else {
                throw new batavia.builtins.TypeError("getattr expected at most 3 arguments, got " + args.length);
            }
        }
    } else {
        throw new batavia.builtins.TypeError("getattr expected at least 2 arguments, got 0");
    }
};

batavia.builtins.globals = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'globals' not implemented");
};

batavia.builtins.hasattr = function(args) {
    if (args) {
        try {
            if (batavia.builtins.getattr(args)) {
                return true;
            }
        } catch (err) {
            if (err instanceof batavia.builtins.AttributeError) {
                return false;
            }
            if (err instanceof batavia.builtins.TypeError) {
                throw new batavia.builtins.TypeError("hasattr expected 2 arguments, got " + args.length);
            }
        }
    } else {
        throw new batavia.builtins.TypeError("hasattr expected 2 arguments, got 0");
    }
};

batavia.builtins.hash = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'hash' not implemented");
};

batavia.builtins.help = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'help' not implemented");
};

batavia.builtins.hex = function(args) {
    if (args.length !== 1) {
        throw new batavia.builtins.TypeError("hex() takes exactly one argument (" + args.length + " given)");
    }
    return "0x" + args[0].toString(16);
};

batavia.builtins.id = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'id' not implemented");
};

batavia.builtins.input = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'input' not implemented");
};

batavia.builtins.int = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("int() doesn't accept keyword arguments");
    }

    var base = 10;
    var value = 0;
    if (args && args.length === 1) {
        value = args[0];
    } else if (args && args.length === 2) {
        value = args[0];
        base = args[1];
    } else {
        throw new batavia.builtins.TypeError(
            "int() takes at most 2 arguments (" + args.length + " given)");
    }

    var result = parseInt(value, base);
    if (isNaN(result)) {
        throw new batavia.builtins.ValueError("invalid literal for int() with base 10: " + batavia.builtins.repr([value], null));
    }
    return result;
};
batavia.builtins.int.__doc__ = "int(x=0) -> integer\nint(x, base=10) -> integer\n\nConvert a number or string to an integer, or return 0 if no arguments\nare given.  If x is a number, return x.__int__().  For floating point\nnumbers, this truncates towards zero.\n\nIf x is not a number or if base is given, then x must be a string,\nbytes, or bytearray instance representing an integer literal in the\ngiven base.  The literal can be preceded by '+' or '-' and be surrounded\nby whitespace.  The base defaults to 10.  Valid bases are 0 and 2-36.\nBase 0 means to interpret the base from the string as an integer literal.\n>>> int('0b100', base=0)\n4";

batavia.builtins.intern = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'intern' not implemented");
};

batavia.builtins.isinstance = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'isinstance' not implemented");
};

batavia.builtins.issubclass = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'issubclass' not implemented");
};

batavia.builtins.iter = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("len() doesn't accept keyword arguments");
    }
    if (!args || args.length === 0) {
        throw new batavia.builtins.TypeError("len() expected at least 1 arguments, got 0");
    }
    if (args.length == 2) {
        throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'iter' with callable/sentinet not implemented");
    }
    if (args.length > 2) {
        throw new batavia.builtins.TypeError("len() expected at most 2 arguments, got 3");
    }

    if (args[0].__iter__) {
        return args[0].__iter__();
    } else if (args[0] instanceof Array) {
        return new batavia.core.list_iterator(args[0]);
    } else if (args[0] instanceof String || typeof args[0] === "string") {
        return new batavia.core.str_iterator(args[0]);
    } else {
        throw new batavia.builtins.TypeError("'" + (typeof args[0]) + "' object is not iterable");
    }
};
batavia.builtins.iter.__doc__ = 'iter(iterable) -> iterator\niter(callable, sentinel) -> iterator\n\nGet an iterator from an object.  In the first form, the argument must\nsupply its own iterator, or be a sequence.\nIn the second form, the callable is called until it returns the sentinel.';

batavia.builtins.len = function(args, kwargs) {
    if (!args || args.length !== 1 || args[0] === undefined) {
        throw new batavia.builtins.TypeError("len() takes exactly one argument (0 given)");
    }

    //if (args[0].hasOwnProperty("__len__")) {
        //TODO: Fix context of python functions calling with proper vm
        //throw new batavia.builtins.NotImplementedError('Builtin Batavia len function is not supporting __len__ implemented.');
        //return args[0].__len__.apply(vm);
    //}

    return args[0].length;
};
batavia.builtins.len.__doc__ = 'len(object)\n\nReturn the number of items of a sequence or collection.';

batavia.builtins.license = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'license' not implemented");
};

batavia.builtins.list = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'list' not implemented");
};

batavia.builtins.locals = function() {
    return this.frame.f_locals;
};

batavia.builtins.long = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'long' not implemented");
};

batavia.builtins.map = function(args, kwargs) {
    // FIXME
    args[0].call(this, [args[1]], {});
};

batavia.builtins.max = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("max() doesn't accept keyword arguments");
    }
    if (!args || args.length === 0) {
        throw new batavia.builtins.TypeError('max() expected at least 1 argument, got ' + args.length);
    }

    return Math.max.apply(null, args[0]);
};
batavia.builtins.max.__doc__ = "max(iterable, *[, default=obj, key=func]) -> value\nmax(arg1, arg2, *args, *[, key=func]) -> value\n\nWith a single iterable argument, return its biggest item. The\ndefault keyword-only argument specifies an object to return if\nthe provided iterable is empty.\nWith two or more arguments, return the largest argument.";

batavia.builtins.memoryview = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'memoryview' not implemented");
};

batavia.builtins.min = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("min() doesn't accept keyword arguments");
    }
    if (!args || args.length === 0) {
        throw new batavia.builtins.TypeError('min() expected at least 1 argument, got ' + args.length);
    }

    return Math.min.apply(null, args[0]);
};
batavia.builtins.min.__doc__ = "min(iterable, *[, default=obj, key=func]) -> value\nmin(arg1, arg2, *args, *[, key=func]) -> value\n\nWith a single iterable argument, return its smallest item. The\ndefault keyword-only argument specifies an object to return if\nthe provided iterable is empty.\nWith two or more arguments, return the smallest argument.";

batavia.builtins.next = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'next' not implemented");
};

batavia.builtins.object = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'object' not implemented");
};

batavia.builtins.oct = function(args) {
    if (args.length !== 1)
        throw new batavia.builtins.TypeError("oct() takes exactly one argument (" + args.length + " given)");
return "0o"+args[0].toString(8);
};

batavia.builtins.open = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'open' not implemented");
};

batavia.builtins.ord = function(args, kwargs) {
    return args[0].charCodeAt(0);
};

batavia.builtins.pow = function(args) {
    var x, y, z;
    if (args.length === 2) {
        x = args[0];
        y = args[1];
        return Math.pow(x, y);
    } else if (args.length === 3) {
        x = args[0];
        y = args[1];
        z = args[2];
        return Math.pow(x, y) % z;
    } else {
        throw new batavia.builtins.TypeError("pow() takes two or three arguments (" + args.length + " given)");
    }
};

batavia.builtins.print = function(args, kwargs) {
    var elements = [], print_value;
    args.map(function(elm) {
        if (elm === null) {
            elements.push("None");
        } else {
            elements.push(elm.__str__ ? elm.__str__() : elm.toString());
        }
    });
    batavia.stdout(elements.join(' ') + "\n");
};

batavia.builtins.property = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'property' not implemented");
};

batavia.builtins.quit = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'quit' not implemented");
};

batavia.builtins.range = function(args, kwargs){
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("range() doesn't accept keyword arguments");
    }
    if (!args || args.length === 0) {
        throw new batavia.builtins.TypeError('range() expected 1 arguments, got ' + args.length);
    }
    if (args.length > 3) {
     throw new batavia.builtins.TypeError('range() expected at most 3 arguments, got ' + args.length);
    }

    return new batavia.core.range(args[0], args[1], args[2]);
};
batavia.builtins.range.__doc__ = 'range(stop) -> range object\nrange(start, stop[, step]) -> range object\n\nReturn a virtual sequence of numbers from start to stop by step.';

batavia.builtins.raw_input = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'raw_input' not implemented");
};

batavia.builtins.reduce = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'reduce' not implemented");
};

batavia.builtins.reload = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'reload' not implemented");
};

batavia.builtins.repr = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("repr() doesn't accept keyword arguments");
    }
    if (!args || args.length !== 1) {
        throw new batavia.builtins.TypeError('repr() takes exactly 1 argument (' + args.length + ' given)');
    }

    if (args[0]['__repr__']) {
        return args[0].__repr__();
    } else {
        return args[0].toString();
    }
};
batavia.builtins.repr.__doc__ = 'repr(object) -> string\n\nReturn the canonical string representation of the object.\nFor most object types, eval(repr(object)) == object.';

batavia.builtins.reversed = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'reversed' not implemented");
};

batavia.builtins.round = function(args) {
    var p = 0; // Precision
    if (args.length == 2) {
        p = args[1];
    }
    var base = Math.pow(10, p);
    return Math.round(args[0] * base) / base;
};

batavia.builtins.set = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'set' not implemented");
};

batavia.builtins.setattr = function(args) {
    if (args.length !== 3) {
        throw new batavia.builtins.TypeError("setattr expected exactly 3 arguments, got " + args.length);
    }

    args[0][args[1]] = args[2];
};

batavia.builtins.slice = function(args, kwargs) {
    if (args.length == 1) {
        return {
            start: 0,
            stop: args[0],
            step: 1
        };
    } else {
        return {
            start: args[0],
            stop: args[1],
            step: args[2] || 1
        };
    }
};

batavia.builtins.sorted = function(args, kwargs) {
    var validatedInput = batavia.builtins.sorted._validateInput(args, kwargs);
    var iterable = validatedInput["iterable"];

    if (iterable instanceof Array) {
        iterable = iterable.map(validatedInput["preparingFunction"]);
        iterable.sort(function (a, b) {
            if (a["key"] > b["key"]) {
                return validatedInput["bigger"];
            }

            if (a["key"] < b["key"]) {
                return validatedInput["smaller"];
            }
            return 0;
        });

        return new batavia.core.List(iterable.map(function (element) {
            return element["value"];
        }));
    }

    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'sorted' not implemented for objects");
};

batavia.builtins.sorted._validateInput = function (args, kwargs, undefined) {
    var bigger = 1;
    var smaller = -1;
    var preparingFunction = function (value) {
        return {
            "key": value,
            "value": value
        };
    };


    if (kwargs !== undefined) {
        if (kwargs['iterable'] !== undefined) {
            throw new batavia.builtins.TypeError("'iterable' is an invalid keyword argument for this function");
        }

        if (kwargs["reverse"] !== undefined && kwargs["reverse"] === true) {
            bigger = -1;
            smaller = 1;
        }


        if (kwargs["key"] !== undefined) {
            //TODO: Fix context of python functions calling with proper vm
            throw new batavia.builtins.NotImplementedError('Builtin Batavia sorted function "key" function is not implemented.');
            //preparingFunction = function (value) {
            //    return {
            //        "key": kwargs["key"].__call__.apply(kwargs["key"]._vm, [value], null),
            //        "value": value
            //    };
            //}
        }
    }

    if (args === undefined || args.length === 0) {
        throw new batavia.builtins.TypeError("Required argument 'iterable' (pos 1) not found");
    }

    return {
        iterable: args[0],
        bigger: bigger,
        smaller: smaller,
        preparingFunction: preparingFunction
    };
};

batavia.builtins.staticmethod = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'staticmethod' not implemented");
};

batavia.builtins.str = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("str() doesn't accept keyword arguments");
    }
    if (!args || args.length !== 1) {
        throw new batavia.builtins.TypeError('str() takes exactly 1 argument (' + args.length + ' given)');
    }

    if (args[0]['__str__']) {
        return args[0].__str__();
    } else {
        return args[0].toString();
    }
};
batavia.builtins.str.__doc__ = 'str(object) -> string\n\nReturn the canonical string representation of the object.\nFor most object types, eval(repr(object)) == object.';

batavia.builtins.sum = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("sum() doesn't accept keyword arguments");
    }
    if (!args || args.length === 0) {
        throw new batavia.builtins.TypeError('sum() expected at least 1 argument, got ' + args.length);
    }
    if (args.length > 2) {
        throw new batavia.builtins.TypeError('sum() expected at most 2 argument, got ' + args.length);
    }

    var total = 0;
    try {
        total = args[0].reduce(function(a, b) {
            return a + b;
        });
    } catch (err) {
        throw new batavia.builtins.TypeError(
                "bad operand type for sum(): 'NoneType'");
    }

    return total;
};

batavia.builtins.super = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'super' not implemented");
};

batavia.builtins.tuple = function(args) {
    return new batavia.core.Tuple(args[0]);
};

batavia.builtins.type = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'type' not implemented");
};

batavia.builtins.unichr = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'unichr' not implemented");
};

batavia.builtins.unicode = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'unicode' not implemented");
};

batavia.builtins.vars = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'vars' not implemented");
};

batavia.builtins.zip = function(args, undefined) {
    if (args === undefined) {
        return [];
    }

    var minLen = Math.min.apply(null, args.map(function (element) {
        return element.length;
    }));


    if (minLen === 0) {
        return [];
    }

    var result = [];
    for(var i = 0; i < minLen; i++) {
        var sequence = [];
        for(var iterableObj = 0; iterableObj < args.length; iterableObj++) {
            sequence.push(args[iterableObj][i]);
        }

        result.push(new batavia.core.Tuple(sequence));
    }

    return result;
};

// Mark all builtins as Python methods.
for (var fn in batavia.builtins) {
    batavia.builtins[fn].__python__ = true;
}
/*
 * A fake cell for closures.
 *
 * Closures keep names in scope by storing them not in a frame, but in a
 * separate object called a cell.  Frames share references to cells, and
 * the LOAD_DEREF and STORE_DEREF opcodes get and set the value from cells.
 *
 * This class acts as a cell, though it has to jump through two hoops to make
 * the simulation complete:
 *
 *     1. In order to create actual FunctionType functions, we have to have
 *        actual cell objects, which are difficult to make. See the twisty
 *        double-lambda in __init__.
 *
 *     2. Actual cell objects can't be modified, so to implement STORE_DEREF,
 *        we store a one-element list in our cell, and then use [0] as the
 *        actual value.
 */

batavia.core.Cell = function(value) {
    this.contents = value;
};

batavia.core.Cell.prototype.get = function() {
    return this.contents;
};

batavia.core.Cell.prototype.set = function(value) {
    this.contents = value;
};

batavia.core.Code = function(kwargs) {
    this.co_argcount = kwargs.argcount || 0;
    this.co_kwonlyargcount = kwargs.kwonlyargcount || 0;
    this.co_nlocals = kwargs.nlocals || 0;
    this.co_stacksize = kwargs.stacksize || 0;
    this.co_flags = kwargs.flags || 0;
    this.co_code = kwargs.code;
    this.co_consts = kwargs.consts || [];
    this.co_names = kwargs.names || [];
    this.co_varnames = kwargs.varnames || [];
    this.co_freevars = kwargs.freevars || 0;
    this.co_cellvars = kwargs.cellvars || [];
    // co_cell2arg
    this.co_filename = kwargs.filename || '<string>';
    this.co_name = kwargs.name || '<module>';
    this.co_firstlineno = kwargs.firstlineno || 1;
    this.co_lnotab = kwargs.lnotab || '';
    // co_zombieframe
    // co_weakreflist
};

BaseException = function(name, msg) {
    this.name = name;
    this.msg = msg;
};
batavia.builtins.BaseException = BaseException;
batavia.builtins.BaseException.prototype.toString = function() {
    if (this.msg) {
        return this.name + ": " + this.msg;
    } else {
        return this.name;
    }
};

function BataviaError(msg) {
    batavia.builtins.BaseException.call(this, 'BataviaError', msg);
}
batavia.builtins.BataviaError = BataviaError;
batavia.builtins.BataviaError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.BataviaError.prototype.constructor = BataviaError;

function ArithmeticError(msg) {
    batavia.builtins.BaseException.call(this, 'ArithmeticError', msg);
}
batavia.builtins.ArithmeticError = ArithmeticError;
batavia.builtins.ArithmeticError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.ArithmeticError.prototype.constructor = ArithmeticError;

function AssertionError(msg) {
    batavia.builtins.BaseException.call(this, 'AssertionError', msg);
}
batavia.builtins.AssertionError = AssertionError;
batavia.builtins.AssertionError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.AssertionError.prototype.constructor = AssertionError;

function AttributeError(msg) {
    batavia.builtins.BaseException.call(this, 'AttributeError', msg);
}
batavia.builtins.AttributeError = AttributeError;
batavia.builtins.AttributeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.AttributeError.prototype.constructor = AttributeError;

function BufferError(msg) {
    batavia.builtins.BaseException.call(this, 'BufferError', msg);
}
batavia.builtins.BufferError = BufferError;
batavia.builtins.BufferError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.BufferError.prototype.constructor = BufferError;

batavia.builtins.BytesWarning = undefined;

batavia.builtins.DeprecationWarning = undefined;

function EOFError(msg) {
    batavia.builtins.BaseException.call(this, 'EOFError', msg);
}
batavia.builtins.EOFError = EOFError;
batavia.builtins.EOFError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.EOFError.prototype.constructor = EOFError;

batavia.builtins.Ellipsis = undefined;

function EnvironmentError(msg) {
    batavia.builtins.BaseException.call(this, 'EnvironmentError', msg);
}
batavia.builtins.EnvironmentError = EnvironmentError;
batavia.builtins.EnvironmentError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.EnvironmentError.prototype.constructor = EnvironmentError;

function Exception(msg) {
    batavia.builtins.BaseException.call(this, 'Exception', msg);
}
batavia.builtins.Exception = Exception;
batavia.builtins.Exception.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.Exception.prototype.constructor = Exception;

function FloatingPointError(msg) {
    batavia.builtins.BaseException.call(this, 'FloatingPointError', msg);
}
batavia.builtins.FloatingPointError = FloatingPointError;
batavia.builtins.FloatingPointError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.FloatingPointError.prototype.constructor = FloatingPointError;

batavia.builtins.FutureWarning = undefined;

function GeneratorExit(msg) {
    batavia.builtins.BaseException.call(this, 'GeneratorExit', msg);
}
batavia.builtins.GeneratorExit = GeneratorExit;
batavia.builtins.GeneratorExit.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.GeneratorExit.prototype.constructor = GeneratorExit;

function IOError(msg) {
    batavia.builtins.BaseException.call(this, 'IOError', msg);
}
batavia.builtins.IOError = IOError;
batavia.builtins.IOError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.IOError.prototype.constructor = IOError;

function ImportError(msg) {
    batavia.builtins.BaseException.call(this, 'ImportError', msg);
}
batavia.builtins.ImportError = ImportError;
batavia.builtins.ImportError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.ImportError.prototype.constructor = ImportError;

batavia.builtins.ImportWarning = undefined;

function IndentationError(msg) {
    batavia.builtins.BaseException.call(this, 'IndentationError', msg);
}
batavia.builtins.IndentationError = IndentationError;
batavia.builtins.IndentationError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.IndentationError.prototype.constructor = IndentationError;

function IndexError(msg) {
    batavia.builtins.BaseException.call(this, 'IndexError', msg);
}
batavia.builtins.IndexError = IndexError;
batavia.builtins.IndexError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.IndexError.prototype.constructor = IndexError;

function KeyError(key) {
    var msg;
    if (key === null) {
        msg = "None";
    } else if (key['__repr__'] && !key.hasOwnProperty('__repr__')) {
        msg = key.__repr__();
    } else {
        msg = key.toString();
    }
    batavia.builtins.BaseException.call(this, 'KeyError', msg);
}
batavia.builtins.KeyError = KeyError;
batavia.builtins.KeyError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.KeyError.prototype.constructor = KeyError;

function KeyboardInterrupt(msg) {
    batavia.builtins.BaseException.call(this, 'KeyboardInterrupt', msg);
}
batavia.builtins.KeyboardInterrupt = KeyboardInterrupt;
batavia.builtins.KeyboardInterrupt.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.KeyboardInterrupt.prototype.constructor = KeyboardInterrupt;

function LookupError(msg) {
    batavia.builtins.BaseException.call(this, 'LookupError', msg);
}
batavia.builtins.LookupError = LookupError;
batavia.builtins.LookupError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.LookupError.prototype.constructor = LookupError;

function MemoryError(msg) {
    batavia.builtins.BaseException.call(this, 'MemoryError', msg);
}
batavia.builtins.MemoryError = MemoryError;
batavia.builtins.MemoryError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.MemoryError.prototype.constructor = MemoryError;

function NameError(msg) {
    batavia.builtins.BaseException.call(this, 'NameError', msg);
}
batavia.builtins.NameError = NameError;
batavia.builtins.NameError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.NameError.prototype.constructor = NameError;

function NotImplemented(msg) {
    batavia.builtins.BaseException.call(this, 'NotImplemented', msg);
}
batavia.builtins.NotImplemented = NotImplemented;
batavia.builtins.NotImplemented.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.NotImplemented.prototype.constructor = NotImplemented;

function NotImplementedError(msg) {
    batavia.builtins.BaseException.call(this, 'NotImplementedError', msg);
}
batavia.builtins.NotImplementedError = NotImplementedError;
batavia.builtins.NotImplementedError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.NotImplementedError.prototype.constructor = NotImplementedError;

function OSError(msg) {
    batavia.builtins.BaseException.call(this, 'OSError', msg);
}
batavia.builtins.OSError = OSError;
batavia.builtins.OSError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.OSError.prototype.constructor = OSError;

function OverflowError(msg) {
    batavia.builtins.BaseException.call(this, 'OverflowError', msg);
}
batavia.builtins.OverflowError = OverflowError;
batavia.builtins.OverflowError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.OverflowError.prototype.constructor = OverflowError;

batavia.builtins.PendingDeprecationWarning = undefined;

function ReferenceError(msg) {
    batavia.builtins.BaseException.call(this, 'ReferenceError', msg);
}
batavia.builtins.ReferenceError = ReferenceError;
batavia.builtins.ReferenceError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.ReferenceError.prototype.constructor = ReferenceError;

function RuntimeError(msg) {
    batavia.builtins.BaseException.call(this, 'RuntimeError', msg);
}
batavia.builtins.RuntimeError = RuntimeError;
batavia.builtins.RuntimeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.RuntimeError.prototype.constructor = RuntimeError;

batavia.builtins.RuntimeWarning = undefined;

function StandardError(msg) {
    batavia.builtins.BaseException.call(this, 'StandardError', msg);
}
batavia.builtins.StandardError = StandardError;
batavia.builtins.StandardError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.StandardError.prototype.constructor = StandardError;

function StopIteration(msg) {
    batavia.builtins.BaseException.call(this, 'StopIteration', msg);
}
batavia.builtins.StopIteration = StopIteration;
batavia.builtins.StopIteration.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.StopIteration.prototype.constructor = StopIteration;

function SyntaxError(msg) {
    batavia.builtins.BaseException.call(this, 'SyntaxError', msg);
}
batavia.builtins.SyntaxError = SyntaxError;
batavia.builtins.SyntaxError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.SyntaxError.prototype.constructor = SyntaxError;

batavia.builtins.SyntaxWarning = undefined;

function SystemError(msg) {
    batavia.builtins.BaseException.call(this, 'SystemError', msg);
}
batavia.builtins.SystemError = SystemError;
batavia.builtins.SystemError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.SystemError.prototype.constructor = SystemError;

function SystemExit(msg) {
    batavia.builtins.BaseException.call(this, 'SystemExit', msg);
}
batavia.builtins.SystemExit = SystemExit;
batavia.builtins.SystemExit.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.SystemExit.prototype.constructor = SystemExit;

function TabError(msg) {
    batavia.builtins.BaseException.call(this, 'TabError', msg);
}
batavia.builtins.TabError = TabError;
batavia.builtins.TabError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.TabError.prototype.constructor = TabError;

function TypeError(msg) {
    batavia.builtins.BaseException.call(this, 'TypeError', msg);
}
batavia.builtins.TypeError = TypeError;
batavia.builtins.TypeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.TypeError.prototype.constructor = TypeError;

function UnboundLocalError(msg) {
    batavia.builtins.BaseException.call(this, 'UnboundLocalError', msg);
}
batavia.builtins.UnboundLocalError = UnboundLocalError;
batavia.builtins.UnboundLocalError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.UnboundLocalError.prototype.constructor = UnboundLocalError;

function UnicodeDecodeError(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeDecodeError', msg);
}
batavia.builtins.UnicodeDecodeError = UnicodeDecodeError;
batavia.builtins.UnicodeDecodeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.UnicodeDecodeError.prototype.constructor = UnicodeDecodeError;

function UnicodeEncodeError(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeEncodeError', msg);
}
batavia.builtins.UnicodeEncodeError = UnicodeEncodeError;
batavia.builtins.UnicodeEncodeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.UnicodeEncodeError.prototype.constructor = UnicodeEncodeError;

function UnicodeError(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeError', msg);
}
batavia.builtins.UnicodeError = UnicodeError;
batavia.builtins.UnicodeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.UnicodeError.prototype.constructor = UnicodeError;

function UnicodeTranslateError(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeTranslateError', msg);
}
batavia.builtins.UnicodeTranslateError = UnicodeTranslateError;
batavia.builtins.UnicodeTranslateError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.UnicodeTranslateError.prototype.constructor = UnicodeTranslateError;

batavia.builtins.UnicodeWarning = undefined;

batavia.builtins.UserWarning = undefined;

function ValueError(msg) {
    batavia.builtins.BaseException.call(this, 'ValueError', msg);
}
batavia.builtins.ValueError = ValueError;
batavia.builtins.ValueError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.ValueError.prototype.constructor = ValueError;

batavia.builtins.Warning = undefined;

function ZeroDivisionError(msg) {
    batavia.builtins.BaseException.call(this, 'ZeroDivisionError', msg);
}
batavia.builtins.ZeroDivisionError = ZeroDivisionError;
batavia.builtins.ZeroDivisionError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.ZeroDivisionError.prototype.constructor = ZeroDivisionError;


batavia.core.Frame = function(kwargs) {
    var v, i;

    this.f_code = kwargs.f_code;
    this.f_globals = kwargs.f_globals;
    this.f_locals = kwargs.f_locals;
    this.f_back = kwargs.f_back;
    this.stack = [];

    if (this.f_back) {
        this.f_builtins = this.f_back.f_builtins;
    } else {
        this.f_builtins = this.f_locals['__builtins__'];
        if (this.f_builtins.hasOwnProperty('__dict__')) {
            this.f_builtins = this.f_builtins.__dict__;
        }
    }

    this.f_lineno = this.f_code.co_firstlineno;
    this.f_lasti = 0;

    if (this.f_code.co_cellvars.length > 0) {
        this.cells = {};
        if (this.f_back && !this.f_back.cells) {
            this.f_back.cells = {};
        }
        for (i = 0; i < this.f_code.co_cellvars.length; i++) {
            // Make a cell for the variable in our locals, or null.
            v = this.f_code.co_cellvars[i];
            this.cells[v] = new batavia.core.Cell(this.f_locals[v]);
            if (this.f_back) {
                this.f_back.cells[v] = this.cells[v];
            }
        }
    } else {
        this.cells = null;
    }

    if (this.f_code.co_freevars.length > 0) {
        if (!this.cells) {
            this.cells = {};
        }
        for (i = 0; i < this.f_code.co_freevars.length; i++) {
            v = this.f_code.co_freevars[i];
            assert(this.cells !== null);
            assert(this.f_back.cells, "f_back.cells: " + this.f_back.cells);
            this.cells[v] = this.f_back.cells[v];
        }
    }
    this.block_stack = [];
    this.generator = null;

};

batavia.core.Frame.prototype.__repr__ = function() {
    return '<Frame at 0x' + id(self) + ': ' + this.f_code.co_filename +' @ ' + this.f_lineno + '>';
};

batavia.core.Frame.prototype.line_number = function() {
    // Get the current line number the frame is executing.
    // We don't keep f_lineno up to date, so calculate it based on the
    // instruction address and the line number table.
    var lnotab = this.f_code.co_lnotab;
    var byte_increments = []; //six.iterbytes(lnotab[0::2]);
    var line_increments = []; //six.iterbytes(lnotab[1::2]);

    byte_num = 0;
    line_num = this.f_code.co_firstlineno;

    for (var incr in byte_increments) {
        var byte_incr = byte_increments[incr];
        var line_incr = line_increments[incr];

        byte_num += byte_incr;
        if (byte_num > this.f_lasti) {
            break;
        }
        line_num += line_incr;
    }

    return line_num;
};
batavia.core.Function = function(name, code, globals, defaults, closure, vm) {
    this.__python__ = true;
    this._vm = vm;
    this.__code__ = code;
    this.__globals__ = globals;
    this.__defaults__ = defaults;
    this.__kwdefaults__ = null;
    this.__closure__ = closure;
    if (code.co_consts.length > 0) {
        this.__doc__ = code.co_consts[0];
    } else {
        this.__doc__ = null;
    }
    this.__name__ = name || code.co_name;
    this.__dict__ = new batavia.core.Dict();
    this.__annotations__ = new batavia.core.Dict();
    this.__qualname__ = this.__name__;

    // var kw = {
    //     'argdefs': this.__defaults__,
    // }
    // if (closure) {
    //     kw['closure'] = tuple(make_cell(0) for _ in closure)
    // }

    this.__call__ = batavia.make_callable(this);

    this.argspec = batavia.modules.inspect.getfullargspec(this);
};


batavia.core.Method = function(instance, func) {
    batavia.core.Function.call(this, func.__name__, func.__code__, func.__globals__, func.__closure__, func._vm);
    this.__self__ = instance;
    this.__func__ = func;
    this.__class__ = instance.__proto__;
};

batavia.core.Method.prototype = Object.create(Function.prototype);


batavia.core.Module = function(name, locals) {
    this.__name__ = name;
    for (var key in locals) {
        if (locals.hasOwnProperty(key)) {
            this[key] = locals[key];
        }
    }
};

/*************************************************************************
 * A C-FILE like object
 *************************************************************************/

batavia.core.PYCFile = function(data) {
    this.magic = data.slice(0, 4);
    this.modtime = data.slice(4, 8);
    this.size = data.slice(8, 12);
    this.data = data.slice(12);

    // this.data = data;
    this.depth = 0;
    this.ptr = 0;
    this.end = this.data.length;
    this.refs = [];
};

batavia.core.PYCFile.EOF = '\x04';

batavia.core.PYCFile.prototype.getc = function() {
    if (this.ptr < this.end) {
        return this.data[this.ptr++].charCodeAt();
    }
    return batavia.core.PYCFile.EOF;
};

batavia.core.PYCFile.prototype.fread = function(n) {
    if (this.ptr + n <= this.end) {
        var retval = this.data.slice(this.ptr, this.ptr + n);
        this.ptr += n;
        return retval;
    }
    return batavia.core.PYCFile.EOF;
};

/*************************************************************************
 * Virtual Machine
 *************************************************************************/

batavia.VirtualMachine = function(loader) {
    // Initialize the bytecode module
    batavia.modules.dis.init();

    if (loader === undefined) {
        this.loader = function(name) {
            return document.getElementById('batavia-' + name).text.replace(/(\r\n|\n|\r)/gm, "").trim();
        };
    } else {
        this.loader = loader;
    }

    // Build a table mapping opcodes to method calls
    this.build_dispatch_table();

    // The call stack of frames.
    this.frames = [];

    // The current frame.
    this.frame = null;
    this.return_value = null;
    this.last_exception = null;
};

batavia.VirtualMachine.Py_Ellipsis = {};

/*
 * Build a table mapping opcodes to a method to be called whenever we encounter that opcode.
 *
 * Each such method will be invoked with apply(this, args).
 */
batavia.VirtualMachine.prototype.build_dispatch_table = function() {
    var vm = this;

    this.dispatch_table = batavia.modules.dis.opname.map(function(opname, opcode) {
        var operator_name, operator;

        if (opcode in batavia.modules.dis.unary_ops) {
            operator_name = opname.slice(6);
            operator = batavia.operators[operator_name];
            return function() {
                var x = this.pop();
                this.push(operator(x));
            };
        } else if (opcode in batavia.modules.dis.binary_ops) {
            operator_name = opname.slice(7);
            operator = batavia.operators[operator_name];
            return function() {
                var items = this.popn(2);
                this.push(operator(items[0], items[1]));
            };
        } else if (opcode in batavia.modules.dis.inplace_ops) {
            operator_name = opname.slice(8);
            operator = batavia.operators[operator_name];
            return function() {
                var items = this.popn(2);
                this.push(operator(items[0], items[1]));
            };
        } else {
            // dispatch
            var bytecode_fn = vm['byte_' + opname];
            if (bytecode_fn) {
                return bytecode_fn;
            } else {
                return function() {
                    throw new batavia.builtins.BataviaError("Unknown opcode " + opcode + " (" + opname + ")");
                };
            }
        }
    });
};

/*
 * The main entry point.
 *
 * Accepts a DOM id for an element containing base64 encoded bytecode.
 */
batavia.VirtualMachine.prototype.run = function(tag, args) {
    try {
        var payload = this.loader(tag);
        var code = batavia.modules.marshal.load_pyc(this, payload);

        // Set up sys.argv
        batavia.modules.sys.argv = new batavia.core.List(['batavia']);
        if (args) {
            batavia.modules.sys.argv.extend(args);
        }

        // Run the code
        return this.run_code({'code': code});

    } catch (e) {
        if (e instanceof batavia.builtins.BataviaError) {
            console.log(e.msg);
        } else {
            throw e;
        }
    }
};

/*
 * An entry point for invoking functions.
 *
 * Accepts a DOM id for an element containing base64 encoded bytecode.
 */
batavia.VirtualMachine.prototype.run_method = function(tag, args, kwargs, f_locals, f_globals) {
    try {
        var payload = this.loader(tag);
        var code = batavia.modules.marshal.load_pyc(this, payload);

        var callargs = new batavia.core.Dict();
        for (var i = 0, l = args.length; i < l; i++) {
            callargs[code.co_varnames[i]] = args[i];
        }
        callargs.update(kwargs);

        // Run the code
        return this.run_code({
            'code': code,
            'callargs': callargs,
            'f_locals': f_locals,
            'f_globals': f_globals
        });

    } catch (e) {
        if (e instanceof batavia.builtins.BataviaError) {
            console.log(e.msg);
        } else {
            throw e;
        }
    }
};

/*
 */
batavia.VirtualMachine.prototype.PyErr_Occurred = function() {
    return this.last_exception !== null;
};

batavia.VirtualMachine.prototype.PyErr_SetString = function(exc, message) {
    var exception = new exc(message);
    this.last_exception = {
        'exc_type': exception.constructor,
        'value': exception,
        'traceback': this.create_traceback()
    };
};

/*
 * Return the value at the top of the stack, with no changes.
 */
batavia.VirtualMachine.prototype.top = function() {
    return this.frame.stack[this.frame.stack.length - 1];
};

/*
 * Pop a value from the stack.
 *
 * Default to the top of the stack, but `i` can be a count from the top
 * instead.
 */
batavia.VirtualMachine.prototype.pop = function(i) {
    if (i === undefined) {
        i = 0;
    }
    return this.frame.stack.splice(this.frame.stack.length - 1 - i, 1)[0];
};

/*
 * Push value onto the value stack.
 */
batavia.VirtualMachine.prototype.push = function(val) {
    this.frame.stack.push(val);
};

/*
 * Pop a number of values from the value stack.
 *
 * A list of `n` values is returned, the deepest value first.
*/
batavia.VirtualMachine.prototype.popn = function(n) {
    if (n) {
        return this.frame.stack.splice(this.frame.stack.length - n, n);
    } else {
        return [];
    }
};

/*
 * Get a value `n` entries down in the stack, without changing the stack.
 */
batavia.VirtualMachine.prototype.peek = function(n) {
    return this.frame.stack[this.frame.stack.length - n];
};

/*
 * Move the bytecode pointer to `jump`, so it will execute next.
 */
batavia.VirtualMachine.prototype.jump = function(jump) {
    this.frame.f_lasti = jump;
};

batavia.VirtualMachine.prototype.push_block = function(type, handler, level) {
    if (level === null) {
        level = this.frame.stack.length;
    }
    this.frame.block_stack.push(new batavia.core.Block(type, handler, level));
};

batavia.VirtualMachine.prototype.pop_block = function() {
    return this.frame.block_stack.pop();
};

batavia.VirtualMachine.prototype.make_frame = function(kwargs) {
    var code = kwargs.code;
    var callargs = kwargs.callargs || {};
    var f_globals = kwargs.f_globals || null;
    var f_locals = kwargs.f_locals || null;

    if (!code.co_unpacked_code) {
        this.unpack_code(code);
    }

    // console.log("make_frame: code=" + code + ", callargs=" + callargs);

    if (f_globals !== null) {
        if (f_locals === null) {
            f_locals = f_globals;
        }
    } else if (this.frames.length > 0) {
        f_globals = this.frame.f_globals;
        f_locals = new batavia.core.Dict();
    } else {
        f_globals = f_locals = new batavia.core.Dict({
            '__builtins__': batavia.builtins,
            '__name__': '__main__',
            '__doc__': null,
            '__package__': null,
        });
    }
    f_locals.update(callargs);

    frame = new batavia.core.Frame({
        'f_code': code,
        'f_globals': f_globals,
        'f_locals': f_locals,
        'f_back': this.frame
    });
    return frame;
};

batavia.VirtualMachine.prototype.push_frame = function(frame) {
    this.frames.push(frame);
    this.frame = frame;
};

batavia.VirtualMachine.prototype.pop_frame = function() {
    this.frames.pop();
    if (this.frames) {
        this.frame = this.frames[this.frames.length - 1];
    } else {
        this.frame = null;
    }
};

batavia.VirtualMachine.prototype.create_traceback = function() {
    var tb = [];
    var frame;

    for (var f in this.frames) {
        frame = this.frames[f];

        // Work out the current source line by taking the
        // f_lineno (the line for the start of the method)
        // and adding the line offsets from the line
        // number table.
        var lnotab = frame.f_code.co_lnotab;
        var byte_num = 0;
        var line_num = frame.f_code.co_firstlineno;

        var byte_incr, line_incr;
        for (var idx = 1; idx < lnotab.length, byte_num < frame.f_lasti; idx += 2) {
            byte_num += lnotab.charCodeAt(idx - 1);
            if (byte_num < frame.f_lasti) {
                line_num += lnotab.charCodeAt(idx);
            }
        }

        tb.push({
            'module': frame.f_code.co_name,
            'filename': frame.f_code.co_filename,
            'line': line_num
        });
    }
    return tb;
};

/*
 * Annotate a Code object with a co_unpacked_code property, consisting of the bytecode
 * unpacked into operations with their respective args
 */
batavia.VirtualMachine.prototype.unpack_code = function(code) {
    var pos = 0;
    var unpacked_code = [];
    var args;

    while (pos < code.co_code.length) {
        var opcode_start_pos = pos;

        var opcode = code.co_code[pos++];

        if (opcode < batavia.modules.dis.HAVE_ARGUMENT) {
            args = [];
        } else {
            var lo = code.co_code[pos++];
            var hi = code.co_code[pos++];
            var intArg = lo + (hi << 8);

            if (opcode in batavia.modules.dis.hasconst) {
                args = [code.co_consts[intArg]];
            } else if (opcode in batavia.modules.dis.hasfree) {
                if (intArg < code.co_cellvars.length) {
                    args = [code.co_cellvars[intArg]];
                } else {
                    var_idx = intArg - code.co_cellvars.length;
                    args = [code.co_freevars[var_idx]];
                }
            } else if (opcode in batavia.modules.dis.hasname) {
                args = [code.co_names[intArg]];
            } else if (opcode in batavia.modules.dis.hasjrel) {
                args = [pos + intArg];
            } else if (opcode in batavia.modules.dis.hasjabs) {
                args = [intArg];
            } else if (opcode in batavia.modules.dis.haslocal) {
                args = [code.co_varnames[intArg]];
            } else {
                args = [intArg];
            }
        }

        unpacked_code[opcode_start_pos] = {
            'opoffset': opcode_start_pos,
            'opcode': opcode,
            'op_method': this.dispatch_table[opcode],
            'args': args,
            'next_pos': pos
        };
    }

    code.co_unpacked_code = unpacked_code;
};

batavia.VirtualMachine.prototype.run_code = function(kwargs) {
    var code = kwargs.code;
    var f_globals = kwargs.f_globals || null;
    var f_locals = kwargs.f_locals || null;
    var callargs = kwargs.callargs || null;
    var frame = this.make_frame({
        'code': code,
        'f_globals': f_globals,
        'f_locals': f_locals,
        'callargs': callargs
    });
    try {
        var val = this.run_frame(frame);

        // Check some invariants
        if (this.frames.length > 0) {
            throw new batavia.builtins.BataviaError("Frames left over!");
        }
        if (this.frame && this.frame.stack.length > 0) {
            throw new batavia.builtins.BataviaError("Data left on stack! " + this.frame.stack);
        }
        return val;
    } catch (e) {
        if (this.last_exception) {
            trace = ['Traceback (most recent call last):'];
            var frame;
            for (var t in this.last_exception.traceback) {
                frame = this.last_exception.traceback[t];
                trace.push('  File "' + frame.filename + '", line ' + frame.line + ', in ' + frame.module);
            }
            trace.push(this.last_exception.value.toString());
            console.log(trace.join('\n'));
            this.last_exception = null;
        } else {
            throw e;
        }
    }
};

batavia.VirtualMachine.prototype.unwind_block = function(block) {
    if (block.type === 'except-handler') {
        offset = 3;
    } else {
        offset = 0;
    }

    while (this.frame.stack.length > block.level + offset) {
        this.pop();
    }

    if (block.type === 'except-handler') {
        exc = this.popn(3);
        this.last_exception = {
            'exc_type': exc[2],
            'value': exc[1],
            'traceback': exc[0]
        };
    }
};

/*
 * Parse 1 - 3 bytes of bytecode into
 * an instruction and optionally arguments.
 */
batavia.VirtualMachine.prototype.parse_byte_and_args = function() {
    var operation = {
        'opoffset': this.frame.f_lasti,
        'opcode': this.frame.f_code.co_code[this.frame.f_lasti],
        'args': []
    };
    var dis = batavia.modules.dis;
    this.frame.f_lasti += 1;
    if (operation.opcode >= dis.HAVE_ARGUMENT) {
        var arg = this.frame.f_code.co_code.slice(this.frame.f_lasti, this.frame.f_lasti + 2);
        this.frame.f_lasti += 2;
        var intArg = arg[0] + (arg[1] << 8);
        if (operation.opcode in dis.hasconst) {
            operation.args = [this.frame.f_code.co_consts[intArg]];
        } else if (operation.opcode in dis.hasfree) {
            if (intArg < this.frame.f_code.co_cellvars.length) {
                operation.args = [this.frame.f_code.co_cellvars[intArg]];
            } else {
                var_idx = intArg - this.frame.f_code.co_cellvars.length;
                operation.args = [this.frame.f_code.co_freevars[var_idx]];
            }
        } else if (operation.opcode in dis.hasname) {
            operation.args = [this.frame.f_code.co_names[intArg]];
        } else if (operation.opcode in dis.hasjrel) {
            operation.args = [this.frame.f_lasti + intArg];
        } else if (operation.opcode in dis.hasjabs) {
            operation.args = [intArg];
        } else if (operation.opcode in dis.haslocal) {
            operation.args = [this.frame.f_code.co_varnames[intArg]];
        } else {
            operation.args = [intArg];
        }
    }

    return operation;
};

/*
 * Log arguments, block stack, and data stack for each opcode.
 */
batavia.VirtualMachine.prototype.log = function(opcode) {
    var op = opcode.opoffset + ': ' + opcode.byteName;
    for (var arg in opcode.args) {
        op += ' ' + opcode.args[arg];
    }
    var indent = "    " * (this.frames.length - 1);

    console.log("  " + indent + "data: " + this.frame.stack);
    console.log("  " + indent + "blks: " + this.frame.block_stack);
    console.log(indent + op);
};

/*
 * Manage a frame's block stack.
 * Manipulate the block stack and data stack for looping,
 * exception handling, or returning.
 */
batavia.VirtualMachine.prototype.manage_block_stack = function(why) {
    assert(why !== 'yield');

    var block = this.frame.block_stack[this.frame.block_stack.length - 1];
    if (block.type === 'loop' && why === 'continue') {
        this.jump(this.return_value);
        why = null;
        return why;
    }

    this.pop_block();
    this.unwind_block(block);

    if (block.type === 'loop' && why === 'break') {
        why = null;
        this.jump(block.handler);
        return why;
    }

    if (why === 'exception' &&
            (block.type === 'setup-except' || block.type === 'finally')) {
        this.push_block('except-handler');
        var exc = this.last_exception;
        this.push(exc.traceback);
        this.push(exc.value);
        this.push(exc.exc_type);
        // PyErr_Normalize_Exception goes here
        this.push(exc.traceback);
        this.push(exc.value);
        this.push(exc.exc_type);
        why = null;
        this.jump(block.handler);
        return why;
    } else if (block.type === 'finally') {
        if (why === 'return' || why === 'continue') {
            this.push(this.return_value);
        }
        this.push(why);

        why = null;
        this.jump(block.handler);
        return why;
    }

    return why;
};
/*
 * Run a frame until it returns (somehow).
 *
 * Exceptions are raised, the return value is returned.
 *
 */
batavia.VirtualMachine.prototype.run_frame = function(frame) {
    var why, operation;

    this.push_frame(frame);
    while (true) {
        operation = this.frame.f_code.co_unpacked_code[this.frame.f_lasti];
        var opname = batavia.modules.dis.opname[operation.opcode];

        // advance f_lasti to next operation. If the operation is a jump, then this
        // pointer will be overwritten during the operation's execution.
        this.frame.f_lasti = operation.next_pos;

        // this.log(operation);

        // When unwinding the block stack, we need to keep track of why we
        // are doing it.
        try {
            why = operation.op_method.apply(this, operation.args);
        } catch (err) {
            // deal with exceptions encountered while executing the op.
            if (err instanceof batavia.builtins.BataviaError) {
                // Batavia errors are a major problem; ABORT HARD
                this.last_exception = null;
                throw err;
            } else if (this.last_exception === null) {
                this.last_exception = {
                    'exc_type': err.constructor,
                    'value': err,
                    'traceback': this.create_traceback()
                };
            }
            why = 'exception';
        }

        if (why === 'exception')  {
            // TODO: ceval calls PyTraceBack_Here, not sure what that does.
        }

        if (why === 'reraise') {
            why = 'exception';
        }

        if (why !== 'yield') {
            while (why && frame.block_stack.length > 0) {
                // Deal with any block management we need to do.
                why = this.manage_block_stack(why);
            }
        }

        if (why) {
            break;
        }
    }

    // TODO: handle generator exception state

    this.pop_frame();

    if (why === 'exception') {
        throw this.last_exception;
    }

    return this.return_value;
};

batavia.VirtualMachine.prototype.byte_LOAD_CONST = function(c) {
    this.push(c);
};

batavia.VirtualMachine.prototype.byte_POP_TOP = function() {
    this.pop();
};

batavia.VirtualMachine.prototype.byte_DUP_TOP = function() {
    this.push(this.top());
};

batavia.VirtualMachine.prototype.byte_DUP_TOPX = function(count) {
    var items = this.popn(count);
    for (var n = 0; n < 2; n++) {
        for (var i = 0; i < count; i++) {
            this.push(items[i]);
        }
    }
};

batavia.VirtualMachine.prototype.byte_DUP_TOP_TWO = function() {
    var items = this.popn(2);
    this.push(items[0]);
    this.push(items[1]);
    this.push(items[0]);
    this.push(items[1]);
};

batavia.VirtualMachine.prototype.byte_ROT_TWO = function() {
    var items = this.popn(2);
    this.push(items[1]);
    this.push(items[0]);
};

batavia.VirtualMachine.prototype.byte_ROT_THREE = function() {
    var items = this.popn(3);
    this.push(items[2]);
    this.push(items[0]);
    this.push(items[1]);
};

batavia.VirtualMachine.prototype.byte_ROT_FOUR = function() {
    var items = this.popn(4);
    this.push(items[3]);
    this.push(items[0]);
    this.push(items[1]);
    this.push(items[2]);
};

batavia.VirtualMachine.prototype.byte_LOAD_NAME = function(name) {
    var frame = this.frame;
    var val;
    if (name in frame.f_locals) {
        val = frame.f_locals[name];
    } else if (name in frame.f_globals) {
        val = frame.f_globals[name];
    } else if (name in frame.f_builtins) {
        val = frame.f_builtins[name];
    } else {
        throw new batavia.builtins.NameError("name '" + name + "' is not defined");
    }
    this.push(val);
};

batavia.VirtualMachine.prototype.byte_STORE_NAME = function(name) {
    this.frame.f_locals[name] = this.pop();
};

batavia.VirtualMachine.prototype.byte_DELETE_NAME = function(name) {
    delete this.frame.f_locals[name];
};

batavia.VirtualMachine.prototype.byte_LOAD_FAST = function(name) {
    var val;
    if (name in this.frame.f_locals) {
        val = this.frame.f_locals[name];
    } else {
        throw new batavia.builtins.NameError("local variable '" + name + "' referenced before assignment");
    }
    this.push(val);
};

batavia.VirtualMachine.prototype.byte_STORE_FAST = function(name) {
    this.frame.f_locals[name] = this.pop();
};

batavia.VirtualMachine.prototype.byte_DELETE_FAST = function(name) {
    delete this.frame.f_locals[name];
};

batavia.VirtualMachine.prototype.byte_STORE_GLOBAL = function(name) {
    this.frame.f_globals[name] = this.pop();
};

batavia.VirtualMachine.prototype.byte_LOAD_GLOBAL = function(name) {
    var val;
    if (name in this.frame.f_globals) {
        val = this.frame.f_globals[name];
    } else if (name in this.frame.f_builtins) {
        val = this.frame.f_builtins[name];
    } else {
        throw new batavia.builtins.NameError("name '" + name + "' is not defined");
    }
    this.push(val);
};

batavia.VirtualMachine.prototype.byte_LOAD_DEREF = function(name) {
    this.push(this.frame.cells[name].get());
};

batavia.VirtualMachine.prototype.byte_STORE_DEREF = function(name) {
    this.frame.cells[name].set(this.pop());
};

batavia.VirtualMachine.prototype.byte_LOAD_LOCALS = function() {
    this.push(this.frame.f_locals);
};

// batavia.VirtualMachine.prototype.sliceOperator = function(op) {
//     start = 0;
//     end = null;          // we will take this to mean end
//     // op, count = op[:-2], int(op[-1]);
//     if count == 1:
//         start = this.pop()
//     elif count == 2:
//         end = this.pop()
//     elif count == 3:
//         end = this.pop()
//         start = this.pop()
//     l = this.pop()
//     if end is null:
//         end = len(l)
//     if op.startswith('STORE_'):
//         l[start:end] = this.pop()
//     elif op.startswith('DELETE_'):
//         del l[start:end]
//     else:
//         this.push(l[start:end])
// };

batavia.VirtualMachine.prototype.byte_COMPARE_OP = function(opnum) {
    var items = this.popn(2);
    this.push(batavia.comparisons[opnum](items[0], items[1]));
};

batavia.VirtualMachine.prototype.byte_LOAD_ATTR = function(attr) {
    var obj = this.pop();
    var val = obj[attr];
    if (val instanceof batavia.core.Function) {
        // If this is a Python function, we need to know the current
        // context - if it's an attribute of an object (rather than
        // a module) we need to upgrade the Function to a Method.
        if (!(obj instanceof batavia.core.Module)) {
            val = new batavia.core.Method(obj, val);
        }
    } else if (val instanceof Function) {
        // If this is a native Javascript function, wrap the function
        // so that the Python calling convention is used. If it's a
        // class, wrap it in a method that uses the Python calling
        // convention, but instantiates the object rather than just
        // proxying the call.
        if (Object.keys(val.prototype).length > 0) {
            val = function(fn) {
                return function(args, kwargs) {
                    var obj = Object.create(fn.prototype);
                    fn.apply(obj, args);
                    return obj;
                };
            }(val);
        } else {
            val = function(fn) {
                return function(args, kwargs) {
                    return fn.apply(obj, args);
                };
            }(val);
        }
    }
    this.push(val);
};

batavia.VirtualMachine.prototype.byte_STORE_ATTR = function(name) {
    var items = this.popn(2);
    items[1][name] = items[0];
};

batavia.VirtualMachine.prototype.byte_DELETE_ATTR = function(name) {
    var obj = this.pop();
    delete obj[name];
};

batavia.VirtualMachine.prototype.byte_STORE_SUBSCR = function() {
    var items = this.popn(3);
    items[1][items[2]] = items[0];
};

batavia.VirtualMachine.prototype.byte_DELETE_SUBSCR = function() {
    var items = this.popn(2);
    delete items[1][items[0]];
};

batavia.VirtualMachine.prototype.byte_BUILD_TUPLE = function(count) {
    var items = this.popn(count);
    this.push(new batavia.core.Tuple(items));
};

batavia.VirtualMachine.prototype.byte_BUILD_LIST = function(count) {
    var items = this.popn(count);
    this.push(new batavia.core.List(items));
};

batavia.VirtualMachine.prototype.byte_BUILD_SET = function(count) {
    var items = this.popn(count);
    this.push(new batavia.core.Set(items));
};

batavia.VirtualMachine.prototype.byte_BUILD_MAP = function(size) {
    this.push(new batavia.core.Dict());
};

batavia.VirtualMachine.prototype.byte_STORE_MAP = function() {
    var items = this.popn(3);
    items[0][items[2]] = items[1];
    this.push(items[0]);
};

batavia.VirtualMachine.prototype.byte_UNPACK_SEQUENCE = function(count) {
    var seq = this.pop();
    if (seq.__next__) {
        try {
            while (true) {
                this.push(seq.__next__());
            }
        } catch (err) {}
    } else {
        for (var i = seq.length; i-- ; ) {
            this.push(seq[i]);
        }
    }
};

batavia.VirtualMachine.prototype.byte_BUILD_SLICE = function(count) {
    if (count === 2 || count === 3) {
        items = this.popn(count);
        this.push(batavia.builtins.slice(items));
    } else {
        throw new batavia.builtins.BataviaError("Strange BUILD_SLICE count: " + count);
    }
};

batavia.VirtualMachine.prototype.byte_LIST_APPEND = function(count) {
    var val = this.pop();
    var the_list = this.peek(count);
    the_list.push(val);
};

batavia.VirtualMachine.prototype.byte_SET_ADD = function(count) {
    var val = this.pop();
    var the_set = this.peek(count);
    the_set.add(val);
};

batavia.VirtualMachine.prototype.byte_MAP_ADD = function(count) {
    var items = this.popn(2);
    var the_map = this.peek(count);
    the_map[items[1]] = items[0];
};

batavia.VirtualMachine.prototype.byte_PRINT_EXPR = function() {
    batavia.stdout(this.pop());
};

batavia.VirtualMachine.prototype.byte_PRINT_ITEM = function() {
    var item = this.pop();
    this.print_item(item);
};

batavia.VirtualMachine.prototype.byte_PRINT_ITEM_TO = function() {
    var to = this.pop();  // FIXME - this is ignored.
    var item = this.pop();
    this.print_item(item);
};

batavia.VirtualMachine.prototype.byte_PRINT_NEWLINE = function() {
    this.print_newline();
};

batavia.VirtualMachine.prototype.byte_PRINT_NEWLINE_TO = function() {
    var to = this.pop();  // FIXME - this is ignored.
    this.print_newline(to);
};

batavia.VirtualMachine.prototype.print_item = function(item, to) {
    if (to === undefined) {
        // to = sys.stdout;  // FIXME - this is ignored.
    }
    batavia.stdout(item);
};

batavia.VirtualMachine.prototype.print_newline = function(to) {
    if (to === undefined) {
        // to = sys.stdout;  // FIXME - this is ignored.
    }
    batavia.stdout("");
};

batavia.VirtualMachine.prototype.byte_JUMP_FORWARD = function(jump) {
    this.jump(jump);
};

batavia.VirtualMachine.prototype.byte_JUMP_ABSOLUTE = function(jump) {
    this.jump(jump);
};

batavia.VirtualMachine.prototype.byte_POP_JUMP_IF_TRUE = function(jump) {
    var val = this.pop();
    if (val) {
        this.jump(jump);
    }
};

batavia.VirtualMachine.prototype.byte_POP_JUMP_IF_FALSE = function(jump) {
    var val = this.pop();
    if (!val) {
        this.jump(jump);
    }
};

batavia.VirtualMachine.prototype.byte_JUMP_IF_TRUE_OR_POP = function(jump) {
    var val = this.top();
    if (val) {
        this.jump(jump);
    } else {
        this.pop();
    }
};

batavia.VirtualMachine.prototype.byte_JUMP_IF_FALSE_OR_POP = function(jump) {
    var val = this.top();
    if (!val) {
        this.jump(jump);
    } else {
        this.pop();
    }
};

batavia.VirtualMachine.prototype.byte_SETUP_LOOP = function(dest) {
    this.push_block('loop', dest);
};

batavia.VirtualMachine.prototype.byte_GET_ITER = function() {
    this.push(batavia.builtins.iter([this.pop()], null));
};

batavia.VirtualMachine.prototype.byte_FOR_ITER = function(jump) {
    var iterobj = this.top();
    try {
        var v = iterobj.__next__();
        this.push(v);
    } catch (err) {
        if (err instanceof batavia.builtins.StopIteration) {
            this.pop();
            this.jump(jump);
        } else {
            throw err;
        }
    }
};

batavia.VirtualMachine.prototype.byte_BREAK_LOOP = function() {
    return 'break';
};

batavia.VirtualMachine.prototype.byte_CONTINUE_LOOP = function(dest) {
    // This is a trick with the return value.
    // While unrolling blocks, continue and return both have to preserve
    // state as the finally blocks are executed.  For continue, it's
    // where to jump to, for return, it's the value to return.  It gets
    // pushed on the stack for both, so continue puts the jump destination
    // into return_value.
    this.return_value = dest;
    return 'continue';
};

batavia.VirtualMachine.prototype.byte_SETUP_EXCEPT = function(dest) {
    this.push_block('setup-except', dest);
};

batavia.VirtualMachine.prototype.byte_SETUP_FINALLY = function(dest) {
    this.push_block('finally', dest);
};

batavia.VirtualMachine.prototype.byte_END_FINALLY = function() {
    var exc_type = this.pop();
    if (exc_type === null) {
        why = null;
    } else {
        value = this.pop();
        if (value instanceof batavia.builtins.BaseException) {
            traceback = this.pop();
            this.last_exception = {
                'exc_type': exc_type,
                'value': value,
                'traceback': traceback
            };
            why = 'reraise';
        } else {
            throw new batavia.builtins.BataviaError("Confused END_FINALLY");
        }
    }
    return why;
};

batavia.VirtualMachine.prototype.byte_POP_BLOCK = function() {
    this.pop_block();
};

batavia.VirtualMachine.prototype.byte_RAISE_VARARGS = function(argc) {
    var cause, exc;
    if (argc == 2) {
        cause = this.pop();
        exc = this.pop();
    } else if (argc == 1) {
        exc = this.pop();
    }
    return this.do_raise(exc, cause);
};

batavia.VirtualMachine.prototype.do_raise = function(exc, cause) {
    if (exc === undefined) {  // reraise
        if (this.last_exception.exc_type === undefined) {
            return 'exception';      // error
        } else {
            return 'reraise';
        }
    } else if (exc instanceof batavia.builtins.BaseException) {
        // As in `throw ValueError('foo')`
        exc_type = exc.constructor;
        val = exc;
    } else {
        return 'exception';  // error
    }

    // If you reach this point, you're guaranteed that
    // val is a valid exception instance and exc_type is its class.
    // Now do a similar thing for the cause, if present.
    if (cause) {
        // if not isinstance(cause, BaseException):
        //     return 'exception'  // error

        val.__cause__ = cause;
    }

    this.last_exception = {
        'exc_type': exc_type,
        'value': val,
        'traceback': this.create_traceback()
    };
    return 'exception';
};

batavia.VirtualMachine.prototype.byte_POP_EXCEPT = function() {
    var block = this.pop_block();
    if (block.type !== 'except-handler') {
        throw new batavia.exception.BataviaError("popped block is not an except handler");
    }
    this.unwind_block(block);
};

// batavia.VirtualMachine.prototype.byte_SETUP_WITH = function(dest) {
//         ctxmgr = this.pop()
//         this.push(ctxmgr.__exit__)
//         ctxmgr_obj = ctxmgr.__enter__()
//         if PY2:
//             this.push_block('with', dest)
//         elif PY3:
//             this.push_block('finally', dest)
//         this.push(ctxmgr_obj)
// }
// batavia.VirtualMachine.prototype.byte_WITH_CLEANUP = function {
//         // The code here does some weird stack manipulation: the exit function
//         // is buried in the stack, and where depends on what's on top of it.
//         // Pull out the exit function, and leave the rest in place.
//         v = w = null
//         u = this.top()
//         if u is null:
//             exit_func = this.pop(1)
//         elif isinstance(u, str):
//             if u in ('return', 'continue'):
//                 exit_func = this.pop(2)
//             else:
//                 exit_func = this.pop(1)
//             u = null
//         elif issubclass(u, BaseException):
//             if PY2:
//                 w, v, u = this.popn(3)
//                 exit_func = this.pop()
//                 this.push(w, v, u)
//             elif PY3:
//                 w, v, u = this.popn(3)
//                 tp, exc, tb = this.popn(3)
//                 exit_func = this.pop()
//                 this.push(tp, exc, tb)
//                 this.push(null)
//                 this.push(w, v, u)
//                 block = this.pop_block()
//                 assert block.type == 'except-handler'
//                 this.push_block(block.type, block.handler, block.level-1)
//         else:       // pragma: no cover
//             throw "Confused WITH_CLEANUP")
//         exit_ret = exit_func(u, v, w)
//         err = (u is not null) and bool(exit_ret)
//         if err:
//             // An error occurred, and was suppressed
//             if PY2:
//                 this.popn(3)
//                 this.push(null)
//             elif PY3:
//                 this.push('silenced')

//     #// Functions
// }

batavia.VirtualMachine.prototype.byte_MAKE_FUNCTION = function(argc) {
    var name = this.pop();
    var code = this.pop();
    var defaults = this.popn(argc);
    var fn = new batavia.core.Function(name, code, this.frame.f_globals, defaults, null, this);
    this.push(fn);
};

batavia.VirtualMachine.prototype.byte_LOAD_CLOSURE = function(name) {
    this.push(this.frame.cells[name]);
};

batavia.VirtualMachine.prototype.byte_MAKE_CLOSURE = function(argc) {
    var name = this.pop();
    var items = this.popn(2);
    var defaults = this.popn(argc);
    var fn = new batavia.core.Function(name, items[1], this.frame.f_globals, defaults, items[0], this);
    this.push(fn);
};

batavia.VirtualMachine.prototype.byte_CALL_FUNCTION = function(arg) {
    return this.call_function(arg, null, null);
};

batavia.VirtualMachine.prototype.byte_CALL_FUNCTION_VAR = function(arg) {
    var args = this.pop();
    return this.call_function(arg, args, null);
};

batavia.VirtualMachine.prototype.byte_CALL_FUNCTION_KW = function(arg) {
    var kwargs = this.pop();
    return this.call_function(arg, null, kwargs);
};

batavia.VirtualMachine.prototype.byte_CALL_FUNCTION_VAR_KW = function(arg) {
    var items = this.popn(2);
    return this.call_function(arg, items[0], items[1]);
};

batavia.VirtualMachine.prototype.call_function = function(arg, args, kwargs) {
    var lenKw = Math.floor(arg / 256);
    var lenPos = arg % 256;
    var namedargs = new batavia.core.Dict();
    for (var i = 0; i < lenKw; i++) {
        var items = this.popn(2);
        namedargs[items[0]] = items[1];
    }
    if (kwargs) {
        namedargs.update(kwargs);
    }
    var posargs = this.popn(lenPos);
    if (args) {
        posargs = posargs.concat(args);
    }

    var func = this.pop();
    // frame = this.frame
    if ('__self__' in func && '__python__' in func) {
        // A python-style method
        // Methods calls get self as an implicit first parameter.
        if (func.__self__) {
            posargs.unshift(func.__self__);
        }
        // The first parameter must be the correct type.
        if (posargs[0] instanceof func.constructor) {
            throw 'unbound method ' + func.__func__.__name__ + '()' +
                ' must be called with ' + func.__class__.__name__ + ' instance ' +
                'as first argument (got ' + posargs[0].prototype + ' instance instead)';
        }
        func = func.__func__.__call__;
    } else if ('__call__' in func) {
        // A Python callable
        func = func.__call__;
    } else if (func.prototype) {
        // If this is a native Javascript class constructor, wrap it
        // in a method that uses the Python calling convention, but
        // instantiates the object.
        if (Object.keys(func.prototype).length > 0) {
            func = function(fn) {
                return function(args, kwargs) {
                    var obj = Object.create(fn.prototype);
                    fn.apply(obj, args);
                    return obj;
                };
            }(func);
        }
    }

    var retval = func.apply(this, [posargs, namedargs]);

    this.push(retval);
};

batavia.VirtualMachine.prototype.byte_RETURN_VALUE = function() {
    this.return_value = this.pop();
    if (this.frame.generator) {
        this.frame.generator.finished = true;
    }
    return "return";
};

// batavia.VirtualMachine.prototype.byte_YIELD_VALUE = function {
//         this.return_value = this.pop()
//         return "yield"
// }
// batavia.VirtualMachine.prototype.byte_YIELD_FROM = function {
//         u = this.pop()
//         x = this.top()

//         try:
//             if not isinstance(x, Generator) or u is null:
//                 // Call next on iterators.
//                 retval = next(x)
//             else:
//                 retval = x.send(u)
//             this.return_value = retval
//         except StopIteration as e:
//             this.pop()
//             this.push(e.value)
//         else:
//             // YIELD_FROM decrements f_lasti, so that it will be called
//             // repeatedly until a StopIteration is raised.
//             this.jump(this.frame.f_lasti - 1)
//             // Returning "yield" prevents the block stack cleanup code
//             // from executing, suspending the frame in its current state.
//             return "yield"

//     #// Importing
// }

batavia.VirtualMachine.prototype.byte_IMPORT_NAME = function(name) {
    var items = this.popn(2);
    this.push(
        batavia.builtins.__import__.apply(this, [[name, this.frame.f_globals, null, items[1], items[0]]])
    );
};

batavia.VirtualMachine.prototype.byte_IMPORT_STAR = function() {
    // TODO: this doesn't use __all__ properly.
    var mod = this.pop();
    if ('__all__' in mod) {
        for (var n = 0; n < mod.__all__.length; n++) {
            var name = mod.__all__[n];
            this.frame.f_locals[name] = mod[name];
        }
    } else {
        for (var attr in mod) {
            if (attr[0] !== '_') {
                this.frame.f_locals[attr] = mod[attr];
            }
        }
    }
};

batavia.VirtualMachine.prototype.byte_IMPORT_FROM = function(name) {
    var mod = this.top();
    this.push(mod[name]);
};

// batavia.VirtualMachine.prototype.byte_EXEC_STMT = function() {
//     stmt, globs, locs = this.popn(3)
//     six.exec_(stmt, globs, locs) f
// };

batavia.VirtualMachine.prototype.byte_LOAD_BUILD_CLASS = function() {
    var make_class = batavia.make_class.bind(this);
    make_class.__python__ = true;
    this.push(make_class);
};

batavia.VirtualMachine.prototype.byte_STORE_LOCALS = function() {
    this.frame.f_locals = this.pop();
};

batavia.VirtualMachine.prototype.byte_SET_LINENO = function(lineno) {
    this.frame.f_lineno = lineno;
};
