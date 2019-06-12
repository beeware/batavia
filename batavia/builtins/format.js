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

// function format(args, kwargs) {
//     verifyArgCount(args);
//     if (args.length == 1) return firstOf(args);
//     if (result = tryResolvingAlignmentFlags(args))
//         return result;
//     if (result = tryResolvingSignFlag(args))
//         return result;
//     if (isStringType(args[0]))
//         throw new exceptions.ValueError.$pyclass('Unknown format code \'b\' for object of type \'str\'')
//     if (args[1] !== 'b')
//         throw new exceptions.ValueError.$pyclass('Invalid format specifier')
//     return converttobinary(args[0]);
// }

// function spaceLeftToPad(end, args) {
//     return end - args[0].length;
// }

// function getPaddingColumnLength(pattern, alignmentFlag) {
//     return pattern.slice([pattern.indexOf(alignmentFlag) + 1]);
// }

// function tryResolvingAlignmentFlags(args) {
//     return makeFormattingAttempts(getAlignmentFormatObjects(args));
// }

// function tryResolvingSignFlag(args) {
//     if (argsViolateStringSignCombo(args))
//         throw new exceptions.ValueError.$pyclass('Sign not allowed in string format specifier')
//     return makeFormattingAttempts(getFormatObjects(args));
// }

// function makeFormattingAttempts(tryList) {
//     for (let i = 0; i < tryList.length; i++) {
//         if (tryList[i].formatApplies())
//             return tryList[i].format();
//     }
// }

// function formatterWrapper(formatCheck, formatOperation) {
//     return {
//         formatApplies: formatCheck,
//         format: formatOperation
//     };
// }

// function getAlignmentFormatObjects(args) {
//     return [
//         formatterWrapper(() => hasAlignLeftFlag(args), () => pad(args, "<", padLeft)),
//         formatterWrapper(() => hasAlignRightFlag(args), () => pad(args, ">", padRight))
//     ];
// }

// function getFormatObjects(args) {
//     return [
//         formatterWrapper(() => isPositiveSignFlag(args), () => appendCharToPositiveFronts(args[0], '+')),
//         formatterWrapper(() => isBlankSpace(args), () => appendCharToPositiveFronts(args[0], ' ')),
//         formatterWrapper(() => isNegativeSignFlag(args), () => formatNegativeSignFlag(args[0], '+'))
//     ];
// }

// function pad(args, character, direction) {
//     let columnLength = getPaddingColumnLength(args[1], character);
//     let space = spaceLeftToPad(columnLength, args);
//     if(space < 0)
//         return args[0];
//     return direction(args[0], args[1][0], space)
// }

// function padLeft(target, padCharacter, length) {
//     return join(target, padCharacter.repeat(length))
// }

// function padRight(target, padCharacter, length) {
//     return join(padCharacter.repeat(length), target)
// }

// function join(first, last) {
//     return first.toString().concat(last);
// }

// function hasAlignLeftFlag(args) {
//     return args[1].indexOf('<') > -1;
// }

// function hasAlignRightFlag(args) {
//     return args[1].indexOf('>') > -1;
// }

// function isBlankSpace(args) {
//     return args[1] === " ";
// }

// function appendCharToPositiveFronts(number, char) {
//     if (number >= 0)
//         return char + number;
//     else
//         return number;
// }

// function isPositiveSignFlag(args) {
//     return args[1] === '+';
// }

// function isNegativeSignFlag(args) {
//     return args[1] === '-';
// }

// function formatNegativeSignFlag(number) {
//     return number;
// }

// function argsViolateStringSignCombo(args) {
//     return isStringType(args[0]) && (
//         args[1] === '-' ||
//         args[1] === '+' ||
//         args[1] === ' ');
// }

// function isStringType(object) {
//     return typeof object === "string";
// }

// function converttobinary(x) {
//     num = "";
//     while (x > 1) {
//         num = x % 2 + num;
//         x = Math.floor(x / 2);
//     }
//     return x + num;
// }
format.__doc__ = 'Return value.__format__(format_spec)\n\nformat_spec defaults to the empty string.\nSee the Format Specification Mini-Language section of help(\'FORMATTING\') for\ndetails.'

module.exports = format
