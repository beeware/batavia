var PyObject = require('../core').Object;
var Type = require('../core').Type;

/*************************************************************************
 * A Python module type
 *************************************************************************/

function Module(name, locals) {
    PyObject.call(this);

    this.__name__ = name;
    for (var key in locals) {
        if (locals.hasOwnProperty(key)) {
            this[key] = locals[key];
        }
    }
}

Module.prototype = Object.create(PyObject.prototype);
Module.prototype.__class__ = new Type('module');
Module.prototype.constructor = Module;

/**************************************************
 * Module exports
 **************************************************/

module.exports = Module;
