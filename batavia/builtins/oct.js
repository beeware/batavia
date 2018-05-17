var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var types = require('../types')

function oct(args, kwargs) {
    if (!args) {
        throw new exceptions.TypeError.$pyclass('oct() takes exactly one argument (0 given)')
    } else if (args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('oct() takes exactly one argument (' + args.length + ' given)')
    }
    var value = args[0]
    if (types.isinstance(value, types.Int)) {
        if (value.val.isNeg() && !value.val.isZero()) {
            return '-0o' + value.val.toString(8).substr(1)
        } else {
            return '0o' + value.val.toString(8)
        }
    } else if (types.isinstance(value, types.Bool)) {
        return '0o' + value.__int__().toString(8)
    } else {
        throw new exceptions.TypeError.$pyclass("'" + type_name(value) + "' object cannot be interpreted as an integer")
    }
};
oct.__doc__ = "oct(number) -> string\n\nReturn the octal representation of an integer.\n\n   >>> oct(342391)\n   '0o1234567'\n"

module.exports = oct
