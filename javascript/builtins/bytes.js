import { Buffer } from 'buffer'

import { BataviaError, PyOverflowError, PyTypeError, PyValueError } from '../core/exceptions'
import * as callables from '../core/callables'
import { type_name } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

import iter from './iter'

export default function bytes(args, kwargs) {
//    bytes(iterable_of_ints) -> bytes
//    bytes(string, encoding[, errors]) -> bytes
//    bytes(bytes_or_buffer) -> immutable copy of bytes_or_buffer
//    bytes(int) -> bytes object of size given by the parameter initialized with null bytes
//    bytes() -> empty bytes object

    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError("<fn>() doesn't accept keyword arguments.")
    }

    if (args.length === 0) {
        //    bytes() -> empty bytes object
        return new types.PyBytes(Buffer.alloc(0))
    } else if (args.length === 1) {
        var arg = args[0]
        if (arg === null) {
            if (version.earlier('3.6')) {
                throw new PyTypeError(
                    "'NoneType' object is not iterable"
                )
            } else {
                throw new PyTypeError(
                    "cannot convert 'NoneType' object to bytes"
                )
            }
        } else if (types.isinstance(arg, types.PyInt)) {
            // bytes(int) -> bytes array of size given by the parameter initialized with null bytes
            // Batavia ints are BigNumbers, so we need to unpack the value from the BigNumber Array.
            // We throw PyOverflowError when we find a PyRangeError, so implementation dependent
            var bignumsign = arg.val.s
            var bignumarray = arg.val.c
            var bignumexp = arg.val.e
            var too_large = false
            if (bignumsign === -1) {
                throw new PyValueError(
                    'negative count'
                )
            } else if (bignumarray.length > 1 || bignumexp !== 0) {
                too_large = true
            } else {
                var byteslength = bignumarray[0]
                try {
                    var bytesbuffer = Buffer.alloc(byteslength)
                } catch (e) {
                    if (e.name === 'PyRangeError') { too_large = true }
                }
            }
            if (too_large) {
                throw new PyOverflowError('byte string is too large')
            } else {
                return new types.PyBytes(bytesbuffer)
            }
        } else if (types.isinstance(arg, types.PyBool)) {
            // Python bool is subclassed from int, but Batavia's Boolean is a fake int:
            return bytes([arg.__int__()], [])
        } else if (types.isinstance(arg, types.PyBytes)) {
            // bytes(bytes_or_buffer) -> immutable copy of bytes_or_buffer
            return new types.PyBytes(Buffer.from(arg.val))
            // (we actually ignore python's bytearray/buffer/memoryview (not JS buffer)
            // let's make that a late-stage TODO)
        } else if (types.isinstance(arg, types.PyBytearray)) {
            // byte(bytes_or_buffer) -> mutable copy of bytes_or_buffer
            return new types.PyBytes(Buffer.from(arg.val.val))
        } else if (types.isinstance(arg, types.PyStr)) {
            throw new PyTypeError('string argument without an encoding')
        // is the argument iterable and not a Str, Bytes, Bytearray (dealt with above)?
        } else if (arg.__iter__ !== undefined) {
            // bytearray(iterable_of_ints) -> bytearray
            // we have an iterable (iter is not undefined) that's not a string(nor a Bytes/Bytearray)
            // build a JS array of numbers while validating inputs are all int
            var buffer_args = []
            var iterobj = iter([arg], null)
            callables.iter_for_each(iterobj, function(val) {
                if (types.isinstance(val, types.PyInt) && (val >= 0) && (val <= 255)) {
                    buffer_args.push(val)
                } else if (types.isinstance(val, types.PyBool)) {
                    if (val) {
                        buffer_args.push(1)
                    } else {
                        buffer_args.push(0)
                    }
                } else {
                    if (!types.isinstance(val, types.PyInt)) {
                        throw new PyTypeError(
                            "'" + type_name(val) + "' object cannot be interpreted as an integer")
                    } else {
                        throw new PyValueError('bytes must be in range(0, 256)')
                    }
                }
            })
            return new types.PyBytes(Buffer.from(buffer_args))
        } else {
            // the argument is not one of the special cases, and not an iterable, so...
            if (version.earlier('3.6')) {
                throw new PyTypeError(
                    "'" + type_name(arg) + "' object is not iterable"
                )
            } else {
                throw new PyTypeError(
                    "cannot convert '" + type_name(arg) + "' object to bytes"
                )
            }
        }
    } else if (args.length >= 2 && args.length <= 3) {
        //    bytes(string, encoding[, errors]) -> bytes
        //    we delegate to str.encode(encoding, errors)
        //    we need to rewrap the first argument because somehow it's coming unwrapped!
        var wrapped_string = new types.PyStr(args[0])
        return wrapped_string.encode(args[1], args[2])
    }
}

bytes.__doc__ = 'bytes(iterable_of_ints) -> bytes\nbytes(string, encoding[, errors]) -> bytes\nbytes(bytes_or_buffer) -> immutable copy of bytes_or_buffer\nbytes(int) -> bytes object of size given by the parameter initialized with null bytes\nbytes() -> empty bytes object\n\nConstruct an immutable array of bytes from:\n  - an iterable yielding integers in range(256)\n  - a text string encoded using the specified encoding\n  - any object implementing the buffer API.\n  - an integer'
bytes.$pyargs = true
