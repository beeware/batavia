var version = require('../core').version
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
    if (args[0].__name__ === 'NoneType') {
        throw new exceptions.TypeError.$pyclass('an integer is required (got type NoneType)')
    }
    return new types.Str(String.fromCharCode(args[0]))
    // After tests pass, let's try saving one object creation
    // return new types.Str.fromCharCode(args[0]);
}
chr.__doc__ = 'chr(i) -> Unicode character\n\nReturn a Unicode string of one character with ordinal i; 0 <= i <= 0x10ffff.'

module.exports = chr
