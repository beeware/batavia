/*************************************************************************
 * An implementation of NotImplementedType
 *************************************************************************/
import { NotImplementedError, TypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

export default class PyNotImplementedType extends PyObject {
    constructor() {
        super()
    }

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    toString() {
        return this.__str__()
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __bool__() {
        return new types.PyBool(true)
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        return 'NotImplemented'
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: NotImplementedType() < ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'<' not supported between instances of 'NotImplementedType' and '" +
                type_name(other) + "'"
            )
        }
    }

    __le__(other) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: NotImplementedType() <= ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'<=' not supported between instances of 'NotImplementedType' and '" +
                type_name(other) + "'"
            )
        }
    }

    __eq__(other) {
        return this.valueOf() === other
    }

    __ne__(other) {
        return this.valueOf() !== other
    }

    __gt__(other) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: NotImplementedType() > ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'>' not supported between instances of 'NotImplementedType' and '" +
                type_name(other) + "'"
            )
        }
    }

    __ge__(other) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: NotImplementedType() >= ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                "'>=' not supported between instances of 'NotImplementedType' and '" +
                type_name(other) + "'"
            )
        }
    }

    __contains__(other) {
        return this.valueOf().hasOwnProperty(other)
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        return new NotImplementedType(+this.valueOf())
    }

    __neg__() {
        return new NotImplementedType(-this.valueOf())
    }

    __not__() {
        return new NotImplementedType(!this.valueOf())
    }

    __invert__() {
        return new NotImplementedType(~this.valueOf())
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __div__(other) {
        throw new NotImplementedError('NotImplementedType.__div__ has not been implemented')
    }

    __floordiv__(other) {
        throw new TypeError("unsupported operand type(s) for //: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __truediv__(other) {
        throw new TypeError("unsupported operand type(s) for /: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [types.PyTuple, types.PyStr, types.PyList, types.PyBytes, types.PyBytearray])) {
            throw new TypeError("can't multiply sequence by non-int of type 'NotImplementedType'")
        }
        throw new TypeError("unsupported operand type(s) for *: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __mod__(other) {
        throw new TypeError("unsupported operand type(s) for %: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __add__(other) {
        throw new TypeError("unsupported operand type(s) for +: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __sub__(other) {
        throw new TypeError("unsupported operand type(s) for -: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __getitem__(other) {
        throw new NotImplementedError('NotImplementedType.__getitem__ has not been implemented')
    }

    __lshift__(other) {
        throw new TypeError("unsupported operand type(s) for <<: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw new TypeError("unsupported operand type(s) for >>: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __and__(other) {
        throw new TypeError("unsupported operand type(s) for &: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __xor__(other) {
        throw new TypeError("unsupported operand type(s) for ^: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __or__(other) {
        throw new TypeError("unsupported operand type(s) for |: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __idiv__(other) {
        throw new NotImplementedError('NotImplementedType.__idiv__ has not been implemented')
    }

    __ifloordiv__(other) {
        throw new TypeError("unsupported operand type(s) for //=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __itruediv__(other) {
        throw new TypeError("unsupported operand type(s) for /=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __iadd__(other) {
        throw new TypeError("unsupported operand type(s) for +=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __isub__(other) {
        throw new TypeError("unsupported operand type(s) for -=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __imul__(other) {
        if (types.isinstance(other, [types.PyTuple, types.PyStr, types.PyList, types.PyBytes, types.PyBytearray])) {
            throw new TypeError("can't multiply sequence by non-int of type 'NotImplementedType'")
        }
        throw new TypeError("unsupported operand type(s) for *=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __imod__(other) {
        throw new TypeError("unsupported operand type(s) for %=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __ipow__(other) {
        throw new TypeError("unsupported operand type(s) for ** or pow(): 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __ilshift__(other) {
        throw new TypeError("unsupported operand type(s) for <<=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __irshift__(other) {
        throw new TypeError("unsupported operand type(s) for >>=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __iand__(other) {
        throw new TypeError("unsupported operand type(s) for &=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        throw new TypeError("unsupported operand type(s) for ^=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __ior__(other) {
        throw new TypeError("unsupported operand type(s) for |=: 'NotImplementedType' and '" + type_name(other) + "'")
    }
}
create_pyclass(PyNotImplementedType, 'NotImplementedType')
