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

/* Token types */
batavia.modules._compile.ENDMARKER =	0;
batavia.modules._compile.NAME =		1;
batavia.modules._compile.NUMBER =		2;
batavia.modules._compile.STRING =		3;
batavia.modules._compile.NEWLINE =		4;
batavia.modules._compile.INDENT =		5;
batavia.modules._compile.DEDENT =		6;
batavia.modules._compile.LPAR =		7;
batavia.modules._compile.RPAR =		8;
batavia.modules._compile.LSQB =		9;
batavia.modules._compile.RSQB =		10;
batavia.modules._compile.COLON =		11;
batavia.modules._compile.COMMA =		12;
batavia.modules._compile.SEMI =		13;
batavia.modules._compile.PLUS =		14;
batavia.modules._compile.MINUS =		15;
batavia.modules._compile.STAR =		16;
batavia.modules._compile.SLASH =		17;
batavia.modules._compile.VBAR =		18;
batavia.modules._compile.AMPER =		19;
batavia.modules._compile.LESS =		20;
batavia.modules._compile.GREATER =		21;
batavia.modules._compile.EQUAL =		22;
batavia.modules._compile.DOT =		23;
batavia.modules._compile.PERCENT =		24;
batavia.modules._compile.LBRACE =		25;
batavia.modules._compile.RBRACE =		26;
batavia.modules._compile.EQEQUAL =		27;
batavia.modules._compile.NOTEQUAL =	28;
batavia.modules._compile.LESSEQUAL =	29;
batavia.modules._compile.GREATEREQUAL =	30;
batavia.modules._compile.TILDE =		31;
batavia.modules._compile.CIRCUMFLEX =	32;
batavia.modules._compile.LEFTSHIFT =	33;
batavia.modules._compile.RIGHTSHIFT =	34;
batavia.modules._compile.DOUBLESTAR =	35;
batavia.modules._compile.PLUSEQUAL =	36;
batavia.modules._compile.MINEQUAL =	37;
batavia.modules._compile.STAREQUAL =	38;
batavia.modules._compile.SLASHEQUAL =	39;
batavia.modules._compile.PERCENTEQUAL =	40;
batavia.modules._compile.AMPEREQUAL =	41;
batavia.modules._compile.VBAREQUAL =	42;
batavia.modules._compile.CIRCUMFLEXEQUAL =	43;
batavia.modules._compile.LEFTSHIFTEQUAL =	44;
batavia.modules._compile.RIGHTSHIFTEQUAL =	45;
batavia.modules._compile.DOUBLESTAREQUAL =	46;
batavia.modules._compile.DOUBLESLASH =	47;
batavia.modules._compile.DOUBLESLASHEQUAL = 48;
batavia.modules._compile.AT =              49;
batavia.modules._compile.ATEQUAL =		50;
batavia.modules._compile.RARROW =          51;
batavia.modules._compile.ELLIPSIS =        52;
/* Don't forget to update the table _PyParser_TokenNames in tokenizer.c! */
batavia.modules._compile.OP =		53;
batavia.modules._compile.AWAIT =		54;
batavia.modules._compile.ASYNC =		55;
batavia.modules._compile.ERRORTOKEN =	56;
batavia.modules._compile.N_TOKENS =	57;

/* Special definitions for cooperation with parser */
batavia.modules._compile.NT_OFFSET =		256;

(function() {
    var Tokenizer = function() {
        /* Input state; buf <= cur <= inp <= end */
        /* NB an entire line is held in the buffer */
        this.buf = null;          /* Input buffer, or NULL; malloc'ed if fp != NULL */
        this.cur = null;          /* Next character in buffer */
        this.inp = null;          /* End of data in buffer */
        this.end = null;          /* End of input buffer if buf != NULL */
        this.start = null;        /* Start of current token if not NULL */
        this.done = null;           /* E_OK normally, E_EOF at EOF, otherwise error code */
        /* NB If done != E_OK, cur must be == inp!!! */
        this.fp = null;           /* Rest of input; NULL if tokenizing a string */
        this.tabsize = 0;        /* Tab spacing */
        this.indent = 0;         /* Current indentation index */
        this.indstack = [];      /* Stack of indents */
        this.atbol = 0;          /* Nonzero if at begin of new line */
        this.pendin = 0;         /* Pending indents (if > 0) or dedents (if < 0) */
        this.prompt = null;          /* For interactive prompting */
        this.nextprompt = null;
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


    // Get next token, after space stripping etc.
    // modeled closely after tokenizer.c: tok_get
    Token.prototype.get_token = function(str, p_start, p_end) {
        var tok = this;
        var c;
        var nonascii;
        p_start = null;
        p_end = null;
        var continue_processing = true;

        var process_line = function() {
            continue_processing = false;
            tok.start = null;
            var blanklinke = 0;

            // Get indentation level
            if (tok.atbol) {
                var col = 0;
                var altcol = 0;
                tok.atbol = 0;
                for (;;) {
                    c = tok_nextc(tok);
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
                tok_backup(tok, c);
                if (c == '#' || c == '\n') {
                    //  Lines with only whitespace and/or comments
                    //  shouldn't affect the indentation and are
                    //  not passed to the parser as NEWLINE tokens,
                    //  except *totally* empty lines in interactive
                    //  mode, which signal the end of a command group. */
                    if (col == 0 && c == '\n' && tok.prompt != null) {
                        blankline = 0; // Let it through
                    } else {
                        blankline = 1; // Ignore completely
                    }
                    //  We can't jump back right here since we still
                    //  may need to skip to the end of a comment */
                }
                if (!blankline && tok.level == 0) {
                    if (col == tok.indstack[tok.indent]) {
                        // No change
                        if (altcol != tok.altindstack[tok.indent]) {
                            if (indenterror(tok))
                                return ERRORTOKEN;
                        }
                    }
                    else if (col > tok.indstack[tok.indent]) {
                        /* Indent -- always one */
                        if (tok.indent + 1 >= MAXINDENT) {
                            tok.done = E_TOODEEP;
                            tok.cur = tok.inp;
                            return ERRORTOKEN;
                        }
                        if (altcol <= tok.altindstack[tok.indent]) {
                            if (indenterror(tok))
                                return ERRORTOKEN;
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
                            return ERRORTOKEN;
                        }
                        if (altcol != tok.altindstack[tok.indent]) {
                            if (indenterror(tok))
                                return ERRORTOKEN;
                        }
                    }
                }
            }

            tok.start = tok.cur;

            /* Return pending indents/dedents */
            if (tok.pendin != 0) {
                if (tok.pendin < 0) {
                    tok.pendin++;
                    return DEDENT;
                }
                else {
                    tok.pendin--;
                    return INDENT;
                }
            }

            if (tok.async_def
                && !blankline
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

        tok.again();
      };

      var result;
      while (continue_processing) {
          result = process_line();
      }
      return result;
  };

  Tokenizer.prototype.again = function() {
       tok.start = null;
       // Skip spaces
       do {
           c = tok_nextc(tok);
       } while (c == ' ' || c == '\t' || c == '\014');

       // Set start of current token
       tok.start = tok.cur - 1;

       // Skip comment
       if (c == '#') {
           while (c != EOF && c != '\n') {
               c = tok_nextc(tok);
           }
       }

       // Check for EOF and errors now
       if (c == EOF) {
           return tok.done == E_EOF ? ENDMARKER : ERRORTOKEN;
       }

       // Identifier (most frequent token!)
       nonascii = 0;
       if (is_potential_identifier_start(c)) {
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
               c = tok_nextc(tok);
               if (c == '"' || c == '\'') {
                   tok.letter_quote();
               }

           }
           while (is_potential_identifier_char(c)) {
               if (c >= 128) {
                   nonascii = 1;
               }
               c = tok_nextc(tok);
           }
           tok_backup(tok, c);
           if (nonascii && !verify_identifier(tok)) {
               return ERRORTOKEN;
           }
           p_start = tok.start;
           p_end = tok.cur;

           // async/await parsing block.
           if (tok.cur - tok.start == 5) {
               // Current token length is 5.
               if (tok.async_def) {
                   // We're inside an 'async def' function.
                   if (memcmp(tok.start, "async", 5) == 0)
                       return ASYNC;
                   if (memcmp(tok.start, "await", 5) == 0)
                       return AWAIT;
               }
               else if (memcmp(tok.start, "async", 5) == 0) {
                   // The current token is 'async'.
                   // Look ahead one token.

                   var ahead_tok = new Tokenizer();
                   var ahead_tok_start = null;
                   var ahead_tok_end = null;
                   var ahead_tok_kind = 0;

                   memcpy(ahead_tok, tok, sizeof(ahead_tok));
                   ahead_tok_kind = tok_get(ahead_tok, ahead_tok_start,
                                            ahead_tok_end);

                   if (ahead_tok_kind == NAME
                       && ahead_tok.cur - ahead_tok.start == 3
                       && memcmp(ahead_tok.start, "def", 3) == 0)
                   {
                       /* The next token is going to be 'def', so instead of
                          returning 'async' NAME token, we return ASYNC. */
                       tok.async_def_indent = tok.indent;
                       tok.async_def = 1;
                       return ASYNC;
                   }
               }
           }

           return NAME;
       }

       // Newline
       if (c == '\n') {
           tok.atbol = 1;
           if (blankline || tok.level > 0) {
               // process next line
               continue_processing = true;
               return null;
           }
           p_start = tok.start;
           p_end = tok.cur - 1; // Leave '\n' out of the string
           tok.cont_line = 0;
           if (tok.async_def) {
               // We're somewhere inside an 'async def' function, and
               // we've encountered a NEWLINE after its signature.
               tok.async_def_nl = 1;
           }
           return NEWLINE;
       }

       // Period or number starting with period?
       if (c == '.') {
           c = tok_nextc(tok);
           if (isdigit(c)) {
               tok_backup(tok, c);
               return fraction();
           } else if (c == '.') {
               c = tok_nextc(tok);
               if (c == '.') {
                   p_start = tok.start;
                   p_end = tok.cur;
                   return ELLIPSIS;
               } else {
                   tok_backup(tok, c);
               }
               tok_backup(tok, '.');
           } else {
               tok_backup(tok, c);
           }
           p_start = tok.start;
           p_end = tok.cur;
           return [DOT, p_start, p_end];
       }

       // Number
       if (isdigit(c)) {
           if (c == '0') {
               // Hex, octal or binary -- maybe.
               c = tok_nextc(tok);
               if (c == 'x' || c == 'X') {

                   // Hex
                   c = tok_nextc(tok);
                   if (!isxdigit(c)) {
                       tok.done = E_TOKEN;
                       tok_backup(tok, c);
                       return ERRORTOKEN;
                   }
                   do {
                       c = tok_nextc(tok);
                   } while (isxdigit(c));
               }
               else if (c == 'o' || c == 'O') {
                   // Octal
                   c = tok_nextc(tok);
                   if (c < '0' || c >= '8') {
                       tok.done = E_TOKEN;
                       tok_backup(tok, c);
                       return ERRORTOKEN;
                   }
                   do {
                       c = tok_nextc(tok);
                   } while ('0' <= c && c < '8');
               }
               else if (c == 'b' || c == 'B') {
                   // Binary
                   c = tok_nextc(tok);
                   if (c != '0' && c != '1') {
                       tok.done = E_TOKEN;
                       tok_backup(tok, c);
                       return ERRORTOKEN;
                   }
                   do {
                       c = tok_nextc(tok);
                   } while (c == '0' || c == '1');
               }
               else {
                   var nonzero = 0;
                   // maybe old-style octal; c is first char of it
                   // in any case, allow '0' as a literal
                   while (c == '0')
                       c = tok_nextc(tok);
                   while (isdigit(c)) {
                       nonzero = 1;
                       c = tok_nextc(tok);
                   }
                   if (c == '.') {
                       return fraction();
                   } else if (c == 'e' || c == 'E') {
                       return tok.exponent();
                   } else if (c == 'j' || c == 'J') {
                       return tok.imaginary();
                   } else if (nonzero) {
                       tok.done = E_TOKEN;
                       tok_backup(tok, c);
                       return ERRORTOKEN;
                   }
               }
           }
           else {
               // Decimal
               do {
                   c = tok_nextc(tok);
               } while (isdigit(c));
               tok.fraction();
           }
           tok_backup(tok, c);
           p_start = tok.start;
           p_end = tok.cur;
           return [NUMBER, p_start, p_end];
       }

     tok.letter_quote();

     // Line continuation
     if (c == '\\') {
         c = tok_nextc(tok);
         if (c != '\n') {
             tok.done = E_LINECONT;
             tok.cur = tok.inp;
             return ERRORTOKEN;
         }
         tok.cont_line = 1;
         return tok.again(); // Read next line
     }

     // Check for two-character token
     {
         var c2 = tok_nextc(tok);
         var token = PyToken_TwoChars(c, c2);
         if (token != OP) {
             var c3 = tok_nextc(tok);
             var token3 = PyToken_ThreeChars(c, c2, c3);
             if (token3 != OP) {
                 token = token3;
             } else {
                 tok_backup(tok, c3);
             }
             p_start = tok.start;
             p_end = tok.cur;
             return [token, p_start, p_end];
         }
         tok_backup(tok, c2);
     }

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

  Tokenizer.prototype.get_token_letter_quote = function() {
      // String
      if (c == '\'' || c == '"') {
          var quote = c;
          var quote_size = 1;             // 1 or 3
          var end_quote_size = 0;

          // Find the quote size and start of string
          c = tok_nextc(tok);
          if (c == quote) {
              c = tok_nextc(tok);
              if (c == quote) {
                  quote_size = 3;
              } else {
                  end_quote_size = 1;     // empty string found
              }
          }
          if (c != quote) {
              tok_backup(tok, c);
          }

          // Get rest of string
          while (end_quote_size != quote_size) {
              c = tok_nextc(tok);
              if (c == EOF) {
                  if (quote_size == 3) {
                      tok.done = E_EOFS;
                  } else {
                      tok.done = E_EOLS;
                  }
                  tok.cur = tok.inp;
                  return ERRORTOKEN;
              }
              if (quote_size == 1 && c == '\n') {
                  tok.done = E_EOLS;
                  tok.cur = tok.inp;
                  return ERRORTOKEN;
              }
              if (c == quote) {
                  end_quote_size += 1;
              } else {
                  end_quote_size = 0;
                  if (c == '\\') {
                      c = tok_nextc(tok);  // skip escaped char
                  }
              }
          }

          p_start = tok.start;
          p_end = tok.cur;
          return [STRING, p_start, p_end];
      }
  };

  Tokenizer.prototype.fraction = function() {
      var e;
      // Accept floating point numbers.
      if (c == '.') {
            // Fraction
            do {
                c = tok_nextc(tok);
            } while (isdigit(c));
        }
        if (c == 'e' || c == 'E') {
            return tok.exponent();
        }
        if (c == 'j' || c == 'J') {
            /* Imaginary part */
            c = tok_nextc(tok);
        }

      tok_backup(tok, c);
      p_start = tok.start;
      p_end = tok.cur;
      return [NUMBER, p_start, p_end];
  };

  Tokenizer.prototype.exponent = function() {
      var e = c;
      /* Exponent part */
      c = tok_nextc(tok);
      if (c == '+' || c == '-') {
          c = tok_nextc(tok);
          if (!isdigit(c)) {
              tok.done = [E_TOKEN, p_start, p_end];
              tok_backup(tok, c);
              return [ERRORTOKEN, p_start, p_end];
          }
      } else if (!isdigit(c)) {
          tok_backup(tok, c);
          tok_backup(tok, e);
          p_start = tok.start;
          p_end = tok.cur;
          return [NUMBER, p_start, p_end];
      }
      do {
          c = tok_nextc(tok);
      } while (isdigit(c));

      if (c == 'j' || c == 'J')
          return tok.imaginary();

      tok_backup(tok, c);
      p_start = tok.start;
      p_end = tok.cur;
      return [NUMBER, p_start, p_end];
  };

  Tokenizer.prototype.imaginary = function() {
      c = tok_nextc(tok);
      tok_backup(tok, c);
      p_start = tok.start;
      p_end = tok.cur;
      return [NUMBER, p_start, p_end];
  };

  batavia.modules._compile.Tokenizer = Tokenizer;
})();
