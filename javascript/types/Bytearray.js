import { iter_for_each, pyargs } from '../core/callables'
import { pyMemoryError, pyNotImplementedError, pyOverflowError, pyStopIteration, pyTypeError, pyValueError } from '../core/exceptions'
import { jstype, type_name, PyObject, pyNone } from '../core/types'

import { getattr, iter } from '../builtins'
import * as types from '../types'

/**************************************************
 * Bytearray Iterator
 **************************************************/

class PyBytearrayIterator extends PyObject {
    @pyargs({
        args: ['data']
    })
    __init__(data) {
        this.$index = 0
        this.$data = data
    }

    __iter__() {
        return this
    }

    __next__() {
        if (this.$index >= this.$data.length) {
            throw pyStopIteration()
        }
        let retval = this.$data[this.$index]
        this.$index++
        return types.pyint(retval)
    }

    __str__() {
        return '<bytearray_iterator object at 0x99999999>'
    }
}
const bytearray_iterator = jstype(PyBytearrayIterator, 'bytearray_iterator', [], null)

/*************************************************************************
 * A Python bytearray type
 *************************************************************************/

class PyBytearray extends PyObject {
    @pyargs({
        default_args: ['data', 'encoding', 'errors']
    })
    __init__(data, encoding, errors) {
        //    bytearray(string, encoding[, errors]) -> bytearray
        //    bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
        //    bytearray(iterable_of_ints) -> bytearray
        //    bytearray(int) -> bytes array of size given by the parameter initialized with null bytes
        //    bytearray() -> empty bytes array
        if (data === undefined) {
            this.$val = types.pybytes()
        } else if (encoding === undefined && errors === undefined) {
            if (types.isinstance(data, types.pybytes)) {
                // bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
                this.$val = data
            } else if (types.isinstance(data, types.pybool)) {
                if (data) {
                    // bytearray(True) -> bytearray(b'\x00')
                    this.$val = types.pybytes(types.pyint(1))
                } else {
                    // bytearray(False) -> bytearray(b'')
                    this.$val = types.pybytes()
                }
            } else if (types.isinstance(data, types.pybytearray)) {
                this.$val = data.$val
            } else if (types.isinstance(data, types.pyint)) {
                if (data.__gt__(types.pyint.$pyclass.MAX_INT) || data.__lt__(types.pyint.$pyclass.MIN_INT)) {
                    throw pyOverflowError('cannot fit \'int\' into an index-sized integer')
                } else if (data.$val.lt(0)) {
                    throw pyValueError('negative count')
                } else if (data.$val.gte(types.pyint.$pyclass.MAX_INT.$val)) {
                    throw pyMemoryError('')
                }
                this.$val = types.pybytes(data)
            } else if (types.isinstance(data, types.pystr)) {
                throw pyTypeError('string argument without an encoding')
            } else if (getattr(data, '__iter__', null)) {
                // we have an iterable (iter is not undefined) that's not a string(nor a Bytes/Bytearray)
                // build a JS array of numbers while validating inputs are all int
                iter_for_each(iter(data), function(val) {
                    if (!types.isinstance(val, [types.pybool, types.pyint])) {
                        throw pyTypeError('an integer is required')
                    }
                })
                this.$val = types.pybytes(data)
            } else if (types.isinstance(data, types.pystr)) {
                throw pyTypeError('string argument without an encoding')
            } else {
                throw pyTypeError(`'${type_name(data)}' object is not iterable`)
            }
        } else {
            if (types.isinstance(data, types.pystr)) {
                this.$val = data.encode(encoding, errors)
            } else {
                throw pyTypeError(`'${type_name(data)}' object is not iterable`)
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
        return this.$val
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__() {
        return this.$val.__bool__()
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        return 'bytearray(' + this.$val.toString() + ')'
    }

    __iter__() {
        if (this.$val.__iter__) {
            return this.$val.__iter__()
        } else {
            return bytearray_iterator(this.$val)
        }
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (other !== pyNone) {
            return this.valueOf() < other
        }
        return false
    }

    __le__(other) {
        if (other !== pyNone) {
            return this.valueOf() <= other
        }
        return false
    }

    __eq__(other) {
        if (other !== pyNone) {
            var val
            if (types.isinstance(other, [
                types.pybool, types.pyint, types.pyfloat])
            ) {
                return false
            } else {
                return this.valueOf() === val
            }
        }
        return this.valueOf() === ''
    }

    __ne__(other) {
        if (other !== pyNone) {
            var val
            if (types.isinstance(other, [
                types.pybool, types.pyint, types.pyfloat])
            ) {
                return true
            } else {
                return this.valueOf() !== val
            }
        }
        return this.valueOf() !== ''
    }

    __gt__(other) {
        if (other !== pyNone) {
            return this.valueOf() > other
        }
        return false
    }

    __ge__(other) {
        if (other !== pyNone) {
            return this.valueOf() >= other
        }
        return false
    }

    __contains__(other) {
        if (other !== pyNone) {
            return this.valueOf().hasOwnProperty(other)
        }
        return false
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        return pybytearray(+this.valueOf())
    }

    __neg__() {
        return pybytearray(-this.valueOf())
    }

    __not__() {
        return pybytearray(!this.valueOf())
    }

    __invert__() {
        return pybytearray(~this.valueOf())
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw pyNotImplementedError('PyBytearray.__pow__ has not been implemented')
    }

    __div__(other) {
        throw pyNotImplementedError('PyBytearray.__div__ has not been implemented')
    }

    __floordiv__(other) {
        throw pyNotImplementedError('PyBytearray.__floordiv__ has not been implemented')
    }

    __truediv__(other) {
        throw pyNotImplementedError('PyBytearray.__truediv__ has not been implemented')
    }

    __mul__(other) {
        return pybytearray(this.$val.__mul__(other))
    }

    __mod__(other) {
        throw pyNotImplementedError('PyBytearray.__mod__ has not been implemented')
    }

    __add__(other) {
        if (types.isinstance(other, types.pybool)) {
            throw pyTypeError(`can't concat bytearray to ${type_name(other)}`)
        }
    }

    __sub__(other) {
        throw pyNotImplementedError('PyBytearray.__sub__ has not been implemented')
    }

    __getitem__(other) {
        throw pyNotImplementedError('PyBytearray.__getitem__ has not been implemented')
    }

    __lshift__(other) {
        throw pyNotImplementedError('PyBytearray.__lshift__ has not been implemented')
    }

    __rshift__(other) {
        throw pyNotImplementedError('PyBytearray.__rshift__ has not been implemented')
    }

    __and__(other) {
        throw pyNotImplementedError('PyBytearray.__and__ has not been implemented')
    }

    __xor__(other) {
        throw pyNotImplementedError('PyBytearray.__xor__ has not been implemented')
    }

    __or__(other) {
        throw pyNotImplementedError('PyBytearray.__or__ has not been implemented')
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __idiv__(other) {
        throw pyNotImplementedError('PyBytearray.__idiv__ has not been implemented')
    }

    __ifloordiv__(other) {
        throw pyNotImplementedError('PyBytearray.__ifloordiv__ has not been implemented')
    }

    __itruediv__(other) {
        throw pyNotImplementedError('PyBytearray.__itruediv__ has not been implemented')
    }

    __iadd__(other) {
        throw pyNotImplementedError('PyBytearray.__iadd__ has not been implemented')
    }

    __isub__(other) {
        throw pyNotImplementedError('PyBytearray.__isub__ has not been implemented')
    }

    __imul__(other) {
        throw pyNotImplementedError('PyBytearray.__imul__ has not been implemented')
    }

    __imod__(other) {
        throw pyNotImplementedError('PyBytearray.__imod__ has not been implemented')
    }

    __ipow__(other) {
        throw pyNotImplementedError('PyBytearray.__ipow__ has not been implemented')
    }

    __ilshift__(other) {
        throw pyNotImplementedError('PyBytearray.__ilshift__ has not been implemented')
    }

    __irshift__(other) {
        throw pyNotImplementedError('PyBytearray.__irshift__ has not been implemented')
    }

    __iand__(other) {
        throw pyNotImplementedError('PyBytearray.__iand__ has not been implemented')
    }

    __ixor__(other) {
        throw pyNotImplementedError('PyBytearray.__ixor__ has not been implemented')
    }

    __ior__(other) {
        throw pyNotImplementedError('PyBytearray.__ior__ has not been implemented')
    }

    /**************************************************
     * Methods
     **************************************************/

    copy() {
        return pybytearray(this.valueOf())
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

const pybytearray = jstype(PyBytearray, 'bytearray', [], null)
export default pybytearray
