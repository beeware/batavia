var callables = require('../core').callables
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var types = require('../types')

function bin(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("bin() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('bin() takes exactly one argument (' + args.length + ' given)')
    }

    const obj = args[0]

    if (!obj.__index__) {
        throw new exceptions.TypeError.$pyclass("'" + type_name(obj) + "' object cannot be interpreted as an integer")
    }

    let binaryDigits = callables.call_method(obj, '__index__', []).toString(2)
    if (binaryDigits[0] === '-') {
        return new types.Str('-0b' + binaryDigits.slice(1))
    }
    return new types.Str('0b' + binaryDigits)
}

bin.__doc__ = "Return the binary representation of an integer.\n\n   >>> bin(2796202)\n   '0b1010101010101010101010'"

module.exports = bin
