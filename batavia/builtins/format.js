var exceptions = require('../core').exceptions
var callables = require('../core').callables

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
    if (args[1] === "" || args[1] === undefined) {
        return args[0];
    }
    if (!args[0].__format__) {
        throw new exceptions.BataviaError.$pyclass(
            '__format__ not implemented for this type.'
        )
    }
    let stringAutoFormat;
    if (stringAutoFormat = stringFormatStandIn(args)) { // See if __format__ is implemented or a stub - TODD: remove
        return stringAutoFormat;                        // If it's a stub, send the formatting to "".format()
    }
    return args[0].__format__(args[0], args[1]) // TODO: Implement the __format__ function for types like int and string, where it actually can do something
}

function stringFormatStandIn(args) {
    const callables = require('../core').callables;
    let result = false;
    try {
        args[0].__format__(args[0], args[1]);
    } catch (error) {
        if(error.toString() === "TypeError: Cannot read property '$pyclass' of undefined"){
            return callables.call_method('{:' + args[1] + '}', 'format', [args[0]], {});
        }
    }
    return result;
}
format.__doc__ = 'Return value.__format__(format_spec)\n\nformat_spec defaults to the empty string'

module.exports = format;
