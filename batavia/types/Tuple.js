
/*************************************************************************
 * A Python Tuple type
 *************************************************************************/

batavia.types.Tuple = function() {
    function Tuple(length){
        if (arguments.length === 0) {
            this.push.apply(this);
        } else if (arguments.length === 1) {
            this.push.apply(this, arguments[0]);
        } else {
            throw new batavia.builtins.TypeError('tuple() takes at most 1 argument (' + arguments.length + ' given)');
        }
    }

    function Array() {}

    Array.prototype = [];

    Tuple.prototype = Object.create(Array.prototype);
    Tuple.prototype.length = 0;

    Tuple.prototype.__len__ = function () {
        return this.length;
    };

    Tuple.prototype.toString = function() {
        return this.__str__();
    };

    Tuple.prototype.__str__ = function() {
        return '(' + this.map(function(obj) {
                return batavia.builtins.repr([obj], null);
            }).join(', ') + ')';
    };

    Tuple.prototype.__iter__ = function() {
        return new Tuple.prototype.TupleIterator(this);
    };

    Tuple.prototype.constructor = Tuple;

    /**************************************************
     * Tuple Iterator
     **************************************************/

    Tuple.prototype.TupleIterator = function (data) {
        Object.call(this);
        this.index = 0;
        this.data = data;
    };

    Tuple.prototype.TupleIterator.prototype = Object.create(Object.prototype);

    Tuple.prototype.TupleIterator.prototype.__next__ = function() {
        var retval = this.data[this.index];
        if (retval === undefined) {
            throw new batavia.builtins.StopIteration();
        }
        this.index++;
        return retval;
    };

    Tuple.prototype.TupleIterator.prototype.__str__ = function() {
        return "<tuple_iterator object at 0x99999999>";
    };

    /**************************************************/

    return Tuple;
}();
