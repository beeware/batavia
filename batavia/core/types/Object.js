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

PyObject.prototype.toString = function() {
    return '<' + this.__class__.__name__ + ' 0x...>';
}

module.exports = PyObject;
