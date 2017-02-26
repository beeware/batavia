var exceptions = require('../core').exceptions
var callables = require('../core').callables
var type_name = require('../core').type_name
var types = require('../types')

function bool(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("bool() doesn't accept keyword arguments")
    }
    if (!args || args.length === 0) {
        return new types.Bool(false)
    } else if (args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('bool() expected exactly 1 argument (' + args.length + ' given)')
    }

    if (args[0] === null) {
        return new types.NoneType.__bool__()
    } else if (args[0].__bool__) {
        // args[0].__bool__, if it exists, is a batavia.types.Function.js,
        // *not* a native Javascript function. Therefore we can't call it in
        // the seemingly obvious way, with __bool__().
        var output = callables.call_method(args[0], '__bool__', [])
        if (type_name(output) === 'bool') {
            return output
        } else {
            throw new exceptions.TypeError.$pyclass('__bool__ should return bool, returned ' + type_name(output))
        }
    // Python bool() checks for __bool__ and then, if __bool__ is not defined,
    // for __len__. See https://docs.python.org/3.4/library/stdtypes.html#truth.
    } else if (args[0].__len__) {
        output = callables.call_method(args[0], '__len__', [])
        var output_type = type_name(output)

        if (output_type === 'int') {
            // Yes, the value under the hood can have been cast to string
            // even if the output type is int and the value __len__ appears to
            // output in the browser is an integer.
            return !!parseInt(output.valueOf())
        } else {
            throw new exceptions.TypeError.$pyclass("'" + output_type + "' object cannot be interpreted as an integer")
        }
    } else {
        return new types.Bool((!!args[0].valueOf()))
    }
}
bool.__doc__ = 'bool(x) -> bool\n\nReturns True when the argument x is true, False otherwise.\nIn CPython, the builtins True and False are the only two instances of the class bool.\nAlso in CPython, the class bool is a subclass of the class int, and cannot be subclassed.\nBatavia implements booleans as a native Javascript Boolean, enhanced with additional __dunder__ methods.\n"Integer-ness" of booleans is faked via builtins.Bool\'s __int__ method.'

module.exports = bool
