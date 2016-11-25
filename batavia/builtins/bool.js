var exceptions = require('../core').exceptions;
var types = require('../types');

var bool = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new exceptions.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError("bool() doesn't accept keyword arguments");
    }
    if (!args || args.length === 0) {
        return new types.Bool(false);
    } else if (args.length != 1) {
        throw new exceptions.TypeError('bool() expected exactly 1 argument (' + args.length + ' given)');
    }

    if (args[0] === null) {
        return new types.NoneType.__bool__();
    } else if (args[0].__bool__) {
        return args[0].__bool__();
    } else {
        return new types.Bool((!!args[0].valueOf()));
    }
};
bool.__doc__ = 'bool(x) -> bool\n\nReturns True when the argument x is true, False otherwise.\nIn CPython, the builtins True and False are the only two instances of the class bool.\nAlso in CPython, the class bool is a subclass of the class int, and cannot be subclassed.\nBatavia implements booleans as a native Javascript Boolean, enhanced with additional __dunder__ methods.\n"Integer-ness" of booleans is faked via builtins.Bool\'s __int__ method.';

module.exports = bool;
