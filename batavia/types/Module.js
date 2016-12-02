
batavia.types.Module = function() {
    function Module(name, filename, package) {
        this.__name__ = name;
        this.__file__ = filename;
        this.__package__ = package;
    }

    Module.prototype = Object.create(batavia.types.JSDict.prototype);
    Module.prototype.__class__ = new batavia.types.Type('module');

    return Module;
}();
