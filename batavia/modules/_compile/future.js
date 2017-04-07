var ast = require('./ast/Python-ast')


var future_parse = function(ff, mod, filename) {
    var i = 0
    var done = 0
    var prev_line = 0
    var first // stmt_ty

    if (!(mod.kind == Module_kind || mod.kind == Interactive_kind)) {
        return 1
    }

    if (ast.asdl_seq_LEN(mod.v.Module.body) == 0) {
        return 1
    }

    /* A subsequent pass will detect future imports that don't
       appear at the beginning of the file.  There's one case,
       however, that is easier to handle here: A series of imports
       joined by semi-colons, where the first import is a future
       statement but some subsequent import has the future form
       but is preceded by a regular import.
    */

    i = 0
    first = ast.asdl_seq_GET(mod.v.Module.body, i)
    if (first.kind == Expr_kind
        && (first.v.Expr.value.kind == Str_kind
            || (first.v.Expr.value.kind == Constant_kind
                && PyUnicode_CheckExact(first.v.Expr.value.v.Constant.value)))) {
        i++
    }

    for (; i < ast.asdl_seq_LEN(mod.v.Module.body); i++) {
        var s = ast.asdl_seq_GET(mod.v.Module.body, i)

        if (done && s.lineno > prev_line) {
            return 1
        }
        prev_line = s.lineno

        /* The tests below will return from this function unless it is
           still possible to find a future statement.  The only things
           that can precede a future statement are another future
           statement and a doc string.
        */

        if (s.kind == ImportFrom_kind) {
            var modname = s.v.ImportFrom.module
            if (modname &&
                !PyUnicode_CompareWithASCIIString(modname, "__future__")) {
                if (done) {
                    PyErr_SetString(PyExc_SyntaxError, ERR_LATE_FUTURE)
                    PyErr_SyntaxLocationObject(filename, s.lineno, s.col_offset)
                    return 0
                }
                if (!future_check_features(ff, s, filename)) {
                    return 0
                }
                ff.ff_lineno = s.lineno
            } else {
                done = 1
            }
        } else {
            done = 1
        }
    }
    return 1
}

var PyFuture_FromASTObject = function(mod, filename) {
    var ff = {
      ff_features: 0,
      ff_lineno: -1
    }

    if (!future_parse(ff, mod, filename)) {
        return null
    }
    return ff
}

module.exports = {
    PyFuture_FromASTObject: PyFuture_FromASTObject
}
