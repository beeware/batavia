var PyObject = require('../core').Object;
var Type = require('../core').Type;
var JSDict = require('./JSDict');

/*************************************************************************
 * A Python module type
 *************************************************************************/

function Module(name, filename, pkg) {
    JSDict.call(this);

    this.__name__ = name;
    this.__file__ = filename;
    this.__package__ = pkg;
}

Module.prototype = Object.create(JSDict.prototype);
Module.prototype.__class__ = new Type('module');
Module.prototype.constructor = Module;

/**************************************************
 * Module exports
 **************************************************/

module.exports = Module;
