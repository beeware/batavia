import { NotImplementedError, TypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'

import { None } from '../builtins'
import * as types from '../types'

import BytearrayIterator from './BytearrayIterator'

/*************************************************************************
 * A Python bytearray type
 *************************************************************************/

export default function Bytearray(val) {
    PyObject.call(this)
    this.val = val
}

create_pyclass(Bytearray, 'bytearray')

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Bytearray.prototype.toString = function() {
    return this.__str__()
}

Bytearray.prototype.valueOf = function() {
    return this.val
}

/**************************************************
 * Type conversions
 **************************************************/

Bytearray.prototype.__bool__ = function() {
    return this.val.__bool__()
}

Bytearray.prototype.__repr__ = function() {
    return this.__str__()
}

Bytearray.prototype.__str__ = function() {
    return 'bytearray(' + this.val.toString() + ')'
}

Bytearray.prototype.__iter__ = function() {
    if (this.val.__iter__) {
        return this.val.__iter__()
    } else {
        return new BytearrayIterator(this.val)
    }
}

/**************************************************
 * Comparison operators
 **************************************************/

Bytearray.prototype.__lt__ = function(other) {
    if (other !== None) {
        return this.valueOf() < other
    }
    return false
}

Bytearray.prototype.__le__ = function(other) {
    if (other !== None) {
        return this.valueOf() <= other
    }
    return false
}

Bytearray.prototype.__eq__ = function(other) {
    if (other !== None) {
        var val
        if (types.isinstance(other, [
            types.Bool, types.Int, types.Float])
        ) {
            return false
        } else {
            return this.valueOf() === val
        }
    }
    return this.valueOf() === ''
}

Bytearray.prototype.__ne__ = function(other) {
    if (other !== None) {
        var val
        if (types.isinstance(other, [
            types.Bool, types.Int, types.Float])
        ) {
            return true
        } else {
            return this.valueOf() !== val
        }
    }
    return this.valueOf() !== ''
}

Bytearray.prototype.__gt__ = function(other) {
    if (other !== None) {
        return this.valueOf() > other
    }
    return false
}

Bytearray.prototype.__ge__ = function(other) {
    if (other !== None) {
        return this.valueOf() >= other
    }
    return false
}

Bytearray.prototype.__contains__ = function(other) {
    if (other !== None) {
        return this.valueOf().hasOwnProperty(other)
    }
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

Bytearray.prototype.__pos__ = function() {
    return new Bytearray(+this.valueOf())
}

Bytearray.prototype.__neg__ = function() {
    return new Bytearray(-this.valueOf())
}

Bytearray.prototype.__not__ = function() {
    return new Bytearray(!this.valueOf())
}

Bytearray.prototype.__invert__ = function() {
    return new Bytearray(~this.valueOf())
}

/**************************************************
 * Binary operators
 **************************************************/

Bytearray.prototype.__pow__ = function(other) {
    throw new NotImplementedError('Bytearray.__pow__ has not been implemented')
}

Bytearray.prototype.__div__ = function(other) {
    throw new NotImplementedError('Bytearray.__div__ has not been implemented')
}

Bytearray.prototype.__floordiv__ = function(other) {
    throw new NotImplementedError('Bytearray.__floordiv__ has not been implemented')
}

Bytearray.prototype.__truediv__ = function(other) {
    throw new NotImplementedError('Bytearray.__truediv__ has not been implemented')
}

Bytearray.prototype.__mul__ = function(other) {
    throw new TypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'")
}

Bytearray.prototype.__mod__ = function(other) {
    throw new NotImplementedError('Bytearray.__mod__ has not been implemented')
}

Bytearray.prototype.__add__ = function(other) {
    if (types.isinstance(other, types.Bool)) {
        throw new TypeError("can't concat bytearray to " + type_name(other))
    }
}

Bytearray.prototype.__sub__ = function(other) {
    throw new NotImplementedError('Bytearray.__sub__ has not been implemented')
}

Bytearray.prototype.__getitem__ = function(other) {
    throw new NotImplementedError('Bytearray.__getitem__ has not been implemented')
}

Bytearray.prototype.__lshift__ = function(other) {
    throw new NotImplementedError('Bytearray.__lshift__ has not been implemented')
}

Bytearray.prototype.__rshift__ = function(other) {
    throw new NotImplementedError('Bytearray.__rshift__ has not been implemented')
}

Bytearray.prototype.__and__ = function(other) {
    throw new NotImplementedError('Bytearray.__and__ has not been implemented')
}

Bytearray.prototype.__xor__ = function(other) {
    throw new NotImplementedError('Bytearray.__xor__ has not been implemented')
}

Bytearray.prototype.__or__ = function(other) {
    throw new NotImplementedError('Bytearray.__or__ has not been implemented')
}

/**************************************************
 * Inplace operators
 **************************************************/

Bytearray.prototype.__idiv__ = function(other) {
    throw new NotImplementedError('Bytearray.__idiv__ has not been implemented')
}

Bytearray.prototype.__ifloordiv__ = function(other) {
    throw new NotImplementedError('Bytearray.__ifloordiv__ has not been implemented')
}

Bytearray.prototype.__itruediv__ = function(other) {
    throw new NotImplementedError('Bytearray.__itruediv__ has not been implemented')
}

Bytearray.prototype.__iadd__ = function(other) {
    throw new NotImplementedError('Bytearray.__iadd__ has not been implemented')
}

Bytearray.prototype.__isub__ = function(other) {
    throw new NotImplementedError('Bytearray.__isub__ has not been implemented')
}

Bytearray.prototype.__imul__ = function(other) {
    throw new NotImplementedError('Bytearray.__imul__ has not been implemented')
}

Bytearray.prototype.__imod__ = function(other) {
    throw new NotImplementedError('Bytearray.__imod__ has not been implemented')
}

Bytearray.prototype.__ipow__ = function(other) {
    throw new NotImplementedError('Bytearray.__ipow__ has not been implemented')
}

Bytearray.prototype.__ilshift__ = function(other) {
    throw new NotImplementedError('Bytearray.__ilshift__ has not been implemented')
}

Bytearray.prototype.__irshift__ = function(other) {
    throw new NotImplementedError('Bytearray.__irshift__ has not been implemented')
}

Bytearray.prototype.__iand__ = function(other) {
    throw new NotImplementedError('Bytearray.__iand__ has not been implemented')
}

Bytearray.prototype.__ixor__ = function(other) {
    throw new NotImplementedError('Bytearray.__ixor__ has not been implemented')
}

Bytearray.prototype.__ior__ = function(other) {
    throw new NotImplementedError('Bytearray.__ior__ has not been implemented')
}

/**************************************************
 * Methods
 **************************************************/

Bytearray.prototype.copy = function() {
    return new Bytearray(this.valueOf())
}
