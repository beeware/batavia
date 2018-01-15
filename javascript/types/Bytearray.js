import { NotImplementedError, TypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject, PyNone } from '../core/types'

import * as types from '../types'

import PyBytearrayIterator from './BytearrayIterator'

/*************************************************************************
 * A Python bytearray type
 *************************************************************************/

export default class PyBytearray extends PyObject {
    constructor(val) {
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
        throw new TypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
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
create_pyclass(PyBytearray, 'bytearray')
