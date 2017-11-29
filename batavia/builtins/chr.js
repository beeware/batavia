var version = require('../core').version
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var types = require('../types')

function chr(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass('chr() takes no keyword arguments')
    }
    if (!args || args.length !== 1) {
        if (version.later('3.4')) {
            throw new exceptions.TypeError.$pyclass(
                'chr() takes exactly one argument (' + args.length + ' given)'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'chr() takes exactly 1 argument (' + args.length + ' given)'
            )
        }
    }
    if (types.isinstance(args[0], types.Complex)) {
        throw new exceptions.TypeError.$pyclass('can\'t convert complex to int')
    }
    if (types.isinstance(args[0], types.Float)) {
        throw new exceptions.TypeError.$pyclass('integer argument expected, got float')
    }
    if (types.isinstance(args[0], types.Bool)) {
        return new types.Str(String.fromCharCode(args[0].__int__()))
    }
    if (!types.isinstance(args[0], types.Int)) {
        throw new exceptions.TypeError.$pyclass('an integer is required (got type ' + type_name(args[0]) + ')')
    }
    if (args[0].__ge__(new types.Int(0).MAX_INT.__add__(new types.Int(1))) || args[0].__le__(new types.Int(0).MIN_INT.__sub__(new types.Int(1)))) {
        throw new exceptions.OverflowError.$pyclass('Python int too large to convert to C long')
    }
    if (args[0].__ge__(new types.Int(0).MAX_INT)) {
        throw new exceptions.OverflowError.$pyclass('signed integer is greater than maximum')
    }
    if (args[0].__le__(new types.Int(0).MIN_INT.__add__(new types.Int(1)))) {
        throw new exceptions.OverflowError.$pyclass('signed integer is less than minimum')
    }
    if (args[0].__lt__(new types.Int(0))) {
        throw new exceptions.ValueError.$pyclass('chr() arg not in range(0xXXXXXXXX)')
    }
    return new types.Str(String.fromCharCode(new types.Int(args[0])))
    // After tests pass, let's try saving one object creation
    // return new types.Str.fromCharCode(args[0]);
}
chr.__doc__ = 'chr(i) -> Unicode character\n\nReturn a Unicode string of one character with ordinal i; 0 <= i <= 0x10ffff.'

module.exports = chr
