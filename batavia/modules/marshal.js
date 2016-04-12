
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

batavia.modules.marshal = {

    /* High water mark to determine when the marshalled object is dangerously deep
     * and risks coring the interpreter.  When the object stack gets this deep,
     * raise an exception instead of continuing.
     * On Windows debug builds, reduce this value.
     * iOS also requires a reduced value.
     */
    MAX_MARSHAL_STACK_DEPTH: 1500,

    TYPE_null: '0'.charCodeAt(),
    TYPE_NONE: 'N'.charCodeAt(),
    TYPE_FALSE: 'F'.charCodeAt(),
    TYPE_TRUE: 'T'.charCodeAt(),
    TYPE_STOPITER: 'S'.charCodeAt(),
    TYPE_ELLIPSIS: '.'.charCodeAt(),
    TYPE_INT: 'i'.charCodeAt(),
    TYPE_FLOAT: 'f'.charCodeAt(),
    TYPE_BINARY_FLOAT: 'g'.charCodeAt(),
    TYPE_COMPLEX: 'x'.charCodeAt(),
    TYPE_BINARY_COMPLEX: 'y'.charCodeAt(),
    TYPE_LONG: 'l'.charCodeAt(),
    TYPE_STRING: 's'.charCodeAt(),
    TYPE_INTERNED: 't'.charCodeAt(),
    TYPE_REF: 'r'.charCodeAt(),
    TYPE_TUPLE: '('.charCodeAt(),
    TYPE_LIST: '['.charCodeAt(),
    TYPE_DICT: '{'.charCodeAt(),
    TYPE_CODE: 'c'.charCodeAt(),
    TYPE_UNICODE: 'u'.charCodeAt(),
    TYPE_UNKNOWN: '?'.charCodeAt(),
    TYPE_SET: '<'.charCodeAt(),
    TYPE_FROZENSET: '>'.charCodeAt(),
    FLAG_REF: 0x80,  // with a type, add obj to index

    TYPE_ASCII: 'a'.charCodeAt(),
    TYPE_ASCII_INTERNED: 'A'.charCodeAt(),
    TYPE_SMALL_TUPLE: ')'.charCodeAt(),
    TYPE_SHORT_ASCII: 'z'.charCodeAt(),
    TYPE_SHORT_ASCII_INTERNED: 'Z'.charCodeAt(),

    /* We assume that Python ints are stored internally in base some power of
       2**15; for the sake of portability we'll always read and write them in base
       exactly 2**15. */

    PyLong_MARSHAL_SHIFT: 15,
// #define PyLong_MARSHAL_BASE ((short)1 << PyLong_MARSHAL_SHIFT)
// #define PyLong_MARSHAL_MASK (PyLong_MARSHAL_BASE - 1)
// #if PyLong_SHIFT % PyLong_MARSHAL_SHIFT != 0
// #error "PyLong_SHIFT must be a multiple of PyLong_MARSHAL_SHIFT"
// #endif
// #define PyLong_MARSHAL_RATIO (PyLong_SHIFT / PyLong_MARSHAL_SHIFT)

// #define W_TYPE(t, p) do { \
//     w_byte((t) | flag, (p)); \
// } while(0)

    SIZE32_MAX: Math.pow(2, 32),

    r_string: function(vm, n, p)
    {
        return p.fread(n);

        // var read = -1;
        // var res;

        // if (p.ptr !== null) {
        //     /* Fast path for loads() */
        //     res = p.ptr;
        //     var left = p.end - p.ptr;
        //     if (left < n) {
        //         vm.PyErr_SetString(batavia.builtins.EOFError,
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
        //     assert(p.fp !== null);
        //     read = fread(p.buf, 1, n, p.fp);
        // }
        // else {
        //     _Py_IDENTIFIER(readinto);
        //     var mview;
        //     var buf;

        //     if (PyBuffer_FillInfo(buf, null, p.buf, n, 0, PyBUF_CONTIG) == -1) {
        //         return null;
        //     }
        //     mview = PyMemoryView_FromBuffer(buf);
        //     if (mview === null)
        //         return null;

        //     res = _PyObject_CallMethodId(p.readable, PyId_readinto, "N", mview);
        //     if (res !== null) {
        //         read = PyNumber_AsSsize_t(res, batavia.builtins.ValueError);
        //     }
        // }
        // if (read != n) {
        //     if (!vm.PyErr_Occurred()) {
        //         if (read > n)
        //             vm.PyErr_Format(batavia.builtins.ValueError,
        //                          "read() returned too much data: " +
        //                          "%zd bytes requested, %zd returned",
        //                          n, read);
        //         else
        //             vm.PyErr_SetString(batavia.builtins.EOFError,
        //                             "EOF read where not expected");
        //     }
        //     return null;
        // }
        // return p.buf;
    },

    r_byte: function(vm, p)
    {
        return p.getc();
    },

    r_short: function(vm, p)
    {
        var x = p.getc();
        x |= p.getc() << 8;

        /* Sign-extension, in case short greater than 16 bits */
        x |= -(x & 0x8000);
        return x;
    },

    r_long: function(vm, p) {
        var x;
        x = p.getc();
        x |= p.getc() << 8;
        x |= p.getc() << 16;
        x |= p.getc() << 24;

        /* Sign extension for 64-bit machines */
        x |= -(x & 0x80000000);
        return x;
    },

    // r_PyLong: function(vm, p) {
    //     var ob;
    //     var n, size, i;
    //     var j, md, shorts_in_top_digit;
    //     var d;

    //     n = r_long(p);
    //     if (vm.PyErr_Occurred())
    //         return null;
    //     if (n === 0) {
    //         return _PyLong_New(0);
    //     }
    //     if (n < -batavia.modules.marshal.SIZE32_MAX || n > batavia.modules.marshal.SIZE32_MAX) {
    //         vm.PyErr_SetString(batavia.builtins.ValueError,
    //                        "bad marshal data (long size out of range)");
    //         return null;
    //     }

    //     size = 1 + (Math.abs(n) - 1) / PyLong_MARSHAL_RATIO;
    //     shorts_in_top_digit = 1 + (Math.abs(n) - 1) % PyLong_MARSHAL_RATIO;
    //     ob = _PyLong_New(size);
    //     if (ob === null)
    //         return null;

    //     //FIXME Py_SIZE(ob) = n > 0 ? size : -size;

    //     for (i = 0; i < size-1; i++) {
    //         d = 0;
    //         for (j=0; j < PyLong_MARSHAL_RATIO; j++) {
    //             md = r_short(p);
    //             if (vm.PyErr_Occurred()) {
    //                 return null;
    //             }
    //             if (md < 0 || md > PyLong_MARSHAL_BASE) {
    //                 goto bad_digit;
    //             }
    //             d += (digit)md << j*PyLong_MARSHAL_SHIFT;
    //         }
    //         ob.ob_digit[i] = d;
    //     }

    //     d = 0;
    //     for (j=0; j < shorts_in_top_digit; j++) {
    //         md = r_short(p);
    //         if (vm.PyErr_Occurred()) {
    //             return null;
    //         }
    //         if (md < 0 || md > PyLong_MARSHAL_BASE)
    //             goto bad_digit;
    //         /* topmost marshal digit should be nonzero */
    //         if (md === 0 && j == shorts_in_top_digit - 1) {
    //             vm.PyErr_SetString(batavia.builtins.ValueError,
    //                 "bad marshal data (unnormalized long data)");
    //             return null;
    //         }
    //         d += (digit)md << j*PyLong_MARSHAL_SHIFT;
    //     }
    //     if (vm.PyErr_Occurred()) {
    //         return null;
    //     }
    //     /* top digit should be nonzero, else the resulting PyLong won't be
    //        normalized */
    //     ob.ob_digit[size-1] = d;
    //     return (var )ob;
    //   bad_digit:
    //     vm.PyErr_SetString(batavia.builtins.ValueError,
    //                     "bad marshal data (digit out of range in long)");
    //     return null;
    // },

    /* allocate the reflist index for a new object. Return -1 on failure */
    r_ref_reserve: function(vm, flag, p) {
        if (flag) { /* currently only FLAG_REF is defined */
            var idx = p.refs.length;
            if (idx >= 0x7ffffffe) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (index list too large)");
                return -1;
            }
            if (p.refs.push(null) < 0) {
                return -1;
            }
            return idx;
        } else {
            return 0;
        }
    },

    /* insert the new object 'o' to the reflist at previously
     * allocated index 'idx'.
     * 'o' can be null, in which case nothing is done.
     * if 'o' was non-null, and the function succeeds, 'o' is returned.
     * if 'o' was non-null, and the function fails, 'o' is released and
     * null returned. This simplifies error checking at the call site since
     * a single test for null for the function result is enoug,h.
     */
    r_ref_insert: function(vm, o, idx, flag, p) {
        if (o !== null && flag) { /* currently only FLAG_REF is defined */
            var tmp = p.refs[idx];
            p.refs[idx] = o;
        }
        return o;
    },

    /* combination of both above, used when an object can be
     * created whenever it is seen in the file, as opposed to
     * after having loaded its sub-objects.,
     */
    r_ref: function(vm, o, flag, p) {
        assert(flag & batavia.modules.marshal.FLAG_REF);
        if (o === null) {
            return null;
        }
        if (p.refs.push(o) < 0) {
            return null;
        }
        return o;
    },

    r_object: function(vm, p) {
        /* null is a valid return value, it does not necessarily means that
           an exception is set. */
        var retval, v;
        var idx = 0;
        var i, n;
        var ptr;
        var type, code = batavia.modules.marshal.r_byte(vm, p);
        var flag, is_interned = 0;

        if (code === batavia.core.PYCFile.EOF) {
            vm.PyErr_SetString(batavia.builtins.EOFError,
                            "EOF read where object expected");
            return null;
        }

        p.depth++;

        if (p.depth > batavia.modules.marshal.MAX_MARSHAL_STACK_DEPTH) {
            p.depth--;
            vm.PyErr_SetString(batavia.builtins.ValueError, "recursion limit exceeded");
            return null;
        }

        flag = code & batavia.modules.marshal.FLAG_REF;
        type = code & ~batavia.modules.marshal.FLAG_REF;

        // console.log.info("R_OBJECT " + type + ' ' + flag);
        switch (type) {

        case batavia.modules.marshal.TYPE_null:
            // console.log.info('TYPE_NULL ');
            break;

        case batavia.modules.marshal.TYPE_NONE:
            retval = null;
            // console.log.info('TYPE_NONE ' + retval);
            break;

        case batavia.modules.marshal.TYPE_STOPITER:
            retval = batavia.builtins.StopIteration;
            // console.log.info('TYPE_STOPITER');
            break;

        case batavia.modules.marshal.TYPE_ELLIPSIS:
            retval = batavia.VirtualMachine.Py_Ellipsis;
            // console.log.info('TYPE_ELLIPSIS');
            break;

        case batavia.modules.marshal.TYPE_FALSE:
            retval = false;
            // console.log.info('TYPE_FALSE');
            break;

        case batavia.modules.marshal.TYPE_TRUE:
            retval = true;
            // console.log.info('TYPE_TRUE');
            break;

        case batavia.modules.marshal.TYPE_INT:
            retval = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_INT ' + retval);
            if (vm.PyErr_Occurred()) {
                break;
            }
            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_LONG:
            retval = batavia.modules.marshal.r_PyLong(vm, p);
            // console.log.info('TYPE_LONG ' + retval);
            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_FLOAT:
            n = batavia.modules.marshal.r_byte(vm, p);
            buf = batavia.modules.marshal.r_string(vm, p, n);
            retval = parseFloat(buf);
            // console.log.info('TYPE_FLOAT ' + retval);
            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_BINARY_FLOAT:
            buf = p.fread(8);

            var sign;
            var e;
            var fhi, flo;
            var incr = 1;

            /* First byte */
            sign = (buf.charCodeAt(7) >> 7) & 1;
            e = (buf.charCodeAt(7) & 0x7F) << 4;

            /* Second byte */
            e |= (buf.charCodeAt(6) >> 4) & 0xF;
            fhi = (buf.charCodeAt(6) & 0xF) << 24;

            if (e == 2047) {
                throw "can't unpack IEEE 754 special value on non-IEEE platform";
            }

            /* Third byte */
            fhi |= buf.charCodeAt(5) << 16;

            /* Fourth byte */
            fhi |= buf.charCodeAt(4)  << 8;

            /* Fifth byte */
            fhi |= buf.charCodeAt(3);

            /* Sixth byte */
            flo = buf.charCodeAt(2) << 16;
            p += incr;

            /* Seventh byte */
            flo |= buf.charCodeAt(1) << 8;
            p += incr;

            /* Eighth byte */
            flo |= buf.charCodeAt(0);

            retval = fhi + flo / 16777216.0; /* 2**24 */
            retval /= 268435456.0; /* 2**28 */

            if (e === 0) {
                e = -1022;
            } else {
                retval += 1.0;
                e -= 1023;
            }
            retval = retval * Math.pow(2, e);

            if (sign) {
                retval = -retval;
            }
            // console.log.info('TYPE_BINARY_FLOAT ' + retval);

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_COMPLEX:
            // console.log.info('TYPE_COMPLEX ' + retval);
        //     {
        //     char buf[256], *ptr;
        //     Py_complex c;
        //     n = batavia.modules.marshal.r_byte(vm, p);
        //     if (n == EOF) {
        //         vm.PyErr_SetString(batavia.builtins.EOFError,
        //             "EOF read where object expected");
        //         break;
        //     }
        //     ptr = r_string(n, p);
        //     if (ptr === null)
        //         break;
        //     memcpy(buf, ptr, n);
        //     buf[n] = '\0';
        //     c.real = PyOS_string_to_double(buf, null, null);
        //     if (c.real == -1.0 && vm.PyErr_Occurred())
        //         break;
        //     n = batavia.modules.marshal.r_byte(vm, p);
        //     if (n == EOF) {
        //         vm.PyErr_SetString(batavia.builtins.EOFError,
        //             "EOF read where object expected");
        //         break;
        //     }
        //     ptr = r_string(n, p);
        //     if (ptr === null)
        //         break;
        //     memcpy(buf, ptr, n);
        //     buf[n] = '\0';
        //     c.imag = PyOS_string_to_double(buf, null, null);
        //     if (c.imag == -1.0 && vm.PyErr_Occurred())
        //         break;
        //     retval = PyComplex_FromCComplex(c);
        //     Marsha.r_ref(vm, retval, flag, p);
            break;

        case batavia.modules.marshal.TYPE_BINARY_COMPLEX:
            // console.log.info('TYPE_COMPLEX ' + retval);
        //         unsigned char *buf;
        //         Py_complex c;
        //         buf = batavia.modules.marshal.r_string(vm, 8, p);
        //         if (buf === null)
        //             break;
        //         c.real = _PyFloat_Unpack8(buf, 1);
        //         if (c.real == -1.0 && vm.PyErr_Occurred())
        //             break;
        //         buf = batavia.modules.marshal.r_string(vm, 8, p);
        //         if (buf === null)
        //             break;
        //         c.imag = _PyFloat_Unpack8(buf, 1);
        //         if (c.imag == -1.0 && vm.PyErr_Occurred())
        //             break;
        //         retval = PyComplex_FromCComplex(c);
        //         Marsha.r_ref(vm, retval, flag, p);
                break;

        case batavia.modules.marshal.TYPE_STRING:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_STRING ' + n);
            if (vm.PyErr_Occurred()) {
                break;
            }
            if (n < 0 || n > batavia.modules.marshal.SIZE32_MAX) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (string size out of range)");
                break;
            }
            retval = batavia.modules.marshal.r_string(vm, n, p);

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_ASCII_INTERNED:
        case batavia.modules.marshal.TYPE_ASCII:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_ASCII ' + n);
            if (n === batavia.core.PYCFile.EOF) {
                vm.PyErr_SetString(batavia.builtins.EOFError,
                    "EOF read where object expected");
                break;
            }
            retval = batavia.modules.marshal.r_string(vm, n, p);

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_SHORT_ASCII_INTERNED:
        case batavia.modules.marshal.TYPE_SHORT_ASCII:
            n = batavia.modules.marshal.r_byte(vm, p);
            // console.log.info('TYPE_SHORT_ASCII ' + n);
            if (n === batavia.core.PYCFile.EOF) {
                vm.PyErr_SetString(batavia.builtins.EOFError,
                    "EOF read where object expected");
                break;
            }
            retval = batavia.modules.marshal.r_string(vm, n, p);

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_INTERNED:
        case batavia.modules.marshal.TYPE_UNICODE:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_UNICODE ' + n);
            if (n === batavia.core.PYCFile.EOF) {
                vm.PyErr_SetString(batavia.builtins.EOFError,
                    "EOF read where object expected");
                break;
            }
            retval = batavia.modules.marshal.r_string(vm, n, p);

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_SMALL_TUPLE:
            n = batavia.modules.marshal.r_byte(vm, p);
            // console.log.info('TYPE_SMALL_TUPLE ' + n);
            if (vm.PyErr_Occurred()) {
                break;
            }
            retval = new batavia.core.Tuple(new Array(n));

            for (i = 0; i < n; i++) {
                retval[i] = batavia.modules.marshal.r_object(vm, p);
            }

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_TUPLE:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_TUPLE ' + n);
            if (vm.PyErr_Occurred()) {
                break;
            }
            if (n < 0 || n > batavia.modules.marshal.SIZE32_MAX) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (tuple size out of range)");
                break;
            }
            retval = new batavia.core.Tuple(new Array(n));

            for (i = 0; i < n; i++) {
                retval[i] = batavia.modules.marshal.r_object(vm, p);
            }

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_LIST:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_LIST ' + n);
            if (vm.PyErr_Occurred()) {
                break;
            }
            if (n < 0 || n > batavia.modules.marshal.SIZE32_MAX) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (list size out of range)");
                break;
            }
            retval = new batavia.core.List(new Array(n));
            for (i = 0; i < n; i++) {
                retval[n] = batavia.modules.marshal.r_object(vm, p);
            }

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_DICT:
            // console.log.info('TYPE_DICT ' + n);
            retval = batavia.core.Dict();
            for (;;) {
                var key, val;
                key = r_object(p);
                if (key === undefined)
                    break;
                val = r_object(p);
                if (val === undefined) {
                    break;
                }
                retval[key] = val;
            }
            if (vm.PyErr_Occurred()) {
                retval = null;
            }

            if (flag) {
                batavia.modules.marshal.r_ref(vm, retval, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_SET:
        case batavia.modules.marshal.TYPE_FROZENSET:
            n = batavia.modules.marshal.r_long(vm, p);
            // console.log.info('TYPE_FROZENSET ' + n);
            if (vm.PyErr_Occurred()) {
                break;
            }
            if (n < 0 || n > batavia.modules.marshal.SIZE32_MAX) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (set size out of range)");
                break;
            }
            if (type == batavia.modules.marshal.TYPE_SET) {
                retval = batavia.core.Set(null);
                if (flag) {
                   batavia.modules.marshal.r_ref(vm, retval, flag, p);
                }
            } else {
                retval = batavia.core.FrozenSet(null);
                /* must use delayed registration of frozensets because they must
                 * be init with a refcount of 1
                 */
                idx = batavia.modules.marshal.r_ref_reserve(flag, p);
                if (idx < 0) {
                    Py_CLEAR(v); /* signal error */
                }
            }

            for (i = 0; i < n; i++) {
                retval.add(r_object(p));
            }

            if (type != batavia.modules.marshal.TYPE_SET) {
                retval = batavia.modules.marshal.r_ref_insert(retval, idx, flag, p);
            }
            break;

        case batavia.modules.marshal.TYPE_CODE:
            var argcount;
            var kwonlyargcount;
            var nlocals;
            var stacksize;
            var flags;
            var consts;
            var names;
            var varnames;
            var freevars;
            var cellvars;
            var filename;
            var name;
            var firstlineno;
            var lnotab;

            idx = batavia.modules.marshal.r_ref_reserve(vm, flag, p);
            if (idx < 0) {
                break;
            }

            v = null;

            argcount = batavia.modules.marshal.r_long(vm, p);
            kwonlyargcount = batavia.modules.marshal.r_long(vm, p);
            nlocals = batavia.modules.marshal.r_long(vm, p);
            stacksize = batavia.modules.marshal.r_long(vm, p);
            flags = batavia.modules.marshal.r_long(vm, p);
            code = batavia.modules.marshal.r_object(vm, p);
            consts = batavia.modules.marshal.r_object(vm, p);
            names = batavia.modules.marshal.r_object(vm, p);
            varnames = batavia.modules.marshal.r_object(vm, p);
            freevars = batavia.modules.marshal.r_object(vm, p);
            cellvars = batavia.modules.marshal.r_object(vm, p);
            filename = batavia.modules.marshal.r_object(vm, p);
            name = batavia.modules.marshal.r_object(vm, p);
            firstlineno = batavia.modules.marshal.r_long(vm, p);
            lnotab = batavia.modules.marshal.r_object(vm, p);

            if (filename) {
                p.current_filename = filename;
            }

            v = new batavia.core.Code({
                argcount: argcount,
                kwonlyargcount: kwonlyargcount,
                nlocals: nlocals,
                stacksize: stacksize,
                flags: flags,
                code: code.split('').map(function (b) { return b.charCodeAt(); }),
                consts: consts,
                names: names,
                varnames: varnames,
                freevars: freevars,
                cellvars: cellvars,
                filename: filename,
                name: name,
                firstlineno: firstlineno,
                lnotab: lnotab
            });
            v = batavia.modules.marshal.r_ref_insert(vm, v, idx, flag, p);

            retval = v;
            break;

        case batavia.modules.marshal.TYPE_REF:
            n = batavia.modules.marshal.r_long(vm, p);
            if (n < 0 || n >= p.refs.length) {
                if (n == -1 && vm.PyErr_Occurred())
                    break;
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (invalid reference)");
                break;
            }
            v = p.refs[n];
            if (v === null) {
                vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (invalid reference)");
                break;
            }
            retval = v;
            break;

        default:
            /* Bogus data got written, which isn't ideal.
               This will let you keep working and recover. */
            vm.PyErr_SetString(batavia.builtins.ValueError, "bad marshal data (unknown type code '" + type + "')");
            break;

        }
        p.depth--;
        return retval;
    },

    read_object: function(vm, p) {
        var v;
        if (vm.PyErr_Occurred()) {
            console.log("readobject called with exception set\n");
            return null;
        }
        v = batavia.modules.marshal.r_object(vm, p);

        if (v === null && !vm.PyErr_Occurred()) {
            vm.PyErr_SetString(batavia.builtins.TypeError, "null object in marshal data for object");
        }
        return v;
    },

    /*
     * load_pyc(bytes)
     *
     * Load a Base64 encoded Convert the bytes object to a value. If no valid value is found, raise\n\
     * EOFError, ValueError or TypeError. Extra characters in the input are\n\
     * ignored."
     */

    load_pyc: function(vm, payload) {
        if (payload === null || payload.length === 0) {
            throw new batavia.builtins.BataviaError('Empty PYC payload');
        } else if (payload.startswith('ERROR:')) {
            throw new batavia.builtins.BataviaError('Traceback (most recent call last):\n' + payload.slice(6).split('\\n').join('\n'));
        }
        return batavia.modules.marshal.read_object(vm, new batavia.core.PYCFile(atob(payload)));
    }
};
