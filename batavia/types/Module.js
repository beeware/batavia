var pytypes = require('./Type');

module.exports = function() {
    function Module(name, locals) {
        pytypes.Object.call(init);

        this.__name__ = name;
        for (var key in locals) {
            if (locals.hasOwnProperty(key)) {
                this[key] = locals[key];
            }
        }
    }

    Module.prototype = Object.create(pytypes.Object.prototype);
    Module.prototype.__class__ = new pytypes.Type('module');

    return Module;
}();
