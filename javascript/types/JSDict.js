import { PyKeyError, PyNotImplementedError, PyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'
import * as version from '../core/version'

import * as builtins from '../builtins'
import * as types from '../types'

/*************************************************************************
 * A Python dict type wrapping JS objects
 *************************************************************************/

export default class JSDict {
    constructor(args, kwargs) {
        if (args) {
            this.update(args)
        }
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
        return Object.keys(this).length > 0
    }

    __repr__() {
        return this.__str__()
    }

    __str__() {
        var result = '{'
        var values = []
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                values.push(builtins.repr([key], null) + ': ' + builtins.repr([this[key]], null))
            }
        }
        result += values.join(', ')
        result += '}'
        return result
    }

    /**************************************************
     * Comparison operators
     **************************************************/

    __lt__(other) {
        if (other !== builtins.PyNone) {
            if (types.isinstance(other, [
                types.PyBool, types.PyDict, types.PyFloat,
                types.PyInt, types.JSDict, types.PyList,
                types.PyStr, types.PyTuple
            ])) {
                if (version.earlier('3.6')) {
                    throw new PyTypeError(
                        'unorderable types: dict() < ' + type_name(other) + '()'
                    )
                } else {
                    throw new PyTypeError(
                        "'<' not supported between instances of 'dict' and '" + type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() < other.valueOf()
            }
        }
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: dict() < NoneType()'
            )
        } else {
            throw new PyTypeError(
                "'<' not supported between instances of 'dict' and 'NoneType'"
            )
        }
    }

    __le__(other) {
        if (other !== builtins.PyNone) {
            if (types.isinstance(other, [
                types.PyBool, types.PyDict, types.PyFloat,
                types.PyInt, types.JSDict, types.PyList,
                types.PyStr, types.PyTuple
            ])) {
                if (version.earlier('3.6')) {
                    throw new PyTypeError(
                        'unorderable types: dict() <= ' + type_name(other) + '()'
                    )
                } else {
                    throw new PyTypeError(
                        "'<=' not supported between instances of 'dict' and '" + type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() <= other.valueOf()
            }
        }
        if (version.earlier('3.6')) {
            throw new PyTypeError(
                'unorderable types: dict() <= NoneType()'
            )
        } else {
            throw new PyTypeError(
                "'<=' not supported between instances of 'dict' and 'NoneType'"
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
        if (other !== builtins.PyNone) {
            if (types.isinstance(other, [
                types.PyBool, types.PyDict, types.PyFloat,
                types.PyInt, types.JSDict, types.PyList,
                types.PySet, types.PyStr,
                types.PyTuple
            ])) {
                if (version.earlier('3.6')) {
                    throw new PyTypeError(
                        'unorderable types: dict() > ' + type_name(other) + '()'
                    )
                } else {
                    throw new PyTypeError(
                        "'>' not supported between instances of 'dict' and '" + type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() > other.valueOf()
            }
        } else {
            if (version.earlier('3.6')) {
                throw new PyTypeError(
                    'unorderable types: dict() > NoneType()'
                )
            } else {
                throw new PyTypeError(
                    "'>' not supported between instances of 'dict' and 'NoneType'"
                )
            }
        }
    }

    __ge__(other) {
        if (other !== builtins.PyNone) {
            if (types.isinstance(other, [
                types.PyBool, types.PyDict, types.PyFloat,
                types.PyInt, types.JSDict, types.PyList,
                types.PyStr, types.PyTuple
            ])) {
                if (version.earlier('3.6')) {
                    throw new PyTypeError(
                        'unorderable types: dict() >= ' + type_name(other) + '()'
                    )
                } else {
                    throw new PyTypeError(
                        "'>=' not supported between instances of 'dict' and '" + type_name(other) + "'"
                    )
                }
            } else {
                return this.valueOf() >= other.valueOf()
            }
        } else {
            if (version.earlier('3.6')) {
                throw new PyTypeError(
                    'unorderable types: dict() >= NoneType()'
                )
            } else {
                throw new PyTypeError(
                    "'>=' not supported between instances of 'dict' and 'NoneType'"
                )
            }
        }
    }

    __contains__(other) {
        return this.valueOf().hasOwnProperty(other)
    }

    /**************************************************
     * Unary operators
     **************************************************/

    __pos__() {
        throw new PyTypeError("bad operand type for unary +: 'jsdict'")
    }

    __neg__() {
        throw new PyTypeError("bad operand type for unary -: 'jsdict'")
    }

    __not__() {
        return this.__bool__().__not__()
    }

    __invert__() {
        throw new PyTypeError("bad operand type for unary ~: 'jsdict'")
    }

    /**************************************************
     * Binary operators
     **************************************************/

    __pow__(other) {
        throw new PyTypeError("unsupported operand type(s) for ** or pow(): 'jsdict' and '" + type_name(other) + "'")
    }

    __div__(other) {
        return this.__truediv__(other)
    }

    __floordiv__(other) {
        throw new PyTypeError("unsupported operand type(s) for //: 'jsdict' and '" + type_name(other) + "'")
    }

    __truediv__(other) {
        throw new PyTypeError("unsupported operand type(s) for /: 'jsdict' and '" + type_name(other) + "'")
    }

    __mul__(other) {
        if (types.isinstance(other, [
            types.PyBool, types.PyDict, types.PyFloat,
            types.JSDict, types.PyInt, types.PyNoneType])) {
            throw new PyTypeError("unsupported operand type(s) for *: 'jsdict' and '" + type_name(other) + "'")
        } else {
            throw new PyTypeError("can't multiply sequence by non-int of type 'jsdict'")
        }
    }

    __mod__(other) {
        throw new PyNotImplementedError('Dict.__mod__ has not been implemented')
    }

    __add__(other) {
        throw new PyTypeError("unsupported operand type(s) for +: 'jsdict' and '" + type_name(other) + "'")
    }

    __sub__(other) {
        throw new PyTypeError("unsupported operand type(s) for -: 'jsdict' and '" + type_name(other) + "'")
    }

    __setitem__(key, value) {
        this[key] = value
    }

    __lshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for <<: 'jsdict' and '" + type_name(other) + "'")
    }

    __rshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for >>: 'jsdict' and '" + type_name(other) + "'")
    }

    __and__(other) {
        throw new PyTypeError("unsupported operand type(s) for &: 'jsdict' and '" + type_name(other) + "'")
    }

    __xor__(other) {
        throw new PyTypeError("unsupported operand type(s) for ^: 'jsdict' and '" + type_name(other) + "'")
    }

    __or__(other) {
        throw new PyTypeError("unsupported operand type(s) for |: 'jsdict' and '" + type_name(other) + "'")
    }

    /**************************************************
     * Inplace operators
     **************************************************/

    __ifloordiv__(other) {
        throw new PyTypeError("unsupported operand type(s) for //=: 'jsdict' and '" + type_name(other) + "'")
    }

    __itruediv__(other) {
        throw new PyTypeError("unsupported operand type(s) for /=: 'jsdict' and '" + type_name(other) + "'")
    }

    __iadd__(other) {
        throw new PyTypeError("unsupported operand type(s) for +=: 'jsdict' and '" + type_name(other) + "'")
    }

    __isub__(other) {
        throw new PyTypeError("unsupported operand type(s) for -=: 'jsdict' and '" + type_name(other) + "'")
    }

    __imul__(other) {
        throw new PyTypeError("unsupported operand type(s) for *=: 'jsdict' and '" + type_name(other) + "'")
    }

    __imod__(other) {
        throw new PyTypeError("unsupported operand type(s) for %=: 'jsdict' and '" + type_name(other) + "'")
    }

    __ipow__(other) {
        throw new PyTypeError("unsupported operand type(s) for **=: 'jsdict' and '" + type_name(other) + "'")
    }

    __ilshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for <<=: 'jsdict' and '" + type_name(other) + "'")
    }

    __irshift__(other) {
        throw new PyTypeError("unsupported operand type(s) for >>=: 'jsdict' and '" + type_name(other) + "'")
    }

    __iand__(other) {
        throw new PyTypeError("unsupported operand type(s) for &=: 'jsdict' and '" + type_name(other) + "'")
    }

    __ixor__(other) {
        throw new PyTypeError("unsupported operand type(s) for ^=: 'jsdict' and '" + type_name(other) + "'")
    }

    __ior__(other) {
        throw new PyTypeError("unsupported operand type(s) for |=: 'jsdict' and '" + type_name(other) + "'")
    }

    __getitem__(other) {
        var value = this[other]
        if (value === undefined) {
            if (other === null) {
                throw new PyKeyError('None')
            } else {
                throw new PyKeyError(other.__str__())
            }
        }
        return value
    }

    __delitem__(key) {
        if (!this.__contains__(key)) {
            if (key === null) {
                throw new PyKeyError('None')
            } else {
                throw new PyKeyError(key)
            }
        }
        delete this[key]
    }

    /**************************************************
     * Methods
     **************************************************/

    get(key, backup) {
        if (this.__contains__(key)) {
            return this[key]
        } else if (typeof backup === 'undefined') {
            if (key === null) {
                throw new PyKeyError('None')
            } else {
                throw new PyKeyError(key)
            }
        } else {
            return backup
        }
    }

    update(values) {
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key]
            }
        }
    }

    copy() {
        return new JSDict(this)
    }

    items() {
        var result = new types.PyList()
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                result.append(new types.PyTuple([key, this[key]]))
            }
        }
        return result
    }

    keys() {
        var result = []
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                result.push(key)
            }
        }
        return new types.PyList(result)
    }

    __iter__() {
        return this.keys().__iter__()
    }

    values() {
        var result = []
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                result.push(this[key])
            }
        }
        return new types.PyList(result)
    }

    clear() {
        for (var key in this) {
            delete this[key]
        }
    }
}
