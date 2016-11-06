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
        throw new batavia.builtins.NotImplementedError("_compile.ast_check is not implemented yet");
    },
    compile_string_object: function(str, filename, compile_mode, cf, optimize) {
        throw new batavia.builtins.NotImplementedError("_compile.compile_string_object is not implemented yet");
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
        throw new batavia.builtins.NotImplementedError("_compile.ast_compile_object is not implemented yet");
    },

    parse_string_object: function(s, filename, grammar, start, iflags) {
        throw new batavia.builtins.NotImplementedError("_compile.parse_string_object is not implemented yet");
    },
    parsetok: function(tok, g, start, err_ret, flags) {
        throw new batavia.builtins.NotImplementedError("_compile.parsetok is not implemented yet");
    },
    Py_single_input: new batavia.types.Int(256),
    Py_file_input: new batavia.types.Int(257),
    Py_eval_input: new batavia.types.Int(258)
};
