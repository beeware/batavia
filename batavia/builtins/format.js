var version = require('../core').version
var exceptions = require('../core').exceptions

function format(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (!args || args.length === 0) {
        throw new exceptions.TypeError.$pyclass(
            'format() takes at least 1 argument (' + args.length + ' given)'
        )
    }
    if (args.length > 2) {
        throw new exceptions.TypeError.$pyclass(
            'format() takes at most 2 arguments (' + args.length + ' given)'
        )
    }
    if (!args[0].__format__) {
        throw new exceptions.BataviaError.$pyclass(
            '__format__ not implemented for this type.'
        )
    }
    return args[0].__format__(args[0], args[1]) // TODO: Implement the __format__ function for types like int and string, where it actually can do something
}

if (!version.earlier('3.6') {
    format.__doc__ = "Return value.__format__(format_spec)\n\nformat_spec defaults to the empty string.\nSee the Format Specification Mini-Language section of help('FORMATTING') for\ndetails."
} else {
    format.__doc__ = 'Return value.__format__(format_spec)\n\nformat_spec defaults to the empty string'
}			

module.exports = format
