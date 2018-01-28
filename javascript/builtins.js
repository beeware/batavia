import { delattr, getattr, hasattr, setattr } from './core/attrs'

import { PyNone, PyObject } from './core/types'

// Types whose constructors double as functions
import PyBytearray from './types/Bytearray'
import PyBytes from './types/Bytes'
import PyComplex from './types/Complex'
import PyDict from './types/Dict'
import PyEllipsis from './types/Ellipsis'
import PyFloat from './types/Float'
import PyFrozenset from './types/Frozenset'
import PyInt from './types/Int'
import PyList from './types/List'
import PyNotImplementedType from './types/NotImplementedType'
import PyRange from './types/Range'
import PySet from './types/Set'
import PySlice from './types/Slice'
import PyTuple from './types/Tuple'

// Types with special constructor handling
import bool from './builtins/bool'
import str from './builtins/str'
import type from './builtins/type'

// Other builtin functions
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
import dir from './builtins/dir'
import divmod from './builtins/divmod'
import enumerate from './builtins/enumerate'
// import * as eval from './builtins/eval'
import exec from './builtins/exec'
import filter from './builtins/filter'
import globals from './builtins/globals'
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
import property from './builtins/property'
import repr from './builtins/repr'
import reversed from './builtins/reversed'
import round from './builtins/round'
import sorted from './builtins/sorted'
import staticmethod from './builtins/staticmethod'
import sum from './builtins/sum'
// import super from './builtins/super'
import vars from './builtins/vars'
import zip from './builtins/zip'

import { dom } from './modules/dom'

// Copy the exceptions into the builtin namespace.
import {
    ArithmeticError,
    AssertionError,
    AttributeError,
    BaseException,
    // BlockingIOError
    // BrokenPipeError,
    BufferError,
    // PyBytesWarning
    // ChildProcessError,
    // ConnectionAbortedError,
    // ConnectionError,
    // ConnectionRefusedError,
    // PyDeprecationWarning,
    EOFError,
    EnvironmentError,
    Exception,
    // FileExistsError,
    // FileNotFoundError,
    FloatingPointError,
    // PyFutureWarning,
    GeneratorExit,
    IOError,
    ImportError,
    // PyImportWarning,
    IndentationError,
    IndexError,
    // InterruptedError,
    // IsADirectoryError,
    KeyError,
    KeyboardInterrupt,
    LookupError,
    MemoryError,
    NameError,
    // NotADirectoryError,
    NotImplementedError,
    OSError,
    OverflowError,
    // PyPendingDeprecationWarning,
    // PermissionError,
    // ProcessLookupError,
    ReferenceError,
    // PyResourceWarning,
    RuntimeError,
    // PyRuntimeWarning,
    StopIteration,
    SyntaxError,
    // PySyntaxWarning
    SystemError,
    SystemExit,
    TabError,
    // TimeoutError,
    TypeError,
    UnboundLocalError,
    UnicodeDecodeError,
    UnicodeEncodeError,
    UnicodeError,
    UnicodeTranslateError,
    // PyUnicodeWarning,
    // PyUserWarning,
    ValueError,
    // Warning,
    ZeroDivisionError,

    BataviaError,
    PolyglotError
} from './core/exceptions'

// The builtin type constructors
var bytearray = PyBytearray.__class__
var bytes = PyBytes.__class__
var complex = PyComplex.__class__
var dict = PyDict.__class__
var float = PyFloat.__class__
var frozenset = PyFrozenset.__class__
var int = PyInt.__class__
var list = PyList.__class__
var object = PyObject.__class__
var range = PyRange.__class__
var set = PySet.__class__
var slice = PySlice.__class__
var tuple = PyTuple.__class__

// A singleton instance of NotImplementedType
var NotImplemented = new PyNotImplementedType()

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
    object,
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

    PyNone as None,
    PyEllipsis as Ellipsis,
    NotImplemented,

    ArithmeticError,
    AssertionError,
    AttributeError,
    BaseException,
    // BlockingIOError
    // BrokenPipeError,
    BufferError,
    // PyBytesWarning
    // ChildProcessError,
    // ConnectionAbortedError,
    // ConnectionError,
    // ConnectionRefusedError,
    // PyDeprecationWarning,
    EOFError,
    EnvironmentError,
    Exception,
    // FileExistsError,
    // FileNotFoundError,
    FloatingPointError,
    // PyFutureWarning,
    GeneratorExit,
    IOError,
    ImportError,
    // PyImportWarning,
    IndentationError,
    IndexError,
    // InterruptedError,
    // IsADirectoryError,
    KeyError,
    KeyboardInterrupt,
    LookupError,
    MemoryError,
    NameError,
    // NotADirectoryError,
    NotImplementedError,
    OSError,
    OverflowError,
    // PyPendingDeprecationWarning,
    // PermissionError,
    // ProcessLookupError,
    ReferenceError,
    // PyResourceWarning,
    RuntimeError,
    // PyRuntimeWarning,
    StopIteration,
    SyntaxError,
    // PySyntaxWarning
    SystemError,
    SystemExit,
    TabError,
    // TimeoutError,
    TypeError,
    UnboundLocalError,
    UnicodeDecodeError,
    UnicodeEncodeError,
    UnicodeError,
    UnicodeTranslateError,
    // PyUnicodeWarning,
    // PyUserWarning,
    ValueError,
    // Warning,
    ZeroDivisionError,

    BataviaError,
    PolyglotError,
    dom
}
