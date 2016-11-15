var pytypes = require('./Type');

/*************************************************************************
 * A Python filter builtin is a type
 *************************************************************************/

module.exports = function() {
    var builtins = require('../core/builtins');
    var utils = require('../utils');

    function filter(args, kwargs) {
        pytypes.Object.call(this);

        if (args.length < 2) {
            throw new builtins.TypeError("filter expected 2 arguments, got " + args.length);
        }
        this._func = args[0];
        this._sequence = args[1];
    }

    filter.prototype = Object.create(pytypes.Object.prototype);
    filter.prototype.__class__ = new pytypes.Type('filter');

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    filter.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    filter.prototype.__iter__ = function() {
        return this;
    };

    filter.prototype.__next__ = function() {
        if (!this._iter) {
            this._iter = builtins.iter([this._sequence], null);
        }
        if (!builtins.callable([this._func], null)) {
            throw new builtins.TypeError(
              builtins.type(this._func).__name__ + "' object is not callable");
        }

        var sval = false;
        do {
            sval = utils.run_callable(this._iter, this._iter.__next__, [], null);
        } while (!utils.run_callable(false, this._func, [sval], null));

        return sval;
    };

    filter.prototype.__str__ = function() {
        return "<filter object at 0x99999999>";
    };

    /**************************************************/

    return filter;
}();
