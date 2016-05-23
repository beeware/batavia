
/*************************************************************************
 * A Python list type
 *************************************************************************/

batavia.types.List = function() {
    function List() {
        if (arguments.length === 0) {
            this.push.apply(this);
        } else if (arguments.length === 1) {
            this.push.apply(this, arguments[0]);
        } else {
            throw new batavia.builtins.TypeError('list() takes at most 1 argument (' + arguments.length + ' given)');
        }
    }

    function Array() {}

    Array.prototype = [];

    List.prototype = Object.create(Array.prototype);
    List.prototype.length = 0;

    List.prototype.constructor = List;

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    List.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    List.prototype.__iter__ = function() {
        return new List.prototype.ListIterator(this);
    };

    List.prototype.__len__ = function () {
        return this.length;
    };

    List.prototype.__repr__ = function() {
        return this.__str__();
    };

    List.prototype.__str__ = function() {
        return '[' + this.map(function(obj) {
                return batavia.builtins.repr([obj], null);
            }).join(', ') + ']';
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    List.prototype.__le__ = function(args, kwargs) {
        return this.valueOf() <= args[0];
    };

    List.prototype.__eq__ = function(args, kwargs) {
        return this.valueOf() == args[0];
    };

    List.prototype.__ne__ = function(args, kwargs) {
        return this.valueOf() != args[0];
    };

    List.prototype.__gt__ = function(args, kwargs) {
        return this.valueOf() > args[0];
    };

    List.prototype.__ge__ = function(args, kwargs) {
        return this.valueOf() >= args[0];
    };

    List.prototype.__contains__ = function(args, kwargs) {
        return this.valueOf().index(args[0]) !== -1;
    };

    /**************************************************
     * Methods
     **************************************************/

    List.prototype.append = function(value) {
        this.push(value);
    };

    List.prototype.extend = function(values) {
        if (values.length > 0) {
            this.push.apply(this, values);
        }
    };

    /**************************************************
     * List Iterator
     **************************************************/

    List.prototype.ListIterator = function (data) {
        Object.call(this);
        this.index = 0;
        this.data = data;
    };

    List.prototype.ListIterator.prototype = Object.create(Object.prototype);

    List.prototype.ListIterator.prototype.__next__ = function() {
        var retval = this.data[this.index];
        if (retval === undefined) {
            throw new batavia.builtins.StopIteration();
        }
        this.index++;
        return retval;
    };

    List.prototype.ListIterator.prototype.__str__ = function() {
        return "<list_iterator object at 0x99999999>";
    };

    List.prototype.ListIterator.prototype.constructor = List.prototype.ListIterator;

    /**************************************************/

    return List;
}();
