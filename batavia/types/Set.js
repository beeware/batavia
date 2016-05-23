
/*************************************************************************
 * A Python Set type
 *************************************************************************/

batavia.types.Set = function() {
    function Set(args, kwargs) {
        Object.call(this);
        if (args) {
            this.update(args);
        }
    }

    Set.prototype = Object.create(Object.prototype);

    Set.prototype.constructor = Set;

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Set.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Set.prototype.__bool__ = function() {
        return this.valueOf().length !== 0;
    };

    Set.prototype.__iter__ = function() {
        return new Set.prototype.SetIterator(this);
    };

    Set.prototype.__repr__ = function() {
        return this.__str__();
    };

    Set.prototype.__str__ = function() {
        var result = "{", values = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                values.push(batavia.builtins.repr(key));
            }
        }
        result += values.join(', ');
        result += "}";
        return result;
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Set.prototype.__le__ = function(args, kwargs) {
        return this.valueOf() <= args[0];
    };

    Set.prototype.__eq__ = function(args, kwargs) {
        return this.valueOf() == args[0];
    };

    Set.prototype.__ne__ = function(args, kwargs) {
        return this.valueOf() != args[0];
    };

    Set.prototype.__gt__ = function(args, kwargs) {
        return this.valueOf() > args[0];
    };

    Set.prototype.__ge__ = function(args, kwargs) {
        return this.valueOf() >= args[0];
    };

    Set.prototype.__contains__ = function(args, kwargs) {
        return this.valueOf().hasOwnProperty(args[0]);
    };

    /**************************************************
     * Methods
     **************************************************/

    Set.prototype.add = function(v) {
        this[v] = null;
    };

    Set.prototype.remove = function(v) {
        delete this[v];
    };

    Set.prototype.update = function(values) {
        for (var value in values) {
            if (values.hasOwnProperty(value)) {
                this[values[value]] = null;
            }
        }
    };

    /**************************************************
     * Set Iterator
     **************************************************/

    Set.prototype.SetIterator = function (data) {
        Object.call(this);
        this.index = 0;
        this.data = data;
    };

    Set.prototype.SetIterator.prototype = Object.create(Object.prototype);

    Set.prototype.SetIterator.prototype.__next__ = function() {
        var retval = this.data[this.index];
        if (retval === undefined) {
            throw new batavia.builtins.StopIteration();
        }
        this.index++;
        return retval;
    };

    Set.prototype.SetIterator.prototype.__str__ = function() {
        return "<set_iterator object at 0x99999999>";
    };

    /**************************************************/

    return Set;
}();
