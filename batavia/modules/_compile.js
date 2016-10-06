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
