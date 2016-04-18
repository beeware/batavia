
batavia.core.Function = function(name, code, globals, defaults, closure, vm) {
    this.__python__ = true;
    this._vm = vm;
    this.__code__ = code;
    this.__globals__ = globals;
    this.__defaults__ = defaults;
    this.__kwdefaults__ = null;
    this.__closure__ = closure;
    if (code.co_consts.length > 0) {
        this.__doc__ = code.co_consts[0];
    } else {
        this.__doc__ = null;
    }
    this.__name__ = name || code.co_name;
    this.__dict__ = new batavia.core.Dict();
    this.__annotations__ = new batavia.core.Dict();
    this.__qualname__ = this.__name__;

    // var kw = {
    //     'argdefs': this.__defaults__,
    // }
    // if (closure) {
    //     kw['closure'] = tuple(make_cell(0) for _ in closure)
    // }

    this.__call__ = batavia.make_callable(this);

    this.argspec = batavia.modules.inspect.getfullargspec(this);
};


batavia.core.Method = function(instance, func) {
    batavia.core.Function.call(this, func.__name__, func.__code__, func.__globals__, func.__closure__, func._vm);
    this.__self__ = instance;
    this.__func__ = func;
    this.__class__ = instance.__proto__;
};

batavia.core.Method.prototype = Object.create(Function.prototype);


batavia.core.Module = function(name, locals) {
    this.__name__ = name;
    for (var key in locals) {
        if (locals.hasOwnProperty(key)) {
            this[key] = locals[key];
        }
    }
};
