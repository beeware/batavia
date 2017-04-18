var create_pyclass = require('../core').create_pyclass
var JSDict = require('./JSDict')

/*************************************************************************
 * A Python module type
 *************************************************************************/

function Module(name, filename, pkg) {
    JSDict.call(this)

    this.__name__ = name
    this.__file__ = filename
    this.__package__ = pkg
}

Module.prototype = Object.create(JSDict.prototype)
create_pyclass(Module, 'module', true)

/**************************************************
 * Module exports
 **************************************************/

module.exports = Module
