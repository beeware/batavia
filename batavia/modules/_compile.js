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
    ast_check: function() {
        throw new batavia.builtins.NotImplementedError("_compile.ast_check is not implemented yet");
    },
    compile_string_object: function(str, filename, compile_mode, cf, optimize) {
        throw new batavia.builtins.NotImplementedError("_compile.compile_string_object is not implemented yet");
    },
    new_arena: function() {
        throw new batavia.builtins.NotImplementedError("_compile.new_arena is not implemented yet");
    },
    ast_obj2mod: function(source, arena, compile_mode) {
        throw new batavia.builtins.NotImplementedError("_compile.ast_obj2mod is not implemented yet");
    },
    ast_validate: function(mod) {
        throw new batavia.builtins.NotImplementedError("_compile.ast_validate is not implemented yet");
    },
    ast_compile_object: function(mod, filename, cf, optimize, arena) {
        throw new batavia.builtins.NotImplementedError("_compile.ast_compile_object is not implemented yet");
    }
};

// modeled closely after tokenizer.c.
(function() {
    /* Error codes passed around between file input, tokenizer, parser and
       interpreter.  This is necessary so we can turn them into Python
       exceptions at a higher level.  Note that some errors have a
       slightly different meaning when passed from the tokenizer to the
       parser than when passed from the parser to the interpreter; e.g.
       the parser only returns E_EOF when it hits EOF immediately, and it
       never returns E_OK. */

    var EOF = -1;
    var E_OK =		10;	/* No error */
    var E_EOF =		11;	/* End Of File */
    var E_INTR =		12;	/* Interrupted */
    var E_TOKEN =		13;	/* Bad token */
    var E_SYNTAX =	14;	/* Syntax error */
    var E_NOMEM =		15;	/* Ran out of memory */
    var E_DONE =		16;	/* Parsing complete */
    var E_ERROR =		17;	/* Execution error */
    var E_TABSPACE =	18;	/* Inconsistent mixing of tabs and spaces */
    var E_OVERFLOW =      19;	/* Node had too many children */
    var E_TOODEEP =	20;	/* Too many indentation levels */
    var E_DEDENT =	21;	/* No matching outer block for dedent */
    var E_DECODE =	22;	/* Error in decoding into Unicode */
    var E_EOFS =		23;	/* EOF in triple-quoted string */
    var E_EOLS =		24;	/* EOL in single-quoted string */
    var E_LINECONT =	25;	/* Unexpected characters after a line continuation */
    var E_IDENTIFIER =    26;      /* Invalid characters in identifier */
    var E_BADSINGLE =	27;	/* Ill-formed single statement input */

    /* Token types */
    var ENDMARKER =	0;
    var NAME =		1;
    var NUMBER =		2;
    var STRING =		3;
    var NEWLINE =		4;
    var INDENT =		5;
    var DEDENT =		6;
    var LPAR =		7;
    var RPAR =		8;
    var LSQB =		9;
    var RSQB =		10;
    var COLON =		11;
    var COMMA =		12;
    var SEMI =		13;
    var PLUS =		14;
    var MINUS =		15;
    var STAR =		16;
    var SLASH =		17;
    var VBAR =		18;
    var AMPER =		19;
    var LESS =		20;
    var GREATER =		21;
    var EQUAL =		22;
    var DOT =		23;
    var PERCENT =		24;
    var LBRACE =		25;
    var RBRACE =		26;
    var EQEQUAL =		27;
    var NOTEQUAL =	28;
    var LESSEQUAL =	29;
    var GREATEREQUAL =	30;
    var TILDE =		31;
    var CIRCUMFLEX =	32;
    var LEFTSHIFT =	33;
    var RIGHTSHIFT =	34;
    var DOUBLESTAR =	35;
    var PLUSEQUAL =	36;
    var MINEQUAL =	37;
    var STAREQUAL =	38;
    var SLASHEQUAL =	39;
    var PERCENTEQUAL =	40;
    var AMPEREQUAL =	41;
    var VBAREQUAL =	42;
    var CIRCUMFLEXEQUAL =	43;
    var LEFTSHIFTEQUAL =	44;
    var RIGHTSHIFTEQUAL =	45;
    var DOUBLESTAREQUAL =	46;
    var DOUBLESLASH =	47;
    var DOUBLESLASHEQUAL = 48;
    var AT =              49;
    var ATEQUAL =		50;
    var RARROW =          51;
    var ELLIPSIS =        52;
    var OP =		53;
    var AWAIT =		54;
    var ASYNC =		55;
    var ERRORTOKEN =	56;
    var N_TOKENS =	57;
    var NT_OFFSET =		256;

    var TABSIZE = 8;

    batavia.modules._compile.EOF = EOF;
    batavia.modules._compile.E_OK = E_OK;
    batavia.modules._compile.E_EOF = E_EOF;
    batavia.modules._compile.E_INTR = E_INTR;
    batavia.modules._compile.E_TOKEN = E_TOKEN;
    batavia.modules._compile.E_SYNTAX = E_SYNTAX;
    batavia.modules._compile.E_NOMEM = E_NOMEM;
    batavia.modules._compile.E_DONE = E_DONE;
    batavia.modules._compile.E_ERROR = E_ERROR;
    batavia.modules._compile.E_TABSPACE = E_TABSPACE;
    batavia.modules._compile.E_OVERFLOW = E_OVERFLOW;
    batavia.modules._compile.E_TOODEEP = E_TOODEEP;
    batavia.modules._compile.E_DEDENT = E_DEDENT;
    batavia.modules._compile.E_DECODE = E_DECODE;
    batavia.modules._compile.E_EOFS = E_EOFS;
    batavia.modules._compile.E_EOLS = E_EOLS;
    batavia.modules._compile.E_LINECONT = E_LINECONT;
    batavia.modules._compile.E_IDENTIFIER = E_IDENTIFIER;
    batavia.modules._compile.E_BADSINGLE = E_BADSINGLE;

    batavia.modules._compile.ENDMARKER = ENDMARKER;
    batavia.modules._compile.NAME = NAME;
    batavia.modules._compile.NUMBER = NUMBER;
    batavia.modules._compile.STRING = STRING;
    batavia.modules._compile.NEWLINE = NEWLINE;
    batavia.modules._compile.INDENT = INDENT;
    batavia.modules._compile.DEDENT = DEDENT;
    batavia.modules._compile.LPAR = LPAR;
    batavia.modules._compile.RPAR = RPAR;
    batavia.modules._compile.LSQB = LSQB;
    batavia.modules._compile.RSQB = RSQB;
    batavia.modules._compile.COLON = COLON;
    batavia.modules._compile.COMMA = COMMA;
    batavia.modules._compile.SEMI = SEMI;
    batavia.modules._compile.PLUS = PLUS;
    batavia.modules._compile.MINUS = MINUS;
    batavia.modules._compile.STAR = STAR;
    batavia.modules._compile.SLASH = SLASH;
    batavia.modules._compile.VBAR = VBAR;
    batavia.modules._compile.AMPER = AMPER;
    batavia.modules._compile.LESS = LESS;
    batavia.modules._compile.GREATER = GREATER;
    batavia.modules._compile.EQUAL = EQUAL;
    batavia.modules._compile.DOT = DOT;
    batavia.modules._compile.PERCENT = PERCENT;
    batavia.modules._compile.LBRACE = LBRACE;
    batavia.modules._compile.RBRACE = RBRACE;
    batavia.modules._compile.EQEQUAL = EQEQUAL;
    batavia.modules._compile.NOTEQUAL = NOTEQUAL;
    batavia.modules._compile.LESSEQUAL = LESSEQUAL;
    batavia.modules._compile.GREATEREQUAL = GREATEREQUAL;
    batavia.modules._compile.TILDE = TILDE;
    batavia.modules._compile.CIRCUMFLEX = CIRCUMFLEX;
    batavia.modules._compile.LEFTSHIFT = LEFTSHIFT;
    batavia.modules._compile.RIGHTSHIFT = RIGHTSHIFT;
    batavia.modules._compile.DOUBLESTAR = DOUBLESTAR;
    batavia.modules._compile.PLUSEQUAL = PLUSEQUAL;
    batavia.modules._compile.MINEQUAL = MINEQUAL;
    batavia.modules._compile.STAREQUAL = STAREQUAL;
    batavia.modules._compile.SLASHEQUAL = SLASHEQUAL;
    batavia.modules._compile.PERCENTEQUAL = PERCENTEQUAL;
    batavia.modules._compile.AMPEREQUAL = AMPEREQUAL;
    batavia.modules._compile.VBAREQUAL = VBAREQUAL;
    batavia.modules._compile.CIRCUMFLEXEQUAL = CIRCUMFLEXEQUAL;
    batavia.modules._compile.LEFTSHIFTEQUAL = LEFTSHIFTEQUAL;
    batavia.modules._compile.RIGHTSHIFTEQUAL = RIGHTSHIFTEQUAL;
    batavia.modules._compile.DOUBLESTAREQUAL = DOUBLESTAREQUAL;
    batavia.modules._compile.DOUBLESLASH = DOUBLESLASH;
    batavia.modules._compile.DOUBLESLASHEQUAL = DOUBLESLASHEQUAL;
    batavia.modules._compile.AT = AT;
    batavia.modules._compile.ATEQUAL = ATEQUAL;
    batavia.modules._compile.RARROW = RARROW;
    batavia.modules._compile.ELLIPSIS = ELLIPSIS;
    batavia.modules._compile.OP = OP;
    batavia.modules._compile.AWAIT = AWAIT;
    batavia.modules._compile.ASYNC = ASYNC;
    batavia.modules._compile.ERRORTOKEN = ERRORTOKEN;
    batavia.modules._compile.N_TOKENS = N_TOKENS;
    batavia.modules._compile.NT_OFFSET = NT_OFFSET;

    batavia.modules._compile.TOKEN_NAMES = {};
    batavia.modules._compile.TOKEN_NAMES[ENDMARKER] = "ENDMARKER";
    batavia.modules._compile.TOKEN_NAMES[NAME] = "NAME";
    batavia.modules._compile.TOKEN_NAMES[NUMBER] = "NUMBER";
    batavia.modules._compile.TOKEN_NAMES[STRING] = "STRING";
    batavia.modules._compile.TOKEN_NAMES[NEWLINE] = "NEWLINE";
    batavia.modules._compile.TOKEN_NAMES[INDENT] = "INDENT";
    batavia.modules._compile.TOKEN_NAMES[DEDENT] = "DEDENT";
    batavia.modules._compile.TOKEN_NAMES[LPAR] = "LPAR";
    batavia.modules._compile.TOKEN_NAMES[RPAR] = "RPAR";
    batavia.modules._compile.TOKEN_NAMES[LSQB] = "LSQB";
    batavia.modules._compile.TOKEN_NAMES[RSQB] = "RSQB";
    batavia.modules._compile.TOKEN_NAMES[COLON] = "COLON";
    batavia.modules._compile.TOKEN_NAMES[COMMA] = "COMMA";
    batavia.modules._compile.TOKEN_NAMES[SEMI] = "SEMI";
    batavia.modules._compile.TOKEN_NAMES[PLUS] = "PLUS";
    batavia.modules._compile.TOKEN_NAMES[MINUS] = "MINUS";
    batavia.modules._compile.TOKEN_NAMES[STAR] = "STAR";
    batavia.modules._compile.TOKEN_NAMES[SLASH] = "SLASH";
    batavia.modules._compile.TOKEN_NAMES[VBAR] = "VBAR";
    batavia.modules._compile.TOKEN_NAMES[AMPER] = "AMPER";
    batavia.modules._compile.TOKEN_NAMES[LESS] = "LESS";
    batavia.modules._compile.TOKEN_NAMES[GREATER] = "GREATER";
    batavia.modules._compile.TOKEN_NAMES[EQUAL] = "EQUAL";
    batavia.modules._compile.TOKEN_NAMES[DOT] = "DOT";
    batavia.modules._compile.TOKEN_NAMES[PERCENT] = "PERCENT";
    batavia.modules._compile.TOKEN_NAMES[LBRACE] = "LBRACE";
    batavia.modules._compile.TOKEN_NAMES[RBRACE] = "RBRACE";
    batavia.modules._compile.TOKEN_NAMES[EQEQUAL] = "EQEQUAL";
    batavia.modules._compile.TOKEN_NAMES[NOTEQUAL] = "NOTEQUAL";
    batavia.modules._compile.TOKEN_NAMES[LESSEQUAL] = "LESSEQUAL";
    batavia.modules._compile.TOKEN_NAMES[GREATEREQUAL] = "GREATEREQUAL";
    batavia.modules._compile.TOKEN_NAMES[TILDE] = "TILDE";
    batavia.modules._compile.TOKEN_NAMES[CIRCUMFLEX] = "CIRCUMFLEX";
    batavia.modules._compile.TOKEN_NAMES[LEFTSHIFT] = "LEFTSHIFT";
    batavia.modules._compile.TOKEN_NAMES[RIGHTSHIFT] = "RIGHTSHIFT";
    batavia.modules._compile.TOKEN_NAMES[DOUBLESTAR] = "DOUBLESTAR";
    batavia.modules._compile.TOKEN_NAMES[PLUSEQUAL] = "PLUSEQUAL";
    batavia.modules._compile.TOKEN_NAMES[MINEQUAL] = "MINEQUAL";
    batavia.modules._compile.TOKEN_NAMES[STAREQUAL] = "STAREQUAL";
    batavia.modules._compile.TOKEN_NAMES[SLASHEQUAL] = "SLASHEQUAL";
    batavia.modules._compile.TOKEN_NAMES[PERCENTEQUAL] = "PERCENTEQUAL";
    batavia.modules._compile.TOKEN_NAMES[AMPEREQUAL] = "AMPEREQUAL";
    batavia.modules._compile.TOKEN_NAMES[VBAREQUAL] = "VBAREQUAL";
    batavia.modules._compile.TOKEN_NAMES[CIRCUMFLEXEQUAL] = "CIRCUMFLEXEQUAL";
    batavia.modules._compile.TOKEN_NAMES[LEFTSHIFTEQUAL] = "LEFTSHIFTEQUAL";
    batavia.modules._compile.TOKEN_NAMES[RIGHTSHIFTEQUAL] = "RIGHTSHIFTEQUAL";
    batavia.modules._compile.TOKEN_NAMES[DOUBLESTAREQUAL] = "DOUBLESTAREQUAL";
    batavia.modules._compile.TOKEN_NAMES[DOUBLESLASH] = "DOUBLESLASH";
    batavia.modules._compile.TOKEN_NAMES[DOUBLESLASHEQUAL] = "DOUBLESLASHEQUAL";
    batavia.modules._compile.TOKEN_NAMES[AT] = "AT";
    batavia.modules._compile.TOKEN_NAMES[ATEQUAL] = "ATEQUAL";
    batavia.modules._compile.TOKEN_NAMES[RARROW] = "RARROW";
    batavia.modules._compile.TOKEN_NAMES[ELLIPSIS] = "ELLIPSIS";
    batavia.modules._compile.TOKEN_NAMES[OP] = "OP";
    batavia.modules._compile.TOKEN_NAMES[AWAIT] = "AWAIT";
    batavia.modules._compile.TOKEN_NAMES[ASYNC] = "ASYNC";
    batavia.modules._compile.TOKEN_NAMES[ERRORTOKEN] = "ERRORTOKEN";
    batavia.modules._compile.TOKEN_NAMES[N_TOKENS] = "N_TOKENS";
    batavia.modules._compile.TOKEN_NAMES[NT_OFFSET] = "NT_OFFSET";

    var is_potential_identifier_start = function(c) {
        return (c >= 'a' && c <= 'z')
               || (c >= 'A' && c <= 'Z')
               || c == '_'
               || (c >= 128);
    };

    var is_potential_identifier_char = function(c) {
        return (c >= 'a' && c <= 'z')
               || (c >= 'A' && c <= 'Z')
               || (c >= '0' && c <= '9')
               || c == '_'
               || (c >= 128);
    };

    var isdigit = function(c) {
        return c >= '0' && c <= '9';
    };


    var PyToken_OneChar = function(c) {
        switch (c) {
        case '(':           return LPAR;
        case ')':           return RPAR;
        case '[':           return LSQB;
        case ']':           return RSQB;
        case ':':           return COLON;
        case ',':           return COMMA;
        case ';':           return SEMI;
        case '+':           return PLUS;
        case '-':           return MINUS;
        case '*':           return STAR;
        case '/':           return SLASH;
        case '|':           return VBAR;
        case '&':           return AMPER;
        case '<':           return LESS;
        case '>':           return GREATER;
        case '=':           return EQUAL;
        case '.':           return DOT;
        case '%':           return PERCENT;
        case '{':           return LBRACE;
        case '}':           return RBRACE;
        case '^':           return CIRCUMFLEX;
        case '~':           return TILDE;
        case '@':           return AT;
        default:            return OP;
        }
    };

    var PyToken_TwoChars = function(c1, c2) {
        switch (c1) {
        case '=':
            switch (c2) {
            case '=':               return EQEQUAL;
            }
            break;
        case '!':
            switch (c2) {
            case '=':               return NOTEQUAL;
            }
            break;
        case '<':
            switch (c2) {
            case '>':               return NOTEQUAL;
            case '=':               return LESSEQUAL;
            case '<':               return LEFTSHIFT;
            }
            break;
        case '>':
            switch (c2) {
            case '=':               return GREATEREQUAL;
            case '>':               return RIGHTSHIFT;
            }
            break;
        case '+':
            switch (c2) {
            case '=':               return PLUSEQUAL;
            }
            break;
        case '-':
            switch (c2) {
            case '=':               return MINEQUAL;
            case '>':               return RARROW;
            }
            break;
        case '*':
            switch (c2) {
            case '*':               return DOUBLESTAR;
            case '=':               return STAREQUAL;
            }
            break;
        case '/':
            switch (c2) {
            case '/':               return DOUBLESLASH;
            case '=':               return SLASHEQUAL;
            }
            break;
        case '|':
            switch (c2) {
            case '=':               return VBAREQUAL;
            }
            break;
        case '%':
            switch (c2) {
            case '=':               return PERCENTEQUAL;
            }
            break;
        case '&':
            switch (c2) {
            case '=':               return AMPEREQUAL;
            }
            break;
        case '^':
            switch (c2) {
            case '=':               return CIRCUMFLEXEQUAL;
            }
            break;
        case '@':
            switch (c2) {
            case '=':               return ATEQUAL;
            }
            break;
        }
        return OP;
    };

    var PyToken_ThreeChars = function(c1, c2, c3) {
        switch (c1) {
        case '<':
            switch (c2) {
            case '<':
                switch (c3) {
                case '=':
                    return LEFTSHIFTEQUAL;
                }
                break;
            }
            break;
        case '>':
            switch (c2) {
            case '>':
                switch (c3) {
                case '=':
                    return RIGHTSHIFTEQUAL;
                }
                break;
            }
            break;
        case '*':
            switch (c2) {
            case '*':
                switch (c3) {
                case '=':
                    return DOUBLESTAREQUAL;
                }
                break;
            }
            break;
        case '/':
            switch (c2) {
            case '/':
                switch (c3) {
                case '=':
                    return DOUBLESLASHEQUAL;
                }
                break;
            }
            break;
        case '.':
            switch (c2) {
            case '.':
                switch (c3) {
                case '.':
                    return ELLIPSIS;
                }
                break;
            }
            break;
        }
        return OP;
    };

    var preprocess_string = function(str) {
        str = str.replace(/\s+$/, '');
        str = str.replace(/\r\n/, '\n');
        str = str.replace(/\r/, '\n');
        return str;
    };

    var Tokenizer = function(str) {
        /* Input state; buf <= cur <= inp <= end */
        /* NB an entire line is held in the buffer */
        str = preprocess_string(str);
        this.buf = str.split('');          /* Input buffer, or NULL; malloc'ed if fp != NULL */
        this.cur = 0;          /* Next character in buffer */
        this.inp = str.length;          /* End of data in buffer */
        this.end = str.length;          /* End of input buffer if buf != NULL */
        this.start = null;        /* Start of current token if not NULL */
        this.done = E_OK;           /* E_OK normally, E_EOF at EOF, otherwise error code */
        /* NB If done != E_OK, cur must be == inp!!! */
        this.tabsize = TABSIZE;        /* Tab spacing */
        this.indent = 0;         /* Current indentation index */
        this.indstack = [0];      /* Stack of indents */
        this.atbol = 0;          /* Nonzero if at begin of new line */
        this.pendin = 0;         /* Pending indents (if > 0) or dedents (if < 0) */
        this.lineno = 0;         /* Current line number */
        this.level = 0;          /* () [] {} Parentheses nesting level */
                /* Used to allow free continuations inside them */
        /* Stuff for checking on different tab sizes */
        this.altwarning = 0;     /* Issue warning if alternate tabs don't match */
        this.alterror = 0;       /* Issue error if alternate tabs don't match */
        this.alttabsize = 0;     /* Alternate tab spacing */
        this.altindstack = [];         /* Stack of alternate indents */
        /* Stuff for PEP 0263 */
        this.decoding_state = null;
        this.decoding_erred = 0;         /* whether erred in decoding  */
        this.read_coding_spec = 0;       /* whether 'coding:...' has been read  */
        this.encoding = null;         /* Source encoding. */
        this.cont_line = 0;          /* whether we are in a continuation line. */
        this.line_start = 0;     /* pointer to start of current line */
        this.enc = null;        /* Encoding for the current str. */
        this.str = null;
        this.input = null; /* Tokenizer's newline translated copy of the string. */

        /* async/await related fields; can be removed in 3.7 when async and await
           become normal keywords. */
        this.async_def = 0;        /* =1 if tokens are inside an 'async def' body. */
        this.async_def_indent = 0; /* Indentation level of the outermost 'async def'. */
        this.async_def_nl = 0;     /* =1 if the outermost 'async def' had at least one
                                 NEWLINE token after it. */
    };

    Tokenizer.prototype.__class__ = new batavia.types.Type('Tokenizer');


    // Get next token, after space stripping etc.
    Tokenizer.prototype.get_token = function() {
        var tok = this;
        var c;
        var p_start = null;
        var p_end = null;
        var continue_processing = true;

        // nothing left to process
        if (tok.cur >= tok.buf.length) {
            return null;
        }

        var process_line = function() {
            continue_processing = false;
            tok.start = null;
            tok.blankline = 0;

            // Get indentation level
            if (tok.atbol) {
                var col = 0;
                var altcol = 0;
                tok.atbol = 0;
                for (;;) {
                    c = tok.tok_nextc();
                    if (c == ' ') {
                        col++, altcol++;
                    } else if (c == '\t') {
                        col = (Math.floor(col / tok.tabsize) + 1) * tok.tabsize;
                        altcol = (Math.floor(altcol / tok.alttabsize) + 1)
                            * tok.alttabsize;
                    } else if (c == '\014') { // Control-L (formfeed)
                        col = 0; // For Emacs users
                        altcol = 0;
                    } else {
                        break;
                    }
                }
                tok.tok_backup(c);
                if (c == '#' || c == '\n') {
                    tok.blankline = 1; // Ignore completely
                    //  We can't jump back right here since we still
                    //  may need to skip to the end of a comment
                }
                if (!tok.blankline && tok.level == 0) {
                    if (col == tok.indstack[tok.indent]) {
                        // No change
                        if (altcol != tok.altindstack[tok.indent]) {
                            if (tok.indenterror())
                                return [ERRORTOKEN, tok.cur, tok.cur, 1];
                        }
                    }
                    else if (col > tok.indstack[tok.indent]) {
                        /* Indent -- always one */
                        if (tok.indent + 1 >= MAXINDENT) {
                            tok.done = E_TOODEEP;
                            tok.cur = tok.inp;
                            return [ERRORTOKEN, tok.cur, tok.cur, 2];
                        }
                        if (altcol <= tok.altindstack[tok.indent]) {
                            if (tok.indenterror())
                                return [ERRORTOKEN, tok.cur, tok.cur, 3];
                        }
                        tok.pendin++;
                        tok.indstack[++tok.indent] = col;
                        tok.altindstack[tok.indent] = altcol;
                    } else { // col < tok.indstack[tok.indent]
                        // Dedent -- any number, must be consistent
                        while (tok.indent > 0 &&
                            col < tok.indstack[tok.indent]) {
                            tok.pendin--;
                            tok.indent--;
                        }
                        if (col != tok.indstack[tok.indent]) {
                            tok.done = E_DEDENT;
                            tok.cur = tok.inp;
                            return [ERRORTOKEN, tok.cur, tok.cur, 4];
                        }
                        if (altcol != tok.altindstack[tok.indent]) {
                            if (tok.indenterror())
                                return [ERRORTOKEN, tok.cur, tok.cur, 5];
                        }
                    }
                }
            }

            tok.start = tok.cur;

            /* Return pending indents/dedents */
            if (tok.pendin != 0) {
                if (tok.pendin < 0) {
                    tok.pendin++;
                    return [DEDENT, p_start, p_end];
                }
                else {
                    tok.pendin--;
                    return [INDENT. p_start, p_end];
                }
            }

            if (tok.async_def
                && !tok.blankline
                && tok.level == 0
                /* There was a NEWLINE after ASYNC DEF,
                   so we're past the signature. */
                && tok.async_def_nl
                /* Current indentation level is less than where
                   the async function was defined */
                && tok.async_def_indent >= tok.indent)
            {
                tok.async_def = 0;
                tok.async_def_indent = 0;
                tok.async_def_nl = 0;
            }

            return tok.again();
      };

      var result;
      while (continue_processing) {
          result = process_line();
      }
      result[0] = batavia.modules._compile.TOKEN_NAMES[result[0]];
      return result;
  };

  Tokenizer.prototype.again = function() {
       var tok = this;
       var c;
       tok.start = null;
       var p_start = null;
       var p_end = null;
       // Skip spaces
       do {
           c = tok.tok_nextc();
       } while (c == ' ' || c == '\t' || c == '\014');

       // Set start of current token
       tok.start = tok.cur - 1;

       // Skip comment
       if (c == '#') {
           while (c != EOF && c != '\n') {
               c = tok.tok_nextc();
           }
       }

       // Check for EOF and errors now
       if (c == EOF) {
           return [tok.done == E_EOF ? ENDMARKER : ERRORTOKEN, null, null, 5];
       }

       // Identifier (most frequent token!)
       if (is_potential_identifier_start(c)) {
           return tok.parse_identifier(c);
       }

       // Newline
       if (c == '\n') {
           tok.atbol = 1;
           if (tok.ret || tok.level > 0) {
               // process next line
               continue_processing = true;
               return null;
           }
           tok.cont_line = 0;
           if (tok.async_def) {
               // We're somewhere inside an 'async def' function, and
               // we've encountered a NEWLINE after its signature.
               tok.async_def_nl = 1;
           }
           // Leave '\n' out of the string
           return [NEWLINE, tok.start, tok.cur - 1];
       }

       // Period or number starting with period?
       if (c == '.') {
           c = tok.tok_nextc();
           if (isdigit(c)) {
               tok.tok_backup(c);
               return tok.fraction(c);
           } else if (c == '.') {
               c = tok.tok_nextc();
               if (c == '.') {
                   p_start = tok.start;
                   p_end = tok.cur;
                   return [ELLIPSIS, p_start, p_end];
               } else {
                   tok.tok_backup(c);
               }
               tok.tok_backup('.');
           } else {
               tok.tok_backup(c);
           }
           p_start = tok.start;
           p_end = tok.cur;
           return [DOT, p_start, p_end];
       }

       // Number
       if (isdigit(c)) {
           if (c == '0') {
               // Hex, octal or binary -- maybe.
               c = tok.tok_nextc();
               if (c == 'x' || c == 'X') {
                   // Hex
                   c = tok.tok_nextc();
                   if (!isxdigit(c)) {
                       tok.done = E_TOKEN;
                       tok.tok_backup(c);
                       return [ERRORTOKEN, p_start, p_end, 6];
                   }
                   do {
                       c = tok.tok_nextc();
                   } while (isxdigit(c));
               }
               else if (c == 'o' || c == 'O') {
                   // Octal
                   c = tok.tok_nextc();
                   if (c < '0' || c >= '8') {
                       tok.done = E_TOKEN;
                       tok.tok_backup(c);
                       return [ERRORTOKEN, p_start, p_end, 7];
                   }
                   do {
                       c = tok.tok_nextc();
                   } while ('0' <= c && c < '8');
               }
               else if (c == 'b' || c == 'B') {
                   // Binary
                   c = tok.tok_nextc();
                   if (c != '0' && c != '1') {
                       tok.done = E_TOKEN;
                       tok.tok_backup(c);
                       return [ERRORTOKEN, p_start, p_end, 8];
                   }
                   do {
                       c = tok.tok_nextc();
                   } while (c == '0' || c == '1');
               }
               else {
                   var nonzero = 0;
                   // maybe old-style octal; c is first char of it
                   // in any case, allow '0' as a literal
                   while (c == '0') {
                      c = tok.tok_nextc();
                   }
                   while (isdigit(c)) {
                       nonzero = 1;
                       c = tok.tok_nextc();
                   }
                   if (c == '.') {
                       return tok.fraction(c);
                   } else if (c == 'e' || c == 'E') {
                       return tok.exponent(c);
                   } else if (c == 'j' || c == 'J') {
                       return tok.imaginary();
                   } else if (nonzero) {
                       tok.done = E_TOKEN;
                       tok.tok_backup(c);
                       return [ERRORTOKEN, tok.start, tok.cur, 8];
                   }
               }
           } else {
               // Decimal
               do {
                   c = tok.tok_nextc();
               } while (isdigit(c));
               return tok.fraction(c);
           }
           tok.tok_backup(c);
           p_start = tok.start;
           p_end = tok.cur;
           return [NUMBER, p_start, p_end];
       }

     var result = tok.letter_quote(c);
     if (result != null) {
         return result;
     }

     // Line continuation
     if (c == '\\') {
         c = tok.tok_nextc();
         if (c != '\n') {
             tok.done = E_LINECONT;
             tok.cur = tok.inp;
             return [ERRORTOKEN, p_start, p_end, 9];
         }
         tok.cont_line = 1;
         return tok.again(); // Read next line
     }

     // Check for two-character token
     var c2 = tok.tok_nextc();
     var token = PyToken_TwoChars(c, c2);
     if (token != OP) {
         var c3 = tok.tok_nextc();
         var token3 = PyToken_ThreeChars(c, c2, c3);
         if (token3 != OP) {
             token = token3;
         } else {
             tok.tok_backup(c3);
         }
         p_start = tok.start;
         p_end = tok.cur;
         return [token, p_start, p_end];
     }
     tok.tok_backup(c2);

     // Keep track of parentheses nesting level
     switch (c) {
     case '(':
     case '[':
     case '{':
         tok.level++;
         break;
     case ')':
     case ']':
     case '}':
         tok.level--;
         break;
     }

     // Punctuation character
     p_start = tok.start;
     p_end = tok.cur;
     return [PyToken_OneChar(c), p_start, p_end];
  };

  Tokenizer.prototype.parse_identifier = function(c) {
    var tok = this;
    var nonascii = 0;
    // Process b"", r"", u"", br"" and rb""
    var saw_b = 0;
    var saw_r = 0;
    var saw_u = 0;
    var saw_f = 0;
    while (1) {
        if (!(saw_b || saw_u || saw_f) && (c == 'b' || c == 'B'))
            saw_b = 1;
        // Since this is a backwards compatibility support literal we don't
        //   want to support it in arbitrary order like byte literals.
        else if (!(saw_b || saw_u || saw_r || saw_f) && (c == 'u' || c == 'U'))
            saw_u = 1;
        // ur"" and ru"" are not supported
        else if (!(saw_r || saw_u) && (c == 'r' || c == 'R'))
            saw_r = 1;
        else if (!(saw_f || saw_b || saw_u) && (c == 'f' || c == 'F'))
            saw_f = 1;
        else
            break;
        c = tok.tok_nextc();
        if (c == '"' || c == '\'') {
            return tok.letter_quote(c);
        }
    }
    while (is_potential_identifier_char(c)) {
        if (c >= 128) {
            nonascii = 1;
        }
        c = tok.tok_nextc();
    }
    tok.tok_backup(c);
    if (nonascii && !verify_identifier(tok)) {
        return [ERRORTOKEN, p_start, p_end, 10];
    }

      // async/await parsing block.
     //  if (tok.cur - tok.start == 5) {
     //      // Current token length is 5.
     //      var word = tok.buf.slice(tok.start, tok.start + 5).join('');
     //      if (tok.async_def) {
     //          // We're inside an 'async def' function.
     //          if (word == "async") {
     //              return [ASYNC, tok.start, tok.cur];
     //          } else if (word == "await") {
     //              return [AWAIT, tok.start, tok.cur];
     //          }
     //      } else if (word == "async") {
     //          // The current token is 'async'.
     //          // Look ahead one token.
      //
     //          var ahead_tok = new Tokenizer();
     //          var ahead_tok_start = null;
     //          var ahead_tok_end = null;
     //          var ahead_tok_kind = 0;
      //
     //          memcpy(ahead_tok, tok, sizeof(ahead_tok));
     //          ahead_tok_kind = tok_get(ahead_tok, ahead_tok_start,
     //                                   ahead_tok_end);
      //
     //          if (ahead_tok_kind == NAME
     //              && ahead_tok.cur - ahead_tok.start == 3
     //              && memcmp(ahead_tok.start, "def", 3) == 0)
     //          {
     //              /* The next token is going to be 'def', so instead of
     //                 returning 'async' NAME token, we return ASYNC. */
     //              tok.async_def_indent = tok.indent;
     //              tok.async_def = 1;
     //              return [ASYNC, p_start, p_end];
     //          }
     //      }
     //  }

      return [NAME, tok.start, tok.cur];
  };

  Tokenizer.prototype.letter_quote = function(c) {
      var tok = this;
      // String
      if (c == '\'' || c == '"') {
          var quote = c;
          var quote_size = 1;             // 1 or 3
          var end_quote_size = 0;

          // Find the quote size and start of string
          c = tok.tok_nextc();
          if (c == quote) {
              c = tok.tok_nextc();
              if (c == quote) {
                  quote_size = 3;
              } else {
                  end_quote_size = 1;     // empty string found
              }
          }
          if (c != quote) {
              tok.tok_backup(c);
          }

          // Get rest of string
          while (end_quote_size != quote_size) {
              c = tok.tok_nextc();
              if (c == EOF) {
                  if (quote_size == 3) {
                      tok.done = E_EOFS;
                  } else {
                      tok.done = E_EOLS;
                  }
                  tok.cur = tok.inp;
                  return [ERRORTOKEN, p_start, p_end, 11];
              }
              if (quote_size == 1 && c == '\n') {
                  tok.done = E_EOLS;
                  tok.cur = tok.inp;
                  return [ERRORTOKEN, p_start, p_end, 11];
              }
              if (c == quote) {
                  end_quote_size += 1;
              } else {
                  end_quote_size = 0;
                  if (c == '\\') {
                      c = tok.tok_nextc();  // skip escaped char
                  }
              }
          }

          p_start = tok.start;
          p_end = tok.cur;
          return [STRING, p_start, p_end];
      }
      return null;
  };

  Tokenizer.prototype.fraction = function(c) {
      var tok = this;
      var e;
      // Accept floating point numbers.
      if (c == '.') {
          // Fraction
          do {
              c = tok.tok_nextc();
          } while (isdigit(c));
      }
      if (c == 'e' || c == 'E') {
          return tok.exponent();
      }
      if (c == 'j' || c == 'J') {
          /* Imaginary part */
          c = tok.tok_nextc();
      }

      tok.tok_backup(c);
      p_start = tok.start;
      p_end = tok.cur;
      return [NUMBER, p_start, p_end];
  };

  Tokenizer.prototype.exponent = function(c) {
      var tok = this;
      var e = c;
      /* Exponent part */
      c = tok.tok_nextc();
      if (c == '+' || c == '-') {
          c = tok.tok_nextc();
          if (!isdigit(c)) {
              tok.done = E_TOKEN;
              tok.tok_backup(c);
              return [ERRORTOKEN, tok.start, tok.end, 15];
          }
      } else if (!isdigit(c)) {
          tok.tok_backup(c);
          tok.tok_backup(e);
          return [NUMBER, tok.start, tok.end];
      }
      do {
          c = tok.tok_nextc();
      } while (isdigit(c));

      if (c == 'j' || c == 'J') {
          return tok.imaginary();
      }

      tok.tok_backup(c);
      return [NUMBER, tok.start, tok.cur];
  };

  Tokenizer.prototype.imaginary = function() {
      var tok = this;
      var c = tok.tok_nextc();
      tok.tok_backup(c);
      p_start = tok.start;
      p_end = tok.cur;
      return [NUMBER, p_start, p_end];
  };


  Tokenizer.prototype.tok_nextc = function() {
    var tok = this;

    if (tok.cur != tok.inp) {
        return tok.buf[tok.cur++]; /* Fast path */
    }
    return EOF;

    // for (;;) {
    //     if (tok.cur != tok.inp) {
    //         return tok.buf[tok.cur++]; /* Fast path */
    //     }
    //     if (tok.done != E_OK) {
    //         return EOF;
    //     }
    //     var done = 0;
    //     var cur = tok.cur;
    //     var pt = null;
        // if (tok.start == null) {
        //     if (decoding_fgets(tok.buf, tok.end,
        //               tok) == null) {
        //         if (!tok.decoding_erred)
        //             tok.done = E_EOF;
        //         done = 1;
        //     } else {
        //         tok.done = E_OK;
        //         tok.inp = strchr(tok.buf, '\0');
        //         done = tok.inp[-1] == '\n';
        //     }
        // } else {
            // cur = tok.cur;
            // tok.done = E_OK;
        // }
        // tok.lineno++;
        // console.log("on line", tok.lineno);
        // /* Read until '\n' or EOF */
        // while (!done) {
        //     var curstart = (tok.start == null) ? -1 :
        //               tok.start;
        //     var curvalid = tok.inp;
        //     tok.cur = cur;
        //     tok.line_start = tok.cur;
        //     tok.inp = curvalid;
        //     tok.start = curstart < 0 ? null : curstart;
        //     tok.inp = tok.buf.length - 1;
        //     done = tok.buf[tok.inp - 1] == '\n';
        //     break;
        // }
        // tok.cur = cur;
        // tok.line_start = tok.cur;
        // /* replace "\r\n" with "\n" */
        // /* For Mac leave the \r, giving a syntax error */
        // pt = tok.inp - 2;
        // if (pt >= 0 && tok.buf[pt] == '\r') {
        //     tok.buf[pt++] = '\n';
        //     tok.buf[pt] = '\0';
        //     tok.inp = pt;
        // }
        // if (tok.done != E_OK) {
        //     tok.cur = tok.inp;
        //     return EOF;
        // }
    // }
    /*NOTREACHED*/
  };

  /* Back-up one character */
  Tokenizer.prototype.tok_backup = function(c) {
      var tok = this;
      if (c != EOF) {
          if (--tok.cur < 0) {
              throw new batavia.types.BatavieError("tok_backup: beginning of buffer");
          }
          if (tok.buf[tok.cur] != c) {
              tok[tok.cur] = c;
          }
      }
  };

  Tokenizer.prototype.indenterror = function() {
      var tok = this;
      if (tok.alterror) {
          tok.done = E_TABSPACE;
          tok.cur = tok.inp;
          return 1;
      }
      if (tok.altwarning) {
          console.log(tok.filename + ": inconsistent use of tabs and spaces in indentation"); tok.altwarning = 0;
      }
      return 0;
  };


  batavia.modules._compile.Tokenizer = Tokenizer;
})();
