var constants = require('../core').constants
var exceptions = require('../core').exceptions
var types = require('../types')

function chr(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass('chr() takes no keyword arguments')
    }
    if (!args || args.length !== 1) {
        switch (constants.BATAVIA_MAGIC) {
            case constants.BATAVIA_MAGIC_34:
                throw new exceptions.TypeError.$pyclass('chr() takes exactly 1 argument (' + args.length + ' given)')

            case constants.BATAVIA_MAGIC_35a0:
            case constants.BATAVIA_MAGIC_35:
            case constants.BATAVIA_MAGIC_353:
            case constants.BATAVIA_MAGIC_36:
                throw new exceptions.TypeError.$pyclass('chr() takes exactly one argument (' + args.length + ' given)')

            default:
                throw new exceptions.BataviaError.$pyclass('Unsupported BATAVIA_MAGIC. Possibly using unsupported Python version (supported: 3.4, 3.5)')
        }
    }
    if (args[0].__name__ === 'NoneType') {
        throw new exceptions.TypeError.$pyclass('an integer is required (got type NoneType)')
    }
    return new types.Str(String.fromCharCode(args[0]))
    // After tests pass, let's try saving one object creation
    // return new types.Str.fromCharCode(args[0]);
}
chr.__doc__ = 'chr(i) -> Unicode character\n\nReturn a Unicode string of one character with ordinal i; 0 <= i <= 0x10ffff.'

module.exports = chr
