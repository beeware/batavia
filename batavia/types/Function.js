var PyObject = require('../core').Object;
var Type = require('../core').Type;

/*************************************************************************
 * A Python function type.
 *************************************************************************/

function Function(name, code, globals, defaults, closure, vm) {
    var types = require('../types');
    var inspect = require('../modules/inspect');

    PyObject.call(this);

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
    this.__dict__ = new types.Dict();
    this.__annotations__ = new types.Dict();
    this.__qualname__ = this.__name__;

    // var kw = {
    //     'argdefs': this.__defaults__,
    // }
    // if (closure) {
    //     kw['closure'] = tuple(make_cell(0) for _ in closure)
    // }

    this.__call__ = utils.make_callable(this);

    this.argspec = inspect.getfullargspec(this);
}

Function.prototype = Object.create(PyObject.prototype);
Function.prototype.__class__ = new Type('function');
Function.prototype.constructor = Function;

/**************************************************
 * Module exports
 **************************************************/

module.exports = Function;
