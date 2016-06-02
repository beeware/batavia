
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
                if (type === null || type === batavia.types.NoneType) {
                    return obj === null;
                } else {
                    return obj instanceof type;
                }
                break;
            default:
                return false;
        }
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

batavia.run_callable = function(func, posargs, namedargs) {
    var vm = (this.is_vm ? this : func._vm || this);
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

    var retval = func.apply(vm, [posargs, namedargs]);
    return retval;
}
