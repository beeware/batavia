
/*************************************************************************
 * A Python filter builtin is a type
 *************************************************************************/

batavia.types.filter = function() {
    function filter(args, kwargs) {
        Object.call(this);
        if (args.length < 2) {
            throw new batavia.builtins.TypeError("filter expected 2 arguments, got " + args.length);
        }
        this._func = args[0];
        this._sequence = args[1];
    }

    filter.prototype = Object.create(Object.prototype);

    filter.prototype.constructor = filter;

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
    }
  
    filter.prototype.__next__ = function() {
        if (!this._iter) {
            this._iter = batavia.builtins.iter([this._sequence], null);
        }
        if (!batavia.builtins.callable([this._func], null)) {
            throw new batavia.builtins.TypeError(
              batavia.builtins.type(this._func).__name__ + "' object is not callable");
        }

        var sval = false;
        do {
            sval = batavia.run_callable(this._iter, this._iter.__next__, [], null);
        } while (!batavia.run_callable(false, this._func, [sval], null));

        return sval;
    }

    filter.prototype.__str__ = function() {
        return "<filter object at 0x99999999>";
    }
  
    /**************************************************/

    return filter;
}();
