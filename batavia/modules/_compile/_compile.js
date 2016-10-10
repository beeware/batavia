var ErrorDetail = function(filename) {
    this.error = E_OK;
    this.lineno = 0;
    this.offset = 0;
    this.text = NULL;
    this.token = -1;
    this.expected = -1;
    if (filename) {
        this.filename = filename;
    } else {
        this.filename = "<string>";
    }
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
      var localflags = null;
      var err = null;
      var iflags = 0;

      var n = batavia.modules._compile.parse_string_object(str, filename,
                                           _PyParser_Grammar, start, err,
                                           iflags);
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

    parse_string_object: function(s, filename, grammar, start, err, iflags) {
        var exec_input = start == file_input;
        var err_ret = new ErrorDetail(filename);

        var tok = new Tokenizer(s, exec_input);
        tok.filename = err_ret.filename;
        return batavia.modules._compile.parsetok(tok, grammar, start, err_ret, flags);
    },

    parsetok: function(tok, g, start, err_ret, flags) {
        var ps = null;
        var n = null;
        var started = 0;

        ps = batavia.modules._compile.new_parser(g, start);

        for (;;) {
            var a, b;
            var type;
            var len;
            var str;
            var col_offset;

            var result = tok.get_token();
            type = result[0];
            a = result[1];
            b = result[2];
            if (type == ERRORTOKEN) {
                err_ret.error = tok.done;
                break;
            }
            if (type == ENDMARKER && started) {
                type = NEWLINE; /* Add an extra newline */
                started = 0;
                /* Add the right number of dedent tokens,
                   except if a certain flag is given --
                   codeop.py uses this. */
                if (tok.indent) {
                    tok.pendin = -tok.indent;
                    tok.indent = 0;
                }
            }
            else
                started = 1;
            len = b - a; /* XXX this may compute null - null */
            str = '';
            if (len > 0) {
              str = tok.buf.slice(a, b);
            }
            str += '\0';

            if (a >= tok.line_start) {
                col_offset = a - tok.line_start;
            } else {
                col_offset = -1;
            }

            err_ret.error = ps.AddToken(type, str, tok.lineno, col_offset, err_ret.expected)
            if (err_ret.error != E_OK) {
                if (err_ret.error != E_DONE) {
                    err_ret.token = type;
                }
                break;
            }
        }

        if (err_ret.error == E_DONE) {
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
                        err_ret.error = E_BADSINGLE;
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
            if (tok.done == E_EOF) {
                err_ret.error = E_EOF;
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
            var r = PyNode_New(encoding_decl);
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
