var exceptions = require('../core').exceptions
var native = require('../core').native
var types = require('../types')

function format(args, kwargs) {
    if(!args || args.length === 0){
        throw new exceptions.TypeError.$pyclass('format() takes at least 1 argument (0 given)')
    }
    if(args.length == 1) return args[0];

    //             throw new exceptions.TypeError.$pyclass('hasattr(): attribute name must be string')
    // if (args) {
    //     if (args.length === 2) {
    //         if (!types.isinstance(args[1], types.Str)) {
    //             throw new exceptions.TypeError.$pyclass('hasattr(): attribute name must be string')
    //         }

    //         var val
    //         try {
    //             if (args[0].__getattribute__ === undefined) {
    //                 val = native.getattr(args[0], args[1])
    //             } else {
    //                 val = native.getattr_py(args[0], args[1])
    //             }
    //         } catch (err) {
    //             if (err instanceof exceptions.AttributeError.$pyclass) {
    //                 val = undefined
    //             } else {
    //                 throw err
    //             }
    //         }

    //         return val !== undefined
    //     } else {
    //         throw new exceptions.TypeError.$pyclass('hasattr expected exactly 2 arguments, got ' + args.length)
    //     }
    // } else {
    //     throw new exceptions.TypeError.$pyclass('hasattr expected exactly 2 arguments, got 0')
    // }
}
format.__doc__ = 'Return value.__format__(format_spec)\n\nformat_spec defaults to the empty string.\nSee the Format Specification Mini-Language section of help(\'FORMATTING\') for\ndetails.'

module.exports = format
