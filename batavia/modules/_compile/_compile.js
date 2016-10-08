var ErrorDetail = function(filename) {
    this.error = E_OK;
    this.lineno = 0;
    this.offset = 0;
    this.text = null;
    this.token = -1;
    this.expected = -1;
    if (filename) {
        this.filename = filename;
    } else {
        this.filename = "<string>";
    }
};

var PyErr_SetNone = function(exception) {
    PyErr_SetObject(exception, null);
};

var PyErr_SetObject = function(exception, o) {
    var tstate = PyThreadState_GET();
    var exc_value;
    var tb = null;

    if (exception != null &&
        !PyExceptionClass_Check(exception)) {
        PyErr_Format(PyExc_SystemError,
                     "exception %R not a BaseException subclass",
                     exception);
        return;
    }
    exc_value = tstate->exc_value;
    if (exc_value != NULL && exc_value != Py_None) {
        /* Implicit exception chaining */
        if (value == NULL || !PyExceptionInstance_Check(value)) {
            /* We must normalize the value right now */
            PyObject *args, *fixed_value;

            /* Issue #23571: PyEval_CallObject() must not be called with an
               exception set */
            PyErr_Clear();

            if (value == NULL || value == Py_None)
                args = PyTuple_New(0);
            else if (PyTuple_Check(value)) {
                Py_INCREF(value);
                args = value;
            }
            else
                args = PyTuple_Pack(1, value);
            fixed_value = args ?
                PyEval_CallObject(exception, args) : NULL;
            if (fixed_value == NULL)
                return;
            value = fixed_value;
        }
        /* Avoid reference cycles through the context chain.
           This is O(chain length) but context chains are
           usually very short. Sensitive readers may try
           to inline the call to PyException_GetContext. */
        if (exc_value != value) {
            PyObject *o = exc_value, *context;
            while ((context = PyException_GetContext(o))) {
                if (context == value) {
                    PyException_SetContext(o, NULL);
                    break;
                }
                o = context;
            }
            PyException_SetContext(value, exc_value);
        }
    }
    if (value != NULL && PyExceptionInstance_Check(value))
        tb = PyException_GetTraceback(value);
    PyErr_Restore(exception, value, tb);
};

var err_input = function(err) {
    console.log('err_input', err);
    var v;
    var w;
    var errtype;
    var errtext;
    var msg_obj = null;
    var msg = null;
    var offset = err.offset;
    errtype = batavia.builtins.SyntaxError;
    switch (err.error) {
    case batavia.modules._compile.E_ERROR:
        return;
    case batavia.modules._compile.E_SYNTAX:
        errtype = batavia.builtins.IndentationError;
        if (err.expected == batavia.modules._compile.INDENT)
            msg = "expected an indented block";
        else if (err.token == batavia.modules._compile.INDENT)
            msg = "unexpected indent";
        else if (err.token == batavia.modules._compile.DEDENT)
            msg = "unexpected unindent";
        else {
            errtype = batavia.builtins.SyntaxError;
            msg = "invalid syntax";
        }
        break;
    case batavia.modules._compile.E_TOKEN:
        msg = "invalid token";
        break;
    case batavia.modules._compile.E_EOFS:
        msg = "EOF while scanning triple-quoted string literal";
        break;
    case batavia.modules._compile.E_EOLS:
        msg = "EOL while scanning string literal";
        break;
    case batavia.modules._compile.E_INTR:
        if (!PyErr_Occurred())
            PyErr_SetNone(batavia.builtins.KeyboardInterrupt);
        return;
    case batavia.modules._compile.E_NOMEM:
        PyErr_SetNone(batavia.builtins.MemoryError);
        return;
    case batavia.modules._compile.E_EOF:
        msg = "unexpected EOF while parsing";
        break;
    case batavia.modules._compile.E_TABSPACE:
        errtype = batavia.builtins.TabError;
        msg = "inconsistent use of tabs and spaces in indentation";
        break;
    case batavia.modules._compile.E_OVERFLOW:
        msg = "expression too long";
        break;
    case batavia.modules._compile.E_DEDENT:
        errtype = batavia.builtins.IndentationError;
        msg = "unindent does not match any outer indentation level";
        break;
    case batavia.modules._compile.E_TOODEEP:
        errtype = batavia.builtins.IndentationError;
        msg = "too many levels of indentation";
        break;
    case batavia.modules._compile.E_DECODE: {
        var f = PyErr_Fetch();
        var value = f[1];
        msg = "unknown decode error";
        if (value != null) {
            msg_obj = value;
        }
        break;
    }
    case batavia.modules._compile.E_LINECONT:
        msg = "unexpected character after line continuation character";
        break;

    case batavia.modules._compile.E_IDENTIFIER:
        msg = "invalid character in identifier";
        break;
    case batavia.modules._compile.E_BADSINGLE:
        msg = "multiple statements found while compiling a single statement";
        break;
    default:
        console.log("error=", err.error);
        msg = "unknown parsing error";
        break;
    }
    /* err->text may not be UTF-8 in case of decoding errors.
       Explicitly convert to an object. */
    if (!err.text) {
        errtext = null;
    } else {
        errtext = err.text;
    }
    v = [err.filename, err.lineno, offset, errtext];
    if (msg_obj) {
        w = [msg_obj, v];
    } else {
        w = [msg, v];
    }

    PyErr_SetObject(errtype, w);
};


/*
 * Python compiler internals.
 */
batavia.modules._compile = {
    file_input: function() {
        throw new batavia.builtins.NotImplementedError("_compile.file_input is not implemented yet");
    },
    eval_input: function() {
        throw new batavia.builtins.NotImplementedError("_compile.eval_input is not implemented yet");
    },
    single_input: function() {
        throw new batavia.builtins.NotImplementedError("_compile.single_input is not implemented yet");
    },
    ast_check: function(obj) {
        return batavia.modules.ast.ast_check(obj);
    },
    compile_string_object: function(str, filename, compile_mode, cf, optimize) {
          var co = null;
          var mod = null;
          mod = batavia.modules._compile.ast_from_string_object(str, filename, compile_mode, cf);
          co = batavia.modules._compile.ast_compile_object(mod, filename, cf, optimize);
          return co;
    },
    ast_obj2mod: function(source, compile_mode) {
        throw new batavia.builtins.NotImplementedError("_compile.ast_obj2mod is not implemented yet");
    },
    ast_validate: function(mod) {
        throw new batavia.builtins.NotImplementedError("_compile.ast_validate is not implemented yet");
    },
    ast_compile_object: function(mod, filename, cf, optimize) {
        throw new batavia.builtins.NotImplementedError("_compile.ast_compile_object is not implemented yet");
    },
    ast_from_string_object: function(str, filename, start, flags) {
      var mod = null;
      var localflags = {};
      var iflags = 0;

      var ret = batavia.modules._compile.parse_string_object(str, filename,
                                           _PyParser_Grammar, start, iflags);
      var n = ret[0];
      var err = ret[1];

      if (flags == null) {
          localflags.cf_flags = 0;
          flags = localflags;
      }
      if (n) {
          flags.cf_flags |= iflags & PyCF_MASK;
          mod = batavia.modules._compile.ast_from_node_object(n, flags, filename);
      } else {
          err_input(err);
          mod = null;
      }
      return mod;
    },

    parse_string_object: function(s, filename, grammar, start, iflags) {
        var exec_input = start.__eq__(batavia.modules._compile.Py_file_input).valueOf();
        var err_ret = new ErrorDetail(filename);

        var tok = new batavia.modules._compile.Tokenizer(s, exec_input);
        tok.filename = err_ret.filename;
        var ret = batavia.modules._compile.parsetok(tok, grammar, start, err_ret, iflags);
        return [ret, err_ret];
    },

    parsetok: function(tok, g, start, err_ret, flags) {
        var n = null;
        var started = 0;

        var ps = new Parser(g, start);

        for (;;) {
            var result = tok.get_token();
            var type = result[0];
            var a = result[1];
            var b = result[2];

            if (type == batavia.modules._compile.ERRORTOKEN) {
                err_ret.error = tok.done;
                break;
            }

            if (type == batavia.modules._compile.ENDMARKER && started) {
                type = batavia.modules._compile.NEWLINE; /* Add an extra newline */
                started = 0;
                /* Add the right number of dedent tokens,
                   except if a certain flag is given --
                   codeop.py uses this. */
                if (tok.indent) {
                    tok.pendin = -tok.indent;
                    tok.indent = 0;
                }
            } else {
                started = 1;
            }
            var len = b - a;
            var str = '';
            if (len > 0) {
              str = tok.buf.slice(a, b);
            }
            str += '\0';

            var col_offset;
            if (a >= tok.line_start) {
                col_offset = a - tok.line_start;
            } else {
                col_offset = -1;
            }

            err_ret.error = ps.add_token(type, str, tok.lineno, col_offset, err_ret.expected)
            if (err_ret.error != batavia.modules._compile.E_OK) {
                if (err_ret.error != batavia.modules._compile.E_DONE) {
                    err_ret.token = type;
                }
                break;
            }
        }

        if (err_ret.error == batavia.modules._compile.E_DONE) {
            n = ps.p_tree;
            ps.p_tree = null;

            /* Check that the source for a single input statement really
               is a single statement by looking at what is left in the
               buffer after parsing.  Trailing whitespace and comments
               are OK.  */
            if (start == single_input) {
                cur = tok.cur;
                c = tok.buf[tok.cur];

                for (;;) {
                    while (c == ' ' || c == '\t' || c == '\n' || c == '\014') {
                        c = tok.buf[++tok.cur];
                    }

                    if (!c) {
                        break;
                    }

                    if (c != '#') {
                        err_ret.error = batavia.modules._compile.E_BADSINGLE;
                        n = null;
                        break;
                    }

                    /* Suck up comment. */
                    while (c && c != '\n') {
                        c = tok.buf[++tok.cur];
                    }
                }
            }
        } else {
            n = null;
        }

        if (n == null) {
            if (tok.done == batavia.modules._compile.E_EOF) {
                err_ret.error = batavia.modules._compile.E_EOF;
            }
            err_ret.lineno = tok.lineno;
            var len;
            err_ret.offset = tok.cur;
            len = tok.inp;
            err_ret.text = '';
            if (len > 0) {
                err_ret.text = tok.buf.slice(0, len).join('');
            }
            err_ret += '\0';
        } else if (tok.encoding != null) {
            /* 'nodes->n_str' uses PyObject_*, while 'tok.encoding' was
             * allocated using PyMem_
             */
            var r = new batavia.modules._compile.Node(encoding_decl);
            r.n_str = tok.encoding;
            tok.encoding = null;
            r.n_nchildren = 1;
            r.n_child = n;
            n = r;
        }

        return n;
    },

    Py_single_input: new batavia.types.Int(256),
    Py_file_input: new batavia.types.Int(257),
    Py_eval_input: new batavia.types.Int(258)
};
