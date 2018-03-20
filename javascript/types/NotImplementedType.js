/*************************************************************************
 * An implementation of NotImplementedType
 *************************************************************************/
import { pyNotImplementedError, pyTypeError } from '../core/exceptions'
import { jstype, type_name, PyObject } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

class PyNotImplementedType extends PyObject {
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
        return types.pybool(true)
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
            throw pyTypeError(
                'unorderable types: NotImplementedType() < ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'<' not supported between instances of 'NotImplementedType' and '" +
                type_name(other) + "'"
            )
        }
    }

    __le__(other) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: NotImplementedType() <= ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
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
            throw pyTypeError(
                'unorderable types: NotImplementedType() > ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                "'>' not supported between instances of 'NotImplementedType' and '" +
                type_name(other) + "'"
            )
        }
    }

    __ge__(other) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: NotImplementedType() >= ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
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
        throw pyTypeError("bad operand type for unary +: '" + this.__class__.__name__ + "'")
    }

    __neg__() {
        throw pyTypeError("bad operand type for unary -: '" + this.__class__.__name__ + "'")
    }

    __not__() {
        throw pyTypeError("bad operand type for unary !: '" + this.__class__.__name__ + "'")
    }

    __invert__() {
        throw pyTypeError("bad operand type for unary ~: '" + this.__class__.__name__ + "'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw pyTypeError("unsupported operand type(s) for ** or pow(): 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __div__(other) {
        throw pyNotImplementedError('NotImplementedType.__div__ has not been implemented')
    }

    __floordiv__(other) {
        throw pyTypeError("unsupported operand type(s) for //: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __truediv__(other) {
        throw pyTypeError("unsupported operand type(s) for /: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [types.pytuple, types.pystr, types.pylist, types.pybytes, types.pybytearray])) {
            throw pyTypeError("can't multiply sequence by non-int of type 'NotImplementedType'")
        }
        throw pyTypeError("unsupported operand type(s) for *: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __mod__(other) {
        throw pyTypeError("unsupported operand type(s) for %: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __add__(other) {
        throw pyTypeError("unsupported operand type(s) for +: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __sub__(other) {
        throw pyTypeError("unsupported operand type(s) for -: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __getitem__(other) {
        throw pyNotImplementedError('NotImplementedType.__getitem__ has not been implemented')
    }

    __lshift__(other) {
        throw pyTypeError("unsupported operand type(s) for <<: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw pyTypeError("unsupported operand type(s) for >>: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __and__(other) {
        throw pyTypeError("unsupported operand type(s) for &: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __xor__(other) {
        throw pyTypeError("unsupported operand type(s) for ^: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __or__(other) {
        throw pyTypeError("unsupported operand type(s) for |: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __idiv__(other) {
        throw pyNotImplementedError('NotImplementedType.__idiv__ has not been implemented')
    }

    __ifloordiv__(other) {
        throw pyTypeError("unsupported operand type(s) for //=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __itruediv__(other) {
        throw pyTypeError("unsupported operand type(s) for /=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __iadd__(other) {
        throw pyTypeError("unsupported operand type(s) for +=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __isub__(other) {
        throw pyTypeError("unsupported operand type(s) for -=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __imul__(other) {
        if (types.isinstance(other, [types.pytuple, types.pystr, types.pylist, types.pybytes, types.pybytearray])) {
            throw pyTypeError("can't multiply sequence by non-int of type 'NotImplementedType'")
        }
        throw pyTypeError("unsupported operand type(s) for *=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __imod__(other) {
        throw pyTypeError("unsupported operand type(s) for %=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __ipow__(other) {
        throw pyTypeError("unsupported operand type(s) for ** or pow(): 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __ilshift__(other) {
        throw pyTypeError("unsupported operand type(s) for <<=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __irshift__(other) {
        throw pyTypeError("unsupported operand type(s) for >>=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __iand__(other) {
        throw pyTypeError("unsupported operand type(s) for &=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        throw pyTypeError("unsupported operand type(s) for ^=: 'NotImplementedType' and '" + type_name(other) + "'")
    }

    __ior__(other) {
        throw pyTypeError("unsupported operand type(s) for |=: 'NotImplementedType' and '" + type_name(other) + "'")
    }
}
const pyNotImplementedType = jstype(PyNotImplementedType, 'NotImplementedType', [], null)

// Create a singleton instance of NotImplementedType
const pyNotImplemented = pyNotImplementedType()

export {
    pyNotImplemented,
    pyNotImplementedType
}
