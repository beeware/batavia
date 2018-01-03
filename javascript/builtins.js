/*
General builtin format:

// Example: a function that accepts exactly one argument, and no keyword arguments

var <fn> = function(<args>, <kwargs>) {
    if (arguments.length !== 2) {
        throw new builtins.BataviaError.$pyclass("Batavia calling convention not used.");
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new builtins.TypeError.$pyclass("<fn>() doesn't accept keyword arguments.");
    }
    if (!args || args.length !== 1) {
        throw new builtins.TypeError.$pyclass("<fn>() expected exactly 1 argument (" + args.length + " given)");
    }
    // if the function only works with a specific object type, add a test
    var obj = args[0];
    if (!types.isinstance(obj, types.<type>)) {
        throw new builtins.TypeError.$pyclass(
            "<fn>() expects a <type> (" + type_name(obj) + " given)");
    }
    // actual code goes here
    Javascript.Function.Stuff();
}
<fn>.__doc__ = 'docstring from Python 3.4 goes here, for documentation'

modules.export = <fn>

*/

import __import__ from './builtins/__import__'
import abs from './builtins/abs'
import all from './builtins/all'
import any from './builtins/any'
import ascii from './builtins/ascii'
import bin from './builtins/bin'
import bool from './builtins/bool'
import bytearray from './builtins/bytearray'
import bytes from './builtins/bytes'
import callable from './builtins/callable'
import chr from './builtins/chr'
import classmethod from './builtins/classmethod'
import compile from './builtins/compile'
import complex from './builtins/complex'
import copyright from './builtins/copyright'
import credits from './builtins/credits'
import delattr from './builtins/delattr'
import dict from './builtins/dict'
import dir from './builtins/dir'
import divmod from './builtins/divmod'
import enumerate from './builtins/enumerate'
// import * as eval from './builtins/eval'
import exec from './builtins/exec'
import filter from './builtins/filter'
import float from './builtins/float'
import frozenset from './builtins/frozenset'
import getattr from './builtins/getattr'
import globals from './builtins/globals'
import hasattr from './builtins/hasattr'
import hash from './builtins/hash'
import help from './builtins/help'
import hex from './builtins/hex'
import id from './builtins/id'
import input from './builtins/input'
import int from './builtins/int'
import isinstance from './builtins/isinstance'
import issubclass from './builtins/issubclass'
import iter from './builtins/iter'
import len from './builtins/len'
import license from './builtins/license'
import list from './builtins/list'
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
import range from './builtins/range'
import repr from './builtins/repr'
import reversed from './builtins/reversed'
import round from './builtins/round'
import set from './builtins/set'
import setattr from './builtins/setattr'
import slice from './builtins/slice'
import sorted from './builtins/sorted'
import staticmethod from './builtins/staticmethod'
import str from './builtins/str'
import sum from './builtins/sum'
// import super from './builtins/super'
import tuple from './builtins/tuple'
import type from './builtins/type'
import vars from './builtins/vars'
import zip from './builtins/zip'

// Copy in core symbols that need to be in the builtins.
import { PyObject, NoneType } from './core/types'
import NotImplementedType from './types/NotImplementedType'
import { dom } from './modules/dom'


// Copy the exceptions into the builtin namespace.
import {
    BaseException,
    SystemExit,
    KeyboardInterrupt,
    GeneratorExit,
    Exception,
    BataviaError,
    ArithmeticError,
    AssertionError,
    AttributeError,
    BufferError,
    EOFError,
    EnvironmentError,
    FloatingPointError,
    IOError,
    ImportError,
    IndentationError,
    IndexError,
    KeyError,
    LookupError,
    MemoryError,
    NameError,
    NotImplementedException,
    NotImplementedError,
    OSError,
    OverflowError,
    PolyglotError,
    ReferenceError,
    RuntimeError,
    StandardError,
    StopIteration,
    SyntaxError,
    SystemError,
    TabError,
    TypeError,
    UnboundLocalError,
    UnicodeDecodeError,
    UnicodeEncodeError,
    UnicodeError,
    UnicodeTranslateError,
    ValueError,
    ZeroDivisionError
} from './core/exceptions'

// Instantiate some Singleton objects.
var object = PyObject.prototype.__class__
var None = new NoneType()
var NotImplemented = new NotImplementedType()

// Now that we have an instance of None, we can fill in the blanks where we needed it
PyObject.prototype.__class__.__base__ = None

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

    None,
    NotImplemented,
    dom,
    object,

    BaseException,
    SystemExit,
    KeyboardInterrupt,
    GeneratorExit,
    Exception,
    BataviaError,
    ArithmeticError,
    AssertionError,
    AttributeError,
    BufferError,
    EOFError,
    EnvironmentError,
    FloatingPointError,
    IOError,
    ImportError,
    IndentationError,
    IndexError,
    KeyError,
    LookupError,
    MemoryError,
    NameError,
    NotImplementedException,
    NotImplementedError,
    OSError,
    OverflowError,
    PolyglotError,
    ReferenceError,
    RuntimeError,
    StandardError,
    StopIteration,
    SyntaxError,
    SystemError,
    TabError,
    TypeError,
    UnboundLocalError,
    UnicodeDecodeError,
    UnicodeEncodeError,
    UnicodeError,
    UnicodeTranslateError,
    ValueError,
    ZeroDivisionError
}
