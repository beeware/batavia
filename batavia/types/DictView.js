var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass

/*************************************************************************
 * A Python dictview type
 *************************************************************************/

function DictView(args, kwargs) {
    PyObject.call(this)
}

create_pyclass(DictView, 'dictview')

/**************************************************
 * Module exports
 **************************************************/

module.exports = DictView
