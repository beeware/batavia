/*

General builtin format:

// Example: a function that accepts exactly one argument, and no keyword arguments
batavia.builtins.<fn> = function(<args>, <kwargs>) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError("Batavia calling convention not used.");
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("<fn>() doesn't accept keyword arguments.");
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError("<fn>() expected exactly 1 argument (" + args.length + " given)");
    }

    // if the function only works with a specific object type, add a test
    var obj = args[0];

    if (!batavia.isinstance(obj, batavia.types.<type>)) {
        throw new batavia.builtins.TypeError(
            "<fn>() expects a <type> (" + batavia.type_name(obj) + " given)");
    }

    // actual code goes here
    Javascript.Function.Stuff();
}
batavia.builtins.<fn>.__doc__ = 'docstring from Python 3.4 goes here, for documentation'
*/

batavia.builtins.__import__ = function(args, kwargs) {
    if (arguments.length !== 2) {
        throw new batavia.builtins.BataviaError("Batavia calling convention not used.");
    }

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
                    'f_locals': new batavia.types.Dict(),
                });
                this.run_frame(frame);

                root_module = new batavia.types.Module(name, frame.f_locals);
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
                        'f_locals': new batavia.types.Dict(),
                    });
                    this.run_frame(frame);

                    new_sub = new batavia.types.Module(name, frame.f_locals);
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
                module = new batavia.types.Module(sub_module.__name__);
                for (name in sub_module) {
                    if (sub_module.hasOwnProperty(name)) {
                        module[name] = sub_module[name];
                    }
                }
            } else {
                // from <mod> import <name>, <name>
                module = new batavia.types.Module(sub_module.__name__);
                for (var sn = 0; sn < args[3].length; sn++) {
                    name = args[3][sn];
                    if (sub_module[name] === undefined) {
                        batavia.builtins.__import__.apply(this, [[sub_module.__name__ + '.' + name, this.frame.f_globals, null, null, null], null]);
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

    var value = args[0];
    if (batavia.isinstance(value, [batavia.types.Bool, batavia.types.Int])) {
        return new batavia.types.Int(Math.abs(args[0].valueOf()));
    } else if (batavia.isinstance(value, batavia.types.Float)) {
        return new batavia.types.Float(Math.abs(args[0].valueOf()));
    } else {
        throw new batavia.builtins.TypeError(
            "bad operand type for abs(): '" + batavia.type_name(value) + "'");
    }
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

batavia.builtins.ascii = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'ascii' not implemented");
};

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

    var obj = args[0];

    if (!batavia.isinstance(obj, batavia.types.Int)) {
        throw new batavia.builtins.TypeError(
            "'" + batavia.type_name(obj) + "' object cannot be interpreted as an integer");
    }

    return "0b" + obj.toString(2);
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

    if (args[0] === null) {
        return batavia.types.NoneType.__bool__();
    } else if (args[0].__bool__) {
        return args[0].__bool__();
    } else {
        return !!(args[0].valueOf());
    }
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
    if (typeof(args[0]) === "function" || (args[0] && args[0].__call__)) {
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
    if (batavia.isinstance(args[0], batavia.types.Int)) {
        throw new batavia.builtins.TypeError("'" + batavia.type_name(args[0]) + "' object is not iterable");
    }
    if (batavia.isinstance(args[0], batavia.types.Str)) {
        throw new batavia.builtins.ValueError("dictionary update sequence element #0 has length 1; 2 is required");
    }

    // handling keyword arguments and no arguments
    if (args.length === 0 || args[0].length === 0) {
        if (kwargs) {
            return new batavia.types.Dict(kwargs);
        }
        else {
            return new batavia.types.Dict();
        }
    } else {
        // iterate through array to find any errors
        for (i = 0; i < args[0].length; i++) {
            if (args[0][i].length !== 2) {
                // single number in an iterable throws different error
                if (batavia.isinstance(args[0][i], batavia.types.Int)) {
                    throw new batavia.builtins.TypeError("cannot convert dictionary update sequence element #" + i + " to a sequence");
                } else {
                    throw new batavia.builtins.ValueError("dictionary update sequence element #" + i + " has length " + args[0][i].length + "; 2 is required");
                }
            }
        }
    }
    // Passing a dictionary as argument
    if (batavia.isinstance(args[0], batavia.types.Dict)) {
        return args[0];
    }

    // passing a list as argument
    if (args.length === 1) {
        var dict = new batavia.types.Dict();
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
    return new batavia.types.Tuple([div, rem]);
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

batavia.builtins.exec = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'exec' not implemented");
};

batavia.builtins.filter = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("filter() doesn't accept keyword arguments");
    }
    return new batavia.types.filter(args, kwargs);
};

batavia.builtins.float = function(args) {
    if (args.length > 1) {
        throw new batavia.builtins.TypeError("float() takes at most 1 argument (" + args.length + " given)");
    }
    if (args.length === 0) {
        return 0.0;
    }

    var value = args[0];

    if (batavia.isinstance(value, batavia.types.Str)) {
        if (value.search(/[^0-9.]/g) === -1) {
            return parseFloat(value);
        } else {
            if (value === "nan" || value === "+nan" || value === "-nan") {
                return NaN;
            } else if(value === "inf" || value === "+inf") {
                return Infinity;
            } else if(toConvert === "-inf") {
                return -Infinity;
            }
            throw new batavia.builtins.ValueError("could not convert string to float: '" + args[0] + "'");
        }
    } else if (batavia.isinstance(value, [batavia.types.Int, batavia.types.Bool])) {
        return args[0].valueOf().toFixed(1);
    } else if (batavia.isinstance(value, batavia.types.Float)) {
        return args[0];
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
    throw new batavia.builtins.PolyglotError("'id' has no meaning here. See docs/internals/limitations#id");
};
batavia.builtins.id__doc__ = 'Return the identity of an object.  This is guaranteed to be unique among simultaneously existing objects.  (Hint: it\'s the object\'s memory address.)';


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
        throw new batavia.builtins.ValueError(
            "invalid literal for int() with base " + base + ": " + batavia.builtins.repr([value], null)
        );
    }
    return result;
};
batavia.builtins.int.__doc__ = "int(x=0) -> integer\nint(x, base=10) -> integer\n\nConvert a number or string to an integer, or return 0 if no arguments\nare given.  If x is a number, return x.__int__().  For floating point\nnumbers, this truncates towards zero.\n\nIf x is not a number or if base is given, then x must be a string,\nbytes, or bytearray instance representing an integer literal in the\ngiven base.  The literal can be preceded by '+' or '-' and be surrounded\nby whitespace.  The base defaults to 10.  Valid bases are 0 and 2-36.\nBase 0 means to interpret the base from the string as an integer literal.\n>>> int('0b100', base=0)\n4";


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
    var iterobj = args[0];
    if (iterobj.__iter__) {
        //needs to work for __iter__ in JS impl (e.g. Map/Filter) and python ones
        return batavia.run_callable(iterobj, iterobj.__iter__, [], null);
    } else {
        throw new batavia.builtins.TypeError("'" + batavia.type_name(iterobj) + "' object is not iterable");
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

batavia.builtins.list = function(args) {
    return new batavia.types.List(args[0]);
};

batavia.builtins.locals = function() {
    return this.frame.f_locals;
};

batavia.builtins.map = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("map() doesn't accept keyword arguments");
    }
  return new batavia.types.map(args, kwargs);
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
    if (args.length !== 1) {
        throw new batavia.builtins.TypeError("oct() takes exactly one argument (" + args.length + " given)");
    }

    return "0o" + args[0].toString(8);
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
        if (elm === null || elm === undefined) {
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

    return new batavia.types.Range(args[0], args[1], args[2]);
};
batavia.builtins.range.__doc__ = 'range(stop) -> range object\nrange(start, stop[, step]) -> range object\n\nReturn a virtual sequence of numbers from start to stop by step.';

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

    if (args[0] === null) {
        return batavia.types.NoneType.__repr__();
    } else if (args[0].__repr__) {
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
        return new batavia.types.Slice({
            start: 0,
            stop: args[0],
            step: 1
        });
    } else {
        return new batavia.types.Slice({
            start: args[0],
            stop: args[1],
            step: args[2] || 1
        });
    }
};

batavia.builtins.sorted = function(args, kwargs) {
    var validatedInput = batavia.builtins.sorted._validateInput(args, kwargs);
    var iterable = validatedInput["iterable"];

    if (batavia.isinstance(iterable, [batavia.types.List, batavia.types.Tuple])) {
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

        return new batavia.types.List(iterable.map(function (element) {
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

    if (args[0] === null) {
        return batavia.types.NoneType.__str__();
    } else if (args[0].__str__) {
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
batavia.builtins.sum.__doc__ = "sum(iterable[, start]) -> value\n\nReturn the sum of an iterable of numbers (NOT strings) plus the value\nof parameter 'start' (which defaults to 0).  When the iterable is\nempty, return start.";

batavia.builtins.super = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'super' not implemented");
};

batavia.builtins.tuple = function(args) {
    return new batavia.types.Tuple(args[0]);
};

batavia.builtins.type = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("type() doesn't accept keyword arguments");
    }
    if (!args || (args.length != 1 && args.length != 3)) {
        throw new batavia.builtins.TypeError('type() takes 1 or 3 arguments');
    }

    if (args.length === 1) {
        return "<class '" + batavia.type_name(args[0]) + "'>";
    } else {
        throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'type' not implemented for 3 arguments");
    }
};
batavia.builtins.type.__doc__ = "type(object_or_name, bases, dict)\ntype(object) -> the object's type\ntype(name, bases, dict) -> a new type";

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

        result.push(new batavia.types.Tuple(sequence));
    }

    return result;
};

// Mark all builtins as Python methods.
for (var fn in batavia.builtins) {
    batavia.builtins[fn].__python__ = true;
}

batavia.builtins.None = null;
