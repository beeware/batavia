import { PyValueError } from '../core/exceptions'
import { _compile } from '../modules'

export default function compile(source, filename, mode, flags, dont_inherit) {
    var cf = null // compiler flags
    var start = [
        _compile.Py_file_input,
        _compile.Py_eval_input,
        _compile.Py_single_input
    ]

    var compile_mode
    if (mode === 'exec') {
        compile_mode = 0
    } else if (mode === 'eval') {
        compile_mode = 1
    } else if (mode === 'single') {
        compile_mode = 2
    } else {
        throw new PyValueError("compile() mode must be 'exec', 'eval' or 'single'")
    }

    var ast_check = _compile.ast_check(source)
    if (ast_check < 0) {
        return null
    }
    if (ast_check === 0) {
        // this is a string
        return _compile.compile_string_object(source, filename, start[compile_mode], cf, false)
    }
    // parse the AST
    var mod = _compile.ast_obj2mod(source, compile_mode)
    if (mod === null) {
        return null
    }
    if (!_compile.ast_validate(mod)) {
        return null
    }
    return _compile.ast_compile_object(mod, filename, cf, false)
}

compile.__name__ = 'compile'
compile.__doc__ = `compile(source, filename, mode[, flags[, dont_inherit]]) -> code object

Compile the source (a Python module, statement or expression)
into a code object that can be executed by exec() or eval().
The filename will be used for run-time error messages.
The mode must be 'exec' to compile a module, 'single' to compile a
single (interactive) statement, or 'eval' to compile an expression.
The flags argument, if present, controls which future statements influence
the compilation of the code.
The dont_inherit argument, if non-zero, stops the compilation inheriting
the effects of any future statements in effect in the code calling
compile; if absent or zero these statements do influence the compilation,
in addition to any features explicitly specified.`
compile.$pyargs = {
    args: ['source', 'filename', 'mode'],
    default_args: ['flags', 'dont_inherit'],
    missing_args_error: (e) => `Required argument '${e.arg}' (pos ${e.argpos}) not found`
}
