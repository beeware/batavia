import { Buffer } from 'buffer'

import { TEXT_ENCODINGS } from '../core/constants'
import { create_pyclass, type_name, PyObject } from '../core/types'
import { NotImplementedError, TypeError, ValueError } from '../core/exceptions'
import * as version from '../core/version'

import * as types from '../types'

import BytesIterator from './BytesIterator'

/*************************************************************************
 * A Python bytes type
 *************************************************************************/

export default class Bytes extends PyObject {
    constructor (val) {
        // the value is an instance of Feross's Buffer class
        super()
        this.val = val
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
        return new types.Int(this.val.length)
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
        return new BytesIterator(this.val)
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (types.isinstance(other, Bytes)) {
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
        if (types.isinstance(other, Bytes)) {
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
        if (types.isinstance(other, Bytes)) {
            var equal = (this.val.compare(other.val) === 0)
            return new types.Bool(equal)
        } else if (types.isinstance(other, types.Bytearray)) {
            throw new NotImplementedError(
                'Comparison between bytes and bytearrays has not been implemented')
        } else {
            return new types.Bool(false)
        }
    }

    __ne__(other) {
        return this.__eq__(other).__not__()
    }

    __gt__(other) {
        if (types.isinstance(other, Bytes)) {
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
        if (types.isinstance(other, Bytes)) {
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
        if (types.isinstance(other, types.Int)) {
            if (other >= 0 && other <= 255) {
                other_value = parseInt(other.valueOf())
            } else {
                throw new ValueError(
                    'byte must be in range (0, 256)'
                )
            }
        } else if (types.isinstance(other, Bytes)) {
            other_value = this.val
        }
        if (other_value !== null) {
            return this.val.indexOf(other_value) !== -1
        } else {
            return new types.Bool(false)
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
        if (types.isinstance(other, [types.Complex])) {
            throw new TypeError("can't take floor of complex number.")
        } else {
            throw new TypeError("unsupported operand type(s) for //: 'bytes' and '" + type_name(other) + "'")
        }
    }

    __truediv__(other) {
        throw new TypeError("unsupported operand type(s) for /: 'bytes' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [types.Bool, types.Int])) {
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

                return new Bytes(byteBuffer)
            } else {
                return new Bytes('')
            }
        } else {
            throw new TypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
        }
    }

    __mod__(other) {
        let types = require('../types')

        if (types.isinstance(other, [types.Complex])) {
            throw new TypeError("can't mod complex numbers.")
        } else {
            throw new TypeError("unsupported operand type(s) for %: 'bytes' and '" + type_name(other) + "'")
        }
    }

    __add__(other) {
        if (types.isinstance(other, [Bytes])) {
            // create a new buffer object of combined length and then write the concatenated string value of both byte objects
            let byteBuffer = Buffer.alloc(this.valueOf().length + other.valueOf().length)
            byteBuffer.write(this.valueOf().toString() + other.valueOf().toString())
            return new Bytes(byteBuffer)
        } else if (types.isinstance(other, [types.Bytearray])) {
            throw new NotImplementedError('Bytes.__add__ has not been implemented')
        } else if (types.isinstance(other, [
            types.Bool,
            types.Dict,
            types.Int,
            types.Float,
            types.List,
            types.NoneType,
            types.Set,
            types.Str,
            types.Tuple ])) {
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
        if (types.isinstance(other, types.Slice)) {
            throw new NotImplementedError('Bytes.__getitem__ with slice has not been implemented')
        }
        if (!types.isinstance(other, types.Int)) {
            throw new TypeError('byte indices must be integers or slices, not ' + type_name(other))
        }
        return new types.Int(this.val[other.int32()])
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
        if (types.isinstance(other, [types.Complex])) {
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
        return new Bytes(this.valueOf())
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
create_pyclass(Bytes, 'bytes')
