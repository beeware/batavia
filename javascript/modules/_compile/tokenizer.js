/* Error codes passed around between file input, tokenizer, parser and
   interpreter.  This is necessary so we can turn them into Python
   exceptions at a higher level.  Note that some errors have a
   slightly different meaning when passed from the tokenizer to the
   parser than when passed from the parser to the interpreter; e.g.
   the parser only returns E_EOF when it hits EOF immediately, and it
   never returns E_OK. */
import { pyargs } from '../../core/callables'
import { BataviaError } from '../../core/exceptions'
import { create_pyclass, PyNone, PyObject } from '../../core/types'

import * as types from '../../types'

export const EOF = -1
export const E_OK = 10 /* No error */
export const E_EOF = 11 /* End Of File */
export const E_INTR = 12 /* Interrupted */
export const E_TOKEN = 13 /* Bad token */
export const E_SYNTAX = 14 /* Syntax error */
export const E_NOMEM = 15 /* Ran out of memory */
export const E_DONE = 16 /* Parsing complete */
export const E_ERROR = 17 /* Execution error */
export const E_TABSPACE = 18 /* Inconsistent mixing of tabs and spaces */
export const E_OVERFLOW = 19 /* Node had too many children */
export const E_TOODEEP = 20 /* Too many indentation levels */
export const E_DEDENT = 21 /* No matching outer block for dedent */
export const E_DECODE = 22 /* Error in decoding into Unicode */
export const E_EOFS = 23 /* EOF in triple-quoted string */
export const E_EOLS = 24 /* EOL in single-quoted string */
export const E_LINECONT = 25 /* Unexpected characters after a line continuation */
export const E_IDENTIFIER = 26 /* Invalid characters in identifier */
export const E_BADSINGLE = 27 /* Ill-formed single statement input */

// modeled closely after tokenizer.c.
/* Token types */
export const ENDMARKER = 0
export const NAME = 1
export const NUMBER = 2
export const STRING = 3
export const NEWLINE = 4
export const INDENT = 5
export const DEDENT = 6
export const LPAR = 7
export const RPAR = 8
export const LSQB = 9
export const RSQB = 10
export const COLON = 11
export const COMMA = 12
export const SEMI = 13
export const PLUS = 14
export const MINUS = 15
export const STAR = 16
export const SLASH = 17
export const VBAR = 18
export const AMPER = 19
export const LESS = 20
export const GREATER = 21
export const EQUAL = 22
export const DOT = 23
export const PERCENT = 24
export const LBRACE = 25
export const RBRACE = 26
export const EQEQUAL = 27
export const NOTEQUAL = 28
export const LESSEQUAL = 29
export const GREATEREQUAL = 30
export const TILDE = 31
export const CIRCUMFLEX = 32
export const LEFTSHIFT = 33
export const RIGHTSHIFT = 34
export const DOUBLESTAR = 35
export const PLUSEQUAL = 36
export const MINEQUAL = 37
export const STAREQUAL = 38
export const SLASHEQUAL = 39
export const PERCENTEQUAL = 40
export const AMPEREQUAL = 41
export const VBAREQUAL = 42
export const CIRCUMFLEXEQUAL = 43
export const LEFTSHIFTEQUAL = 44
export const RIGHTSHIFTEQUAL = 45
export const DOUBLESTAREQUAL = 46
export const DOUBLESLASH = 47
export const DOUBLESLASHEQUAL = 48
export const AT = 49
export const ATEQUAL = 50
export const RARROW = 51
export const ELLIPSIS = 52
export const OP = 53
export const AWAIT = 54
export const ASYNC = 55
export const ERRORTOKEN = 56
export const N_TOKENS = 57
export const NT_OFFSET = 256

export const TABSIZE = 8
export const MAXINDENT = 100

export var TOKEN_NAMES = {}

TOKEN_NAMES[ENDMARKER] = 'ENDMARKER'
TOKEN_NAMES[NAME] = 'NAME'
TOKEN_NAMES[NUMBER] = 'NUMBER'
TOKEN_NAMES[STRING] = 'STRING'
TOKEN_NAMES[NEWLINE] = 'NEWLINE'
TOKEN_NAMES[INDENT] = 'INDENT'
TOKEN_NAMES[DEDENT] = 'DEDENT'
TOKEN_NAMES[LPAR] = 'LPAR'
TOKEN_NAMES[RPAR] = 'RPAR'
TOKEN_NAMES[LSQB] = 'LSQB'
TOKEN_NAMES[RSQB] = 'RSQB'
TOKEN_NAMES[COLON] = 'COLON'
TOKEN_NAMES[COMMA] = 'COMMA'
TOKEN_NAMES[SEMI] = 'SEMI'
TOKEN_NAMES[PLUS] = 'PLUS'
TOKEN_NAMES[MINUS] = 'MINUS'
TOKEN_NAMES[STAR] = 'STAR'
TOKEN_NAMES[SLASH] = 'SLASH'
TOKEN_NAMES[VBAR] = 'VBAR'
TOKEN_NAMES[AMPER] = 'AMPER'
TOKEN_NAMES[LESS] = 'LESS'
TOKEN_NAMES[GREATER] = 'GREATER'
TOKEN_NAMES[EQUAL] = 'EQUAL'
TOKEN_NAMES[DOT] = 'DOT'
TOKEN_NAMES[PERCENT] = 'PERCENT'
TOKEN_NAMES[LBRACE] = 'LBRACE'
TOKEN_NAMES[RBRACE] = 'RBRACE'
TOKEN_NAMES[EQEQUAL] = 'EQEQUAL'
TOKEN_NAMES[NOTEQUAL] = 'NOTEQUAL'
TOKEN_NAMES[LESSEQUAL] = 'LESSEQUAL'
TOKEN_NAMES[GREATEREQUAL] = 'GREATEREQUAL'
TOKEN_NAMES[TILDE] = 'TILDE'
TOKEN_NAMES[CIRCUMFLEX] = 'CIRCUMFLEX'
TOKEN_NAMES[LEFTSHIFT] = 'LEFTSHIFT'
TOKEN_NAMES[RIGHTSHIFT] = 'RIGHTSHIFT'
TOKEN_NAMES[DOUBLESTAR] = 'DOUBLESTAR'
TOKEN_NAMES[PLUSEQUAL] = 'PLUSEQUAL'
TOKEN_NAMES[MINEQUAL] = 'MINEQUAL'
TOKEN_NAMES[STAREQUAL] = 'STAREQUAL'
TOKEN_NAMES[SLASHEQUAL] = 'SLASHEQUAL'
TOKEN_NAMES[PERCENTEQUAL] = 'PERCENTEQUAL'
TOKEN_NAMES[AMPEREQUAL] = 'AMPEREQUAL'
TOKEN_NAMES[VBAREQUAL] = 'VBAREQUAL'
TOKEN_NAMES[CIRCUMFLEXEQUAL] = 'CIRCUMFLEXEQUAL'
TOKEN_NAMES[LEFTSHIFTEQUAL] = 'LEFTSHIFTEQUAL'
TOKEN_NAMES[RIGHTSHIFTEQUAL] = 'RIGHTSHIFTEQUAL'
TOKEN_NAMES[DOUBLESTAREQUAL] = 'DOUBLESTAREQUAL'
TOKEN_NAMES[DOUBLESLASH] = 'DOUBLESLASH'
TOKEN_NAMES[DOUBLESLASHEQUAL] = 'DOUBLESLASHEQUAL'
TOKEN_NAMES[AT] = 'AT'
TOKEN_NAMES[ATEQUAL] = 'ATEQUAL'
TOKEN_NAMES[RARROW] = 'RARROW'
TOKEN_NAMES[ELLIPSIS] = 'ELLIPSIS'
TOKEN_NAMES[OP] = 'OP'
TOKEN_NAMES[AWAIT] = 'AWAIT'
TOKEN_NAMES[ASYNC] = 'ASYNC'
TOKEN_NAMES[ERRORTOKEN] = 'ERRORTOKEN'
TOKEN_NAMES[N_TOKENS] = 'N_TOKENS'
TOKEN_NAMES[NT_OFFSET] = 'NT_OFFSET'

function is_potential_identifier_start(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || (c >= 128)
}

function is_potential_identifier_char(c) {
    return (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9') ||
        c === '_' ||
        (c >= 128)
}

function isdigit(c) {
    return c >= '0' && c <= '9'
}

function PyToken_OneChar(c) {
    switch (c) {
        case '(': return LPAR
        case ')': return RPAR
        case '[': return LSQB
        case ']': return RSQB
        case ':': return COLON
        case ',': return COMMA
        case ';': return SEMI
        case '+': return PLUS
        case '-': return MINUS
        case '*': return STAR
        case '/': return SLASH
        case '|': return VBAR
        case '&': return AMPER
        case '<': return LESS
        case '>': return GREATER
        case '=': return EQUAL
        case '.': return DOT
        case '%': return PERCENT
        case '{': return LBRACE
        case '}': return RBRACE
        case '^': return CIRCUMFLEX
        case '~': return TILDE
        case '@': return AT
        default: return OP
    }
}

function PyToken_TwoChars(c1, c2) {
    switch (c1) {
        case '=':
            switch (c2) {
                case '=': return EQEQUAL
            }
            break
        case '!':
            switch (c2) {
                case '=': return NOTEQUAL
            }
            break
        case '<':
            switch (c2) {
                case '>': return NOTEQUAL
                case '=': return LESSEQUAL
                case '<': return LEFTSHIFT
            }
            break
        case '>':
            switch (c2) {
                case '=': return GREATEREQUAL
                case '>': return RIGHTSHIFT
            }
            break
        case '+':
            switch (c2) {
                case '=': return PLUSEQUAL
            }
            break
        case '-':
            switch (c2) {
                case '=': return MINEQUAL
                case '>': return RARROW
            }
            break
        case '*':
            switch (c2) {
                case '*': return DOUBLESTAR
                case '=': return STAREQUAL
            }
            break
        case '/':
            switch (c2) {
                case '/': return DOUBLESLASH
                case '=': return SLASHEQUAL
            }
            break
        case '|':
            switch (c2) {
                case '=': return VBAREQUAL
            }
            break
        case '%':
            switch (c2) {
                case '=': return PERCENTEQUAL
            }
            break
        case '&':
            switch (c2) {
                case '=': return AMPEREQUAL
            }
            break
        case '^':
            switch (c2) {
                case '=': return CIRCUMFLEXEQUAL
            }
            break
        case '@':
            switch (c2) {
                case '=': return ATEQUAL
            }
            break
    }
    return OP
}

function PyToken_ThreeChars(c1, c2, c3) {
    switch (c1) {
        case '<':
            switch (c2) {
                case '<':
                    switch (c3) {
                        case '=':
                            return LEFTSHIFTEQUAL
                    }
                    break
            }
            break
        case '>':
            switch (c2) {
                case '>':
                    switch (c3) {
                        case '=':
                            return RIGHTSHIFTEQUAL
                    }
                    break
            }
            break
        case '*':
            switch (c2) {
                case '*':
                    switch (c3) {
                        case '=':
                            return DOUBLESTAREQUAL
                    }
                    break
            }
            break
        case '/':
            switch (c2) {
                case '/':
                    switch (c3) {
                        case '=':
                            return DOUBLESLASHEQUAL
                    }
                    break
            }
            break
        case '.':
            switch (c2) {
                case '.':
                    switch (c3) {
                        case '.':
                            return ELLIPSIS
                    }
                    break
            }
            break
    }
    return OP
}

function preprocess_string(str) {
    str = str.replace(/\s+$/, '')
    str = str.replace(/\r\n/, '\n')
    str = str.replace(/\r/, '\n')
    return str
}


class PyTokenizer extends PyObject {
    @pyargs({
        args: ['str'],
    })
    __init__(str) {
        /* Input state; buf <= cur <= inp <= end */
        /* NB an entire line is held in the buffer */
        str = preprocess_string(str)
        this.buf = str.split('') /* Input buffer, or null; malloc'ed if fp !== null */
        this.cur = 0 /* Next character in buffer */
        this.inp = str.length /* End of data in buffer */
        this.end = str.length /* End of input buffer if buf !== null */
        this.start = null /* Start of current token if not null */
        this.done = E_OK /* E_OK normally, E_EOF at EOF, otherwise error code */
        /* NB If done !== E_OK, cur must be === inp!!! */
        this.tabsize = TABSIZE /* Tab spacing */
        this.indent = 0 /* Current indentation index */
        this.indstack = [0] /* Stack of indents */
        this.atbol = 0 /* Nonzero if at begin of new line */
        this.pendin = 0 /* Pending indents (if > 0) or dedents (if < 0) */
        this.lineno = 0 /* Current line number */
        this.level = 0 /* () [] {} Parentheses nesting level */
        /* Used to allow free continuations inside them */
        /* Stuff for checking on different tab sizes */
        this.altwarning = 0 /* Issue warning if alternate tabs don't match */
        this.alterror = 0 /* Issue error if alternate tabs don't match */
        this.alttabsize = 1 /* Alternate tab spacing */
        this.altindstack = [] /* Stack of alternate indents */
        /* Stuff for PEP 0263 */
        this.decoding_state = null
        this.decoding_erred = 0 /* whether erred in decoding  */
        this.read_coding_spec = 0 /* whether 'coding:...' has been read  */
        this.encoding = null /* Source encoding. */
        this.cont_line = 0 /* whether we are in a continuation line. */
        this.line_start = 0 /* pointer to start of current line */
        this.enc = null /* Encoding for the current str. */
        this.str = null
        this.input = null /* Tokenizer's newline translated copy of the string. */

        /* async/await related fields; can be removed in 3.7 when async and await
           become normal keywords. */
        this.async_def = 0 /* =1 if tokens are inside an 'async def' body. */
        this.async_def_indent = 0 /* Indentation level of the outermost 'async def'. */
        this.async_def_nl = 0 /* =1 if the outermost 'async def' had at least one
                                 NEWLINE token after i */
    }

    // Get next token, after space stripping etc.
    get_token() {
        var tok = this
        var c
        // var p_start = null;
        // var p_end = null;
        tok.continue_processing = true

        // nothing left to process
        if (tok.cur >= tok.buf.length) {
            return PyNone
        }

        var process_line = function() {
            tok.continue_processing = false
            tok.start = null
            tok.blankline = 0

            // Get indentation level
            if (tok.atbol) {
                var col = 0
                var altcol = 0
                tok.atbol = 0
                for (;;) {
                    c = tok.tok_nextc()
                    if (c === ' ') {
                        col++
                        altcol++
                    } else if (c === '\t') {
                        col = (Math.floor(col / tok.tabsize) + 1) * tok.tabsize
                        altcol = (Math.floor(altcol / tok.alttabsize) + 1) * tok.alttabsize
                    } else if (c === '\x0f') { // Control-L (formfeed)
                        col = 0 // For Emacs users
                        altcol = 0
                    } else {
                        break
                    }
                }
                tok.tok_backup(c)
                if (c === '#' || c === '\n') {
                    tok.blankline = 1 // Ignore completely
                    //  We can't jump back right here since we still
                    //  may need to skip to the end of a comment
                }
                if (!tok.blankline && tok.level === 0) {
                    if (col === tok.indstack[tok.indent]) {
                        // No change
                        if (altcol !== tok.altindstack[tok.indent]) {
                            if (tok.indenterror()) {
                                return [ERRORTOKEN, tok.cur, tok.cur, 1]
                            }
                        }
                    } else if (col > tok.indstack[tok.indent]) {
                        /* Indent -- always one */
                        if (tok.indent + 1 >= MAXINDENT) {
                            tok.done = E_TOODEEP
                            tok.cur = tok.inp
                            return [ERRORTOKEN, tok.cur, tok.cur, 2]
                        }
                        if (altcol <= tok.altindstack[tok.indent]) {
                            if (tok.indenterror()) {
                                return [ERRORTOKEN, tok.cur, tok.cur, 3]
                            }
                        }
                        tok.pendin++
                        tok.indstack[++tok.indent] = col
                        tok.altindstack[tok.indent] = altcol
                    } else { // col < tok.indstack[tok.indent]
                        // Dedent -- any number, must be consistent
                        while (tok.indent > 0 && col < tok.indstack[tok.indent]) {
                            tok.pendin--
                            tok.indent--
                        }
                        if (col !== tok.indstack[tok.indent]) {
                            tok.done = E_DEDENT
                            tok.cur = tok.inp
                            return [ERRORTOKEN, tok.cur, tok.cur, 4]
                        }
                        if (altcol !== tok.altindstack[tok.indent]) {
                            if (tok.indenterror()) {
                                return [ERRORTOKEN, tok.cur, tok.cur, 5]
                            }
                        }
                    }
                }
            }

            tok.start = tok.cur

            // Return pending indents/dedents
            if (tok.pendin !== 0) {
                if (tok.pendin < 0) {
                    tok.pendin++
                    return [DEDENT, tok.start, tok.cur]
                } else {
                    tok.pendin--
                    return [INDENT, tok.start, tok.cur]
                }
            }

            if (tok.async_def &&
                    !tok.blankline &&
                    tok.level === 0 &&
                    /* There was a NEWLINE after ASYNC DEF,
                       so we're past the signature. */
                    tok.async_def_nl &&
                    /* Current indentation level is less than where
                       the async function was defined */
                    tok.async_def_indent >= tok.indent) {
                tok.async_def = 0
                tok.async_def_indent = 0
                tok.async_def_nl = 0
            }

            return tok.again()
        }

        var result
        while (tok.continue_processing) {
            result = process_line()
        }
        result[0] = TOKEN_NAMES[result[0]]
        return result
    }

    again() {
        var tok = this
        var c
        tok.start = null
        var p_start = null
        var p_end = null
        // Skip spaces
        do {
            c = tok.tok_nextc()
        } while (c === ' ' || c === '\t' || c === '\x0c')

        // Set start of current token
        tok.start = tok.cur - 1

        // Skip comment
        if (c === '#') {
            while (c !== EOF && c !== '\n') {
                c = tok.tok_nextc()
            }
        }

        // Check for EOF and errors now
        if (c === EOF) {
            var marker
            if (tok.done === E_EOF) {
                marker = ENDMARKER
            } else {
                marker = ERRORTOKEN
            }
            return [marker, PyNone, PyNone, 5]
        }

        // Identifier (most frequent token!)
        if (is_potential_identifier_start(c)) {
            return tok.parse_identifier(c)
        }

        // Newline
        if (c === '\n') {
            tok.atbol = 1
            if (tok.level > 0) {
                // process next line
                tok.continue_processing = true
                return PyNone
            }
            tok.cont_line = 0
            if (tok.async_def) {
                // We're somewhere inside an 'async def' function, and
                // we've encountered a NEWLINE after its signature.
                tok.async_def_nl = 1
            }
            // Leave '\n' out of the string
            return [NEWLINE, tok.start, tok.cur - 1]
        }

        // Period or number starting with period?
        if (c === '.') {
            c = tok.tok_nextc()
            if (isdigit(c)) {
                tok.tok_backup(c)
                return tok.fraction(c)
            } else if (c === '.') {
                c = tok.tok_nextc()
                if (c === '.') {
                    p_start = tok.start
                    p_end = tok.cur
                    return [ELLIPSIS, p_start, p_end]
                } else {
                    tok.tok_backup(c)
                }
                tok.tok_backup('.')
            } else {
                tok.tok_backup(c)
            }
            p_start = tok.start
            p_end = tok.cur
            return [DOT, p_start, p_end]
        }

        // Number
        if (isdigit(c)) {
            if (c === '0') {
                // Hex, octal or binary -- maybe.
                c = tok.tok_nextc()
                if (c === 'x' || c === 'X') {
                    // Hex
                    c = tok.tok_nextc()
                    // FIXME - the undefined symbol shouldn't be...
                    if (!isxdigit(c)) { // eslint-disable-line no-undef
                        tok.done = E_TOKEN
                        tok.tok_backup(c)
                        return [ERRORTOKEN, p_start, p_end, 6]
                    }
                    do {
                        c = tok.tok_nextc()
                    // FIXME - the undefined symbol shouldn't be...
                    } while (isxdigit(c)) // eslint-disable-line no-undef
                } else if (c === 'o' || c === 'O') {
                    // Octal
                    c = tok.tok_nextc()
                    if (c < '0' || c >= '8') {
                        tok.done = E_TOKEN
                        tok.tok_backup(c)
                        return [ERRORTOKEN, p_start, p_end, 7]
                    }
                    do {
                        c = tok.tok_nextc()
                    } while (c >= '0' && c < '8')
                } else if (c === 'b' || c === 'B') {
                    // Binary
                    c = tok.tok_nextc()
                    if (c !== '0' && c !== '1') {
                        tok.done = E_TOKEN
                        tok.tok_backup(c)
                        return [ERRORTOKEN, p_start, p_end, 8]
                    }
                    do {
                        c = tok.tok_nextc()
                    } while (c === '0' || c === '1')
                } else {
                    var nonzero = 0
                    // maybe old-style octal; c is first char of it
                    // in any case, allow '0' as a literal
                    while (c === '0') {
                        c = tok.tok_nextc()
                    }
                    while (isdigit(c)) {
                        nonzero = 1
                        c = tok.tok_nextc()
                    }
                    if (c === '.') {
                        return tok.fraction(c)
                    } else if (c === 'e' || c === 'E') {
                        return tok.exponent(c)
                    } else if (c === 'j' || c === 'J') {
                        return tok.imaginary()
                    } else if (nonzero) {
                        tok.done = E_TOKEN
                        tok.tok_backup(c)
                        return [ERRORTOKEN, tok.start, tok.cur, 8]
                    }
                }
            } else {
                // Decimal
                do {
                    c = tok.tok_nextc()
                } while (isdigit(c))
                return tok.fraction(c)
            }
            tok.tok_backup(c)
            p_start = tok.start
            p_end = tok.cur
            return [NUMBER, p_start, p_end]
        }

        var result = tok.letter_quote(c)
        if (result !== PyNone) {
            return result
        }

        // Line continuation
        if (c === '\\') {
            c = tok.tok_nextc()
            if (c !== '\n') {
                tok.done = E_LINECONT
                tok.cur = tok.inp
                return [ERRORTOKEN, p_start, p_end, 9]
            }
            tok.cont_line = 1
            return tok.again() // Read next line
        }

        // Check for two-character token
        var c2 = tok.tok_nextc()
        var token = PyToken_TwoChars(c, c2)
        if (token !== OP) {
            var c3 = tok.tok_nextc()
            var token3 = PyToken_ThreeChars(c, c2, c3)
            if (token3 !== OP) {
                token = token3
            } else {
                tok.tok_backup(c3)
            }
            p_start = tok.start
            p_end = tok.cur
            return [token, p_start, p_end]
        }
        tok.tok_backup(c2)

        // Keep track of parentheses nesting level
        switch (c) {
            case '(':
            case '[':
            case '{':
                tok.level++
                break
            case ')':
            case ']':
            case '}':
                tok.level--
                break
        }

        // Punctuation character
        p_start = tok.start
        p_end = tok.cur
        return [PyToken_OneChar(c), p_start, p_end]
    }

    parse_identifier(c) {
        var tok = this
        var nonascii = 0
        // Process b"", r"", u"", br"" and rb""
        var saw_b = 0
        var saw_r = 0
        var saw_u = 0
        var saw_f = 0
        while (1) {
            if (!(saw_b || saw_u || saw_f) && (c === 'b' || c === 'B')) {
                saw_b = 1
            // Since this is a backwards compatibility support literal we don't
            //   want to support it in arbitrary order like byte literals.
            } else if (!(saw_b || saw_u || saw_r || saw_f) && (c === 'u' || c === 'U')) {
                saw_u = 1
            // ur"" and ru"" are not supported
            } else if (!(saw_r || saw_u) && (c === 'r' || c === 'R')) {
                saw_r = 1
            } else if (!(saw_f || saw_b || saw_u) && (c === 'f' || c === 'F')) { saw_f = 1 } else { break }
            c = tok.tok_nextc()
            if (c === '"' || c === '\'') {
                return tok.letter_quote(c)
            }
        }
        while (is_potential_identifier_char(c)) {
            if (c >= 128) {
                nonascii = 1
            }
            c = tok.tok_nextc()
        }
        tok.tok_backup(c)
        // FIXME - the undefined symbol shouldn't be...
        if (nonascii && !verify_identifier(tok)) { // eslint-disable-line no-undef
            var p_start = tok.start
            var p_end = tok.cur
            return [ERRORTOKEN, p_start, p_end, 10]
        }

        // async/await parsing block.
        //  if (tok.cur - tok.start === 5) {
        //      // Current token length is 5.
        //      var word = tok.buf.slice(tok.start, tok.start + 5).join('');
        //      if (tok.async_def) {
        //          // We're inside an 'async def' function.
        //          if (word === "async") {
        //              return [ASYNC, tok.start, tok.cur];
        //          } else if (word === "await") {
        //              return [AWAIT, tok.start, tok.cur];
        //          }
        //      } else if (word === "async") {
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
        //          if (ahead_tok_kind === NAME
        //              && ahead_tok.cur - ahead_tok.start === 3
        //              && memcmp(ahead_tok.start, "def", 3) === 0)
        //          {
        //              /* The next token is going to be 'def', so instead of
        //                 returning 'async' NAME token, we return ASYNC. */
        //              tok.async_def_indent = tok.indent;
        //              tok.async_def = 1;
        //              return [ASYNC, p_start, p_end];
        //          }
        //      }
        //  }

        return [NAME, tok.start, tok.cur]
    }

    letter_quote(c) {
        var tok = this
        var p_start, p_end
        // String
        if (c === '\'' || c === '"') {
            var quote = c
            var quote_size = 1 // 1 or 3
            var end_quote_size = 0

            // Find the quote size and start of string
            c = tok.tok_nextc()
            if (c === quote) {
                c = tok.tok_nextc()
                if (c === quote) {
                    quote_size = 3
                } else {
                    end_quote_size = 1 // empty string found
                }
            }
            if (c !== quote) {
                tok.tok_backup(c)
            }

            // Get rest of string
            while (end_quote_size !== quote_size) {
                c = tok.tok_nextc()
                if (c === EOF) {
                    if (quote_size === 3) {
                        tok.done = E_EOFS
                    } else {
                        tok.done = E_EOLS
                    }
                    tok.cur = tok.inp
                    return [ERRORTOKEN, p_start, p_end, 11]
                }
                if (quote_size === 1 && c === '\n') {
                    tok.done = E_EOLS
                    tok.cur = tok.inp
                    return [ERRORTOKEN, p_start, p_end, 11]
                }
                if (c === quote) {
                    end_quote_size += 1
                } else {
                    end_quote_size = 0
                    if (c === '\\') {
                        c = tok.tok_nextc() // skip escaped char
                    }
                }
            }

            p_start = tok.start
            p_end = tok.cur
            return [STRING, p_start, p_end]
        }
        return PyNone
    }

    fraction(c) {
        var tok = this
        var p_start, p_end
        // var e;
        // Accept floating point numbers.
        if (c === '.') {
            // Fraction
            do {
                c = tok.tok_nextc()
            } while (isdigit(c))
        }
        if (c === 'e' || c === 'E') {
            return tok.exponent()
        }
        if (c === 'j' || c === 'J') {
            /* Imaginary part */
            c = tok.tok_nextc()
        }

        tok.tok_backup(c)
        p_start = tok.start
        p_end = tok.cur
        return [NUMBER, p_start, p_end]
    }

    exponent(c) {
        var tok = this
        var e = c
        /* Exponent part */
        c = tok.tok_nextc()
        if (c === '+' || c === '-') {
            c = tok.tok_nextc()
            if (!isdigit(c)) {
                tok.done = E_TOKEN
                tok.tok_backup(c)
                return [ERRORTOKEN, tok.start, tok.end, 15]
            }
        } else if (!isdigit(c)) {
            tok.tok_backup(c)
            tok.tok_backup(e)
            return [NUMBER, tok.start, tok.end]
        }
        do {
            c = tok.tok_nextc()
        } while (isdigit(c))

        if (c === 'j' || c === 'J') {
            return tok.imaginary()
        }

        tok.tok_backup(c)
        return [NUMBER, tok.start, tok.cur]
    }

    imaginary() {
        var tok = this
        var p_start, p_end
        var c = tok.tok_nextc()

        tok.tok_backup(c)
        p_start = tok.start
        p_end = tok.cur
        return [NUMBER, p_start, p_end]
    }

    tok_nextc() {
        var tok = this

        if (tok.cur !== tok.inp) {
            return tok.buf[tok.cur++] /* Fast path */
        }
        return EOF
    }

    /* Back-up one character */
    tok_backup(c) {
        var tok = this
        if (c !== EOF) {
            if (--tok.cur < 0) {
                throw new BataviaError('tok_backup: beginning of buffer')
            }
            if (tok.buf[tok.cur] !== c) {
                tok[tok.cur] = c
            }
        }
    }

    indenterror() {
        var tok = this
        if (tok.alterror) {
            tok.done = E_TABSPACE
            tok.cur = tok.inp
            return 1
        }
        if (tok.altwarning) {
            console.log(tok.filename + ': inconsistent use of tabs and spaces in indentation'); tok.altwarning = 0
        }
        return 0
    }
}
create_pyclass(PyTokenizer, 'Tokenizer')

export var Tokenizer = PyTokenizer.__class__