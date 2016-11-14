
module.exports = {
    Module: function() {
        function Module(name, locals) {
            this.__name__ = name;
            for (var key in locals) {
                if (locals.hasOwnProperty(key)) {
                    this[key] = locals[key];
                }
            }
        }

        Module.prototype = Object.create(Object.prototype);
        Module.prototype.__class__ = new batavia.types.Type('module');

        return Module;
    }()
};
