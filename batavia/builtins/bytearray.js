var Buffer = require('buffer').Buffer

var exceptions = require('../core').exceptions
var callables = require('../core').callables
var type_name = require('../core').type_name
var types = require('../types')
var iter = require('./iter')

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

    if (args.length === 0) {
        // bytearray() -> empty bytes array
        return new types.Bytearray(new types.Bytes([]))
    } else if (args.length === 1) {
        var arg_value = args[0]

        if (types.isinstance(arg_value, types.Int)) {
            // bytearray(int) -> bytes array of size given by the parameter initialized with null bytes
            // Batavia ints are BigNumbers, so unpack the value from the BigNumber Array and throw
            // OverflowError on RangeError, making this implementation dependent
            var arg_value_chunks = arg_value.val.c
            var arg_value_sign = arg_value.val.s
            var arg_value_causes_overflow = false
            if (arg_value_sign === -1) {
                throw new exceptions.ValueError.$pyclass(
                    'negative count'
                )
            } else if (arg_value_chunks.length > 1) {
                arg_value_causes_overflow = true
            } else {
                try {
                    var return_bytes_value = new types.Bytes(Buffer.alloc(arg_value_chunks[0]))
                } catch (e) {
                    if (e instanceof RangeError) {
                        arg_value_causes_overflow = true
                    } else {
                        throw e
                    }
                }
            }
            if (arg_value_causes_overflow) {
                throw new exceptions.OverflowError.$pyclass(
                    'byte string is too large'
                )
            } else {
                return new types.Bytearray(return_bytes_value)
            }
        } else if (types.isinstance(arg_value, types.Bool)) {
            // Python bool is subclassed from int, but Batavia's Boolean is a fake int, so handle recursively
            return bytearray([arg_value.__int__()], [])
        } else if (types.isinstance(arg_value, types.Bytes)) {
            // bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
            return new types.Bytearray(arg_value)
        } else if (types.isinstance(arg_value, types.Bytearray)) {
            // bytearray(bytearray) -> mutable copy of bytearray
            return new types.Bytearray(arg_value.val)
        } else if (types.isinstance(arg_value, types.Str)) {
            throw new exceptions.TypeError.$pyclass(
                'string argument without an encoding'
            )
        } else if (arg_value.__iter__ !== undefined) {
            // bytearray(iterable_of_ints) -> bytearray
            // build a JS array of numbers while validating all values as integers of appropriate size
            var buffer_args = []
            var iter_obj = iter([arg_value], null)
            callables.iter_for_each(iter_obj, function(val) {
                if (types.isinstance(val, types.Int) && (val >= 0) && (val <= 255)) {
                    buffer_args.push(val)
                } else if (types.isinstance(val, types.Bool)) {
                    if (val) {
                        buffer_args.push(1)
                    } else {
                        buffer_args.push(0)
                    }
                } else {
                    if (!types.isinstance(val, types.Int)) {
                        throw new exceptions.TypeError.$pyclass(
                            'an integer is required'
                        )
                    } else {
                        throw new exceptions.ValueError.$pyclass(
                            'bytes must be in range(0, 256)'
                        )
                    }
                }
            })
            return new types.Bytearray(new types.Bytes(Buffer.from(buffer_args)))
        } else {
            // the argument is not one of the special cases above, and not an iterable, so throw an Error
            throw new exceptions.TypeError.$pyclass(
                "'" + type_name(arg_value) + "' object is not iterable"
            )
        }
    } else if (args.length >= 2 && args.length <= 3) {
        // bytearray(string, encoding[, errors]) -> bytearray
        // delegate to str.encode(encoding, errors)
        var wrapped_string = new types.Str(args[0])
        return new types.Bytearray(new types.Bytes(wrapped_string.encode(args[1], args[2])))
    }
}
bytearray.__doc__ = 'bytearray(iterable_of_ints) -> bytearray\nbytearray(string, encoding[, errors]) -> bytearray\nbytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer\nbytearray(int) -> bytes array of size given by the parameter initialized with null bytes\nbytearray() -> empty bytes array\n\nConstruct an mutable bytearray object from:\n  - an iterable yielding integers in range(256)\n  - a text string encoded using the specified encoding\n  - a bytes or a buffer object\n  - any object implementing the buffer API.\n  - an integer'

module.exports = bytearray
