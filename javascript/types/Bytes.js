import { Buffer } from 'buffer'

import { iter_for_each, python } from '../core/callables'
import { TEXT_ENCODINGS } from '../core/constants'
import { create_pyclass, type_name, PyObject } from '../core/types'
import { NotImplementedError, OverflowError, StopIteration, TypeError, ValueError } from '../core/exceptions'
import * as version from '../core/version'

import * as types from '../types'
import { iter } from '../builtins'

/**************************************************
 * Bytes Iterator
 **************************************************/

class PyBytesIterator extends PyObject {
    constructor(data) {
        super()
        this.index = 0
        this.data = data
    }

    __iter__() {
        return this
    }

    __next__() {
        if (this.index >= this.data.length) {
            throw new StopIteration()
        }
        var retval = this.data[this.index]
        this.index++
        return new types.PyInt(retval)
    }

    __str__() {
        return '<bytes_iterator object at 0x99999999>'
    }
}
create_pyclass(PyBytesIterator, 'bytes_iterator')

/*************************************************************************
 * A Python bytes type
 *************************************************************************/

export default class PyBytes extends PyObject {
    @python({
        default_args: ['data', 'encoding', 'errors']
    })
    __init__(data, encoding, errors) {
        //    bytes(iterable_of_ints) -> bytes
        //    bytes(string, encoding[, errors]) -> bytes
        //    bytes(bytes_or_buffer) -> immutable copy of bytes_or_buffer
        //    bytes(int) -> bytes object of size given by the parameter initialized with null bytes
        //    bytes() -> empty bytes object

        if (data === undefined) {
            //    bytes() -> empty bytes object
            this.val = Buffer.alloc(0)
        } else if (encoding === undefined && errors === undefined) {
            if (data === null) {
                if (version.earlier('3.6')) {
                    throw new TypeError(
                        "'NoneType' object is not iterable"
                    )
                } else {
                    throw new TypeError(
                        "cannot convert 'NoneType' object to bytes"
                    )
                }
            } else if (types.isinstance(data, [types.PyInt, types.PyBool])) {
                // Python bool is subclassed from int, but Batavia's Boolean is a fake int:
                if (types.isinstance(data, types.PyBool)) {
                    data = data.__int__()
                }

                // bytes(int) -> bytes array of size given by the parameter initialized with null bytes
                // Batavia ints are BigNumbers, so we need to unpack the value from the BigNumber Array.
                // We throw OverflowError when we find a RangeError, so implementation dependent
                var bignumsign = data.val.s
                var bignumarray = data.val.c
                var bignumexp = data.val.e
                var too_large = false
                if (bignumsign === -1) {
                    throw new ValueError('negative count')
                } else if (bignumarray.length > 1 || bignumexp !== 0) {
                    too_large = true
                } else {
                    var byteslength = bignumarray[0]
                    try {
                        var bytesbuffer = Buffer.alloc(byteslength)
                    } catch (e) {
                        if (e.name === 'RangeError') {
                            too_large = true
                        }
                    }
                }
                if (too_large) {
                    throw new OverflowError('byte string is too large')
                } else {
                    this.val = bytesbuffer
                }
            } else if (types.isinstance(data, types.PyBytes)) {
                // bytes(bytes_or_buffer) -> immutable copy of bytes_or_buffer
                this.val = Buffer.from(data.val)
                // (we actually ignore python's bytearray/buffer/memoryview (not JS buffer)
                // let's make that a late-stage TODO)
            } else if (types.isinstance(data, types.PyBytearray)) {
                // byte(bytes_or_buffer) -> mutable copy of bytes_or_buffer
                this.val = Buffer.from(data.val.val)
            } else if (types.isinstance(data, types.PyStr)) {
                throw new TypeError('string argument without an encoding')
            // is the argument iterable and not a Str, Bytes, Bytearray (dealt with above)?
            } else if (data instanceof Uint8Array) {
                // Passing in an array of bytes. This is an affordance for Javascript.
                this.val = Buffer.from(data)
            } else if (data.__iter__ !== undefined) {
                // bytearray(iterable_of_ints) -> bytearray
                // we have an iterable (iter is not undefined) that's not a string(nor a Bytes/Bytearray)
                // build a JS array of numbers while validating inputs are all int
                var values = []
                iter_for_each(iter(data), function(val) {
                    if (types.isinstance(val, types.PyInt) && (val >= 0) && (val <= 255)) {
                        values.push(val)
                    } else if (types.isinstance(val, types.PyBool)) {
                        if (val) {
                            values.push(1)
                        } else {
                            values.push(0)
                        }
                    } else {
                        if (!types.isinstance(val, types.PyInt)) {
                            throw new TypeError(
                                "'" + type_name(val) + "' object cannot be interpreted as an integer")
                        } else {
                            throw new ValueError('bytes must be in range(0, 256)')
                        }
                    }
                })
                this.val = Buffer.from(values)
            } else {
                // the argument is not one of the special cases, and not an iterable, so...
                if (version.earlier('3.6')) {
                    throw new TypeError(
                        "'" + type_name(data) + "' object is not iterable"
                    )
                } else {
                    throw new TypeError(
                        "cannot convert '" + type_name(data) + "' object to bytes"
                    )
                }
            }
        } else {
            if (types.isinstance(data, types.PyStr)) {
                //    bytes(string, encoding[, errors]) -> bytes
                //    we delegate to str.encode(encoding, errors)
                //    we need to rewrap the first argument because somehow it's coming unwrapped!
                this.val = data.encode(encoding, errors).val
            } else {
                if (version.earlier('3.6')) {
                    throw new TypeError(
                        "'" + type_name(data) + "' object is not iterable"
                    )
                } else {
                    throw new TypeError(
                        "cannot convert '" + type_name(data) + "' object to bytes"
                    )
                }
            }
        }
    }

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    toString() {
        return this.__str__()
    }

    valueOf() {
        return this.val
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__() {
        return this.val.length > 0
    }

    __len__() {
        return new types.PyInt(this.val.length)
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        // we iterate natively in JS so as not to have to box/unbox
        // the values from a Batavia Int, maybe premature optimisation
        // when writing only one bytestring to a console/textarea
        // but can't hurt when writing a lot of bytestrings on a socket
        var stringified = "b'"
        // var buffer_length = this.val.length
        var buffer_length = this.__len__()
        for (var i = 0; i < buffer_length; i++) {
            var value = this.val[i]
            if (value >= 32 && value <= 126) {
                stringified += String.fromCharCode(value)
            } else if (value >= 9 && value <= 13) {
                stringified += {
                    9: '\\t',
                    10: '\\n',
                    11: '\\x0b',
                    12: '\\x0c',
                    13: '\\r'
                }[value]
            } else {
                stringified += '\\x' + ('0' + value.toString(16)).slice(-2)
            }
        }
        return stringified + "'"
    }

    __iter__() {
        return new PyBytesIterator(this.val)
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (types.isinstance(other, PyBytes)) {
            return this.val < other.val
        } else {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: bytes() < ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'<' not supported between instances of 'bytes' and '" +
                    type_name(other) + "'"
                )
            }
        }
    }

    __le__(other) {
        if (types.isinstance(other, PyBytes)) {
            return this.val <= other.val
        } else {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: bytes() <= ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'<=' not supported between instances of 'bytes' and '" +
                    type_name(other) + "'"
                )
            }
        }
    }

    __eq__(other) {
        if (types.isinstance(other, PyBytes)) {
            var equal = (this.val.compare(other.val) === 0)
            return new types.PyBool(equal)
        } else if (types.isinstance(other, types.PyBytearray)) {
            throw new NotImplementedError(
                'Comparison between bytes and bytearrays has not been implemented')
        } else {
            return new types.PyBool(false)
        }
    }

    __ne__(other) {
        return this.__eq__(other).__not__()
    }

    __gt__(other) {
        if (types.isinstance(other, PyBytes)) {
            return this.val > other.val
        } else {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: bytes() > ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'>' not supported between instances of 'bytes' and '" +
                    type_name(other) + "'"
                )
            }
        }
    }

    __ge__(other) {
        if (types.isinstance(other, PyBytes)) {
            return this.val >= other.val
        } else {
            if (version.earlier('3.6')) {
                throw new TypeError(
                    'unorderable types: bytes() >= ' + type_name(other) + '()'
                )
            } else {
                throw new TypeError(
                    "'>=' not supported between instances of 'bytes' and '" +
                    type_name(other) + "'"
                )
            }
        }
    }

    __contains__(other) {
        var other_value = null
        if (types.isinstance(other, types.PyInt)) {
            if (other >= 0 && other <= 255) {
                other_value = parseInt(other.valueOf())
            } else {
                throw new ValueError(
                    'byte must be in range (0, 256)'
                )
            }
        } else if (types.isinstance(other, PyBytes)) {
            other_value = this.val
        }
        if (other_value !== null) {
            return this.val.indexOf(other_value) !== -1
        } else {
            return new types.PyBool(false)
        }
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        throw new TypeError("bad operand type for unary +: 'bytes'")
    }

    __neg__() {
        throw new TypeError("bad operand type for unary -: 'bytes'")
    }

    __not__() {
        return this.val.length === 0
    }

    __invert__() {
        throw new TypeError("bad operand type for unary ~: 'bytes'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'bytes' and '" + type_name(other) + "'")
    }

    __div__(other) {
        return this.__truediv__(other)
    }

    __floordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't take floor of complex number.")
        } else {
            throw new TypeError("unsupported operand type(s) for //: 'bytes' and '" + type_name(other) + "'")
        }
    }

    __truediv__(other) {
        throw new TypeError("unsupported operand type(s) for /: 'bytes' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [types.PyBool, types.PyInt])) {
            // Check if value of 'other' Int/Bool value is truthy
            // and 'this' byte object is non-empty
            if (other.valueOf() > 0 && this.valueOf().length > 0) {
                let thisByteLength = this.valueOf().length
                let thisValue = this.valueOf().toString()
                let otherValue = other.valueOf()

                // Add at least one copy of byte object string into buffer
                let byteBuffer = Buffer.alloc(thisByteLength * otherValue)
                byteBuffer.write(thisValue)

                // repeat adding copies as necessary
                if (otherValue > 1) {
                    for (let i = 1; i < otherValue; i++) {
                        byteBuffer.write(thisValue, i * thisByteLength)
                    }
                }

                return new PyBytes(byteBuffer)
            } else {
                return new PyBytes()
            }
        } else {
            throw new TypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't mod complex numbers.")
        } else {
            throw new TypeError("unsupported operand type(s) for %: 'bytes' and '" + type_name(other) + "'")
        }
    }

    __add__(other) {
        if (types.isinstance(other, PyBytes)) {
            // create a new buffer object of combined length and then write the concatenated string value of both byte objects
            let byteBuffer = Buffer.alloc(this.valueOf().length + other.valueOf().length)
            byteBuffer.write(this.valueOf().toString() + other.valueOf().toString())
            return new PyBytes(byteBuffer)
        } else if (types.isinstance(other, types.PyBytearray)) {
            throw new NotImplementedError('Bytes.__add__ has not been implemented')
        } else if (types.isinstance(other, [
            types.PyBool,
            types.PyDict,
            types.PyInt,
            types.PyFloat,
            types.PyList,
            types.PyNoneType,
            types.PySet,
            types.PyStr,
            types.PyTuple ])) {
            // does not concat with all these
            if (version.earlier('3.6')) {
                throw new TypeError(
                    "can't concat bytes to " + type_name(other)
                )
            } else {
                throw new TypeError(
                    "can't concat " + type_name(other) + ' to bytes'
                )
            }
        } else {
            throw new TypeError("can't concat bytes to " + type_name(other))
        }
    }

    __sub__(other) {
        throw new TypeError("unsupported operand type(s) for -: 'bytes' and '" + type_name(other) + "'")
    }

    __getitem__(other) {
        if (types.isinstance(other, types.PySlice)) {
            throw new NotImplementedError('Bytes.__getitem__ with slice has not been implemented')
        }
        if (!types.isinstance(other, types.PyInt)) {
            throw new TypeError('byte indices must be integers or slices, not ' + type_name(other))
        }
        return new types.PyInt(this.val[other.int32()])
    }

    __lshift__(other) {
        throw new TypeError("unsupported operand type(s) for <<: 'bytes' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw new TypeError("unsupported operand type(s) for >>: 'bytes' and '" + type_name(other) + "'")
    }

    __and__(other) {
        throw new TypeError("unsupported operand type(s) for &: 'bytes' and '" + type_name(other) + "'")
    }

    __xor__(other) {
        throw new TypeError("unsupported operand type(s) for ^: 'bytes' and '" + type_name(other) + "'")
    }

    __or__(other) {
        throw new TypeError("unsupported operand type(s) for |: 'bytes' and '" + type_name(other) + "'")
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__(other) {
        if (types.isinstance(other, types.PyComplex)) {
            throw new TypeError("can't take floor of complex number.")
        } else {
            throw new TypeError("unsupported operand type(s) for //=: 'bytes' and '" + type_name(other) + "'")
        }
    }

    __itruediv__(other) {
        throw new NotImplementedError('Bytes.__itruediv__ has not been implemented')
    }

    __iadd__(other) {
        throw new NotImplementedError('Bytes.__iadd__ has not been implemented')
    }

    __isub__(other) {
        throw new NotImplementedError('Bytes.__isub__ has not been implemented')
    }

    __imul__(other) {
        throw new NotImplementedError('Bytes.__imul__ has not been implemented')
    }

    __imod__(other) {
        throw new NotImplementedError('Bytes.__imod__ has not been implemented')
    }

    __ipow__(other) {
        throw new NotImplementedError('Bytes.__ipow__ has not been implemented')
    }

    __ilshift__(other) {
        throw new NotImplementedError('Bytes.__ilshift__ has not been implemented')
    }

    __irshift__(other) {
        throw new NotImplementedError('Bytes.__irshift__ has not been implemented')
    }

    __iand__(other) {
        throw new TypeError("unsupported operand type(s) for &=: 'bytes' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        throw new NotImplementedError('Bytes.__ixor__ has not been implemented')
    }

    __ior__(other) {
        throw new NotImplementedError('Bytes.__ior__ has not been implemented')
    }

    /**************************************************
     * Methods
     **************************************************/

    copy() {
        return new PyBytes(this.valueOf())
    }

    decode(encoding, errors) {
        if (errors !== undefined) {
            return new NotImplementedError(
                "'errors' parameter of String.encode not implemented"
            )
        }
        encoding = encoding.toLowerCase()
        var encs = TEXT_ENCODINGS
        if (encs.ascii.indexOf(encoding) !== -1) {
            return this.val.toString('ascii')
        } else if (encs.latin_1.indexOf(encoding) !== -1) {
            return this.val.toString('latin1')
        } else if (encs.utf_8.indexOf(encoding) !== -1) {
            return this.val.toString('utf8')
        } else {
            return new NotImplementedError(
                'encoding not implemented or incorrect encoding'
            )
        }
    }
}
PyBytes.prototype.__doc__ = `bytes(iterable_of_ints) -> bytes
bytes(string, encoding[, errors]) -> bytes
bytes(bytes_or_buffer) -> immutable copy of bytes_or_buffer
bytes(int) -> bytes object of size given by the parameter initialized with null bytes
bytes() -> empty bytes object

Construct an immutable array of bytes from:
  - an iterable yielding integers in range(256)
  - a text string encoded using the specified encoding
  - any object implementing the buffer API.
  - an integer`
create_pyclass(PyBytes, 'bytes')
