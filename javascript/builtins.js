import { delattr, getattr, hasattr, setattr } from './core/attrs'

import { PyNone, PyObject } from './core/types'

// Types with special constructor handling
import bool from './builtins/bool'
import str from './builtins/str'
import type from './builtins/type'

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
    PyArithmeticError,
    PyAssertionError,
    PyAttributeError,
    PyBaseException,
    // BlockingIOError
    // BrokenPipeError,
    PyBufferError,
    // PyBytesWarning
    // ChildProcessError,
    // ConnectionAbortedError,
    // ConnectionError,
    // ConnectionRefusedError,
    // PyDeprecationWarning,
    PyEOFError,
    PyEnvironmentError,
    PyException,
    // FileExistsError,
    // FileNotFoundError,
    PyFloatingPointError,
    // PyFutureWarning,
    PyGeneratorExit,
    PyIOError,
    PyImportError,
    // PyImportWarning,
    PyIndentationError,
    PyIndexError,
    // InterruptedError,
    // IsADirectoryError,
    PyKeyError,
    PyKeyboardInterrupt,
    PyLookupError,
    PyMemoryError,
    PyNameError,
    // NotADirectoryError,
    PyNotImplementedError,
    PyOSError,
    PyOverflowError,
    // PyPendingDeprecationWarning,
    // PermissionError,
    // ProcessPyLookupError,
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
    // TimeoutError,
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

    PyBataviaError,
    PyPolyglotError
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

// The builtin exception constructors
var ArithmeticError = PyArithmeticError.__class__
var AssertionError = PyAssertionError.__class__
var AttributeError = PyAttributeError.__class__
var BaseException = PyBaseException.__class__
// var BlockingPyIOError = PyBlockingPyIOError.__class__
// var BrokenPipeError = PyBrokenPipeError.__class__
var BufferError = PyBufferError.__class__
// var BytesWarning = PyBytesWarning.__class__
// var ChildProcessError = PyChildProcessError.__class__
// var ConnectionAbortedError = PyConnectionAbortedError.__class__
// var ConnectionError = PyConnectionError.__class__
// var ConnectionRefusedError = PyConnectionRefusedError.__class__
// var DeprecationWarning = PyDeprecationWarning.__class__
var EOFError = PyEOFError.__class__
var EnvironmentError = PyEnvironmentError.__class__
var Exception = PyException.__class__
// var FileExistsError = PyFileExistsError.__class__
// var FileNotFoundError = PyFileNotFoundError.__class__
var FloatingPointError = PyFloatingPointError.__class__
// var FutureWarning = PyFutureWarning.__class__
var GeneratorExit = PyGeneratorExit.__class__
var IOError = PyIOError.__class__
var ImportError = PyImportError.__class__
// var ImportWarning = PyImportWarning.__class__
var IndentationError = PyIndentationError.__class__
var IndexError = PyIndexError.__class__
// var InterruptedError = PyInterruptedError.__class__
// var IsADirectoryError = PyIsADirectoryError.__class__
var KeyError = PyKeyError.__class__
var KeyboardInterrupt = PyKeyboardInterrupt.__class__
var LookupError = PyLookupError.__class__
var MemoryError = PyMemoryError.__class__
var NameError = PyNameError.__class__
// var NotADirectoryError = PyNotADirectoryError.__class__
var NotImplementedError = PyNotImplementedError.__class__
var OSError = PyOSError.__class__
var OverflowError = PyOverflowError.__class__
// var PendingDeprecationWarning = PyPendingDeprecationWarning.__class__
// var PermissionError = PyPermissionError.__class__
// var ProcessPyLookupError = PyProcessPyLookupError.__class__
var ReferenceError_ = PyReferenceError.__class__
// var ResourceWarning = PyResourceWarning.__class__
var RuntimeError = PyRuntimeError.__class__
// var RuntimeWarning = PyRuntimeWarning.__class__
var StopIteration = PyStopIteration.__class__
var SyntaxError_ = PySyntaxError.__class__
// PySyntaxWarning
var SystemError = PySystemError.__class__
var SystemExit = PySystemExit.__class__
var TabError = PyTabError.__class__
// var TimeoutError = PyTimeoutError.__class__
var TypeError_ = PyTypeError.__class__
var UnboundLocalError = PyUnboundLocalError.__class__
var UnicodeDecodeError = PyUnicodeDecodeError.__class__
var UnicodeEncodeError = PyUnicodeEncodeError.__class__
var UnicodeError = PyUnicodeError.__class__
var UnicodeTranslateError = PyUnicodeTranslateError.__class__
// var UnicodeWarning = PyUnicodeWarning.__class__
// var UserWarning = PyUserWarning.__class__
var ValueError = PyValueError.__class__
// var Warning = PyWarning.__class__
var ZeroDivisionError = PyZeroDivisionError.__class__

var BataviaError = PyBataviaError.__class__
var PolyglotError = PyPolyglotError.__class__

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
    // BlockingPyIOError
    // BrokenPipeError,
    BufferError,
    // BytesWarning
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
    // FutureWarning,
    GeneratorExit,
    IOError,
    ImportError,
    // ImportWarning,
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
    // PendingDeprecationWarning,
    // PermissionError,
    // ProcessPyLookupError,
    ReferenceError_ as ReferenceError,
    // ResourceWarning,
    RuntimeError,
    // RuntimeWarning,
    StopIteration,
    SyntaxError_ as SyntaxError,
    // SyntaxWarning
    SystemError,
    SystemExit,
    TabError,
    // TimeoutError,
    TypeError_ as TypeError_,
    UnboundLocalError,
    UnicodeDecodeError,
    UnicodeEncodeError,
    UnicodeError,
    UnicodeTranslateError,
    // UnicodeWarning,
    // UserWarning,
    ValueError,
    // Warning,
    ZeroDivisionError,

    BataviaError,
    PolyglotError,
    dom
}
