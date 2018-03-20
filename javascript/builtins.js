// Import the type primitives
// We use type, not pytype here, because we want the type *method*
// that can be used to return the type of existing type objects,
// as well as being a constructor for new type objects.
import { pyNone, pyobject, type } from './core/types'

// Types with special constructor handling
import pybool from './builtins/bool'
import pystr from './builtins/str'

// Types whose constructors double as functions
import pybytearray from './types/Bytearray'
import pybytes from './types/Bytes'
import pycomplex from './types/Complex'
import pydict from './types/Dict'
import pyellipsis from './types/Ellipsis'
import pyfloat from './types/Float'
import pyfrozenset from './types/Frozenset'
import pyint from './types/Int'
import pylist from './types/List'
import { pyNotImplemented } from './types/NotImplementedType'
import pyrange from './types/Range'
import pyset from './types/Set'
import pyslice from './types/Slice'
import pytuple from './types/Tuple'

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
import delattr from './builtins/delattr'
import dir from './builtins/dir'
import divmod from './builtins/divmod'
import enumerate from './builtins/enumerate'
// import * as eval from './builtins/eval'
import exec from './builtins/exec'
import filter from './builtins/filter'
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
import property from './builtins/property'
import repr from './builtins/repr'
import reversed from './builtins/reversed'
import round from './builtins/round'
import setattr from './builtins/setattr'
import sorted from './builtins/sorted'
import staticmethod from './builtins/staticmethod'
import sum from './builtins/sum'
// import super from './builtins/super'
import vars from './builtins/vars'
import zip from './builtins/zip'

import { dom } from './modules/dom'

// Copy the exceptions into the builtin namespace.
import {
    pyArithmeticError,
    pyAssertionError,
    pyAttributeError,
    pyBaseException,
    pyBlockingIOError,
    pyBrokenPipeError,
    pyBufferError,
    pyBytesWarning,
    pyChildProcessError,
    pyConnectionAbortedError,
    pyConnectionError,
    pyConnectionRefusedError,
    pyConnectionResetError,
    pyDeprecationWarning,
    pyEOFError,
    pyException,
    pyFileExists,
    pyFileNotFoundError,
    pyFloatingPointError,
    pyFutureWarning,
    pyGeneratorExit,
    pyImportError,
    pyImportWarning,
    pyIndentationError,
    pyIndexError,
    pyInterruptedError,
    pyIsADirectoryError,
    pyKeyboardInterrupt,
    pyKeyError,
    pyLookupError,
    pyMemoryError,
    pyModuleNotFoundError,
    pyNameError,
    pyNotADirectoryError,
    pyNotImplementedError,
    pyOSError,
    pyOverflowError,
    pyPendingDeprecationWarning,
    pyPermissionError,
    pyProcessLookupError,
    pyRecursionError,
    pyReferenceError,
    pyResourceWarning,
    pyRuntimeError,
    pyRuntimeWarning,
    pyStopAsyncIteration,
    pyStopIteration,
    pySyntaxError,
    pySyntaxWarning,
    pySystemError,
    pySystemExit,
    pyTabError,
    pyTimeoutError,
    pyTypeError,
    pyUnboundLocalError,
    pyUnicodeDecodeError,
    pyUnicodeEncodeError,
    pyUnicodeError,
    pyUnicodeTranslateError,
    pyUnicodeWarning,
    pyUserWarning,
    pyValueError,
    pyWarning,
    pyZeroDivisionError,

    pyBataviaError,
    pyPolyglotError
} from './core/exceptions'

let __name__ = 'builtins'
let __package__ = ''

export {
    __name__,
    __package__,


    __import__,

    abs,
    all,
    any,
    ascii,
    bin,
    pybool as bool,
    pybytearray as bytearray,
    pybytes as bytes,
    callable,
    chr,
    classmethod,
    compile,
    pycomplex as complex,
    copyright,
    credits,
    delattr,
    pydict as dict,
    dir,
    // display,
    divmod,
    enumerate,
    // eval,
    exec,
    filter,
    pyfloat as float,
    pyfrozenset as frozenset,
    getattr,
    globals,
    hasattr,
    hash,
    help,
    hex,
    id,
    input,
    pyint as int,
    isinstance,
    issubclass,
    iter,
    len,
    license,
    pylist as list,
    locals,
    map,
    max,
    memoryview,
    min,
    next,
    pyobject as object,
    oct,
    open,
    ord,
    pow,
    print,
    property,
    pyrange as range,
    repr,
    reversed,
    round,
    pyset as set,
    setattr,
    pyslice as slice,
    sorted,
    staticmethod,
    pystr as str,
    sum,
    // super,
    pytuple as tuple,
    type,
    vars,
    zip,

    pyNone as None,
    pyellipsis as ellipsis,
    pyNotImplemented as NotImplemented,

    pyArithmeticError as ArithmeticError,
    pyAssertionError as AssertionError,
    pyAttributeError as AttributeError,
    pyBaseException as BaseException,
    pyBlockingIOError as BlockingIOError,
    pyBrokenPipeError as BrokenPipeError,
    pyBufferError as BufferError,
    pyBytesWarning as BytesWarning,
    pyChildProcessError as ChildProcessError,
    pyConnectionAbortedError as ConnectionAbortedError,
    pyConnectionError as ConnectionError,
    pyConnectionRefusedError as ConnectionRefusedError,
    pyConnectionResetError as ConnectionResetError,
    pyDeprecationWarning as DeprecationWarning,
    pyEOFError as EOFError,
    pyException as Exception,
    pyFileExists as FileExists,
    pyFileNotFoundError as FileNotFoundError,
    pyFloatingPointError as FloatingPointError,
    pyFutureWarning as FutureWarning,
    pyGeneratorExit as GeneratorExit,
    pyImportError as ImportError,
    pyImportWarning as ImportWarning,
    pyIndentationError as IndentationError,
    pyIndexError as IndexError,
    pyInterruptedError as InterruptedError,
    pyIsADirectoryError as IsADirectoryError,
    pyKeyboardInterrupt as KeyboardInterrupt,
    pyKeyError as KeyError,
    pyLookupError as LookupError,
    pyMemoryError as MemoryError,
    pyModuleNotFoundError as ModuleNotFoundError,
    pyNameError as NameError,
    pyNotADirectoryError as NotADirectoryError,
    pyNotImplementedError as NotImplementedError,
    pyOSError as OSError,
    pyOverflowError as OverflowError,
    pyPendingDeprecationWarning as PendingDeprecationWarning,
    pyPermissionError as PermissionError,
    pyProcessLookupError as ProcessLookupError,
    pyRecursionError as RecursionError,
    pyReferenceError as ReferenceError,
    pyResourceWarning as ResourceWarning,
    pyRuntimeError as RuntimeError,
    pyRuntimeWarning as RuntimeWarning,
    pyStopAsyncIteration as StopAsyncIteration,
    pyStopIteration as StopIteration,
    pySyntaxError as SyntaxError,
    pySyntaxWarning as SyntaxWarning,
    pySystemError as SystemError,
    pySystemExit as SystemExit,
    pyTabError as TabError,
    pyTimeoutError as TimeoutError,
    pyTypeError as TypeError,
    pyUnboundLocalError as UnboundLocalError,
    pyUnicodeDecodeError as UnicodeDecodeError,
    pyUnicodeEncodeError as UnicodeEncodeError,
    pyUnicodeError as UnicodeError,
    pyUnicodeTranslateError as UnicodeTranslateError,
    pyUnicodeWarning as UnicodeWarning,
    pyUserWarning as UserWarning,
    pyValueError as ValueError,
    pyWarning as Warning,
    pyZeroDivisionError as ZeroDivisionError,

    pyBataviaError as BataviaError,
    pyPolyglotError as PolyglotError,
    dom
}
