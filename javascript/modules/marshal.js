/*************************************************************************
 * Marshal
 * This module contains functions that can read and write Python values in
 * a binary format. The format is specific to Python, but independent of
 * machine architecture issues.

 * Not all Python object types are supported; in general, only objects
 * whose value is independent from a particular invocation of Python can be
 * written and read by this module. The following types are supported:
 * None, integers, floating point numbers, strings, bytes, bytearrays,
 * tuples, lists, sets, dictionaries, and code objects, where it
 * should be understood that tuples, lists and dictionaries are only
 * supported as long as the values contained therein are themselves
 * supported; and recursive lists and dictionaries should not be written
 * (they will cause infinite loops).
 *
 * Variables:
 *
 * version -- indicates the format that the module uses. Version 0 is the
 *     historical format, version 1 shares interned strings and version 2
 *     uses a binary format for floating point numbers.
 *     Version 3 shares common object references (New in version 3.4).
 *
 * Functions:
 *
 * dumps() -- write value to a string

 *************************************************************************/
import { Buffer } from 'buffer'
import BigNumber from 'bignumber.js'
import * as base64js from 'base64-js'

import * as types from '../types'
import * as builtins from '../builtins'
import { BataviaError, PyTypeError, PyValueError } from '../core/exceptions'
import PYCFile from '../core/PYCFile'

export var marshal = {
    '__doc__': '',
    '__file__': 'batavia/modules/marshal.js',
    '__name__': 'marshal',
    '__package__': '',

    /* High water mark to determine when the marshalled object is dangerously deep
     * and risks coring the interpreter.  When the object stack gets this deep,
     * raise an exception instead of continuing.
     * On Windows debug builds, reduce this value.
     * iOS also requires a reduced value.
     */
    'MAX_MARSHAL_STACK_DEPTH': 1500,

    'TYPE_null': '0'.charCodeAt(),
    'TYPE_NONE': 'N'.charCodeAt(),
    'TYPE_FALSE': 'F'.charCodeAt(),
    'TYPE_TRUE': 'T'.charCodeAt(),
    'TYPE_STOPITER': 'S'.charCodeAt(),
    'TYPE_ELLIPSIS': '.'.charCodeAt(),
    'TYPE_INT': 'i'.charCodeAt(),
    'TYPE_FLOAT': 'f'.charCodeAt(),
    'TYPE_BINARY_FLOAT': 'g'.charCodeAt(),
    'TYPE_COMPLEX': 'x'.charCodeAt(),
    'TYPE_BINARY_COMPLEX': 'y'.charCodeAt(),
    'TYPE_LONG': 'l'.charCodeAt(),
    'TYPE_STRING': 's'.charCodeAt(),
    'TYPE_INTERNED': 't'.charCodeAt(),
    'TYPE_REF': 'r'.charCodeAt(),
    'TYPE_TUPLE': '('.charCodeAt(),
    'TYPE_LIST': '['.charCodeAt(),
    'TYPE_DICT': '{'.charCodeAt(),
    'TYPE_CODE': 'c'.charCodeAt(),
    'TYPE_UNICODE': 'u'.charCodeAt(),
    'TYPE_UNKNOWN': '?'.charCodeAt(),
    'TYPE_SET': '<'.charCodeAt(),
    'TYPE_FROZENSET': '>'.charCodeAt(),
    'FLAG_REF': 0x80, // with a type, add obj to index

    'TYPE_ASCII': 'a'.charCodeAt(),
    'TYPE_ASCII_INTERNED': 'A'.charCodeAt(),
    'TYPE_SMALL_TUPLE': ')'.charCodeAt(),
    'TYPE_SHORT_ASCII': 'z'.charCodeAt(),
    'TYPE_SHORT_ASCII_INTERNED': 'Z'.charCodeAt(),

    /* We assume that Python ints are stored internally in base some power of
       2**15; for the sake of portability we'll always read and write them in base
       exactly 2**15. */

    'PyLong_MARSHAL_SHIFT': 15,
    'PyLong_MARSHAL_BASE': 1 << 15,
    'PyLong_MARSHAL_MASK': (1 << 15) - 1,
    'PyLong_MARSHAL_RATIO': 30 / 15,

    'SIZE32_MAX': 0x7FFFFFFF
}

marshal.r_string = function(vm, n, p) {
    return p.fread(n)

    // var read = -1;
    // var res;

    // if (p.ptr !== null) {
    //     /* Fast path for loads() */
    //     res = p.ptr;
    //     var left = p.end - p.ptr;
    //     if (left < n) {
    //         vm.PyErr_SetString(builtins.PyEOFError,
    //                         "marshal data too short");
    //         return null;
    //     }
    //     p.ptr += n;
    //     return res;
    // }
    // if (p.buf === null) {
    //     p.buf = PyMem_MALLOC(n);
    //     if (p.buf === null) {
    //         PyErr_NoMemory();
    //         return null;
    //     }
    //     p.buf_size = n;
    // }
    // else if (p.buf_size < n) {
    //     p.buf = PyMem_REALLOC(p.buf, n);
    //     if (p.buf === null) {
    //         PyErr_NoMemory();
    //         return null;
    //     }
    //     p.buf_size = n;
    // }

    // if (!p.readable) {
    //     read = fread(p.buf, 1, n, p.fp);
    // }
    // else {
    //     _Py_IDENTIFIER(readinto);
    //     var mview;
    //     var buf;

    //     if (PyBuffer_FillInfo(buf, null, p.buf, n, 0, PyBUF_CONTIG) === -1) {
    //         return null;
    //     }
    //     mview = PyMemoryView_FromBuffer(buf);
    //     if (mview === null)
    //         return null;

    //     res = _PyObject_CallMethodId(p.readable, PyId_readinto, "N", mview);
    //     if (res !== null) {
    //         read = PyNumber_AsSsize_t(res, PyValueError);
    //     }
    // }
    // if (read !== n) {
    //     if (!vm.PyErr_Occurred()) {
    //         if (read > n)
    //             vm.PyErr_Format(PyValueError,
    //                          "read() returned too much data: " +
    //                          "%zd bytes requested, %zd returned",
    //                          n, read);
    //         else
    //             vm.PyErr_SetString(builtins.PyEOFError,
    //                             "EOF read where not expected");
    //     }
    //     return null;
    // }
    // return p.buf;
}

marshal.r_byte = function(vm, p) {
    return p.getc()
}

marshal.r_short = function(vm, p) {
    var x = p.getc()
    x |= p.getc() << 8

    /* Sign-extension, in case short greater than 16 bits */
    x |= -(x & 0x8000)
    return new types.PyInt(x)
}

marshal.read_int32 = function(vm, p) {
    var x
    x = p.getc()
    x |= p.getc() << 8
    x |= p.getc() << 16
    x |= p.getc() << 24

    /* Sign extension for 64-bit machines */
    x |= -(x & 0x80000000)
    return x
}

marshal.r_int = function(vm, p) {
    return new types.PyInt(this.read_int32(vm, p))
}

marshal.r_long = function(vm, p) {
    var n = marshal.read_int32(vm, p)
    if (n === 0) {
        return new types.PyInt(0)
    }
    var negative = false
    if (n < 0) {
        n = -n
        negative = true
    }
    var num = new BigNumber(0)
    // in little-endian order
    var multiplier = new BigNumber(1)
    for (var i = 0; i < n; i++) {
        num = num.add(multiplier.mul(marshal.r_short(vm, p)))
        multiplier = multiplier.mul(marshal.PyLong_MARSHAL_BASE)
    }
    if (negative) {
        num = num.neg()
    }
    return new types.PyInt(num)
}

marshal.r_float = function(vm, p) {
    var buf = p.fread(8)

    var sign
    var e
    var fhi, flo
    var retval

    /* First byte */
    sign = (buf[7] >> 7) & 1
    e = (buf[7] & 0x7F) << 4

    /* Second byte */
    e |= (buf[6] >> 4) & 0xF
    fhi = (buf[6] & 0xF) << 24

    if (e === 2047) {
        throw builtins.PyRuntimeError("can't unpack IEEE 754 special value on non-IEEE platform")
    }

    /* Third byte */
    fhi |= buf[5] << 16

    /* Fourth byte */
    fhi |= buf[4] << 8

    /* Fifth byte */
    fhi |= buf[3]

    /* Sixth byte */
    flo = buf[2] << 16

    /* Seventh byte */
    flo |= buf[1] << 8

    /* Eighth byte */
    flo |= buf[0]

    retval = fhi + flo / 16777216.0 /* 2**24 */
    retval /= 268435456.0 /* 2**28 */

    if (e === 0) {
        e = -1022
    } else {
        retval += 1.0
        e -= 1023
    }
    retval = retval * Math.pow(2, e)

    if (sign) {
        retval = -retval
    }

    return new types.PyFloat(retval)
}

/* allocate the reflist index for a new object. Return -1 on failure */
marshal.r_ref_reserve = function(vm, flag, p) {
    if (flag) { /* currently only FLAG_REF is defined */
        var idx = p.refs.length
        if (idx >= 0x7ffffffe) {
            vm.PyErr_SetString(PyValueError, 'bad marshal data (index list too large)')
            return -1
        }
        if (p.refs.push(null) < 0) {
            return -1
        }
        return idx
    } else {
        return 0
    }
}

/* insert the new object 'o' to the reflist at previously
 * allocated index 'idx'.
 * 'o' can be null, in which case nothing is done.
 * if 'o' was non-null, and the function succeeds, 'o' is returned.
 * if 'o' was non-null, and the function fails, 'o' is released and
 * null returned. This simplifies error checking at the call site since
 * a single test for null for the function result is enoug,h.
 */
marshal.r_ref_insert = function(vm, o, idx, flag, p) {
    if (o !== null && flag) { /* currently only FLAG_REF is defined */
        p.refs[idx] = o
    }
    return o
}

/* combination of both above, used when an object can be
 * created whenever it is seen in the file, as opposed to
 * after having loaded its sub-objects.,
 */
marshal.r_ref = function(vm, o, flag, p) {
    if (o === null) {
        return null
    }
    if (p.refs.push(o) < 0) {
        return null
    }
    return o
}

marshal.r_object = function(vm, p) {
    /* null is a valid return value, it does not necessarily means that
       an exception is set. */
    var buf
    var real, imag
    var retval, v
    var idx = 0
    var i, n
    var type
    var code = marshal.r_byte(vm, p)
    var flag = 0

    if (code === PYCFile.EOF) {
        vm.PyErr_SetString(builtins.PyEOFError,
            'EOF read where object expected')
        return null
    }

    p.depth++

    if (p.depth > marshal.MAX_MARSHAL_STACK_DEPTH) {
        p.depth--
        vm.PyErr_SetString(PyValueError, 'recursion limit exceeded')
        return null
    }

    flag = code & marshal.FLAG_REF
    type = code & ~marshal.FLAG_REF

    // console.log.info("R_OBJECT " + type + ' ' + flag);
    switch (type) {
        case marshal.TYPE_null:
            retval = null
            // console.log.info('TYPE_NULL ');
            break

        case marshal.TYPE_NONE:
            retval = builtins.PyNone
            // console.log.info('TYPE_NONE ' + retval);
            break

        case marshal.TYPE_STOPITER:
            retval = builtins.PyStopIteration
            // console.log.info('TYPE_STOPITER');
            break

        case marshal.TYPE_ELLIPSIS:
            retval = new types.PyEllipsis()
            // console.log.info('TYPE_ELLIPSIS');
            break

        case marshal.TYPE_FALSE:
            retval = false
            // console.log.info('TYPE_FALSE');
            break

        case marshal.TYPE_TRUE:
            retval = true
            // console.log.info('TYPE_TRUE');
            break

        case marshal.TYPE_INT:
            retval = marshal.r_int(vm, p)
            // console.log.info('TYPE_INT ' + retval);
            if (vm.PyErr_Occurred()) {
                break
            }
            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_LONG:
            retval = marshal.r_long(vm, p)
            // console.log.info('TYPE_LONG ' + retval);
            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_FLOAT:
            n = marshal.r_byte(vm, p)
            buf = marshal.r_string(vm, p, n)
            retval = new types.PyFloat(parseFloat(buf))
            // console.log.info('TYPE_FLOAT ' + retval);
            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_BINARY_FLOAT:
            buf = p.fread(8)

            var sign
            var e
            var fhi, flo

            /* First byte */
            sign = (buf[7] >> 7) & 1
            e = (buf[7] & 0x7F) << 4

            /* Second byte */
            e |= (buf[6] >> 4) & 0xF
            fhi = (buf[6] & 0xF) << 24

            if (e === 2047) {
                throw builtins.PyRuntimeError("can't unpack IEEE 754 special value on non-IEEE platform")
            }

            /* Third byte */
            fhi |= buf[5] << 16

            /* Fourth byte */
            fhi |= buf[4] << 8

            /* Fifth byte */
            fhi |= buf[3]

            /* Sixth byte */
            flo = buf[2] << 16

            /* Seventh byte */
            flo |= buf[1] << 8

            /* Eighth byte */
            flo |= buf[0]

            retval = fhi + flo / 16777216.0 /* 2**24 */
            retval /= 268435456.0 /* 2**28 */

            if (e === 0) {
                e = -1022
            } else {
                retval += 1.0
                e -= 1023
            }
            retval = retval * Math.pow(2, e)

            if (sign) {
                retval = -retval
            }

            // console.log.info('TYPE_BINARY_FLOAT ' + retval);

            retval = new types.PyFloat(retval)

            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_COMPLEX:
            n = marshal.r_byte(vm, p)
            if (n === PYCFile.EOF) {
                vm.PyErr_SetString(builtins.PyEOFError,
                    'EOF read where object expected')
                break
            }
            buf = marshal.r_string(vm, p, n)
            real = new types.PyFloat(parseFloat(buf))
            n = marshal.r_byte(vm, p)
            if (n === PYCFile.EOF) {
                vm.PyErr_SetString(builtins.PyEOFError,
                    'EOF read where object expected')
                break
            }
            buf = marshal.r_string(vm, p, n)
            imag = new types.PyFloat(parseFloat(buf))
            retval = new types.PyComplex(real, imag)
            // console.log.info('TYPE_COMPLEX ' + retval);
            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_BINARY_COMPLEX:
            real = marshal.r_float(vm, p)
            imag = marshal.r_float(vm, p)
            retval = new types.PyComplex(real, imag)
            // console.log.info('TYPE_BINARY_COMPLEX ' + retval);
            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_STRING:
            n = marshal.read_int32(vm, p)
            // console.log.info('TYPE_STRING ' + n);
            if (vm.PyErr_Occurred()) {
                break
            }
            if (n < 0 || n > marshal.SIZE32_MAX) {
                vm.PyErr_SetString(PyValueError, 'bad marshal data (string size out of range)')
                break
            }
            //            retval = marshal.r_string(vm, n, p);
            var contents = marshal.r_string(vm, n, p)
            retval = new types.PyBytes(Buffer.from(contents))

            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_ASCII_INTERNED:
        case marshal.TYPE_ASCII:
            n = marshal.read_int32(vm, p)
            // console.log.info('TYPE_ASCII ' + n);
            if (n === PYCFile.EOF) {
                vm.PyErr_SetString(builtins.PyEOFError,
                    'EOF read where object expected')
                break
            }
            retval = ''
            buf = marshal.r_string(vm, n, p)
            for (i = 0; i < buf.length; i++) {
                retval += String.fromCharCode(buf[i])
            }

            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_SHORT_ASCII_INTERNED:
        case marshal.TYPE_SHORT_ASCII:
            n = marshal.r_byte(vm, p)
            // console.log.info('TYPE_SHORT_ASCII ' + n);
            if (n === PYCFile.EOF) {
                vm.PyErr_SetString(builtins.PyEOFError,
                    'EOF read where object expected')
                break
            }
            retval = ''
            buf = marshal.r_string(vm, n, p)
            for (i = 0; i < buf.length; i++) {
                retval += String.fromCharCode(buf[i])
            }

            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_INTERNED:
        case marshal.TYPE_UNICODE:
            n = marshal.read_int32(vm, p)
            // console.log.info('TYPE_UNICODE ' + n);
            if (n === PYCFile.EOF) {
                vm.PyErr_SetString(builtins.PyEOFError,
                    'EOF read where object expected')
                break
            }
            retval = ''
            buf = marshal.r_string(vm, n, p)
            for (i = 0; i < buf.length; i++) {
                retval += String.fromCharCode(buf[i])
            }

            // Now decode the contents from UTF-8
            retval = decodeURIComponent(escape(retval))

            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_SMALL_TUPLE:
            n = marshal.r_byte(vm, p)
            // console.log.info('TYPE_SMALL_TUPLE ' + n);
            if (vm.PyErr_Occurred()) {
                break
            }
            retval = new types.PyTuple(new Array(n))

            for (i = 0; i < n; i++) {
                retval[i] = marshal.r_object(vm, p)
            }

            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_TUPLE:
            n = marshal.read_int32(vm, p)
            // console.log.info('TYPE_TUPLE ' + n);
            if (vm.PyErr_Occurred()) {
                break
            }
            if (n < 0 || n > marshal.SIZE32_MAX) {
                vm.PyErr_SetString(PyValueError, 'bad marshal data (tuple size out of range)')
                break
            }
            retval = new types.PyTuple(new Array(n))

            for (i = 0; i < n; i++) {
                retval[i] = marshal.r_object(vm, p)
            }

            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_LIST:
            n = marshal.read_int32(vm, p)
            // console.log.info('TYPE_LIST ' + n);
            if (vm.PyErr_Occurred()) {
                break
            }
            if (n < 0 || n > marshal.SIZE32_MAX) {
                vm.PyErr_SetString(PyValueError, 'bad marshal data (list size out of range)')
                break
            }
            retval = new types.PyList(new Array(n))
            for (i = 0; i < n; i++) {
                retval[n] = marshal.r_object(vm, p)
            }

            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_DICT:
            // console.log.info('TYPE_DICT ' + n);
            retval = new types.PyDict()
            for (;;) {
                var key, val
                key = marshal.r_object(p)
                if (key === undefined) {
                    break
                }
                val = marshal.r_object(p)
                if (val === undefined) {
                    break
                }
                retval[key] = val
            }
            if (vm.PyErr_Occurred()) {
                retval = null
            }

            if (flag) {
                marshal.r_ref(vm, retval, flag, p)
            }
            break

        case marshal.TYPE_SET:
        case marshal.TYPE_FROZENSET:
            n = marshal.read_int32(vm, p)
            // console.log.info('TYPE_FROZENSET ' + n);
            if (vm.PyErr_Occurred()) {
                break
            }
            if (n < 0 || n > marshal.SIZE32_MAX) {
                vm.PyErr_SetString(PyValueError, 'bad marshal data (set size out of range)')
                break
            }
            if (type === marshal.TYPE_SET) {
                retval = new types.PySet(null)
                if (flag) {
                    marshal.r_ref(vm, retval, flag, p)
                }
            } else {
                retval = new types.PyFrozenSet(null)
                /* must use delayed registration of frozensets because they must
                 * be init with a refcount of 1
                 */
                idx = marshal.r_ref_reserve(flag, p)
                if (idx < 0) {
                    marshal.Py_CLEAR(v) /* signal error */
                }
            }

            for (i = 0; i < n; i++) {
                retval.add(marshal.r_object(p))
            }

            if (type !== marshal.TYPE_SET) {
                retval = marshal.r_ref_insert(retval, idx, flag, p)
            }
            break

        case marshal.TYPE_CODE:
            var argcount
            var kwonlyargcount
            var nlocals
            var stacksize
            var flags
            var consts
            var names
            var varnames
            var freevars
            var cellvars
            var filename
            var name
            var firstlineno
            var lnotab

            idx = marshal.r_ref_reserve(vm, flag, p)
            if (idx < 0) {
                break
            }

            v = null

            argcount = marshal.read_int32(vm, p)
            kwonlyargcount = marshal.read_int32(vm, p)
            nlocals = marshal.read_int32(vm, p)
            stacksize = marshal.read_int32(vm, p)
            flags = marshal.read_int32(vm, p)
            code = marshal.r_object(vm, p)
            consts = marshal.r_object(vm, p)
            names = marshal.r_object(vm, p)
            varnames = marshal.r_object(vm, p)
            freevars = marshal.r_object(vm, p)
            cellvars = marshal.r_object(vm, p)
            filename = marshal.r_object(vm, p)
            name = marshal.r_object(vm, p)
            firstlineno = marshal.read_int32(vm, p)
            lnotab = marshal.r_object(vm, p)

            if (filename) {
                p.current_filename = filename
            }

            v = new types.PyCode({
                argcount: argcount,
                kwonlyargcount: kwonlyargcount,
                nlocals: nlocals,
                stacksize: stacksize,
                flags: flags,
                code: code,
                consts: consts,
                names: names,
                varnames: varnames,
                freevars: freevars,
                cellvars: cellvars,
                filename: filename,
                name: name,
                firstlineno: firstlineno,
                lnotab: lnotab
            })
            v = marshal.r_ref_insert(vm, v, idx, flag, p)

            retval = v
            break

        case marshal.TYPE_REF:
            n = marshal.read_int32(vm, p)
            if (n < 0 || n >= p.refs.length) {
                if (n === -1 && vm.PyErr_Occurred()) {
                    break
                }
                vm.PyErr_SetString(PyValueError, 'bad marshal data (invalid reference)')
                break
            }
            v = p.refs[n]
            if (v === null) {
                vm.PyErr_SetString(PyValueError, 'bad marshal data (invalid reference)')
                break
            }
            retval = v
            break

        default:
            /* Bogus data got written, which isn't ideal.
               This will let you keep working and recover. */

            vm.PyErr_SetString(PyValueError, "bad marshal data (unknown type code '" + type + "')")
            break
    }
    p.depth--

    return retval
}

marshal.read_object = function(vm, p) {
    var v
    if (vm.PyErr_Occurred()) {
        console.log('readobject called with exception set\n')
        return null
    }
    v = marshal.r_object(vm, p)

    if (v === null && !vm.PyErr_Occurred()) {
        vm.PyErr_SetString(PyTypeError, 'null object in marshal data for object')
    }
    return v
}

/*
 * load_pyc(bytes)
 *
 * Load a Base64 encoded Convert the bytes object to a value. If no valid value is found, raise\n\
 * PyEOFError, PyValueError or PyTypeError. Extra characters in the input are\n\
 * ignored."
 */

marshal.load_pyc = function(vm, payload) {
    if (payload === null || payload.length === 0) {
        throw new BataviaError('Empty PYC payload')
    } else if (payload.startswith('ERROR:')) {
        throw new BataviaError('Traceback (most recent call last):\n' + payload.slice(6).split('\\n').join('\n'))
    }
    return marshal.read_object(vm, new PYCFile(base64js.toByteArray(payload)))
}
