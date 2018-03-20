import { pyBataviaError } from './core/exceptions'

import { pytype, pyNoneType } from './core/types'

import { pyNotImplementedType } from './types/NotImplementedType'

import pycode from './types/Code'
import pymodule from './types/Module'

// Str and Bool are special, and need to be handled first.
import pystr from './types/Str'
import pybool from './types/Bool'

import pyfloat from './types/Float'
import pyint from './types/Int'

import pydict from './types/Dict'
import pylist from './types/List'
import pyset from './types/Set'
import pytuple from './types/Tuple'
import pyfrozenset from './types/FrozenSet'

import pybytes from './types/Bytes'
import pybytearray from './types/Bytearray'

import pycomplex from './types/Complex'

import pyellipsis from './types/Ellipsis'

import pyfunction from './types/Function'
import pymethod from './types/Method'

import pygenerator from './types/Generator'

import pyrange from './types/Range'
import pyslice from './types/Slice'

/*************************************************************************
 * Type comparison defintions that match Python-like behavior.
 *************************************************************************/

export function _isinstance(obj, type) {
    switch (typeof obj) {
        case 'boolean':
            return type === pybool
        case 'number':
            return type === pyint
        case 'string':
            return type === pystr
        case 'function':
        case 'object':
            if (obj.__class__) {
                for (let t of obj.__class__.mro()) {
                    if (t === type) {
                        return true
                    }
                }
            }
            return false
        default:
            return false
    }
}

export function isinstance(obj, type) {
    if (type instanceof Array) {
        for (let t in type) {
            if (_isinstance(obj, type[t])) {
                return true
            }
        }
        return false
    } else {
        return _isinstance(obj, type)
    }
}

export function isbataviainstance(obj) {
    return isinstance(obj, [
        pybool, pydict, pyfloat,
        pyint, pylist,
        pyNoneType, pytuple, pyslice,
        pybytes, pybytearray, pytype,
        pystr, pyset, pyrange,
        pyfrozenset, pycomplex,
        pyNotImplementedType
    ])
}

export function _issubclass(cls, type) {
    switch (typeof cls) {
        case 'boolean':
            return type === pybool
        case 'number':
            return type === pyint
        case 'string':
            return type === pystr
        case 'function':
        case 'object':
            if (type === null || type === pyNoneType) {
                return cls === null
            } else {
                for (let t of cls.mro()) {
                    if (t === type) {
                        return true
                    }
                }
            }
            return false
        default:
            return false
    }
}

export function issubclass(cls, type) {
    if (type instanceof Array) {
        for (let t in type) {
            if (_issubclass(cls, type[t])) {
                return true
            }
        }
        return false
    } else {
        return _issubclass(cls, type)
    }
}

export function js2py(arg) {
    if (Array.isArray(arg)) {
        // recurse
        let arr = pylist()
        for (let i = 0; i < arg.length; i++) {
            arr.append(js2py(arg[i]))
        }
        return arr
    }

    switch (typeof arg) {
        case 'boolean':
            return arg
        case 'number':
            if (Number.isInteger(arg)) {
                return pyint(arg)
            } else {
                return pyfloat(arg)
            }
        case 'string':
            return pystr(arg)
        case 'function':
        case 'object':
            if (arg === null || arg === pyNoneType) {
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
                let d = pydict()
                for (let k in arg) {
                    if (arg.hasOwnProperty(k)) {
                        d.__setitem__(js2py(k), js2py(arg[k]))
                    }
                }
                return d
            }
        default:
            throw pyBataviaError('Unknown type ' + (typeof arg))
    }
}

export {
    pybool,
    pybytearray,
    pybytes,
    pycode,
    pycomplex,
    pydict,
    pyellipsis,
    pyfloat,
    pyfrozenset,
    pyfunction,
    pygenerator,
    pyint,
    pylist,
    pymethod,
    pymodule,
    pyNoneType,
    pyNotImplementedType,
    pyrange,
    pyset,
    pyslice,
    pystr,
    pytuple,
    pytype
}
