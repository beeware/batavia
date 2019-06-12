var exceptions = require('../core').exceptions
var types = require('../types')

function format(args, kwargs) {
    verifyArgCount(args);
    if (args.length === 1) return firstOf(args);
    if (args[1] === '') return firstOf(args);
    return types.js2py(args[0]).__format__(args[0], args[1]);
}

function verifyArgCount(args) {
    if (noArgumentsGiven(args)) {
        throw new exceptions.TypeError.$pyclass('format() takes at least 1 argument (0 given)')
    }
    if (argumentsExceed(2, args)) {
        throw new exceptions.TypeError.$pyclass('format() takes at most 2 arguments (' + args.length + ' given)')
    }
}

function argumentsExceed(count, args) {
    return args.length > count;
}

function noArgumentsGiven(args) {
    return !args || args.length === 0;
}

function firstOf(args) {
    return args[0];
}
format.__doc__ = 'Return value.__format__(format_spec)\n\nformat_spec defaults to the empty string.\nSee the Format Specification Mini-Language section of help(\'FORMATTING\') for\ndetails.'

module.exports = format
