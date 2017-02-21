var PyObject = require('../core').Object;
var Type = require('../core').Type;

/*************************************************************************
 * A Python function type.
 *************************************************************************/

var make_callable = function(func) {
    var types = require('../types');

    var fn = function(args, kwargs, locals) {
        var inspect = require('../modules/inspect');
        var dis = require('../modules/dis');
        var retval;
        var callargs = inspect.getcallargs(func, args, kwargs);

        if (locals === undefined) {
            locals = new types.JSDict();
        }

        var frame = this.make_frame({
            'code': func.__code__,
            'callargs': callargs,
            'f_globals': func.__globals__,
            'f_locals': locals,
        });

        if (func.__code__.co_flags & dis.CO_GENERATOR) {
            frame.generator = new types.Generator(frame, this);
            retval = frame.generator;
        } else {
            retval = this.run_frame(frame);
        }
        return retval;
    };
    fn.$pyargs = true;
    return fn.bind(func.$vm);
}


function Function(name, code, globals, defaults, closure, vm) {
    var types = require('../types');
    var inspect = require('../modules/inspect');

    PyObject.call(this);

    this.$pyargs = true;
    this.$vm = vm;
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
    this.__dict__ = new types.Dict();
    this.__annotations__ = new types.Dict();
    this.__qualname__ = this.__name__;

    // var kw = {
    //     'argdefs': this.__defaults__,
    // }
    // if (closure) {
    //     kw['closure'] = tuple(make_cell(0) for _ in closure)
    // }

    this.__call__ = make_callable(this);

    this.argspec = inspect.getfullargspec(this);
}

Function.prototype = Object.create(PyObject.prototype);
Function.prototype.__class__ = new Type('function');
Function.prototype.__class__.$pyclass = Function;

Function.prototype.__get__ = function(instance, klass) {
    var types = require('../types');

    // Module functions don't need to be bound to the instance as methods.
    if (instance instanceof types.Module) {
        return this;
    }
    return new types.Method(instance, this);
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Function;
