import { BataviaError } from './core/exceptions'

import JSDict from './types/JSDict'

import { PyType, PyNoneType } from './core/types'

import PyNotImplementedType from './types/NotImplementedType'

import PyCode from './types/Code'
import PyModule from './types/Module'

import PyProperty from './types/Property'

import PySetIterator from './types/SetIterator'

import PyBool from './types/Bool'
import PyFloat from './types/Float'
import PyInt from './types/Int'

import PyDict from './types/Dict'
import PyList from './types/List'
import PySet from './types/Set'
import PyTuple from './types/Tuple'
import PyFrozenSet from './types/FrozenSet'

import PyStr from './types/Str'
import PyBytes from './types/Bytes'
import PyBytearray from './types/Bytearray'

import PyComplex from './types/Complex'

import PyDictView from './types/DictView'
import PyEllipsis from './types/Ellipsis'

import PyFilter from './types/Filter'
import PyMap from './types/Map'
import PyZip from './types/Zip'

import PyFunction from './types/Function'
import PyMethod from './types/Method'

import PyGenerator from './types/Generator'

import PyRange from './types/Range'
import PySlice from './types/Slice'

import PyCallableIterator from './types/CallableIterator'

import PyEnumerate from './types/Enumerate'

/*************************************************************************
 * Type comparison defintions that match Python-like behavior.
 *************************************************************************/

export function isinstance(obj, type) {
    if (type instanceof Array) {
        for (var t in type) {
            if (isinstance(obj, type[t])) {
                return true
            }
        }
        return false
    } else {
        switch (typeof obj) {
            case 'boolean':
                return type === PyBool
            case 'number':
                return type === PyInt
            case 'string':
                return type === PyStr
            case 'object':
                return obj instanceof type
            default:
                return false
        }
    }
}

export function isbataviainstance(obj) {
    return isinstance(obj, [
        PyBool, PyDict, PyFloat,
        PyInt, PyJSDict, PyList,
        PyNoneType, PyTuple, PySlice,
        PyBytes, PyBytearray, PyType,
        PyStr, PySet, PyRange,
        PyFrozenSet, PyComplex,
        PyNotImplementedType
    ])
}

export function issubclass(cls, type) {
    var t
    if (type instanceof Array) {
        for (t in type) {
            if (issubclass(cls, type[t])) {
                return true
            }
        }
        return false
    } else {
        switch (typeof cls) {
            case 'boolean':
                return type === PyBool
            case 'number':
                return type === PyInt
            case 'string':
                return type === PyStr
            case 'object':
                if (type === null || type === PyNoneType) {
                    return cls === null
                } else {
                    var mro = cls.mro()
                    for (t in mro) {
                        if (mro[t] === type.__class__) {
                            return true
                        }
                    }
                }
                return false
            default:
                return false
        }
    }
}

export function js2py(arg) {
    if (Array.isArray(arg)) {
        // recurse
        var arr = new PyList()
        for (var i = 0; i < arg.length; i++) {
            arr.append(js2py(arg[i]))
        }
        return arr
    }

    switch (typeof arg) {
        case 'boolean':
            return arg
        case 'number':
            if (Number.isInteger(arg)) {
                return new PyInt(arg)
            } else {
                return new PyFloat(arg)
            }
        case 'string':
            return new PyStr(arg)
        case 'object':
            if (arg === null || arg === PyNoneType) {
                return null
            } else if (
                arg.__class__ !== undefined &&
                arg.__class__ !== null &&
                arg.__class__.__name__
            ) {
                // already a Python object
                return arg
            } else {
                // this is a generic object; turn it into a dictionary
                var dict = new PyDict()
                for (var k in arg) {
                    if (arg.hasOwnProperty(k)) {
                        dict.__setitem__(js2py(k), js2py(arg[k]))
                    }
                }
                return dict
            }
        default:
            throw new BataviaError('Unknown type ' + (typeof arg))
    }
}

export {
    JSDict,

    PyBool,
    PyBytearray,
    PyBytes,
    PyCallableIterator,
    PyCode,
    PyComplex,
    PyDict,
    PyDictView,
    PyEllipsis,
    PyEnumerate,
    PyFilter,
    PyFloat,
    PyFrozenSet,
    PyFunction,
    PyGenerator,
    PyInt,
    PyList,
    PyMap,
    PyMethod,
    PyModule,
    PyNoneType,
    PyNotImplementedType,
    PyProperty,
    PyRange,
    PySet,
    PySetIterator,
    PySlice,
    PyStr,
    PyTuple,
    PyType,
    PyZip
}
