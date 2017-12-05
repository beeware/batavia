var exceptions = require('../core').exceptions

function compile(args, kwargs) {
    var _compile = require('../modules/_compile/_compile')

    if (args.length < 3) {
        var argument_names = ['source', 'filename', 'mode']
        throw new exceptions.TypeError.$pyclass('Required argument \'' + argument_names[args.length] + '\' (pos ' + (args.length + 1) + ') not found')
    }

    var source = args[0]
    var filename = args[1]
    var mode = args[2]
    // var flags = args[3];
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
        throw new exceptions.ValueError.$pyclass("compile() mode must be 'exec', 'eval' or 'single'")
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
compile.__doc__ = "compile(source, filename, mode[, flags[, dont_inherit]]) -> code object\n\nCompile the source (a Python module, statement or expression)\ninto a code object that can be executed by exec() or eval().\nThe filename will be used for run-time error messages.\nThe mode must be 'exec' to compile a module, 'single' to compile a\nsingle (interactive) statement, or 'eval' to compile an expression.\nThe flags argument, if present, controls which future statements influence\nthe compilation of the code.\nThe dont_inherit argument, if non-zero, stops the compilation inheriting\nthe effects of any future statements in effect in the code calling\ncompile; if absent or zero these statements do influence the compilation,\nin addition to any features explicitly specified."

module.exports = compile
