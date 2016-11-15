var types = require('./Type');

module.exports = function() {
    function Module(name, locals) {
        types.Object.call(this);

        this.__name__ = name;
        for (var key in locals) {
            if (locals.hasOwnProperty(key)) {
                this[key] = locals[key];
            }
        }
    }

    Module.prototype = Object.create(types.Object.prototype);
    Module.prototype.__class__ = new types.Type('module');

    return Module;
}();
