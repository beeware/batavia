/*
 * Python compiler internals.
 */
var tokenizer = require('./tokenizer');
var types = require('../../types');
var exceptions = require('../../core/exceptions');

var _compile = {
    '__doc__': "",
    '__file__': "batavia/modules/_compile/_compile.js",
    '__name__': "_compile",
    '__package__': "",
};

_compile.file_input = function() {
    throw new exceptions.NotImplementedError("_compile.file_input is not implemented yet");
}

_compile.eval_input = function() {
    throw new exceptions.NotImplementedError("_compile.eval_input is not implemented yet");
}

_compile.single_input = function() {
    throw new exceptions.NotImplementedError("_compile.single_input is not implemented yet");
}

_compile.ast_check = function(obj) {
    throw new exceptions.NotImplementedError("_compile.ast_check is not implemented yet");
}

_compile.compile_string_object = function(str, filename, compile_mode, cf, optimize) {
    throw new exceptions.NotImplementedError("_compile.compile_string_object is not implemented yet");
}

_compile.ast_obj2mod = function(source, compile_mode) {
    throw new exceptions.NotImplementedError("_compile.ast_obj2mod is not implemented yet");
}

_compile.ast_validate = function(mod) {
    throw new exceptions.NotImplementedError("_compile.ast_validate is not implemented yet");
}

_compile.ast_compile_object = function(mod, filename, cf, optimize) {
    throw new exceptions.NotImplementedError("_compile.ast_compile_object is not implemented yet");
}

_compile.ast_from_string_object = function(str, filename, start, flags) {
    throw new exceptions.NotImplementedError("_compile.ast_compile_object is not implemented yet");
}

_compile.parse_string_object = function(s, filename, grammar, start, iflags) {
    throw new exceptions.NotImplementedError("_compile.parse_string_object is not implemented yet");
}
_compile.parsetok = function(tok, g, start, err_ret, flags) {
    throw new exceptions.NotImplementedError("_compile.parsetok is not implemented yet");
}

_compile['Py_single_input'] = new types.Int(256);
_compile['Py_file_input'] = new types.Int(257);
_compile['Py_eval_input'] = new types.Int(258);

_compile['EOF'] = tokenizer.EOF;
_compile['E_OK'] = tokenizer.E_OK;
_compile['E_EOF'] = tokenizer.E_EOF;
_compile['E_INTR'] = tokenizer.E_INTR;
_compile['E_TOKEN'] = tokenizer.E_TOKEN;
_compile['E_SYNTAX'] = tokenizer.E_SYNTAX;
_compile['E_NOMEM'] = tokenizer.E_NOMEM;
_compile['E_DONE'] = tokenizer.E_DONE;
_compile['E_ERROR'] = tokenizer.E_ERROR;
_compile['E_TABSPACE'] = tokenizer.E_TABSPACE;
_compile['E_OVERFLOW'] = tokenizer.E_OVERFLOW;
_compile['E_TOODEEP'] = tokenizer.E_TOODEEP;
_compile['E_DEDENT'] = tokenizer.E_DEDENT;
_compile['E_DECODE'] = tokenizer.E_DECODE;
_compile['E_EOFS'] = tokenizer.E_EOFS;
_compile['E_EOLS'] = tokenizer.E_EOLS;
_compile['E_LINECONT'] = tokenizer.E_LINECONT;
_compile['E_IDENTIFIER'] = tokenizer.E_IDENTIFIER;
_compile['E_BADSINGLE'] = tokenizer.E_BADSINGLE;

_compile['ENDMARKER'] = tokenizer.ENDMARKER;
_compile['NAME'] = tokenizer.NAME;
_compile['NUMBER'] = tokenizer.NUMBER;
_compile['STRING'] = tokenizer.STRING;
_compile['NEWLINE'] = tokenizer.NEWLINE;
_compile['INDENT'] = tokenizer.INDENT;
_compile['DEDENT'] = tokenizer.DEDENT;
_compile['LPAR'] = tokenizer.LPAR;
_compile['RPAR'] = tokenizer.RPAR;
_compile['LSQB'] = tokenizer.LSQB;
_compile['RSQB'] = tokenizer.RSQB;
_compile['COLON'] = tokenizer.COLON;
_compile['COMMA'] = tokenizer.COMMA;
_compile['SEMI'] = tokenizer.SEMI;
_compile['PLUS'] = tokenizer.PLUS;
_compile['MINUS'] = tokenizer.MINUS;
_compile['STAR'] = tokenizer.STAR;
_compile['SLASH'] = tokenizer.SLASH;
_compile['VBAR'] = tokenizer.VBAR;
_compile['AMPER'] = tokenizer.AMPER;
_compile['LESS'] = tokenizer.LESS;
_compile['GREATER'] = tokenizer.GREATER;
_compile['EQUAL'] = tokenizer.EQUAL;
_compile['DOT'] = tokenizer.DOT;
_compile['PERCENT'] = tokenizer.PERCENT;
_compile['LBRACE'] = tokenizer.LBRACE;
_compile['RBRACE'] = tokenizer.RBRACE;
_compile['EQEQUAL'] = tokenizer.EQEQUAL;
_compile['NOTEQUAL'] = tokenizer.NOTEQUAL;
_compile['LESSEQUAL'] = tokenizer.LESSEQUAL;
_compile['GREATEREQUAL'] = tokenizer.GREATEREQUAL;
_compile['TILDE'] = tokenizer.TILDE;
_compile['CIRCUMFLEX'] = tokenizer.CIRCUMFLEX;
_compile['LEFTSHIFT'] = tokenizer.LEFTSHIFT;
_compile['RIGHTSHIFT'] = tokenizer.RIGHTSHIFT;
_compile['DOUBLESTAR'] = tokenizer.DOUBLESTAR;
_compile['PLUSEQUAL'] = tokenizer.PLUSEQUAL;
_compile['MINEQUAL'] = tokenizer.MINEQUAL;
_compile['STAREQUAL'] = tokenizer.STAREQUAL;
_compile['SLASHEQUAL'] = tokenizer.SLASHEQUAL;
_compile['PERCENTEQUAL'] = tokenizer.PERCENTEQUAL;
_compile['AMPEREQUAL'] = tokenizer.AMPEREQUAL;
_compile['VBAREQUAL'] = tokenizer.VBAREQUAL;
_compile['CIRCUMFLEXEQUAL'] = tokenizer.CIRCUMFLEXEQUAL;
_compile['LEFTSHIFTEQUAL'] = tokenizer.LEFTSHIFTEQUAL;
_compile['RIGHTSHIFTEQUAL'] = tokenizer.RIGHTSHIFTEQUAL;
_compile['DOUBLESTAREQUAL'] = tokenizer.DOUBLESTAREQUAL;
_compile['DOUBLESLASH'] = tokenizer.DOUBLESLASH;
_compile['DOUBLESLASHEQUAL'] = tokenizer.DOUBLESLASHEQUAL;
_compile['AT'] = tokenizer.AT;
_compile['ATEQUAL'] = tokenizer.ATEQUAL;
_compile['RARROW'] = tokenizer.RARROW;
_compile['ELLIPSIS'] = tokenizer.ELLIPSIS;
_compile['OP'] = tokenizer.OP;
_compile['AWAIT'] = tokenizer.AWAIT;
_compile['ASYNC'] = tokenizer.ASYNC;
_compile['ERRORTOKEN'] = tokenizer.ERRORTOKEN;
_compile['N_TOKENS'] = tokenizer.N_TOKENS;
_compile['NT_OFFSET'] = tokenizer.NT_OFFSET;

_compile['Tokenizer'] = tokenizer.Tokenizer;

module.exports = _compile;