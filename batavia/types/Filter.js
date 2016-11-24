var PyObject = require('../core').Object;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;

/*************************************************************************
 * A Python filter builtin is a type
 *************************************************************************/

function filter(args, kwargs) {
    PyObject.call(this);

    if (args.length < 2) {
        throw new exceptions.TypeError("filter expected 2 arguments, got " + args.length);
    }
    this._func = args[0];
    this._sequence = args[1];
}

filter.prototype = Object.create(PyObject.prototype);
filter.prototype.__class__ = new Type('filter');
filter.prototype.constructor = filter;

/**************************************************
 * Javascript compatibility methods
 **************************************************/

filter.prototype.toString = function() {
    return this.__str__();
};

/**************************************************
 * Type conversions
 **************************************************/

filter.prototype.__iter__ = function() {
    return this;
};

filter.prototype.__next__ = function() {
    if (!this._iter) {
        this._iter = builtins.iter([this._sequence], null);
    }
    if (!builtins.callable([this._func], null)) {
        throw new exceptions.TypeError(type_name(this._func) + "' object is not callable");
    }

    var sval = false;
    do {
        sval = utils.run_callable(this._iter, this._iter.__next__, [], null);
    } while (!utils.run_callable(false, this._func, [sval], null));

    return sval;
};

filter.prototype.__str__ = function() {
    return "<filter object at 0x99999999>";
};

/**************************************************
 * Module exports
 **************************************************/

module.exports = filter;
