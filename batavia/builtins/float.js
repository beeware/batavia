var exceptions = require('../core').exceptions
var str = require('./str')
var type_name = require('../core').type_name
var types = require('../types')

function float(args, kwargs) {
    if (args.length > 1) {
        throw new exceptions.TypeError.$pyclass('float() takes at most 1 argument (' + args.length + ' given)')
    }
    if (args.length === 0) {
        return new types.Float(0.0)
    }

    var value = args[0]

    // For some reason complex throws a non-standard error message
    if (types.isinstance(value, types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't convert complex to float")
    }

    if (types.isinstance(value, [types.Bytes, types.Bytearray, types.Str])) {
        // Attempt to convert bytearray to string for parsing.
        var was_byte_object = false
        if (types.isinstance(value, [types.Bytes, types.Bytearray])) {
            was_byte_object = true
            value = str([value], null)
        }
        if (value.length === 0 || value === "b''" || value === "bytearray''") {
            throw new exceptions.ValueError.$pyclass('could not convert string to float: ')
        } else if (value.search(/[^-0-9.]/g) === -1) {
            return new types.Float(parseFloat(value))
        } else {
            if (value === 'nan' || value === '+nan' || value === '-nan') {
                return new types.Float(NaN)
            } else if (value === 'inf' || value === '+inf') {
                return new types.Float(Infinity)
            } else if (value === '-inf') {
                return new types.Float(-Infinity)
            }
            // Byte object errors are reported without quotations.
            if (was_byte_object) {
                throw new exceptions.ValueError.$pyclass('could not convert string to float: ' + value)
            } else {
                throw new exceptions.ValueError.$pyclass("could not convert string to float: '" + value + "'")
            }
        }
    } else if (types.isinstance(value, [types.Int, types.Bool, types.Float])) {
        return args[0].__float__()
    } else {
        throw new exceptions.TypeError.$pyclass(
            "float() argument must be a string, a bytes-like object or a number, not '" + type_name(args[0]) + "'")
    }
}
float.__doc__ = 'float([x]) -> Convert a string or a number to floating point.'

module.exports = float
