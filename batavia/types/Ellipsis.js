var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass

/*************************************************************************
 * A Python ellipsis type
 *************************************************************************/

function Ellipsis(args, kwargs) {
    PyObject.call(this)
}

create_pyclass(Ellipsis, 'ellipsis')

/**************************************************
 * Module exports
 **************************************************/

module.exports = Ellipsis
