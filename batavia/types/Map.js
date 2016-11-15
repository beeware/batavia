var pytypes = require('./Type');

/*************************************************************************
 * A Python map builtin is a type
 *************************************************************************/

module.exports = function() {
    var builtins = require('../core/builtins');
    var utils = require('../utils');

    function map(args, kwargs) {
        pytypes.Object.call(this);

        if (args.length < 2) {
            throw new builtins.TypeError("map expected 2 arguments, got " + args.length);
        }
        this._func = args[0];
        this._sequence = args[1];
    }

    map.prototype = Object.create(pytypes.Object.prototype);
    map.prototype.__class__ = new pytypes.Type('map');

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
            this._iter = builtins.iter([this._sequence], null);
        }
        if (!builtins.callable([this._func], null)) {
            throw new builtins.TypeError(
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
}()
