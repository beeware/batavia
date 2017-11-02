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
    if (args.length === 0) {
        return new types.Bytearray(new types.Bytes([]))
    } else if (args.length === 1 && types.isinstance(args[0], types.Bytes)) {
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
    } else if (types.isinstance(args[0], types.Dict)) {
        var toConvert = args[0].keys()
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
    } else if (types.isinstance(args[0], types.Int)) {
        let asInt = new types.Int(args[0])
        if (asInt.__gt__(asInt.MAX_INT) || asInt.__lt__(asInt.MIN_INT)) {
            throw new exceptions.OverflowError.$pyclass('cannot fit \'int\' into an index-sized integer')
        } else if (asInt.__lt__(new types.Int(0))) {
            throw new exceptions.ValueError.$pyclass('negative count')
        } else if (asInt.__eq__(asInt.MAX_INT)) {
            throw new exceptions.MemoryError.$pyclass('')
        }
        let retArray = []
        for (var i = 0; i < args[0]; i++) {
            retArray.push(0)
        }
        return new types.Bytearray(new types.Bytes(retArray))
    } else if (types.isinstance(args[0], [types.List, types.Range, types.Tuple])) {
        let toConvert
        if (types.isinstance(args[0], [types.Range, types.Tuple])) {
            toConvert = new types.List(args[0])
        } else {
            toConvert = args[0]
        }
        toConvert = toConvert.map(function(value) {
            if (types.isinstance(value, types.Bool)) {
                return value.__int__()
            }
            if (types.isinstance(value, types.Int)) {
                return value.int32()
            }
            return value
        })
        let nonDigits = toConvert.filter(function(value) {
            return !types.isinstance(value, [types.Int, types.Bool])
        })
        if (nonDigits.length > 0) {
            throw new exceptions.TypeError.$pyclass('an integer is required')
        }
        return new types.Bytearray(new types.Bytes(toConvert))
    } else if (types.isinstance(args[0], types.Str)) {
        if (args.length < 2) {
            throw new exceptions.TypeError.$pyclass('string argument without an encoding')
        }
        return new types.Bytearray(args[0].encode(args.slice(1), kwargs))
    }
}
bytearray.__doc__ = 'bytearray(iterable_of_ints) -> bytearray\nbytearray(string, encoding[, errors]) -> bytearray\nbytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer\nbytearray(int) -> bytes array of size given by the parameter initialized with null bytes\nbytearray() -> empty bytes array\n\nConstruct an mutable bytearray object from:\n  - an iterable yielding integers in range(256)\n  - a text string encoded using the specified encoding\n  - a bytes or a buffer object\n  - any object implementing the buffer API.\n  - an integer'

module.exports = bytearray
