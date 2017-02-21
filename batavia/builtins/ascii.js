var exceptions = require('../core').exceptions
var repr = require('./repr')

function ascii(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("ascii() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('ascii() takes exactly 1 argument (' + args.length + ' given)')
    }

    var repr_string = repr([args[0]], null)
    var ascii_string = ''
    var lead_surrogate = 0x0

    for (var i = 0; i < repr_string.length; i++) {
        var char_code = repr_string[i].charCodeAt(0)
        var combined_char_code
        var current_character
        var hex_code
        var zeroes = ''

        // if char_code is a lead surrogate, assign to variable and continue out of loop
        if (char_code > 0xd800 && char_code <= 0xd83f) {
            lead_surrogate = char_code
            continue
        }

        // if lead_surrogate populated, calculate combined char_code; reset lead_surrogate
        if (lead_surrogate >= 0xd800 && lead_surrogate <= 0xd83f) {
            char_code = ((lead_surrogate - 0xD800) * 0x400) + (char_code - 0xDC00) + 0x10000
            hex_code = char_code.toString(16)
            lead_surrogate = 0x0
        } else {
            hex_code = char_code.toString(16)
        }

        if (char_code < 127) {
            current_character = repr_string[i]
        } else if (char_code < 256) {
            for (var two_index = 0; two_index < 2 - hex_code.length; two_index++) {
                zeroes += '0'
            }
            current_character = '\\x' + zeroes + hex_code
        } else if (char_code < 65536) {
            for (var four_index = 0; four_index < 4 - hex_code.length; four_index++) {
                zeroes += '0'
            }
            current_character = '\\u' + zeroes + hex_code
        } else if (char_code < 1114112) {
            for (var eight_index = 0; eight_index < 8 - hex_code.length; eight_index++) {
                zeroes += '0'
            }
            current_character = '\\U' + zeroes + hex_code
        }
        ascii_string += current_character
    }
    return ascii_string
}
ascii.__doc__ = 'ascii(object) -> string\n\nAs repr(), return a string containing a printable representation of an\nobject, but escape the non-ASCII characters in the string returned by\nrepr() using \\x, \\u or \\U escapes.  This generates a string similar\nto that returned by repr() in Python 2.'

module.exports = ascii
