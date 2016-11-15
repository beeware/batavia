var types = require('./Type');

/*************************************************************************
 * A Python map builtin is a type
 *************************************************************************/

module.exports = function() {
    var utils = require('../utils');

    function map(args, kwargs) {
        types.Object.call(this);

        if (args.length < 2) {
            throw new batavia.builtins.TypeError("map expected 2 arguments, got " + args.length);
        }
        this._func = args[0];
        this._sequence = args[1];
    }

    map.prototype = Object.create(types.Object.prototype);
    map.prototype.__class__ = new types.Type('map');

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    map.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    map.prototype.__iter__ = function() {
        return this;
    };

    map.prototype.__next__ = function() {
        if (!this._iter) {
            this._iter = batavia.builtins.iter([this._sequence], null);
        }
        if (!batavia.builtins.callable([this._func], null)) {
            throw new batavia.builtins.TypeError(
              utils.type_name(this._func) + "' object is not callable");
        }

        var sval = utils.run_callable(this._iter, this._iter.__next__, [], null);
        return utils.run_callable(false, this._func, [sval], null);
    };

    map.prototype.__str__ = function() {
        return "<map object at 0x99999999>";
    };

    /**************************************************/

    return map;
}();
