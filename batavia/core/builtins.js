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

    // First, check for builtins
    var module;

    if (args[0] == "builtins") {
        module = batavia.builtins;
    }

    // Second, try native modules
    if (module === undefined) {
        module = batavia.modules[args[0]];
    }

    // If there's no native module, try for a pre-loaded module.
    if (module === undefined) {
        module = batavia.modules.sys.modules[args[0]];
    }
    // Check if there is a stdlib (pyc) module.
    if (module === undefined) {
        var payload = batavia.stdlib[args[0]];
        if (payload) {
            var code = batavia.modules.marshal.load_pyc(this, payload);
            // Convert code object to module
            args[1].__name__ = args[0]
            var frame = this.make_frame({
                'code': code,
                'f_globals': args[1]
            });
            this.run_frame(frame);

            module = new batavia.types.Module(name, frame.f_locals);
            batavia.modules.sys.modules[name] = module;
        }
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
                    'f_locals': new batavia.types.JSDict(),
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
                        'f_locals': new batavia.types.JSDict(),
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
        throw new batavia.builtins.TypeError('abs() takes exactly one argument (' + args.length + ' given)');
    }

    var value = args[0];
    if (batavia.isinstance(value, batavia.types.Bool)) {
        return new batavia.types.Int(Math.abs(value.valueOf()));
    } else if (batavia.isinstance(value, [batavia.types.Int,
                                          batavia.types.Float,
                                          batavia.types.Complex])) {
        return value.__abs__();
    } else {
        throw new batavia.builtins.TypeError(
            "bad operand type for abs(): '" + batavia.type_name(value) + "'");
    }
};
batavia.builtins.abs.__doc__ = 'abs(number) -> number\n\nReturn the absolute value of the argument.';

batavia.builtins.all = function(args, kwargs) {
    if (args[0] == null) {
        throw new batavia.builtins.TypeError("'NoneType' object is not iterable");
    }
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("all() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError('all() expected exactly 0 or 1 argument (' + args.length + ' given)');
    }

    if(!args[0].__iter__) {
        throw new batavia.builtins.TypeError("'" + batavia.type_name(args[0]) + "' object is not iterable");
    }

    for (var i = 0; i < args[0].length; i++) {
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

    if (batavia.isinstance(args[0], batavia.types.Tuple)) {
      for (var i = 0; i < args[0].length; i++) {
        if (args[0][i]) {
           return true;
        }
      }
      return false;
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
batavia.builtins.bool.__doc__ = 'bool(x) -> bool\n\nReturns True when the argument x is true, False otherwise.\nIn CPython, the builtins True and False are the only two instances of the class bool.\nAlso in CPython, the class bool is a subclass of the class int, and cannot be subclassed.\nBatavia implements booleans as a native Javascript Boolean, enhanced with additional __dunder__ methods.\n"Integer-ness" of booleans is faked via batavia.builtins.Bool\'s __int__ method.';

batavia.builtins.bytearray = function(args, kwargs) {

//    bytearray(string, encoding[, errors]) -> bytearray
//    bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
//    bytearray(iterable_of_ints) -> bytearray
//    bytearray(int) -> bytes array of size given by the parameter initialized with null bytes
//    bytearray() -> empty bytes array

    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError("Batavia calling convention not used.");
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("<fn>() doesn't accept keyword arguments.");
    }


    if (args.length == 1 && batavia.isinstance(args[0], batavia.types.Bytes)) {
        // bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
        return new batavia.types.Bytearray(args[0]);
    } else {
        throw new batavia.builtins.NotImplementedError(
            "Not implemented"
        );
    }

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
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("complex() doesn't accept keyword arguments");
    }
    if (!args || args.length > 2) {
        throw new batavia.builtins.TypeError('complex() expected at most 2 arguments (' + args.length + ' given)');
    }
    if (batavia.isinstance(args[0], batavia.types.Complex) && !args[1]) {
        return args[0];
    }
    var re = new batavia.types.Float(0);
    if (args.length >= 1) {
        re = args[0];
    }
    var im = new batavia.types.Float(0);
    if (args.length == 2 && args[1]) {
        im = args[1];
    }
    return new batavia.types.Complex(re, im);
};
batavia.builtins.complex.__doc__ = 'complex(real[, imag]) -> complex number\n\nCreate a complex number from a real part and an optional imaginary part.\nThis is equivalent to (real + imag*1j) where imag defaults to 0.';

batavia.builtins.copyright = function(args, kwargs) {
    console.log("Batavia: Copyright (c) 2015 Russell Keith-Magee. (BSD-3 Licence)\n"+
                "byterun: Copyright (c) 2013, Ned Batchelder. (MIT Licence)");
};
batavia.builtins.copyright.__doc__ = 'copyright()\n\ninteractive prompt objects for printing the license text, a list of\n    contributors and the copyright notice.';

batavia.builtins.credits = function(args, kwargs) {
    console.log("Thanks to all contributors, including those in AUTHORS, for supporting Batavia development. See https://github.com/pybee/batavia for more information");
};
batavia.builtins.credits.__doc__ = 'credits()\n\ninteractive prompt objects for printing the license text, a list of\n    contributors and the copyright notice.';

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
    if (batavia.isinstance(args[0], [batavia.types.Int, batavia.types.Bool])) {
        throw new batavia.builtins.TypeError("'" + batavia.type_name(args[0]) + "' object is not iterable");
    }
    if (batavia.isinstance(args[0], batavia.types.Str)) {
        throw new batavia.builtins.ValueError("dictionary update sequence element #0 has length 1; 2 is required");
    }
    //if single bool case

    //if multiple bool case

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
        for (var i = 0; i < args[0].length; i++) {
            if (args[0][i].length !== 2) {
                // single number or bool in an iterable throws different error
                if (batavia.isinstance(args[0][i], [batavia.types.Bool, batavia.types.Int])) {
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
        for (var i = 0; i < args[0].length; i++) {
            var sub_array = args[0][i];
            if (sub_array.length === 2) {
                dict.__setitem__(sub_array[0], sub_array[1]);
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
    for (var i = 0; i < values.length; i++) {
        result.push([i, values[i]]);
    }
    // FIXME this should return a generator, not list
    return result;
};
batavia.builtins.enumerate.__doc__ = 'enumerate(iterable[, start]) -> iterator for index, value of iterable\n\nReturn an enumerate object.  iterable must be another object that supports\niteration.  The enumerate object yields pairs containing a count (from\nstart, which defaults to zero) and a value yielded by the iterable argument.\nenumerate is useful for obtaining an indexed list:\n    (0, seq[0]), (1, seq[1]), (2, seq[2]), ...';

batavia.builtins.eval = function(args, kwargs) {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'eval' not implemented");
};
batavia.builtins.eval.__doc__ = 'eval(source[, globals[, locals]]) -> value\n\nEvaluate the source in the context of globals and locals.\nThe source may be a string representing a Python expression\nor a code object as returned by compile().\nThe globals must be a dictionary and locals can be any mapping,\ndefaulting to the current globals and locals.\nIf only globals is given, locals defaults to it.\n';

batavia.builtins.exec = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'exec' not implemented");
};
batavia.builtins.exec.__doc__ = 'exec(object[, globals[, locals]])\n\nRead and execute code from an object, which can be a string or a code\nobject.\nThe globals and locals are dictionaries, defaulting to the current\nglobals and locals.  If only globals is given, locals defaults to it.';

batavia.builtins.filter = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("filter() doesn't accept keyword arguments");
    }
    return new batavia.types.filter(args, kwargs);
};
batavia.builtins.filter.__doc__ = 'filter(function or None, iterable) --> filter object\n\nReturn an iterator yielding those items of iterable for which function(item)\nis true. If function is None, return the items that are true.';

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
            return new batavia.types.Float(parseFloat(value));
        } else {
            if (value === "nan" || value === "+nan" || value === "-nan") {
                return new batavia.types.Float(NaN);
            } else if (value === "inf" || value === "+inf") {
                return new batavia.types.Float(Infinity);
            } else if (value === "-inf") {
                return new batavia.types.Float(-Infinity);
            }
            throw new batavia.builtins.ValueError("could not convert string to float: '" + args[0] + "'");
        }
    } else if (batavia.isinstance(value, [batavia.types.Int, batavia.types.Bool, batavia.types.Float])) {
        return args[0].__float__();
    }
};

batavia.builtins.float.__doc__ = 'float([x]) -> Convert a string or a number to floating point.';

batavia.builtins.format = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'format' not implemented");
};
batavia.builtins.format.__doc__ = 'format(value[, format_spec]) -> string\n\nReturns value.__format__(format_spec)\nformat_spec defaults to ""';


batavia.builtins.frozenset = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("frozenset() doesn't accept keyword arguments.");
    }
    if (args && args.length > 1) {
        throw new batavia.builtins.TypeError("set expected at most 1 arguments, got " + args.length);
    }
    if (!args || args.length == 0) {
        return new batavia.types.FrozenSet();
    }
    return new batavia.types.FrozenSet(args[0]);
};
batavia.builtins.frozenset.__doc__ = 'frozenset() -> empty frozenset object\nfrozenset(iterable) -> frozenset object\n\nBuild an immutable unordered collection of unique elements.';

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
batavia.builtins.getattr.__doc__ = "getattr(object, name[, default]) -> value\n\nGet a named attribute from an object; getattr(x, 'y') is equivalent to x.y.\nWhen a default argument is given, it is returned when the attribute doesn't\nexist; without it, an exception is raised in that case.";

// TODO: this should be a proper dictionary
batavia.builtins.globals = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("globals() doesn't accept keyword arguments");
    }
    if (args && args.length != 0) {
        throw new batavia.builtins.TypeError('globals() takes no arguments (' + args.length + ' given)');
    }
    var globals = this.frame.f_globals;

    // support items() iterator
    globals.items = function() {
        var l = [];
        var keys = Object.keys(globals);
        for (var i in keys) {
            var k = keys[i];
            // workaround until we have a proper dictionary
            if (k == 'items') {
              continue;
            }
            l.push(new batavia.types.Tuple([k, globals[k]]));
        }
        l = new batavia.types.List(l);
        return l;
    };
    return globals;
};
batavia.builtins.globals.__doc__ = "globals() -> dictionary\n\nReturn the dictionary containing the current scope's global variables.";

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
batavia.builtins.hasattr.__doc__ = 'hasattr(object, name) -> bool\n\nReturn whether the object has an attribute with the given name.\n(This is done by calling getattr(object, name) and catching AttributeError.)';

batavia.builtins.hash = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("hash() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new batavia.builtins.TypeError('hash() expected exactly 1 argument (' + args.length + ' given)');
    }
    var arg = args[0];
    // None
    if (arg === null) {
        return 278918143;
    }
    if (batavia.isinstance(arg, [batavia.types.Bytearray, batavia.types.Dict, batavia.types.JSDict, batavia.types.List, batavia.types.Set, batavia.types.Slice])) {
        throw new batavia.builtins.TypeError("unhashable type: '" + batavia.type_name(arg) + "'");
    }
    if (typeof arg.__hash__ !== 'undefined') {
        return batavia.run_callable(arg, arg.__hash__, [], null);
    }
    // Use JS toString() to do a simple default hash, for now.
    // (This is similar to how JS objects work.)
    return new batavia.types.Str(arg.toString()).__hash__();
};
batavia.builtins.hash.__doc__ = 'hash(object) -> integer\n\nReturn a hash value for the object.  Two objects with the same value have\nthe same hash value.  The reverse is not necessarily true, but likely.';

batavia.builtins.help = function() {
    console.log("For help, please see: https://github.com/pybee/batavia.");
};
batavia.builtins.help.__doc__ = 'In Python, this is a wrapper around pydoc.help. In Batavia, this is a link to the README.';

batavia.builtins.hex = function(args) {
    if (args.length !== 1) {
        throw new batavia.builtins.TypeError("hex() takes exactly one argument (" + args.length + " given)");
    };
    var int = args[0].val
    return "0x" + int.toString(16);
};
batavia.builtins.hex.__doc__ = "hex(number) -> string\n\nReturn the hexadecimal representation of an integer.\n\n   >>> hex(3735928559)\n   '0xdeadbeef'\n";

batavia.builtins.id = function() {
    throw new batavia.builtins.PolyglotError("'id' has no meaning here. See docs/internals/limitations#id");
};
batavia.builtins.id.__doc__ = 'Return the identity of an object.  This is guaranteed to be unique among simultaneously existing objects.  (Hint: it\'s the object\'s memory address.)';


batavia.builtins.input = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'input' not implemented");
};
batavia.builtins.input.__doc__ = 'input([prompt]) -> string\n\nRead a string from standard input.  The trailing newline is stripped.\nIf the user hits EOF (Unix: Ctl-D, Windows: Ctl-Z+Return), raise EOFError.\nOn Unix, GNU readline is used if enabled.  The prompt string, if given,\nis printed without a trailing newline before reading.';

batavia.builtins.int = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("int() doesn't accept keyword arguments");
    }

    var base = 10;
    var value = 0;
    if (!args || args.length === 0) {
        return new batavia.types.Int(0);
    } else if (args && args.length === 1) {
        value = args[0];
        if (batavia.isinstance(value, [batavia.types.Int, batavia.types.Bool])) {
            return value.__int__();
        }
    } else if (args && args.length === 2) {
        value = args[0];
        base = args[1];
    } else {
        throw new batavia.builtins.TypeError(
            "int() takes at most 2 arguments (" + args.length + " given)");
    }
    // TODO: this should be able to parse things longer than 53 bits
    var result = parseInt(value, base);
    if (isNaN(result)) {
        throw new batavia.builtins.ValueError(
            "invalid literal for int() with base " + base + ": " + batavia.builtins.repr([value], null)
        );
    }
    return new batavia.types.Int(result);
};
batavia.builtins.int.__doc__ = "int(x=0) -> integer\nint(x, base=10) -> integer\n\nConvert a number or string to an integer, or return 0 if no arguments\nare given.  If x is a number, return x.__int__().  For floating point\nnumbers, this truncates towards zero.\n\nIf x is not a number or if base is given, then x must be a string,\nbytes, or bytearray instance representing an integer literal in the\ngiven base.  The literal can be preceded by '+' or '-' and be surrounded\nby whitespace.  The base defaults to 10.  Valid bases are 0 and 2-36.\nBase 0 means to interpret the base from the string as an integer literal.\n>>> int('0b100', base=0)\n4";

batavia.builtins.isinstance = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("isinstance() takes no keyword arguments");
    }

    if (!args || args.length != 2) {
        throw new batavia.builtins.TypeError("isinstance expected 2 arguments, got " + args.length);
    }

    return batavia.isinstance(args[0], args[1]);
};
batavia.builtins.isinstance.__doc__ = "isinstance(object, class-or-type-or-tuple) -> bool\n\nReturn whether an object is an instance of a class or of a subclass thereof.\nWith a type as second argument, return whether that is the object's type.\nThe form using a tuple, isinstance(x, (A, B, ...)), is a shortcut for\nisinstance(x, A) or isinstance(x, B) or ... (etc.).";

batavia.builtins.issubclass = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'issubclass' not implemented");
};
batavia.builtins.issubclass.__doc__ = 'issubclass(C, B) -> bool\n\nReturn whether class C is a subclass (i.e., a derived class) of class B.\nWhen using a tuple as the second argument issubclass(X, (A, B, ...)),\nis a shortcut for issubclass(X, A) or issubclass(X, B) or ... (etc.).';

batavia.builtins.iter = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("iter() doesn't accept keyword arguments");
    }
    if (!args || args.length === 0) {
        throw new batavia.builtins.TypeError("iter() expected at least 1 arguments, got 0");
    }
    if (args.length == 2) {
        throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'iter' with callable/sentinel not implemented");
    }
    if (args.length > 2) {
        throw new batavia.builtins.TypeError("iter() expected at most 2 arguments, got 3");
    }
    var iterobj = args[0];
    if (iterobj !== null && typeof iterobj === 'object' && !iterobj.__class__) {
        // this is a plain JS object, wrap it in a JSDict
        iterobj = new batavia.types.JSDict(iterobj);
    }

    if (iterobj !== null && iterobj.__iter__) {
        //needs to work for __iter__ in JS impl (e.g. Map/Filter) and python ones
        return batavia.run_callable(iterobj, iterobj.__iter__, [], null);
    } else {
        throw new batavia.builtins.TypeError("'" + batavia.type_name(iterobj) + "' object is not iterable");
    }
};
batavia.builtins.iter.__doc__ = 'iter(iterable) -> iterator\niter(callable, sentinel) -> iterator\n\nGet an iterator from an object.  In the first form, the argument must\nsupply its own iterator, or be a sequence.\nIn the second form, the callable is called until it returns the sentinel.';

batavia.builtins.len = function(args, kwargs) {
    if (!args || args.length !== 1 || args[0] === undefined) {
        throw new batavia.builtins.TypeError("len() takes exactly one argument (" + args.length + " given)");
    }

    //if (args[0].hasOwnProperty("__len__")) {
        //TODO: Fix context of python functions calling with proper vm
        //throw new batavia.builtins.NotImplementedError('Builtin Batavia len function is not supporting __len__ implemented.');
        //return args[0].__len__.apply(vm);
    //}

    return new batavia.types.Int(args[0].length);
};
batavia.builtins.len.__doc__ = 'len(object)\n\nReturn the number of items of a sequence or collection.';

batavia.builtins.license = function() {
    console.log("LICENSE file is available at https://github.com/pybee/batavia/blob/master/LICENSE");
    batavia.builtins.credits();
    batavia.builtins.copyright();
};
batavia.builtins.license.__doc__ = 'license()\n\nPrompt printing the license text, a list of contributors, and the copyright notice';

batavia.builtins.list = function(args) {
    if (!args || args.length === 0) {
      return new batavia.types.List();
    }
    return new batavia.types.List(args[0]);
};
batavia.builtins.list.__doc__ = "list() -> new empty list\nlist(iterable) -> new list initialized from iterable's items";

batavia.builtins.locals = function() {
    return this.frame.f_locals;
};
batavia.builtins.locals.__doc__ = "locals() -> dictionary\n\nUpdate and return a dictionary containing the current scope's local variables.";

batavia.builtins.map = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }

    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("map() doesn't accept keyword arguments");
    }

    if (!args || args.length < 2) {
        throw new batavia.builtins.TypeError('map() must have at least two arguments.');
    }

    return new batavia.types.map(args, kwargs);
};
batavia.builtins.map.__doc__ = 'map(func, *iterables) --> map object\n\nMake an iterator that computes the function using arguments from\neach of the iterables.  Stops when the shortest iterable is exhausted.';


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
batavia.builtins.memoryview.__doc__ = 'memoryview(object)\n\nCreate a new memoryview object which references the given object.';

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
    //if its iterable return next thing in iterable
    //else stop iteration
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'next' not implemented");
};
batavia.builtins.next.__doc__ = 'next(iterator[, default])\n\nReturn the next item from the iterator. If default is given and the iterator\nis exhausted, it is returned instead of raising StopIteration.';


batavia.builtins.object = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'object' not implemented");
};
batavia.builtins.object.__doc__ = "The most base type"; // Yes, that's the entire docstring.

batavia.builtins.oct = function(args) {
    if (!args || args.length !== 1) {
        throw new batavia.builtins.TypeError("oct() takes exactly one argument (" + (args ? args.length : 0) + " given)");
    }
    var value = args[0];
    if (batavia.isinstance(value, batavia.types.Int)) {
        if (value.val.isNeg()) {
            return "-0o" + value.val.toString(8).substr(1);
        } else {
            return "0o" + value.val.toString(8);
        }
    } else if (batavia.isinstance(value, batavia.types.Bool)) {
        return "0o" + value.__int__().toString(8);
    }

    if(!batavia.isinstance(value, batavia.types.Int)) {
        if(value.__index__) {
             value = value.__index__();
        } else {
            throw new batavia.builtins.TypeError("__index__ method needed for non-integer inputs");
        }
    }
    if(value < 0) {
        return "-0o" + (0 - value).toString(8);
    }

    return "0o" + value.toString(8);
};
batavia.builtins.oct.__doc__ = "oct(number) -> string\n\nReturn the octal representation of an integer.\n\n   >>> oct(342391)\n   '0o1234567'\n";

batavia.builtins.open = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'open' not implemented");
};
batavia.builtins.open.__doc__ = 'open() is complicated.'; // 6575 character long docstring

batavia.builtins.ord = function(args, kwargs) {
    return args[0].charCodeAt(0);
};
batavia.builtins.ord.__doc__ = 'ord(c) -> integer\n\nReturn the integer ordinal of a one-character string.';

batavia.builtins.pow = function(args) {
    var x, y, z;
    if (!args) {
      throw new batavia.builtins.TypeError("pow expected at least 2 arguments, got 0");
    }
    if (args.length === 2) {
        x = args[0];
        y = args[1];
        return x.__pow__(y);
    } else if (args.length === 3) {
        x = args[0];
        y = args[1];
        z = args[2];

        if (!batavia.isinstance(x, batavia.types.Int) ||
            !batavia.isinstance(y, batavia.types.Int) ||
            !batavia.isinstance(y, batavia.types.Int)) {
            throw new batavia.builtins.TypeError("pow() requires all arguments be integers when 3 arguments are present");
        }
        if (y < 0) {
          throw new batavia.builtins.TypeError("Builtin Batavia does not support negative exponents");
        }
        if (y == 0) {
          return 1;
        }
        if (z == 1) {
          return 0;
        }

        // right-to-left exponentiation to reduce memory and time
        // See https://en.wikipedia.org/wiki/Modular_exponentiation#Right-to-left_binary_method
        var result = 1;
        var base = x % z;
        while (y > 0) {
          if ((y & 1) == 1) {
            result = (result * base) % z;
          }
          y >>= 1;
          base = (base * base) % z;
        }
        return result;
    } else {
        throw new batavia.builtins.TypeError("pow expected at least 2 arguments, got " + args.length);
    }
};
batavia.builtins.pow.__doc__ = 'pow(x, y[, z]) -> number\n\nWith two arguments, equivalent to x**y.  With three arguments,\nequivalent to (x**y) % z, but may be more efficient (e.g. for ints).';

batavia.builtins.print = function(args, kwargs) {
    var elements = [], print_value;
    args.map(function(elm) {
        if (elm === null || elm === undefined) {
            elements.push("None");
        } else if (elm.__str__) {
            elements.push(batavia.run_callable(elm, elm.__str__, [], {}));
        } else {
            elements.push(elm.toString());
        }
    });
    batavia.stdout(elements.join(' ') + "\n");
};
batavia.builtins.print.__doc__ = "print(value, ..., sep=' ', end='\\n', file=sys.stdout, flush=False)\n\nPrints the values to a stream, or to sys.stdout by default.\nOptional keyword arguments:\nfile:  a file-like object (stream); defaults to the current sys.stdout.\nsep:   string inserted between values, default a space.\nend:   string appended after the last value, default a newline.\nflush: whether to forcibly flush the stream.";


batavia.builtins.property = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'property' not implemented");
};
batavia.builtins.property.__doc__ = 'property(fget=None, fset=None, fdel=None, doc=None) -> property attribute\n\nfget is a function to be used for getting an attribute value, and likewise\nfset is a function for setting, and fdel a function for del\'ing, an\nattribute.  Typical use is to define a managed attribute x:\n\nclass C(object):\n    def getx(self): return self._x\n    def setx(self, value): self._x = value\n    def delx(self): del self._x\n    x = property(getx, setx, delx, "I\'m the \'x\' property.")\n\nDecorators make defining new properties or modifying existing ones easy:\n\nclass C(object):\n    @property\n    def x(self):\n        "I am the \'x\' property."\n        return self._x\n    @x.setter\n    def x(self, value):\n        self._x = value\n    @x.deleter\n    def x(self):\n        del self._x\n';

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
        return 'None';
    } else if (args[0].__repr__) {
        return args[0].__repr__();
    } else {
        return args[0].toString();
    }
};
batavia.builtins.repr.__doc__ = 'repr(object) -> string\n\nReturn the canonical string representation of the object.\nFor most object types, eval(repr(object)) == object.';

batavia.builtins.reversed = function(args, kwargs) {
    var iterable = args[0];
    if (batavia.isinstance(iterable, [batavia.types.List, batavia.types.Tuple])) {
        var new_iterable = iterable.slice(0);
        new_iterable.reverse();
        return new batavia.types.List(new_iterable);
    }

    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'reversed' not implemented for objects");

};

batavia.builtins.reversed.__doc__ = 'reversed(sequence) -> reverse iterator over values of the sequence\n\nReturn a reverse iterator';


batavia.builtins.round = function(args) {
    var p = 0; // Precision
    if (!args) {
      throw new batavia.builtins.TypeError("Required argument 'number' (pos 1) not found");
    }
    if (args.length == 2) {
        p = args[1];
    }
    var result = 0;
    if (batavia.isinstance(args[0], batavia.types.Bool)) {
        result = args[0].__int__();
    } else {
        result = new batavia.vendored.BigNumber(args[0]).round(p);
    }
    if (args.length == 1) {
        return new batavia.types.Int(result);
    }
    return batavia.types.Float(result.valueOf());
};
batavia.builtins.round.__doc__ = 'round(number[, ndigits]) -> number\n\nRound a number to a given precision in decimal digits (default 0 digits).\nThis returns an int when called with one argument, otherwise the\nsame type as the number. ndigits may be negative.';

batavia.builtins.set = function(args,kwargs) {
    if (arguments.length != 2) {
        throw new batavia.builtins.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new batavia.builtins.TypeError("set() doesn't accept keyword arguments.");
    }
    if (args && args.length > 1) {
        throw new batavia.builtins.TypeError("set expected at most 1 arguments, got " + args.length);
    }
    if (!args || args.length == 0) {
        return new batavia.types.Set();
    }
    return new batavia.types.Set(args[0]);
};
batavia.builtins.set.__doc__ = 'set() -> new empty set object\nset(iterable) -> new set object\n\nBuild an unordered collection of unique elements.';

batavia.builtins.setattr = function(args) {
    if (args.length !== 3) {
        throw new batavia.builtins.TypeError("setattr expected exactly 3 arguments, got " + args.length);
    }

    args[0][args[1]] = args[2];
};
batavia.builtins.setattr.__doc__ = "setattr(object, name, value)\n\nSet a named attribute on an object; setattr(x, 'y', v) is equivalent to\n``x.y = v''.";

batavia.builtins.slice = function(args, kwargs) {
    if (args.length == 1) {
        return new batavia.types.Slice({
            start: new batavia.types.Int(0),
            stop: args[0],
            step: new batavia.types.Int(1)
        });
    } else {
        return new batavia.types.Slice({
            start: args[0],
            stop: args[1],
            step: new batavia.types.Int(args[2] || 1)
        });
    }
};
batavia.builtins.slice.__doc__ = 'slice(stop)\nslice(start, stop[, step])\n\nCreate a slice object.  This is used for extended slicing (e.g. a[0:10:2]).';

batavia.builtins.sorted = function(args, kwargs) {
    var validatedInput = batavia.builtins.sorted._validateInput(args, kwargs);
    var iterable = validatedInput["iterable"];

    if (batavia.isinstance(iterable, [batavia.types.List, batavia.types.Tuple])) {
        iterable = iterable.map(validatedInput["preparingFunction"]);
        iterable.sort(function (a, b) {
            // TODO: Replace this with a better, guaranteed stable sort.
            // Javascript's default sort has performance problems in some
            // implementations and is not guaranteed to be stable, while
            // CPython's sorted is stable and efficient. See:
            // * https://docs.python.org/3/library/functions.html#sorted
            // * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
            if (a["key"].__gt__(b["key"])) {
                return validatedInput["bigger"];
            }

            if (a["key"].__lt__(b["key"])) {
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
batavia.builtins.sorted.__doc__ = 'sorted(iterable, key=None, reverse=False) --> new sorted list';

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
batavia.builtins.staticmethod.__doc__ = 'staticmethod(function) -> method\n\nConvert a function to be a static method.\n\nA static method does not receive an implicit first argument.\nTo declare a static method, use this idiom:\n\n     class C:\n     def f(arg1, arg2, ...): ...\n     f = staticmethod(f)\n\nIt can be called either on the class (e.g. C.f()) or on an instance\n(e.g. C().f()).  The instance is ignored except for its class.\n\nStatic methods in Python are similar to those found in Java or C++.\nFor a more advanced concept, see the classmethod builtin.';

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
        return 'None';
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

    try {
        return args[0].reduce(function(a, b) {
            return a.__add__(b);
        }, new batavia.types.Int(0));
    } catch (err) {
        throw new batavia.builtins.TypeError(
                "bad operand type for sum(): 'NoneType'");
    }
};
batavia.builtins.sum.__doc__ = "sum(iterable[, start]) -> value\n\nReturn the sum of an iterable of numbers (NOT strings) plus the value\nof parameter 'start' (which defaults to 0).  When the iterable is\nempty, return start.";

batavia.builtins.super = function(args, kwargs) {
    if (args.length > 0) {
        throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'super' with arguments not implemented");
    }

    return batavia.make_super(this.frame, args);
};
batavia.builtins.super.__doc__ = 'super() -> same as super(__class__, <first argument>)\nsuper(type) -> unbound super object\nsuper(type, obj) -> bound super object; requires isinstance(obj, type)\nsuper(type, type2) -> bound super object; requires issubclass(type2, type)\nTypical use to call a cooperative superclass method:\nclass C(B):\n    def meth(self, arg):\n        super().meth(arg)\nThis works for class methods too:\nclass C(B):\n    @classmethod\n    def cmeth(cls, arg):\n        super().cmeth(arg)\n';

batavia.builtins.tuple = function(args) {
    if (args.length === 0) {
      return new batavia.types.Tuple();
    }
    return new batavia.types.Tuple(args[0]);
};
batavia.builtins.tuple.__doc__ = "tuple() -> empty tuple\ntuple(iterable) -> tuple initialized from iterable's items\n\nIf the argument is a tuple, the return value is the same object.";

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
        if (args[0] === null) {
            return batavia.types.NoneType;
        } else {
            return args[0].__class__;
        }
    } else {
        return new batavia.types.Type(args[0], args[1], args[2]);
    }
};
batavia.builtins.type.__doc__ = "type(object_or_name, bases, dict)\ntype(object) -> the object's type\ntype(name, bases, dict) -> a new type";

batavia.builtins.vars = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'vars' not implemented");
};
batavia.builtins.vars.__doc__ = 'vars([object]) -> dictionary\n\nWithout arguments, equivalent to locals().\nWith an argument, equivalent to object.__dict__.';

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
batavia.builtins.zip.__doc__ = 'zip(iter1 [,iter2 [...]]) --> zip object\n\nReturn a zip object whose .__next__() method returns a tuple where\nthe i-th element comes from the i-th iterable argument.  The .__next__()\nmethod continues until the shortest iterable in the argument sequence\nis exhausted and then it raises StopIteration.';

// Mark all builtins as Python methods.
for (var fn in batavia.builtins) {
    batavia.builtins[fn].__python__ = true;
}

batavia.builtins.None = null;
batavia.builtins.NotImplemented = new batavia.types.NotImplementedType();
