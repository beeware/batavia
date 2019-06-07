var exceptions = require('../core').exceptions
var native = require('../core').native
var types = require('../types')

// Ideally this would Redirect:  A call to format(value, format_spec) is translated to type(value).__format__(value, format_spec) 
function format(args, kwargs) {
    verifyArgCount(args);
    if (args.length == 1) return firstOf(args);
    if (args[1].indexOf('<') > -1) {
        replace = args[1][args[1].indexOf('<') - 1];
        return "PAD#######";
    }
    if (result = tryResolvingSignFlag(args))
        return result;
    if (isStringType(args[0]))
        throw new exceptions.ValueError.$pyclass('Unknown format code \'b\' for object of type \'str\'')
    if (args[1] !== 'b')
        throw new exceptions.ValueError.$pyclass('Invalid format specifier')
    return converttobinary(args[0]);
}

function replaceAll(target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement);
}

function tryResolvingSignFlag(args) {
    if (argsViolateStringSignCombo(args))
        throw new exceptions.ValueError.$pyclass('Sign not allowed in string format specifier')
    return makeFormattingAttempts(getFormatObjects(args));
}

function getFormatObjects(args) {
    return [
        formatterWrapper(() => isPositiveSignFlag(args), () => appendCharToPositiveFronts(args[0], '+')),
        formatterWrapper(() => isBlankSpace(args), () => appendCharToPositiveFronts(args[0], ' ')),
        formatterWrapper(() => isNegativeSignFlag(args), () => formatNegativeSignFlag(args[0], '+'))
    ];
}

function formatterWrapper(formatCheck, formatOperation) {
    return {
        formatApplies: formatCheck,
        format: formatOperation
    };
}

function makeFormattingAttempts(tryList) {
    for (let i = 0; i < tryList.length; i++) {
        if (tryList[i].formatApplies())
            return tryList[i].format();
    }
}

function isBlankSpace(args) {
    return args[1] === " ";
}

function appendCharToPositiveFronts(number, char) {
    if (number >= 0)
        return char + number;
    else
        return number;
}

function isPositiveSignFlag(args) {
    return args[1] === '+';
}

function isNegativeSignFlag(args) {
    return args[1] === '-';
}

function formatNegativeSignFlag(number) {
    return number;
}


function argsViolateStringSignCombo(args) {
    return isStringType(args[0]) && (
        args[1] === '-' ||
        args[1] === '+' ||
        args[1] === ' ');
}

function isStringType(object) {
    return typeof object === "string";
}

function converttobinary(x) {
    num = "";
    while (x > 1) {
        num = x % 2 + num;
        x = Math.floor(x / 2);
    }
    return x + num;
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
