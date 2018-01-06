/*
General builtin format:

// Example: a function that accepts exactly one argument, and no keyword arguments

var <fn> = function(<args>, <kwargs>) {
    if (arguments.length !== 2) {
        throw new builtins.BataviaError("Batavia calling convention not used.");
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new builtins.PyTypeError("<fn>() doesn't accept keyword arguments.");
    }
    if (!args || args.length !== 1) {
        throw new builtins.PyTypeError("<fn>() expected exactly 1 argument (" + args.length + " given)");
    }
    // if the function only works with a specific object type, add a test
    var obj = args[0];
    if (!types.isinstance(obj, types.<type>)) {
        throw new builtins.PyTypeError(
            "<fn>() expects a <type> (" + type_name(obj) + " given)");
    }
    // actual code goes here
    Javascript.Function.Stuff();
}
<fn>.__doc__ = 'docstring from Python 3.4 goes here, for documentation'

modules.export = <fn>

*/

import { PyNone, PyObject, PyType } from './core/types'

import PyBool from './types/Bool'
import PyBytearray from './types/Bytearray'
import PyBytes from './types/Bytes'
import PyComplex from './types/Complex'
import PyDict from './types/Dict'
import PyEllipsis from './types/Ellipsis'
import PyEnumerate from './types/Enumerate'
import PyFilter from './types/Filter'
import PyFloat from './types/Float'
import PyFrozenset from './types/Frozenset'
import PyInt from './types/Int'
import PyList from './types/List'
import PyNotImplementedType from './types/NotImplementedType'
import PyProperty from './types/Property'
import PyRange from './types/Range'
import PySet from './types/Set'
import PyStr from './types/Str'
import PyTuple from './types/Tuple'

import __import__ from './builtins/__import__'
import abs from './builtins/abs'
import all from './builtins/all'
import any from './builtins/any'
import ascii from './builtins/ascii'
import bin from './builtins/bin'
import callable from './builtins/callable'
import chr from './builtins/chr'
import classmethod from './builtins/classmethod'
import compile from './builtins/compile'
import copyright from './builtins/copyright'
import credits from './builtins/credits'
import delattr from './builtins/delattr'
import dir from './builtins/dir'
import divmod from './builtins/divmod'
// import * as eval from './builtins/eval'
import exec from './builtins/exec'
import getattr from './builtins/getattr'
import globals from './builtins/globals'
import hasattr from './builtins/hasattr'
import hash from './builtins/hash'
import help from './builtins/help'
import hex from './builtins/hex'
import id from './builtins/id'
import input from './builtins/input'
import isinstance from './builtins/isinstance'
import issubclass from './builtins/issubclass'
import iter from './builtins/iter'
import len from './builtins/len'
import license from './builtins/license'
import locals from './builtins/locals'
import map from './builtins/map'
import max from './builtins/max'
import memoryview from './builtins/memoryview'
import min from './builtins/min'
import next from './builtins/next'
import oct from './builtins/oct'
import open from './builtins/open'
import ord from './builtins/ord'
import pow from './builtins/pow'
import print from './builtins/print'
import repr from './builtins/repr'
import reversed from './builtins/reversed'
import round from './builtins/round'
import setattr from './builtins/setattr'
import slice from './builtins/slice'
import sorted from './builtins/sorted'
import staticmethod from './builtins/staticmethod'
import sum from './builtins/sum'
// import super from './builtins/super'
import vars from './builtins/vars'
import zip from './builtins/zip'


import { dom } from './modules/dom'

// Copy the exceptions into the builtin namespace.
import {
    PyBaseException,
    PySystemExit,
    PyKeyboardInterrupt,
    PyGeneratorExit,
    PyException,
    PyArithmeticError,
    PyAssertionError,
    PyAttributeError,
    PyBufferError,
    PyEOFError,
    PyEnvironmentError,
    PyFloatingPointError,
    PyIOError,
    PyImportError,
    PyIndentationError,
    PyIndexError,
    PyKeyError,
    PyLookupError,
    PyMemoryError,
    PyNameError,
    PyNotImplementedError,
    PyOSError,
    PyOverflowError,
    PyReferenceError,
    PyRuntimeError,
    // PyStandardError,
    PyStopIteration,
    PySyntaxError,
    PySystemError,
    PyTabError,
    PyTypeError,
    PyUnboundLocalError,
    PyUnicodeDecodeError,
    PyUnicodeEncodeError,
    PyUnicodeError,
    PyUnicodeTranslateError,
    PyValueError,
    PyZeroDivisionError,

    BataviaError,
    PolyglotError
} from './core/exceptions'

// The type constructors
var bool = PyBool.__class__
var bytearray = PyBytearray.__class__
var bytes = PyBytes.__class__
var complex = PyComplex.__class__
var dict = PyDict.__class__
var enumerate = PyEnumerate.__class__
var filter = PyFilter.__class__
var float = PyFloat.__class__
var frozenset = PyFrozenset.__class__
var int = PyInt.__class__
var list = PyList.__class__
var property = PyProperty.__class__
var range = PyRange.__class__
var set = PySet.__class__
var str = PyStr.__class__
var tuple = PyTuple.__class__
var type = PyType.__class__

// A singleton instance of NotImplementedType
var PyNotImplemented = new PyNotImplementedType()

export {
    __import__,

    abs,
    all,
    any,
    ascii,
    bin,
    bool,
    bytearray,
    bytes,
    callable,
    chr,
    classmethod,
    compile,
    complex,
    copyright,
    credits,
    delattr,
    dict,
    dir,
    // display,
    divmod,
    enumerate,
    // eval,
    exec,
    filter,
    float,
    frozenset,
    getattr,
    globals,
    hasattr,
    hash,
    help,
    hex,
    id,
    input,
    int,
    isinstance,
    issubclass,
    iter,
    len,
    license,
    list,
    locals,
    map,
    max,
    memoryview,
    min,
    next,
    PyObject as object,
    oct,
    open,
    ord,
    pow,
    print,
    property,
    range,
    repr,
    reversed,
    round,
    set,
    setattr,
    slice,
    sorted,
    staticmethod,
    str,
    sum,
    // super,
    tuple,
    type,
    vars,
    zip,

    PyNone,
    PyEllipsis,

    PyArithmeticError,
    PyAssertionError,
    PyAttributeError,
    PyBaseException,
    // PyBlockingIOError
    // PyBrokenPipeError,
    PyBufferError,
    // PyBytesWarning
    // PyChildProcessError,
    // PyConnectionAbortedError,
    // PyConnectionError,
    // PyConnectionRefusedError,
    // PyDeprecationWarning,
    PyEOFError,
    PyEnvironmentError,
    PyException,
    // PyFileExistsError,
    // PyFileNotFoundError,
    PyFloatingPointError,
    // PyFutureWarning,
    PyGeneratorExit,
    PyIOError,
    PyImportError,
    // PyImportWarning,
    PyIndentationError,
    PyIndexError,
    // PyInterruptedError,
    // PyIsADirectoryError,
    PyKeyError,
    PyKeyboardInterrupt,
    PyLookupError,
    PyMemoryError,
    PyNameError,
    // PyNotADirectoryError,
    PyNotImplemented,
    PyNotImplementedError,
    PyOSError,
    PyOverflowError,
    // PyPendingDeprecationWarning,
    // PyPermissionError,
    // PyProcessLookupError,
    PyReferenceError,
    // PyResourceWarning,
    PyRuntimeError,
    // PyRuntimeWarning,
    PyStopIteration,
    PySyntaxError,
    // PySyntaxWarning
    PySystemError,
    PySystemExit,
    PyTabError,
    // PyTimeoutError,
    PyTypeError,
    PyUnboundLocalError,
    PyUnicodeDecodeError,
    PyUnicodeEncodeError,
    PyUnicodeError,
    PyUnicodeTranslateError,
    // PyUnicodeWarning,
    // PyUserWarning,
    PyValueError,
    // Warning,
    PyZeroDivisionError,

    BataviaError,
    PolyglotError,
    dom
}
