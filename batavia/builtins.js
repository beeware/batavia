/*
General builtin format:

// Example: a function that accepts exactly one argument, and no keyword arguments

var <fn> = function(<args>, <kwargs>) {
    if (arguments.length != 2) {
        throw new builtins.BataviaError.$pyclass("Batavia calling convention not used.");
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new builtins.TypeError.$pyclass("<fn>() doesn't accept keyword arguments.");
    }
    if (!args || args.length != 1) {
        throw new builtins.TypeError.$pyclass("<fn>() expected exactly 1 argument (" + args.length + " given)");
    }
    // if the function only works with a specific object type, add a test
    var obj = args[0];
    if (!types.isinstance(obj, types.<type>)) {
        throw new builtins.TypeError.$pyclass(
            "<fn>() expects a <type> (" + type_name(obj) + " given)");
    }
    // actual code goes here
    Javascript.Function.Stuff();
}
<fn>.__doc__ = 'docstring from Python 3.4 goes here, for documentation'

modules.export = <fn>

*/

var builtins = {
    '__import__': require('./builtins/__import__'),
    'abs': require('./builtins/abs'),
    'all': require('./builtins/all'),
    'any': require('./builtins/any'),
    'ascii': require('./builtins/ascii'),
    'bin': require('./builtins/bin'),
    'bool': require('./builtins/bool'),
    'bytearray': require('./builtins/bytearray'),
    'bytes': require('./builtins/bytes'),
    'callable': require('./builtins/callable'),
    'chr': require('./builtins/chr'),
    'classmethod': require('./builtins/classmethod'),
    'compile': require('./builtins/compile'),
    'complex': require('./builtins/complex'),
    'copyright': require('./builtins/copyright'),
    'credits': require('./builtins/credits'),
    'delattr': require('./builtins/delattr'),
    'dict': require('./builtins/dict'),
    'dir': require('./builtins/dir'),
    'divmod': require('./builtins/divmod'),
    'enumerate': require('./builtins/enumerate'),
    'eval': require('./builtins/eval'),
    'exec': require('./builtins/exec'),
    'filter': require('./builtins/filter'),
    'float': require('./builtins/float'),
    'frozenset': require('./builtins/frozenset'),
    'getattr': require('./builtins/getattr'),
    'globals': require('./builtins/globals'),
    'hasattr': require('./builtins/hasattr'),
    'hash': require('./builtins/hash'),
    'help': require('./builtins/help'),
    'hex': require('./builtins/hex'),
    'id': require('./builtins/id'),
    'input': require('./builtins/input'),
    'int': require('./builtins/int'),
    'isinstance': require('./builtins/isinstance'),
    'issubclass': require('./builtins/issubclass'),
    'iter': require('./builtins/iter'),
    'len': require('./builtins/len'),
    'license': require('./builtins/license'),
    'list': require('./builtins/list'),
    'locals': require('./builtins/locals'),
    'map': require('./builtins/map'),
    'max': require('./builtins/max'),
    'memoryview': require('./builtins/memoryview'),
    'min': require('./builtins/min'),
    'next': require('./builtins/next'),
    'oct': require('./builtins/oct'),
    'open': require('./builtins/open'),
    'ord': require('./builtins/ord'),
    'pow': require('./builtins/pow'),
    'print': require('./builtins/print'),
    'property': require('./builtins/property'),
    'range': require('./builtins/range'),
    'repr': require('./builtins/repr'),
    'reversed': require('./builtins/reversed'),
    'round': require('./builtins/round'),
    'set': require('./builtins/set'),
    'setattr': require('./builtins/setattr'),
    'slice': require('./builtins/slice'),
    'sorted': require('./builtins/sorted'),
    'staticmethod': require('./builtins/staticmethod'),
    'str': require('./builtins/str'),
    'sum': require('./builtins/sum'),
    'super': require('./builtins/super'),
    'tuple': require('./builtins/tuple'),
    'type': require('./builtins/type'),
    'vars': require('./builtins/vars'),
    'zip': require('./builtins/zip'),
};

// Mark all builtins as Python methods.
for (var fn in builtins) {
    builtins[fn].$pyargs = true;
}

// Copy in core symbols that need to be in the builtins.
builtins['None'] = require('./core').None;
builtins['NotImplemented'] = require('./core').NotImplemented;
builtins['dom'] = require('./modules/dom');

// Copy in the core types
builtins['object'] = require('./core').Object.prototype.__class__;

// Copy the exceptions into the builtin namespace.
var exceptions = require('./core').exceptions;
for (var exc in exceptions) {
    builtins[exc] = exceptions[exc];
}

// And export all the builtins.
module.exports = builtins;
