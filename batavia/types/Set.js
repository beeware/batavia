
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

    Set.prototype.toString = function() {
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

    Set.prototype.__iter__ = function() {
        return new Set.prototype.SetIterator(this);
    };

    Set.prototype.constructor = Set;

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
