var exceptions = require('../core').exceptions
var types = require('../types')
var type_name = require('../core').type_name
var bytes = require('./bytes')
var repr = require('./repr')

function int(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("int() doesn't accept keyword arguments")
    }

    var base = 10
    var value = 0
    var unsupported_numeric_types = [types.Complex]
    var unsupported_nonnumeric_types = [types.Dict, types.FrozenSet, types.List, types.NoneType,
        types.NotImplementedType, types.Range, types.Set, types.Slice, types.Tuple]
    if (!args || args.length === 0) {
        return new types.Int(0)
    } else if (args && args.length === 1) {
        value = args[0]
        if (types.isinstance(value, [types.Int, types.Bool])) {
            return value.__int__()
        } else if (types.isinstance(value, unsupported_numeric_types)) {
            throw new exceptions.TypeError.$pyclass(
                "can't convert " + type_name(value) + ' to int'
            )
        // Check for non-numeric types and classes (type_name = 'type')
        } else if (types.isinstance(value, unsupported_nonnumeric_types) || type_name(value) === 'type') {
            throw new exceptions.TypeError.$pyclass(
                "int() argument must be a string, a bytes-like object or a number, not '" + type_name(value) + "'"
            )
        }
    } else if (args && args.length === 2) {
        value = args[0]
        base = args[1]
    } else {
        throw new exceptions.TypeError.$pyclass(
            'int() takes at most 2 arguments (' + args.length + ' given)')
    }
    // The CPython int() implementation appears to resolve bytearrays to bytes objects before reporting ValueErrors
    if (types.isinstance(value, types.Bytearray)) {
        value = bytes([value], null)
    }
    // TODO: this should be able to parse things longer than 53 bits
    var result = parseInt(value, base)
    if (isNaN(result)) {
        throw new exceptions.ValueError.$pyclass(
            'invalid literal for int() with base ' + base + ': ' + repr([value], null)
        )
    }
    return new types.Int(result)
}
int.__doc__ = "int(x=0) -> integer\nint(x, base=10) -> integer\n\nConvert a number or string to an integer, or return 0 if no arguments\nare given.  If x is a number, return x.__int__().  For floating point\nnumbers, this truncates towards zero.\n\nIf x is not a number or if base is given, then x must be a string,\nbytes, or bytearray instance representing an integer literal in the\ngiven base.  The literal can be preceded by '+' or '-' and be surrounded\nby whitespace.  The base defaults to 10.  Valid bases are 0 and 2-36.\nBase 0 means to interpret the base from the string as an integer literal.\n>>> int('0b100', base=0)\n4"

module.exports = int
