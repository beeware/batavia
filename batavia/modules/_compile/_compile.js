/*
 * Python compiler internals.
 */
var tokenizer = require('./tokenizer')
var types = require('../../types')
var exceptions = require('../../core/exceptions')
var _PyParser_Grammar = require('./ast/graminit')
var ast_check = require('./ast/Python-ast').ast_check
var Parser = require('./parser')

var ErrorDetail = function(filename) {
  this.filename = filename
}

var _compile = {
    '__doc__': '',
    '__file__': 'batavia/modules/_compile/_compile.js',
    '__name__': '_compile',
    '__package__': ''
}

_compile.file_input = function() {
    throw new exceptions.NotImplementedError.$pyclass('_compile.file_input is not implemented yet')
}

_compile.eval_input = function() {
    throw new exceptions.NotImplementedError.$pyclass('_compile.eval_input is not implemented yet')
}

_compile.single_input = function() {
    throw new exceptions.NotImplementedError.$pyclass('_compile.single_input is not implemented yet')
}

_compile.ast_check = function(obj) {
  return ast_check(obj)
}

_compile.compile_string_object = function(str, filename, start, optimize) {
    var flags = null
    var mod = _compile.ast_from_string_object(str, filename, start, flags)
    var co = _compile.ast_compile_object(mod, filename, flags, optimize)
    return co
}

_compile.ast_obj2mod = function(source, compile_mode) {
    // mod_ty res;
    // PyObject *req_type[3];
    // char *req_name[3];
    // int isinstance;
    //
    // req_type[0] = (PyObject*)Module_type;
    // req_type[1] = (PyObject*)Expression_type;
    // req_type[2] = (PyObject*)Interactive_type;
    //
    // req_name[0] = "Module";
    // req_name[1] = "Expression";
    // req_name[2] = "Interactive";
    //
    // assert(0 <= mode && mode <= 2);
    //
    // init_types();
    //
    // isinstance = PyObject_IsInstance(ast, req_type[mode]);
    // if (isinstance == -1)
    //     return NULL;
    // if (!isinstance) {
    //     PyErr_Format(PyExc_TypeError, "expected %s node, got %.400s",
    //                  req_name[mode], Py_TYPE(ast)->tp_name);
    //     return NULL;
    // }
    // if (obj2ast_mod(ast, &res, arena) != 0) {
    //     return NULL;
    // } else {
    //    return res;
    // }
}

_compile.ast_validate = function(mod) {
    throw new exceptions.NotImplementedError.$pyclass('_compile.ast_validate is not implemented yet')
}

_compile.ast_compile_object = function(mod, filename, cf, optimize) {
    throw new exceptions.NotImplementedError.$pyclass('_compile.ast_compile_object is not implemented yet')
}

_compile.ast_from_string_object = function(str, filename, start, flags) {
    var mod = null
    var localflags = null
    var err = null
    var iflags = 0

    var n = _compile.parse_string_object(str, filename,
                                         _PyParser_Grammar, start, err,
                                         iflags)
    if (flags == null) {
        // localflags.cf_flags = 0
        // flags = localflags
    }
    if (n) {
        // flags.cf_flags |= iflags & PyCF_MASK
        mod = _compile.ast_from_node_object(n, flags, filename)
    } else {
        // err_input(err)
        mod = null
    }
    return mod
}

_compile.source_as_string = function(cmd, funcname, what) {
    var str

    if (types.isinstance(cmd, types.Str)) {
        str = cmd
    } else if (types.isinstance(cmd, types.Bytes)) {
        str = cmd.decode('utf8')
    } else if (types.isinstance(cmd, types.ByteArray)) {
        throw new exceptions.NotImplementedError.$pyclass('_compile.source_as_string is not implemented yet for bytearray')
    } else {
        PyErr_Format(PyExc_TypeError,
          "%s() arg 1 must be a %s object",
          funcname, what);
        return null
    }

    return str
}

_compile.parse_string_object = function(s, filename, grammar, start, flags) {
    var exec_input = start.__eq__(_compile.Py_file_input)
    var err_ret = new ErrorDetail(filename)

    var tok = new tokenizer.Tokenizer(s, exec_input)
    tok.filename = err_ret.filename
    return _compile.parsetok(tok, grammar, start, err_ret, flags)
}

_compile.parsetok = function(tok, g, start, err_ret, flags) {
    var ps = null
    var n = null
    var started = 0

    ps = new Parser(g, start)

    for (;;) {
        var a, b
        var type
        var len
        var str
        var col_offset

        var result = tok.get_token()
        type = result[0]
        a = result[1]
        b = result[2]
        if (type == _compile.ERRORTOKEN) {
            err_ret.error = tok.done
            break
        }
        if (type == _compile.ENDMARKER && started) {
            type = _compile.NEWLINE; /* Add an extra newline */
            started = 0
            /* Add the right number of dedent tokens,
               except if a certain flag is given --
               codeop.py uses this. */
            if (tok.indent) {
                tok.pendin = -tok.indent
                tok.indent = 0
            }
        }
        else
            started = 1
        len = b - a /* XXX this may compute null - null */
        str = ''
        if (len > 0) {
          str = tok.buf.slice(a, b)
        }
        str += '\0'

        if (a >= tok.line_start) {
            col_offset = a - tok.line_start
        } else {
            col_offset = -1
        }

        err_ret.error = ps.add_token(type, str, tok.lineno, col_offset, err_ret.expected)
        if (err_ret.error != _compile.E_OK) {
            if (err_ret.error != _compile.E_DONE) {
                err_ret.token = type
            }
            break
        }
    }

    if (err_ret.error == _compile.E_DONE) {
        n = ps.p_tree
        ps.p_tree = null

        /* Check that the source for a single input statement really
           is a single statement by looking at what is left in the
           buffer after parsing.  Trailing whitespace and comments
           are OK.  */
        if (start == single_input) {
            cur = tok.cur
            c = tok.buf[tok.cur]

            for (;;) {
                while (c == ' ' || c == '\t' || c == '\n' || c == '\x0c') {
                    c = tok.buf[++tok.cur]
                }

                if (!c) {
                    break
                }

                if (c != '#') {
                    err_ret.error = _compile.E_BADSINGLE
                    n = null
                    break
                }

                /* Suck up comment. */
                while (c && c != '\n') {
                    c = tok.buf[++tok.cur]
                }
            }
        }
    } else {
        n = null
    }

    if (n == null) {
        if (tok.done == _compile.E_EOF) {
            err_ret.error = _compile.E_EOF
        }
        err_ret.lineno = tok.lineno
        var len
        err_ret.offset = tok.cur
        len = tok.inp
        err_ret.text = ''
        if (len > 0) {
            err_ret.text = tok.buf.slice(0, len).join('')
        }
        err_ret += '\0'
    } else if (tok.encoding != null) {
        /* 'nodes->n_str' uses PyObject_*, while 'tok.encoding' was
         * allocated using PyMem_
         */
        var r = PyNode_New(encoding_decl)
        r.n_str = tok.encoding
        tok.encoding = null
        r.n_nchildren = 1
        r.n_child = n
        n = r
    }

    return n
}

_compile['Py_single_input'] = new types.Int(256)
_compile['Py_file_input'] = new types.Int(257)
_compile['Py_eval_input'] = new types.Int(258)

_compile['EOF'] = tokenizer.EOF
_compile['E_OK'] = tokenizer.E_OK
_compile['E_EOF'] = tokenizer.E_EOF
_compile['E_INTR'] = tokenizer.E_INTR
_compile['E_TOKEN'] = tokenizer.E_TOKEN
_compile['E_SYNTAX'] = tokenizer.E_SYNTAX
_compile['E_NOMEM'] = tokenizer.E_NOMEM
_compile['E_DONE'] = tokenizer.E_DONE
_compile['E_ERROR'] = tokenizer.E_ERROR
_compile['E_TABSPACE'] = tokenizer.E_TABSPACE
_compile['E_OVERFLOW'] = tokenizer.E_OVERFLOW
_compile['E_TOODEEP'] = tokenizer.E_TOODEEP
_compile['E_DEDENT'] = tokenizer.E_DEDENT
_compile['E_DECODE'] = tokenizer.E_DECODE
_compile['E_EOFS'] = tokenizer.E_EOFS
_compile['E_EOLS'] = tokenizer.E_EOLS
_compile['E_LINECONT'] = tokenizer.E_LINECONT
_compile['E_IDENTIFIER'] = tokenizer.E_IDENTIFIER
_compile['E_BADSINGLE'] = tokenizer.E_BADSINGLE

_compile['ENDMARKER'] = tokenizer.ENDMARKER
_compile['NAME'] = tokenizer.NAME
_compile['NUMBER'] = tokenizer.NUMBER
_compile['STRING'] = tokenizer.STRING
_compile['NEWLINE'] = tokenizer.NEWLINE
_compile['INDENT'] = tokenizer.INDENT
_compile['DEDENT'] = tokenizer.DEDENT
_compile['LPAR'] = tokenizer.LPAR
_compile['RPAR'] = tokenizer.RPAR
_compile['LSQB'] = tokenizer.LSQB
_compile['RSQB'] = tokenizer.RSQB
_compile['COLON'] = tokenizer.COLON
_compile['COMMA'] = tokenizer.COMMA
_compile['SEMI'] = tokenizer.SEMI
_compile['PLUS'] = tokenizer.PLUS
_compile['MINUS'] = tokenizer.MINUS
_compile['STAR'] = tokenizer.STAR
_compile['SLASH'] = tokenizer.SLASH
_compile['VBAR'] = tokenizer.VBAR
_compile['AMPER'] = tokenizer.AMPER
_compile['LESS'] = tokenizer.LESS
_compile['GREATER'] = tokenizer.GREATER
_compile['EQUAL'] = tokenizer.EQUAL
_compile['DOT'] = tokenizer.DOT
_compile['PERCENT'] = tokenizer.PERCENT
_compile['LBRACE'] = tokenizer.LBRACE
_compile['RBRACE'] = tokenizer.RBRACE
_compile['EQEQUAL'] = tokenizer.EQEQUAL
_compile['NOTEQUAL'] = tokenizer.NOTEQUAL
_compile['LESSEQUAL'] = tokenizer.LESSEQUAL
_compile['GREATEREQUAL'] = tokenizer.GREATEREQUAL
_compile['TILDE'] = tokenizer.TILDE
_compile['CIRCUMFLEX'] = tokenizer.CIRCUMFLEX
_compile['LEFTSHIFT'] = tokenizer.LEFTSHIFT
_compile['RIGHTSHIFT'] = tokenizer.RIGHTSHIFT
_compile['DOUBLESTAR'] = tokenizer.DOUBLESTAR
_compile['PLUSEQUAL'] = tokenizer.PLUSEQUAL
_compile['MINEQUAL'] = tokenizer.MINEQUAL
_compile['STAREQUAL'] = tokenizer.STAREQUAL
_compile['SLASHEQUAL'] = tokenizer.SLASHEQUAL
_compile['PERCENTEQUAL'] = tokenizer.PERCENTEQUAL
_compile['AMPEREQUAL'] = tokenizer.AMPEREQUAL
_compile['VBAREQUAL'] = tokenizer.VBAREQUAL
_compile['CIRCUMFLEXEQUAL'] = tokenizer.CIRCUMFLEXEQUAL
_compile['LEFTSHIFTEQUAL'] = tokenizer.LEFTSHIFTEQUAL
_compile['RIGHTSHIFTEQUAL'] = tokenizer.RIGHTSHIFTEQUAL
_compile['DOUBLESTAREQUAL'] = tokenizer.DOUBLESTAREQUAL
_compile['DOUBLESLASH'] = tokenizer.DOUBLESLASH
_compile['DOUBLESLASHEQUAL'] = tokenizer.DOUBLESLASHEQUAL
_compile['AT'] = tokenizer.AT
_compile['ATEQUAL'] = tokenizer.ATEQUAL
_compile['RARROW'] = tokenizer.RARROW
_compile['ELLIPSIS'] = tokenizer.ELLIPSIS
_compile['OP'] = tokenizer.OP
_compile['AWAIT'] = tokenizer.AWAIT
_compile['ASYNC'] = tokenizer.ASYNC
_compile['ERRORTOKEN'] = tokenizer.ERRORTOKEN
_compile['N_TOKENS'] = tokenizer.N_TOKENS
_compile['NT_OFFSET'] = tokenizer.NT_OFFSET

_compile['Tokenizer'] = tokenizer.Tokenizer

module.exports = _compile
