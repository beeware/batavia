var exceptions = require('../core').exceptions
var types = require('../types')
var type_name = require('../core').type_name

function nonNumericFilter(value) {
    return /\D/.test(value)
}

function asBytes(value) {
    return new types.Bytes(value)
}

function bytearray(args, kwargs) {
//    bytearray(string, encoding[, errors]) -> bytearray
//    bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
//    bytearray(iterable_of_ints) -> bytearray
//    bytearray(int) -> bytes array of size given by the parameter initialized with null bytes
//    bytearray() -> empty bytes array
    var notIterableTypes = [
        types.NoneType,
        types.NotImplementedType,
        types.Type,
        types.Complex,
        types.Float,
        types.Slice
    ]

    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("<fn>() doesn't accept keyword arguments.")
    }
    if (args.length === 1 && types.isinstance(args[0], types.Bytes)) {
        // bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
        return new types.Bytearray(args[0])
    } else if (args.length === 1 && types.isinstance(args[0], types.Bool)) {
        // bytearray(True) -> bytearray(b'\x00')
        if (args[0]) {
            return new types.Bytearray(new types.Bytes([0]))
        // bytearray(False) -> bytearray(b'')
        } else {
            return new types.Bytearray(new types.Bytes([]))
        }
    } else if (types.isinstance(args[0], notIterableTypes)) {
        throw new exceptions.TypeError.$pyclass('\'' + type_name(args[0]) + '\' object is not iterable')
    } else if (types.isinstance(args[0], types.Bytearray)) {
        return new types.Bytearray(args[0])
    } else if (types.isinstance(args[0], [types.Dict, types.List])) {
        var toConvert
        if (types.isinstance(args[0], types.Dict)) {
            toConvert = args[0].keys()
        } else {
            toConvert = args[0]
        }
        let nonDigits = toConvert.filter(nonNumericFilter)
        if (nonDigits.length > 0) {
            throw new exceptions.TypeError.$pyclass('an integer is required')
        }
        return new types.Bytearray(toConvert.map(asBytes))
    } else if (types.isinstance(args[0], [types.FrozenSet, types.Set])) {
        var asList = new types.List(args[0].data.keys())
        let nonDigits = asList.filter(nonNumericFilter)
        if (nonDigits.length > 0) {
            throw new exceptions.TypeError.$pyclass('an integer is required')
        }
        return new types.Bytearray(asList.map(function(value) {
            return asBytes([value])
        }))
    }
}
bytearray.__doc__ = 'bytearray(iterable_of_ints) -> bytearray\nbytearray(string, encoding[, errors]) -> bytearray\nbytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer\nbytearray(int) -> bytes array of size given by the parameter initialized with null bytes\nbytearray() -> empty bytes array\n\nConstruct an mutable bytearray object from:\n  - an iterable yielding integers in range(256)\n  - a text string encoded using the specified encoding\n  - a bytes or a buffer object\n  - any object implementing the buffer API.\n  - an integer'

module.exports = bytearray
