var PyObject = require('../core').Object;
var Type = require('../core').Type;

/*************************************************************************
 * A Python dictview type
 *************************************************************************/

function DictView(args, kwargs) {
    PyObject.call(this);
}

DictView.prototype = Object.create(PyObject.prototype);
DictView.prototype.__class__ = new Type('dictview');
DictView.prototype.constructor = DictView;

/**************************************************
 * Module exports
 **************************************************/

module.exports = DictView;
