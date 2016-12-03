
function ord(args, kwargs) {
    return args[0].charCodeAt(0);
}
ord.__doc__ = 'ord(c) -> integer\n\nReturn the integer ordinal of a one-character string.';

module.exports = ord;
