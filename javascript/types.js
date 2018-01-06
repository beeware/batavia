import { BataviaError } from './core/exceptions'

import { Type, NoneType } from './core/types'

import NotImplementedType from './types/NotImplementedType'

import Code from './types/Code'
import Module from './types/Module'
import JSDict from './types/JSDict'

import Property from './types/Property'

import SetIterator from './types/SetIterator'

import Bool from './types/Bool'
import Float from './types/Float'
import Int from './types/Int'

import Dict from './types/Dict'
import List from './types/List'
import Set from './types/Set'
import Tuple from './types/Tuple'
import FrozenSet from './types/FrozenSet'

import Str from './types/Str'
import Bytes from './types/Bytes'
import Bytearray from './types/Bytearray'

import Complex from './types/Complex'

import DictView from './types/DictView'
import Ellipsis from './types/Ellipsis'

import Filter from './types/Filter'
import Map from './types/Map'
import Zip from './types/Zip'

import Function from './types/Function'
import Method from './types/Method'

import Generator from './types/Generator'

import Range from './types/Range'
import Slice from './types/Slice'

import CallableIterator from './types/CallableIterator'

import Enumerate from './types/Enumerate'

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
                return type === Bool
            case 'number':
                return type === Int
            case 'string':
                return type === Str
            case 'object':
                return obj instanceof type
            default:
                return false
        }
    }
}

export function isbataviainstance(obj) {
    return isinstance(obj, [
        Bool, Dict, Float,
        Int, JSDict, List,
        NoneType, Tuple, Slice,
        Bytes, Bytearray, Type,
        Str, Set, Range,
        FrozenSet, Complex,
        NotImplementedType
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
                return type === Bool
            case 'number':
                return type === Int
            case 'string':
                return type === Str
            case 'object':
                if (type === null || type === NoneType) {
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
        var arr = new List()
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
                return new Int(arg)
            } else {
                return new Float(arg)
            }
        case 'string':
            return new Str(arg)
        case 'object':
            if (arg === null || arg === NoneType) {
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
                var dict = new Dict()
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
    Bool,
    Bytearray,
    Bytes,
    CallableIterator,
    Code,
    Complex,
    Dict,
    DictView,
    Ellipsis,
    Enumerate,
    Filter,
    Float,
    FrozenSet,
    Function,
    Generator,
    Int,
    JSDict,
    List,
    Map,
    Method,
    Module,
    NoneType,
    NotImplementedType,
    Property,
    Range,
    Set,
    SetIterator,
    Slice,
    Str,
    Tuple,
    Type,
    Zip
}
