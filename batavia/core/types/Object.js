/*************************************************************************
 * A base Python object
 *************************************************************************/
function PyObject(args, kwargs) {
    Object.call(this);
    if (args) {
        this.update(args);
    }
}

PyObject.prototype = Object.create(Object.prototype);

module.exports = PyObject;
