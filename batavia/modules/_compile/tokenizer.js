/* Error codes passed around between file input, tokenizer, parser and
   interpreter.  This is necessary so we can turn them into Python
   exceptions at a higher level.  Note that some errors have a
   slightly different meaning when passed from the tokenizer to the
   parser than when passed from the parser to the interpreter; e.g.
   the parser only returns E_EOF when it hits EOF immediately, and it
   never returns E_OK. */
var types = require('../../types');
var builtins = require('../../builtins');

var tokenizer = {
    'EOF':          -1,
    'E_OK':         10,    /* No error */
    'E_EOF':        11,    /* End Of File */
    'E_INTR':       12,    /* Interrupted */
    'E_TOKEN':      13,    /* Bad token */
    'E_SYNTAX':     14,    /* Syntax error */
    'E_NOMEM':      15,    /* Ran out of memory */
    'E_DONE':       16,    /* Parsing complete */
    'E_ERROR':      17,    /* Execution error */
    'E_TABSPACE':   18,    /* Inconsistent mixing of tabs and spaces */
    'E_OVERFLOW':   19,    /* Node had too many children */
    'E_TOODEEP':    20,    /* Too many indentation levels */
    'E_DEDENT':     21,    /* No matching outer block for dedent */
    'E_DECODE':     22,    /* Error in decoding into Unicode */
    'E_EOFS':       23,    /* EOF in triple-quoted string */
    'E_EOLS':       24,    /* EOL in single-quoted string */
    'E_LINECONT':   25,    /* Unexpected characters after a line continuation */
    'E_IDENTIFIER': 26,    /* Invalid characters in identifier */
    'E_BADSINGLE':  27,    /* Ill-formed single statement input */


// modeled closely after tokenizer.c.
/* Token types */
    'ENDMARKER':        0,
    'NAME':             1,
    'NUMBER':           2,
    'STRING':           3,
    'NEWLINE':          4,
    'INDENT':           5,
    'DEDENT':           6,
    'LPAR':             7,
    'RPAR':             8,
    'LSQB':             9,
    'RSQB':             10,
    'COLON':            11,
    'COMMA':            12,
    'SEMI':             13,
    'PLUS':             14,
    'MINUS':            15,
    'STAR':             16,
    'SLASH':            17,
    'VBAR':             18,
    'AMPER':            19,
    'LESS':             20,
    'GREATER':          21,
    'EQUAL':            22,
    'DOT':              23,
    'PERCENT':          24,
    'LBRACE':           25,
    'RBRACE':           26,
    'EQEQUAL':          27,
    'NOTEQUAL':         28,
    'LESSEQUAL':        29,
    'GREATEREQUAL':     30,
    'TILDE':            31,
    'CIRCUMFLEX':       32,
    'LEFTSHIFT':        33,
    'RIGHTSHIFT':       34,
    'DOUBLESTAR':       35,
    'PLUSEQUAL':        36,
    'MINEQUAL':         37,
    'STAREQUAL':        38,
    'SLASHEQUAL':       39,
    'PERCENTEQUAL':     40,
    'AMPEREQUAL':       41,
    'VBAREQUAL':        42,
    'CIRCUMFLEXEQUAL':  43,
    'LEFTSHIFTEQUAL':   44,
    'RIGHTSHIFTEQUAL':  45,
    'DOUBLESTAREQUAL':  46,
    'DOUBLESLASH':      47,
    'DOUBLESLASHEQUAL': 48,
    'AT':               49,
    'ATEQUAL':          50,
    'RARROW':           51,
    'ELLIPSIS':         52,
    'OP':               53,
    'AWAIT':            54,
    'ASYNC':            55,
    'ERRORTOKEN':       56,
    'N_TOKENS':         57,
    'NT_OFFSET':        256,

    'TABSIZE':          8,
    'MAXINDENT':        100,

    'TOKEN_NAMES': {}
}

tokenizer.TOKEN_NAMES[tokenizer.ENDMARKER] = "ENDMARKER";
tokenizer.TOKEN_NAMES[tokenizer.NAME] = "NAME";
tokenizer.TOKEN_NAMES[tokenizer.NUMBER] = "NUMBER";
tokenizer.TOKEN_NAMES[tokenizer.STRING] = "STRING";
tokenizer.TOKEN_NAMES[tokenizer.NEWLINE] = "NEWLINE";
tokenizer.TOKEN_NAMES[tokenizer.INDENT] = "INDENT";
tokenizer.TOKEN_NAMES[tokenizer.DEDENT] = "DEDENT";
tokenizer.TOKEN_NAMES[tokenizer.LPAR] = "LPAR";
tokenizer.TOKEN_NAMES[tokenizer.RPAR] = "RPAR";
tokenizer.TOKEN_NAMES[tokenizer.LSQB] = "LSQB";
tokenizer.TOKEN_NAMES[tokenizer.RSQB] = "RSQB";
tokenizer.TOKEN_NAMES[tokenizer.COLON] = "COLON";
tokenizer.TOKEN_NAMES[tokenizer.COMMA] = "COMMA";
tokenizer.TOKEN_NAMES[tokenizer.SEMI] = "SEMI";
tokenizer.TOKEN_NAMES[tokenizer.PLUS] = "PLUS";
tokenizer.TOKEN_NAMES[tokenizer.MINUS] = "MINUS";
tokenizer.TOKEN_NAMES[tokenizer.STAR] = "STAR";
tokenizer.TOKEN_NAMES[tokenizer.SLASH] = "SLASH";
tokenizer.TOKEN_NAMES[tokenizer.VBAR] = "VBAR";
tokenizer.TOKEN_NAMES[tokenizer.AMPER] = "AMPER";
tokenizer.TOKEN_NAMES[tokenizer.LESS] = "LESS";
tokenizer.TOKEN_NAMES[tokenizer.GREATER] = "GREATER";
tokenizer.TOKEN_NAMES[tokenizer.EQUAL] = "EQUAL";
tokenizer.TOKEN_NAMES[tokenizer.DOT] = "DOT";
tokenizer.TOKEN_NAMES[tokenizer.PERCENT] = "PERCENT";
tokenizer.TOKEN_NAMES[tokenizer.LBRACE] = "LBRACE";
tokenizer.TOKEN_NAMES[tokenizer.RBRACE] = "RBRACE";
tokenizer.TOKEN_NAMES[tokenizer.EQEQUAL] = "EQEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.NOTEQUAL] = "NOTEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.LESSEQUAL] = "LESSEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.GREATEREQUAL] = "GREATEREQUAL";
tokenizer.TOKEN_NAMES[tokenizer.TILDE] = "TILDE";
tokenizer.TOKEN_NAMES[tokenizer.CIRCUMFLEX] = "CIRCUMFLEX";
tokenizer.TOKEN_NAMES[tokenizer.LEFTSHIFT] = "LEFTSHIFT";
tokenizer.TOKEN_NAMES[tokenizer.RIGHTSHIFT] = "RIGHTSHIFT";
tokenizer.TOKEN_NAMES[tokenizer.DOUBLESTAR] = "DOUBLESTAR";
tokenizer.TOKEN_NAMES[tokenizer.PLUSEQUAL] = "PLUSEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.MINEQUAL] = "MINEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.STAREQUAL] = "STAREQUAL";
tokenizer.TOKEN_NAMES[tokenizer.SLASHEQUAL] = "SLASHEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.PERCENTEQUAL] = "PERCENTEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.AMPEREQUAL] = "AMPEREQUAL";
tokenizer.TOKEN_NAMES[tokenizer.VBAREQUAL] = "VBAREQUAL";
tokenizer.TOKEN_NAMES[tokenizer.CIRCUMFLEXEQUAL] = "CIRCUMFLEXEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.LEFTSHIFTEQUAL] = "LEFTSHIFTEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.RIGHTSHIFTEQUAL] = "RIGHTSHIFTEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.DOUBLESTAREQUAL] = "DOUBLESTAREQUAL";
tokenizer.TOKEN_NAMES[tokenizer.DOUBLESLASH] = "DOUBLESLASH";
tokenizer.TOKEN_NAMES[tokenizer.DOUBLESLASHEQUAL] = "DOUBLESLASHEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.AT] = "AT";
tokenizer.TOKEN_NAMES[tokenizer.ATEQUAL] = "ATEQUAL";
tokenizer.TOKEN_NAMES[tokenizer.RARROW] = "RARROW";
tokenizer.TOKEN_NAMES[tokenizer.ELLIPSIS] = "ELLIPSIS";
tokenizer.TOKEN_NAMES[tokenizer.OP] = "OP";
tokenizer.TOKEN_NAMES[tokenizer.AWAIT] = "AWAIT";
tokenizer.TOKEN_NAMES[tokenizer.ASYNC] = "ASYNC";
tokenizer.TOKEN_NAMES[tokenizer.ERRORTOKEN] = "ERRORTOKEN";
tokenizer.TOKEN_NAMES[tokenizer.N_TOKENS] = "N_TOKENS";
tokenizer.TOKEN_NAMES[tokenizer.NT_OFFSET] = "NT_OFFSET";

var is_potential_identifier_start = function(c) {
    return (c >= 'a' && c <= 'z')
           || (c >= 'A' && c <= 'Z')
           || c == '_'
           || (c >= 128);
}

var is_potential_identifier_char = function(c) {
    return (c >= 'a' && c <= 'z')
           || (c >= 'A' && c <= 'Z')
           || (c >= '0' && c <= '9')
           || c == '_'
           || (c >= 128);
}

var isdigit = function(c) {
    return c >= '0' && c <= '9';
}


var PyToken_OneChar = function(c) {
    switch (c) {
        case '(':           return tokenizer.LPAR;
        case ')':           return tokenizer.RPAR;
        case '[':           return tokenizer.LSQB;
        case ']':           return tokenizer.RSQB;
        case ':':           return tokenizer.COLON;
        case ',':           return tokenizer.COMMA;
        case ';':           return tokenizer.SEMI;
        case '+':           return tokenizer.PLUS;
        case '-':           return tokenizer.MINUS;
        case '*':           return tokenizer.STAR;
        case '/':           return tokenizer.SLASH;
        case '|':           return tokenizer.VBAR;
        case '&':           return tokenizer.AMPER;
        case '<':           return tokenizer.LESS;
        case '>':           return tokenizer.GREATER;
        case '=':           return tokenizer.EQUAL;
        case '.':           return tokenizer.DOT;
        case '%':           return tokenizer.PERCENT;
        case '{':           return tokenizer.LBRACE;
        case '}':           return tokenizer.RBRACE;
        case '^':           return tokenizer.CIRCUMFLEX;
        case '~':           return tokenizer.TILDE;
        case '@':           return tokenizer.AT;
        default:            return tokenizer.OP;
    }
}

var PyToken_TwoChars = function(c1, c2) {
    switch (c1) {
        case '=':
            switch (c2) {
            case '=':               return tokenizer.EQEQUAL;
            }
            break;
        case '!':
            switch (c2) {
            case '=':               return tokenizer.NOTEQUAL;
            }
            break;
        case '<':
            switch (c2) {
            case '>':               return tokenizer.NOTEQUAL;
            case '=':               return tokenizer.LESSEQUAL;
            case '<':               return tokenizer.LEFTSHIFT;
            }
            break;
        case '>':
            switch (c2) {
            case '=':               return tokenizer.GREATEREQUAL;
            case '>':               return tokenizer.RIGHTSHIFT;
            }
            break;
        case '+':
            switch (c2) {
            case '=':               return tokenizer.PLUSEQUAL;
            }
            break;
        case '-':
            switch (c2) {
            case '=':               return tokenizer.MINEQUAL;
            case '>':               return tokenizer.RARROW;
            }
            break;
        case '*':
            switch (c2) {
            case '*':               return tokenizer.DOUBLESTAR;
            case '=':               return tokenizer.STAREQUAL;
            }
            break;
        case '/':
            switch (c2) {
            case '/':               return tokenizer.DOUBLESLASH;
            case '=':               return tokenizer.SLASHEQUAL;
            }
            break;
        case '|':
            switch (c2) {
            case '=':               return tokenizer.VBAREQUAL;
            }
            break;
        case '%':
            switch (c2) {
            case '=':               return tokenizer.PERCENTEQUAL;
            }
            break;
        case '&':
            switch (c2) {
            case '=':               return tokenizer.AMPEREQUAL;
            }
            break;
        case '^':
            switch (c2) {
            case '=':               return tokenizer.CIRCUMFLEXEQUAL;
            }
            break;
        case '@':
            switch (c2) {
            case '=':               return tokenizer.ATEQUAL;
            }
            break;
    }
    return tokenizer.OP;
}

var PyToken_ThreeChars = function(c1, c2, c3) {
    switch (c1) {
    case '<':
        switch (c2) {
        case '<':
            switch (c3) {
            case '=':
                return tokenizer.LEFTSHIFTEQUAL;
            }
            break;
        }
        break;
    case '>':
        switch (c2) {
        case '>':
            switch (c3) {
            case '=':
                return tokenizer.RIGHTSHIFTEQUAL;
            }
            break;
        }
        break;
    case '*':
        switch (c2) {
        case '*':
            switch (c3) {
            case '=':
                return tokenizer.DOUBLESTAREQUAL;
            }
            break;
        }
        break;
    case '/':
        switch (c2) {
        case '/':
            switch (c3) {
            case '=':
                return tokenizer.DOUBLESLASHEQUAL;
            }
            break;
        }
        break;
    case '.':
        switch (c2) {
        case '.':
            switch (c3) {
            case '.':
                return tokenizer.ELLIPSIS;
            }
            break;
        }
        break;
    }
    return tokenizer.OP;
}

var preprocess_string = function(str) {
    str = str.replace(/\s+$/, '');
    str = str.replace(/\r\n/, '\n');
    str = str.replace(/\r/, '\n');
    return str;
}

var Tokenizer = function(str) {
    /* Input state; buf <= cur <= inp <= end */
    /* NB an entire line is held in the buffer */
    str = preprocess_string(str);
    this.buf = str.split('');          /* Input buffer, or null; malloc'ed if fp != null */
    this.cur = 0;          /* Next character in buffer */
    this.inp = str.length;          /* End of data in buffer */
    this.end = str.length;          /* End of input buffer if buf != null */
    this.start = null;        /* Start of current token if not null */
    this.done = tokenizer.E_OK;           /* E_OK normally, E_EOF at EOF, otherwise error code */
    /* NB If done != E_OK, cur must be == inp!!! */
    this.tabsize = tokenizer.TABSIZE;        /* Tab spacing */
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
    this.alttabsize = 1;     /* Alternate tab spacing */
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
                             NEWLINE token after itokenizer. */
}

Tokenizer.prototype.__class__ = new types.Type('Tokenizer');
tokenizer['Tokenizer'] = Tokenizer;


// Get next token, after space stripping etc.
Tokenizer.prototype.get_token = function() {
    var tok = this;
    var c;
    // var p_start = null;
    // var p_end = null;
    tok.continue_processing = true;

    // nothing left to process
    if (tok.cur >= tok.buf.length) {
        return builtins.None;
    }

    var process_line = function() {
        tok.continue_processing = false;
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
                } else if (c == '\x0f') { // Control-L (formfeed)
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
                        if (tok.indenterror()) {
                            return [tokenizer.ERRORTOKEN, tok.cur, tok.cur, 1];
                        }
                    }
                } else if (col > tok.indstack[tok.indent]) {
                    /* Indent -- always one */
                    if (tok.indent + 1 >= tokenizer.MAXINDENT) {
                        tok.done = tokenizer.E_TOODEEP;
                        tok.cur = tok.inp;
                        return [tokenizer.ERRORTOKEN, tok.cur, tok.cur, 2];
                    }
                    if (altcol <= tok.altindstack[tok.indent]) {
                        if (tok.indenterror()) {
                            return [tokenizer.ERRORTOKEN, tok.cur, tok.cur, 3];
                        }
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
                        tok.done = tokenizer.E_DEDENT;
                        tok.cur = tok.inp;
                        return [tokenizer.ERRORTOKEN, tok.cur, tok.cur, 4];
                    }
                    if (altcol != tok.altindstack[tok.indent]) {
                        if (tok.indenterror())
                            return [tokenizer.ERRORTOKEN, tok.cur, tok.cur, 5];
                    }
                }
            }
        }

        tok.start = tok.cur;

        // Return pending indents/dedents
        if (tok.pendin != 0) {
            if (tok.pendin < 0) {
                tok.pendin++;
                return [tokenizer.DEDENT, tok.start, tok.cur];
            } else {
                tok.pendin--;
                return [tokenizer.INDENT, tok.start, tok.cur];
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
            && tok.async_def_indent >= tok.indent) {

            tok.async_def = 0;
            tok.async_def_indent = 0;
            tok.async_def_nl = 0;
        }

        return tok.again();
    }

    var result;
    while (tok.continue_processing) {
        result = process_line();
    }
    result[0] = tokenizer.TOKEN_NAMES[result[0]];
    return result;
}

Tokenizer.prototype.again = function() {
    var tok = this;
    var c;
    tok.start = null;
    var p_start = null;
    var p_end = null;
    // Skip spaces
    do {
        c = tok.tok_nextc();
    } while (c == ' ' || c == '\t' || c == '\x0c');

    // Set start of current token
    tok.start = tok.cur - 1;

    // Skip comment
    if (c == '#') {
        while (c != tokenizer.EOF && c != '\n') {
            c = tok.tok_nextc();
        }
    }

    // Check for EOF and errors now
    if (c == tokenizer.EOF) {
        return [tok.done == tokenizer.E_EOF ? tokenizer.ENDMARKER : tokenizer.ERRORTOKEN, builtins.None, builtins.None, 5];
    }

    // Identifier (most frequent token!)
    if (is_potential_identifier_start(c)) {
        return tok.parse_identifier(c);
    }

    // Newline
    if (c == '\n') {
        tok.atbol = 1;
        if (tok.level > 0) {
            // process next line
            tok.continue_processing = true;
            return builtins.None;
        }
        tok.cont_line = 0;
        if (tok.async_def) {
            // We're somewhere inside an 'async def' function, and
            // we've encountered a NEWLINE after its signature.
            tok.async_def_nl = 1;
        }
        // Leave '\n' out of the string
        return [tokenizer.NEWLINE, tok.start, tok.cur - 1];
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
                return [tokenizer.ELLIPSIS, p_start, p_end];
            } else {
                tok.tok_backup(c);
            }
            tok.tok_backup('.');
        } else {
            tok.tok_backup(c);
        }
        p_start = tok.start;
        p_end = tok.cur;
        return [tokenizer.DOT, p_start, p_end];
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
                    tok.done = tokenizer.E_TOKEN;
                    tok.tok_backup(c);
                     return [tokenizer.ERRORTOKEN, p_start, p_end, 6];
                }
                do {
                    c = tok.tok_nextc();
                } while (isxdigit(c));
            }
            else if (c == 'o' || c == 'O') {
                // Octal
                c = tok.tok_nextc();
                if (c < '0' || c >= '8') {
                    tok.done = tokenizer.E_TOKEN;
                    tok.tok_backup(c);
                    return [tokenizer.ERRORTOKEN, p_start, p_end, 7];
                }
                do {
                    c = tok.tok_nextc();
                } while ('0' <= c && c < '8');
            }
            else if (c == 'b' || c == 'B') {
                // Binary
                c = tok.tok_nextc();
                if (c != '0' && c != '1') {
                    tok.done = tokenizer.E_TOKEN;
                    tok.tok_backup(c);
                    return [tokenizer.ERRORTOKEN, p_start, p_end, 8];
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
                    tok.done = tokenizer.E_TOKEN;
                    tok.tok_backup(c);
                    return [tokenizer.ERRORTOKEN, tok.start, tok.cur, 8];
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
        return [tokenizer.NUMBER, p_start, p_end];
    }

    var result = tok.letter_quote(c);
    if (result !== builtins.None) {
        return result;
    }

    // Line continuation
    if (c == '\\') {
        c = tok.tok_nextc();
        if (c != '\n') {
            tok.done = tokenizer.E_LINECONT;
            tok.cur = tok.inp;
            return [tokenizer.ERRORTOKEN, p_start, p_end, 9];
        }
        tok.cont_line = 1;
        return tok.again(); // Read next line
    }

    // Check for two-character token
    var c2 = tok.tok_nextc();
    var token = PyToken_TwoChars(c, c2);
    if (token != tokenizer.OP) {
        var c3 = tok.tok_nextc();
        var token3 = PyToken_ThreeChars(c, c2, c3);
        if (token3 != tokenizer.OP) {
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
}

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
        return [tokenizer.ERRORTOKEN, p_start, p_end, 10];
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

    return [tokenizer.NAME, tok.start, tok.cur];
}

Tokenizer.prototype.letter_quote = function(c) {
    var tok = this;
    var p_start, p_end;
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
            if (c == tokenizer.EOF) {
                if (quote_size == 3) {
                    tok.done = tokenizer.E_EOFS;
                } else {
                    tok.done = tokenizer.E_EOLS;
                }
                tok.cur = tok.inp;
                return [tokenizer.ERRORTOKEN, p_start, p_end, 11];
            }
            if (quote_size == 1 && c == '\n') {
                tok.done = tokenizer.E_EOLS;
                tok.cur = tok.inp;
                return [tokenizer.ERRORTOKEN, p_start, p_end, 11];
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
        return [tokenizer.STRING, p_start, p_end];
    }
    return builtins.None;
}

Tokenizer.prototype.fraction = function(c) {
    var tok = this;
    var p_start, p_end;
    // var e;
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
    return [tokenizer.NUMBER, p_start, p_end];
}

Tokenizer.prototype.exponent = function(c) {
    var tok = this;
    var e = c;
    /* Exponent part */
    c = tok.tok_nextc();
    if (c == '+' || c == '-') {
        c = tok.tok_nextc();
        if (!isdigit(c)) {
            tok.done = tokenizer.E_TOKEN;
            tok.tok_backup(c);
            return [tokenizer.ERRORTOKEN, tok.start, tok.end, 15];
        }
    } else if (!isdigit(c)) {
        tok.tok_backup(c);
        tok.tok_backup(e);
        return [tokenizer.NUMBER, tok.start, tok.end];
    }
    do {
        c = tok.tok_nextc();
    } while (isdigit(c));

    if (c == 'j' || c == 'J') {
        return tok.imaginary();
    }

    tok.tok_backup(c);
    return [tokenizer.NUMBER, tok.start, tok.cur];
}

Tokenizer.prototype.imaginary = function() {
    var tok = this;
    var p_start, p_end;
    var c = tok.tok_nextc();

    tok.tok_backup(c);
    p_start = tok.start;
    p_end = tok.cur;
    return [tokenizer.NUMBER, p_start, p_end];
}

Tokenizer.prototype.tok_nextc = function() {
    var tok = this;

    if (tok.cur != tok.inp) {
        return tok.buf[tok.cur++]; /* Fast path */
    }
    return tokenizer.EOF;
}

/* Back-up one character */
Tokenizer.prototype.tok_backup = function(c) {
    var tok = this;
    if (c != tokenizer.EOF) {
        if (--tok.cur < 0) {
            throw new types.BatavieError("tok_backup: beginning of buffer");
        }
        if (tok.buf[tok.cur] != c) {
            tok[tok.cur] = c;
        }
    }
}

Tokenizer.prototype.indenterror = function() {
    var tok = this;
    if (tok.alterror) {
        tok.done = tokenizer.E_TABSPACE;
        tok.cur = tok.inp;
        return 1;
    }
    if (tok.altwarning) {
        console.log(tok.filename + ": inconsistent use of tabs and spaces in indentation"); tok.altwarning = 0;
    }
    return 0;
}

module.exports = tokenizer;
