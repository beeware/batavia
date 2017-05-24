var exceptions = require('../core').exceptions
var types = require('../types')

function repeatArray(value, len) {
    var A = []
    var i = 0
    for (i = 0; i < len; i++) {
        A[i] = value
    }
    return A
}

function bytearray(args, kwargs) {
//    bytearray(string, encoding[, errors]) -> bytearray
//    bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
//    bytearray(iterable_of_ints) -> bytearray
//    bytearray(int) -> bytes array of size given by the parameter initialized with null bytes
//    bytearray() -> empty bytes array

    // console.log('args')
    // console.log(args)
    // console.log('args.length')
    // console.log(args.length)
    // console.log('args[0]')
    // console.log(args[0])
    // console.log('kwargs')
    // console.log(kwargs)
    // console.log('arguments')
    // console.log(arguments)
    // console.log('arguments.length')
    // console.log(arguments.length)

    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("<fn>() doesn't accept keyword arguments.")
    }

    if (args.length === 0) {
        // bytearray() -> empty bytes array
        return new types.Bytearray(new types.Bytes([]))
    } else if (args.length === 1 && types.isinstance(args[0], types.Int)) {
        var arg_value = args[0]
        var arg_value_chunks = arg_value.val.c
        var arg_value_exponent = arg_value.val.e
        var arg_value_sign = arg_value.val.s

        // throw OverflowError(cannot fit 'int' into an index-sized integer)
        // if int >= 9223372036854775808 || int < -9223372036854775808
        if (arg_value_exponent > 18) {
            throw new exceptions.OverflowError.$pyclass("cannot fit 'int' into an index-sized integer")
        } else if (arg_value_exponent === 18 && arg_value_chunks[0] > 92233) {
            throw new exceptions.OverflowError.$pyclass("cannot fit 'int' into an index-sized integer")
        } else if (arg_value_exponent === 18 && arg_value_chunks[0] === 92233 && arg_value_chunks[1] > 72036854775808 && arg_value_sign === -1) {
            throw new exceptions.OverflowError.$pyclass("cannot fit 'int' into an index-sized integer")
        } else if (arg_value_exponent === 18 && arg_value_chunks[0] === 92233 && arg_value_chunks[1] > 72036854775807 && arg_value_sign === 1) {
            throw new exceptions.OverflowError.$pyclass("cannot fit 'int' into an index-sized integer")
        } else if (arg_value_sign === -1) {
            // throw ValueError(negative count)
            // if int < 0 && int >= -9223372036854775808
            throw new exceptions.ValueError.$pyclass('negative count')
        } else if (arg_value_chunks[1] > Math.pow(2, 31)) {
            // throw MemoryError
            // if int > Math.pow(2, 31) && int < 9223372036854775808
            throw new exceptions.MemoryError.$pyclass('')
        } else {
            // bytearray(int) -> bytes array of size given by the parameter
            // initialized with null bytes
            return new types.Bytearray(new types.Bytes(repeatArray(0, args[0])))
        }
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
    } else {
        throw new exceptions.NotImplementedError.$pyclass(
            'Not implemented'
        )
    }
}
bytearray.__doc__ = 'bytearray(iterable_of_ints) -> bytearray\nbytearray(string, encoding[, errors]) -> bytearray\nbytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer\nbytearray(int) -> bytes array of size given by the parameter initialized with null bytes\nbytearray() -> empty bytes array\n\nConstruct an mutable bytearray object from:\n  - an iterable yielding integers in range(256)\n  - a text string encoded using the specified encoding\n  - a bytes or a buffer object\n  - any object implementing the buffer API.\n  - an integer'

module.exports = bytearray
