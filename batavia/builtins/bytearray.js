var Buffer = require('buffer').Buffer

var exceptions = require('../core').exceptions
var types = require('../types')

function bytearray(args, kwargs) {
//    bytearray(string, encoding[, errors]) -> bytearray
//    bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
//    bytearray(iterable_of_ints) -> bytearray
//    bytearray(int) -> bytes array of size given by the parameter initialized with null bytes
//    bytearray() -> empty bytes array

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
    } else if (args.length === 1 && types.isinstance(args[0], types.Int)) {
    // bytearray(int) -> bytes array of size given by the parameter initialized with null bytes
        var bignumsign = args[0].val.s
        var bignumarray = args[0].val.c
        var bignumexp = args[0].val.e
        var too_large = false
        if (bignumsign === -1) {
            throw new exceptions.ValueError.$pyclass(
                'negative count'
            )
        } else if (bignumarray.length > 1 || bignumexp !== 0) {
            too_large = true
        } else {
            var byteslength = bignumarray[0]
            try {
                var bytesbuffer = Buffer.alloc(byteslength)
            } catch (e) {
                if (e.name === 'RangeError') { too_large = true }
            }
        }
        if (too_large) {
            throw new exceptions.OverflowError.$pyclass('byte string is too large')
        } else {
            return new types.Bytearray(new types.Bytes(bytesbuffer))
        }
    } else {
        throw new exceptions.NotImplementedError.$pyclass(
            'Not implemented'
        )
    }
}
bytearray.__doc__ = 'bytearray(iterable_of_ints) -> bytearray\nbytearray(string, encoding[, errors]) -> bytearray\nbytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer\nbytearray(int) -> bytes array of size given by the parameter initialized with null bytes\nbytearray() -> empty bytes array\n\nConstruct an mutable bytearray object from:\n  - an iterable yielding integers in range(256)\n  - a text string encoded using the specified encoding\n  - a bytes or a buffer object\n  - any object implementing the buffer API.\n  - an integer'

module.exports = bytearray
