
batavia.make_callable = function(func) {
    return function(args, kwargs) {
        var callargs = batavia.modules.inspect.getcallargs(func._func, args, kwargs);

        var frame = func._vm.make_frame({
            'code': func.func_code,
            'callargs': callargs,
            'f_globals': func.func_globals,
            'f_locals': {},
        });

        if (func.func_code.co_flags & dis.CO_GENERATOR) {
            gen = new batavia.Generator(frame, self._vm);
            frame.generator = gen;
            retval = gen;
        } else {
            retval = func._vm.run_frame(frame);
        }
        return retval;
    };
};

batavia.core.Function = function(name, code, globals, defaults, closure, vm) {
    this._vm = vm;
    this.func_code = code;
    this.func_name = this.__name__ = name || code.co_name;
    this.func_defaults = defaults;
    this.func_globals = globals;
    this.func_locals = this._vm.frame.f_locals;
    this.__dict__ = {};
    this.func_closure = closure;
    if (code.co_consts.length > 0) {
        this.__doc__ = code.co_consts[0];
    } else {
        this.__doc__ = null;
    }

    // var kw = {
    //     'argdefs': this.func_defaults,
    // }
    // if (closure) {
    //     kw['closure'] = tuple(make_cell(0) for _ in closure)
    // }

    this.__call__ = batavia.make_callable(this);

    this.argspec = batavia.modules.inspect.getfullargspec(this);
};
