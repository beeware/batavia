import { iter_for_each, python } from '../core/callables'
import { MemoryError, NotImplementedError, OverflowError, StopIteration, TypeError, ValueError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject, PyNone } from '../core/types'

import { iter } from '../builtins'
import * as types from '../types'

/**************************************************
 * Bytearray Iterator
 **************************************************/

class PyBytearrayIterator extends PyObject {
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
        return '<bytearray_iterator object at 0x99999999>'
    }
}
create_pyclass(PyBytearrayIterator, 'bytearray_iterator')

/*************************************************************************
 * A Python bytearray type
 *************************************************************************/

export default class PyBytearray extends PyObject {
    @python({
        default_args: ['data', 'encoding', 'errors']
    })
    __init__(data, encoding, errors) {
        //    bytearray(string, encoding[, errors]) -> bytearray
        //    bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
        //    bytearray(iterable_of_ints) -> bytearray
        //    bytearray(int) -> bytes array of size given by the parameter initialized with null bytes
        //    bytearray() -> empty bytes array
        if (data === undefined) {
            this.val = new types.PyBytes()
        } else if (encoding === undefined && errors === undefined) {
            if (types.isinstance(data, types.PyBytes)) {
                // bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
                this.val = data
            } else if (types.isinstance(data, types.PyBool)) {
                if (data) {
                    // bytearray(True) -> bytearray(b'\x00')
                    this.val = new types.PyBytes(new types.PyInt(1))
                } else {
                    // bytearray(False) -> bytearray(b'')
                    this.val = new types.PyBytes()
                }
            } else if (types.isinstance(data, types.PyBytearray)) {
                this.val = data.val
            } else if (types.isinstance(data, types.PyInt)) {
                if (data.__gt__(types.PyInt.MAX_INT) || data.__lt__(types.PyInt.MIN_INT)) {
                    throw new OverflowError('cannot fit \'int\' into an index-sized integer')
                } else if (data.val.lt(0)) {
                    throw new ValueError('negative count')
                } else if (data.val.gte(types.PyInt.MAX_INT.val)) {
                    throw new MemoryError('')
                }
                this.val = new types.PyBytes(data)
            } else if (types.isinstance(data, types.PyStr)) {
                throw new TypeError('string argument without an encoding')
            } else if (data.__iter__ !== undefined) {
                // we have an iterable (iter is not undefined) that's not a string(nor a Bytes/Bytearray)
                // build a JS array of numbers while validating inputs are all int
                iter_for_each(iter(data), function(val) {
                    if (!types.isinstance(val, [types.PyBool, types.PyInt])) {
                        throw new TypeError('an integer is required')
                    }
                })
                this.val = new types.PyBytes(data)
            } else if (types.isinstance(data, types.PyStr)) {
                throw new TypeError('string argument without an encoding')
            } else {
                throw new TypeError('\'' + type_name(data) + '\' object is not iterable')
            }
        } else {
            if (types.isinstance(data, types.PyStr)) {
                this.val = data.encode(encoding, errors)
            } else {
                throw new TypeError('\'' + type_name(data) + '\' object is not iterable')
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
        return this.val.__bool__()
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        return 'bytearray(' + this.val.toString() + ')'
    }

    __iter__() {
        if (this.val.__iter__) {
            return this.val.__iter__()
        } else {
            return new PyBytearrayIterator(this.val)
        }
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (other !== PyNone) {
            return this.valueOf() < other
        }
        return false
    }

    __le__(other) {
        if (other !== PyNone) {
            return this.valueOf() <= other
        }
        return false
    }

    __eq__(other) {
        if (other !== PyNone) {
            var val
            if (types.isinstance(other, [
                types.PyBool, types.PyInt, types.PyFloat])
            ) {
                return false
            } else {
                return this.valueOf() === val
            }
        }
        return this.valueOf() === ''
    }

    __ne__(other) {
        if (other !== PyNone) {
            var val
            if (types.isinstance(other, [
                types.PyBool, types.PyInt, types.PyFloat])
            ) {
                return true
            } else {
                return this.valueOf() !== val
            }
        }
        return this.valueOf() !== ''
    }

    __gt__(other) {
        if (other !== PyNone) {
            return this.valueOf() > other
        }
        return false
    }

    __ge__(other) {
        if (other !== PyNone) {
            return this.valueOf() >= other
        }
        return false
    }

    __contains__(other) {
        if (other !== PyNone) {
            return this.valueOf().hasOwnProperty(other)
        }
        return false
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        return new PyBytearray(+this.valueOf())
    }

    __neg__() {
        return new PyBytearray(-this.valueOf())
    }

    __not__() {
        return new PyBytearray(!this.valueOf())
    }

    __invert__() {
        return new PyBytearray(~this.valueOf())
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new NotImplementedError('PyBytearray.__pow__ has not been implemented')
    }

    __div__(other) {
        throw new NotImplementedError('PyBytearray.__div__ has not been implemented')
    }

    __floordiv__(other) {
        throw new NotImplementedError('PyBytearray.__floordiv__ has not been implemented')
    }

    __truediv__(other) {
        throw new NotImplementedError('PyBytearray.__truediv__ has not been implemented')
    }

    __mul__(other) {
        return new PyBytearray(this.val.__mul__(other))
    }

    __mod__(other) {
        throw new NotImplementedError('PyBytearray.__mod__ has not been implemented')
    }

    __add__(other) {
        if (types.isinstance(other, types.PyBool)) {
            throw new TypeError("can't concat bytearray to " + type_name(other))
        }
    }

    __sub__(other) {
        throw new NotImplementedError('PyBytearray.__sub__ has not been implemented')
    }

    __getitem__(other) {
        throw new NotImplementedError('PyBytearray.__getitem__ has not been implemented')
    }

    __lshift__(other) {
        throw new NotImplementedError('PyBytearray.__lshift__ has not been implemented')
    }

    __rshift__(other) {
        throw new NotImplementedError('PyBytearray.__rshift__ has not been implemented')
    }

    __and__(other) {
        throw new NotImplementedError('PyBytearray.__and__ has not been implemented')
    }

    __xor__(other) {
        throw new NotImplementedError('PyBytearray.__xor__ has not been implemented')
    }

    __or__(other) {
        throw new NotImplementedError('PyBytearray.__or__ has not been implemented')
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __idiv__(other) {
        throw new NotImplementedError('PyBytearray.__idiv__ has not been implemented')
    }

    __ifloordiv__(other) {
        throw new NotImplementedError('PyBytearray.__ifloordiv__ has not been implemented')
    }

    __itruediv__(other) {
        throw new NotImplementedError('PyBytearray.__itruediv__ has not been implemented')
    }

    __iadd__(other) {
        throw new NotImplementedError('PyBytearray.__iadd__ has not been implemented')
    }

    __isub__(other) {
        throw new NotImplementedError('PyBytearray.__isub__ has not been implemented')
    }

    __imul__(other) {
        throw new NotImplementedError('PyBytearray.__imul__ has not been implemented')
    }

    __imod__(other) {
        throw new NotImplementedError('PyBytearray.__imod__ has not been implemented')
    }

    __ipow__(other) {
        throw new NotImplementedError('PyBytearray.__ipow__ has not been implemented')
    }

    __ilshift__(other) {
        throw new NotImplementedError('PyBytearray.__ilshift__ has not been implemented')
    }

    __irshift__(other) {
        throw new NotImplementedError('PyBytearray.__irshift__ has not been implemented')
    }

    __iand__(other) {
        throw new NotImplementedError('PyBytearray.__iand__ has not been implemented')
    }

    __ixor__(other) {
        throw new NotImplementedError('PyBytearray.__ixor__ has not been implemented')
    }

    __ior__(other) {
        throw new NotImplementedError('PyBytearray.__ior__ has not been implemented')
    }

    /**************************************************
     * Methods
     **************************************************/

    copy() {
        return new PyBytearray(this.valueOf())
    }
}
PyBytearray.prototype.__doc__ = `bytearray(iterable_of_ints) -> bytearray
bytearray(string, encoding[, errors]) -> bytearray
bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
bytearray(int) -> bytes array of size given by the parameter initialized with null bytes
bytearray() -> empty bytes array

Construct an mutable bytearray object from:
  - an iterable yielding integers in range(256)
  - a text string encoded using the specified encoding
  - a bytes or a buffer object
  - any object implementing the buffer API.
  - an integer`
create_pyclass(PyBytearray, 'bytearray')
