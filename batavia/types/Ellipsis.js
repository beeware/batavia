var PyObject = require('../core').Object;
var Type = require('../core').Type;

/*************************************************************************
 * A Python ellipsis type
 *************************************************************************/

function Ellipsis(args, kwargs) {
    PyObject.call(this);
}

Ellipsis.prototype = Object.create(PyObject.prototype);
Ellipsis.prototype.__class__ = new Type('ellipsis');
Ellipsis.prototype.__class__.$pyclass = Ellipsis;

/**************************************************
 * Module exports
 **************************************************/

module.exports = Ellipsis;
