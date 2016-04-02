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
        try {
            var payload = document.getElementById('batavia-' + args[0]).text.replace(/(\r\n|\n|\r)/gm, "").trim();
            var bytecode = atob(payload);
            var code = batavia.modules.marshal.load_pyc(this, bytecode);

            // Convert code object to module
            var frame = this.make_frame({'code': code, 'f_globals': args[1], 'f_locals': null});
            this.run_frame(frame);

            batavia.modules.sys.modules[args[0]] = new batavia.core.Module(frame.f_locals);
            if (args[3] === null) {
                // import <mod>
                module = batavia.modules.sys.modules[args[0]];
            } else {
                // from <mod> import *
                module = new batavia.core.Module();
                for (var n in args[3]) {
                    var name = args[3][n];
                    module[name] = frame.f_locals[name];
                }
            }
        } catch (err) {
            throw new batavia.builtins.ImportError("No module named '" + args[0] + "'");
        }
    }
    return module;
};

batavia.builtins.abs = function(args) {
    if (args.length !== 1) {
        throw new batavia.builtins.TypeError("abs() takes exactly one argument (" + args.length + " given)");
    }
    if (args[0] === null) {
        throw new batavia.builtins.TypeError("bad operand type for abs(): 'NoneType'");
    }
    return Math.abs(args[0]);
};

batavia.builtins.all = function(args) {
    for (var i in args[0]) {
        if (!args[0][i]) {
           return false;
        }
    }
    return true;
};

batavia.builtins.any = function(args) {
    for (var i in args[0]) {
        if (args[0][i]) {
           return true;
        }
    }
    return false;
};

batavia.builtins.apply = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'apply' not implemented");
};

batavia.builtins.basestring = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'basestring' not implemented");
};

batavia.builtins.bin = function(args) {
    if (args.length !== 1) {
        throw new batavia.builtins.TypeError("hex() takes exactly one argument (" + args.length + " given)");
    }
    return "0b" + args[0].toString(2);
};

batavia.builtins.bool = function(args) {
    if (args.length !== 1) {
        throw new batavia.builtins.TypeError("bool() takes exactly one argument (" + args.length + " given)");
    }
    return !!args[0];
};

batavia.builtins.bytearray = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'bytearray' not implemented");
};

batavia.builtins.bytes = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'bytes' not implemented");
};

batavia.builtins.callable = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'callable' not implemented");
};

batavia.builtins.chr = function(args, kwargs) {
    return String.fromCharCode(args[0]);
};

batavia.builtins.classmethod = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'classmethod' not implemented");
};

batavia.builtins.compile = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'compile' not implemented");
};

batavia.builtins.complex = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'complex' not implemented");
};

batavia.builtins.copyright = function() {
    console.log("Batavia: Copyright (c) 2015 Russell Keith-Magee. (BSD-3 Licence)\n"+
                "byterun: Copyright (c) 2013, Ned Batchelder. (MIT Licence)");
};

batavia.builtins.credits = function() {
    console.log("Thanks to all contributors, including those in AUTHORS, for supporting Batavia development. See https://github.com/pybee/batavia for more information");
};

batavia.builtins.delattr = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'delattr' not implemented");
};

batavia.builtins.dict = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'dict' not implemented");
};

batavia.builtins.dir = function(args) {
    if (args.length !== 1) {
        throw new batavia.builtins.TypeError("dir() takes exactly one argument (" + args.length + " given)");
    }
    return Object.keys(args[0]);
};

batavia.builtins.divmod = function(args) {
    if (args.length !== 2) {
        throw new batavia.builtins.TypeError("divmod() takes exactly one argument (" + args.length + " given)");
    }
    div = Math.floor(args[0]/args[1]);
    rem = args[0] % args[1];
    // FIXME send this result back as a proper set
    return [div, rem];
};

batavia.builtins.enumerate = function(args) {
    var result = [];
    var values = args[0];
    for (i = 0; i < values.length; i++) {
        result.push([i, values[i]])    
    }
    // FIXME this should return a generator, not list
    return result;
};

batavia.builtins.eval = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'eval' not implemented");
};

batavia.builtins.exit = function() {
    // NOTE You can't actually exit a JavaScript session, so...
    console.log("Goodbye");
};

batavia.builtins.file = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'file' not implemented");
};

batavia.builtins.filter = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'filter' not implemented");
};

batavia.builtins.float = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'float' not implemented");
};

batavia.builtins.format = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'format' not implemented");
};

batavia.builtins.frozenset = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'frozenset' not implemented");
};

batavia.builtins.getattr = function(args) {
    try {
        return args[0][args[1]];
    } catch (err) {
        if (args) {
            if (args.length === 3) {
                return args[2];
            } else if (args.length === 2) {
                throw new batavia.builtins.AttributeError("'" + args[0] + "' object has no attribute '" + args[1] + "'");
            } else if (args.length < 2) {
                throw new batavia.builtins.TypeError("getattr expected at least 2 arguments, got " + args.length);
            } else {
                throw new batavia.builtins.TypeError("getattr expected at most 3 arguments, got " + args.length);
            }
        } else {
            throw new batavia.builtins.TypeError("getattr expected at least 2 arguments, got 0");
        }
    }
};

batavia.builtins.globals = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'globals' not implemented");
};

batavia.builtins.hasattr = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'hasattr' not implemented");
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

batavia.builtins.int = function(args) {
    var base = 10;
    if (args.length > 1) {
        base = args[1];
    }
    return parseInt(args[0], base);
};

batavia.builtins.intern = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'intern' not implemented");
};

batavia.builtins.isinstance = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'isinstance' not implemented");
};

batavia.builtins.issubclass = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'issubclass' not implemented");
};

batavia.builtins.iter = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'iter' not implemented");
};

batavia.builtins.len = function(args, kwargs) {
    return args[0].length;
};

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
    return Math.max.apply(null, args);
};

batavia.builtins.memoryview = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'memoryview' not implemented");
};

batavia.builtins.min = function(args, kwargs) {
return Math.min.apply(null, args);
};

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

batavia.builtins.pow = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'pow' not implemented");
};

batavia.builtins.print = function(args, kwargs) {
    batavia.stdout(args.join(' ') + '\n');
};

batavia.builtins.property = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'property' not implemented");
};

batavia.builtins.quit = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'quit' not implemented");
};

batavia.builtins.range = function(args, kwargs){
    return range(args[0], args[1], args[2]);
};

batavia.builtins.raw_input = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'raw_input' not implemented");
};

batavia.builtins.reduce = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'reduce' not implemented");
};

batavia.builtins.reload = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'reload' not implemented");
};

batavia.builtins.repr = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'repr' not implemented");
};

batavia.builtins.reversed = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'reversed' not implemented");
};

batavia.builtins.round = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'round' not implemented");
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

batavia.builtins.sorted = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'sorted' not implemented");
};

batavia.builtins.staticmethod = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'staticmethod' not implemented");
};

batavia.builtins.str = function(args) {
    console.log(typeof args[0]);
    // FIXME: object's __str__ method should be used if available
    return String(args[0]);
};

batavia.builtins.sum = function(args) {
    var total = args.reduce(function(a, b) {
        return a + b;
    });
    return total;
};

batavia.builtins.super = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'super' not implemented");
};

batavia.builtins.tuple = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'tuple' not implemented");
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

batavia.builtins.xrange = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'xrange' not implemented");
};

batavia.builtins.zip = function() {
    throw new batavia.builtins.NotImplementedError("Builtin Batavia function 'zip' not implemented");
};

// Mark all builtins as Python methods.
for (var fn in batavia.builtins) {
    batavia.builtins[fn].__python__ = true;
}
