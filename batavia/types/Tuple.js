
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

    Tuple.prototype.constructor = Tuple;
    Tuple.__name__ = 'tuple';
    
    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Tuple.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Tuple.prototype.__iter__ = function() {
        return new Tuple.prototype.TupleIterator(this);
    };

    Tuple.prototype.__len__ = function () {
        return this.length;
    };

    Tuple.prototype.__repr__ = function() {
        return this.__str__();
    };

    Tuple.prototype.__str__ = function() {
        return '(' + this.map(function(obj) {
                return batavia.builtins.repr([obj], null);
            }).join(', ') + ')';
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Tuple.prototype.__lt__ = function(other) {
        return this.valueOf() < other;
    };

    Tuple.prototype.__le__ = function(other) {
        return this.valueOf() <= other;
    };

    Tuple.prototype.__eq__ = function(other) {
        return this.valueOf() == other;
    };

    Tuple.prototype.__ne__ = function(other) {
        return this.valueOf() != other;
    };

    Tuple.prototype.__gt__ = function(other) {
        return this.valueOf() > other;
    };

    Tuple.prototype.__ge__ = function(other) {
        return this.valueOf() >= other;
    };

    Tuple.prototype.__contains__ = function(other) {
        return this.valueOf().index(other) !== -1;
    };

    /**************************************************
     * Unary operators
     **************************************************/

    Tuple.prototype.__pos__ = function() {
        return new Tuple(+this.valueOf());
    };

    Tuple.prototype.__neg__ = function() {
        return new Tuple(-this.valueOf());
    };

    Tuple.prototype.__not__ = function() {
        return new Tuple(!this.valueOf());
    };

    Tuple.prototype.__invert__ = function() {
        return new Tuple(~this.valueOf());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Tuple.prototype.__pow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__pow__ has not been implemented");
    };

    Tuple.prototype.__div__ = function(other) {
        return this.__truediv__(other);
    };

    Tuple.prototype.__floordiv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'tuple' and '" + batavia.type_name(other) + "'");
    };

    Tuple.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'tuple' and '" + batavia.type_name(other) + "'");
    };

    Tuple.prototype.__mul__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Int)) {
            result = new List();
            for (i = 0; i < other.valueOf(); i++) {
                result.extend(this);
            }
            return result;
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other.valueOf()) {
                return this.copy();
            } else {
                return new List();
            }
        } else {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type '" + batavia.type_name(other) + "'");
        }
    };

    Tuple.prototype.__mod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__mod__ has not been implemented");
    };

    Tuple.prototype.__add__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__add__ has not been implemented");
    };

    Tuple.prototype.__sub__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'tuple' and '" + batavia.type_name(other) + "'");
    };

    Tuple.prototype.__getitem__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__getitem__ has not been implemented");
    };

    Tuple.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__lshift__ has not been implemented");
    };

    Tuple.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__rshift__ has not been implemented");
    };

    Tuple.prototype.__and__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__and__ has not been implemented");
    };

    Tuple.prototype.__xor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__xor__ has not been implemented");
    };

    Tuple.prototype.__or__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__or__ has not been implemented");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    Tuple.prototype.__idiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__idiv__ has not been implemented");
    };

    Tuple.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__ifloordiv__ has not been implemented");
    };

    Tuple.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__itruediv__ has not been implemented");
    };

    Tuple.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__iadd__ has not been implemented");
    };

    Tuple.prototype.__isub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__isub__ has not been implemented");
    };

    Tuple.prototype.__imul__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__imul__ has not been implemented");
    };

    Tuple.prototype.__imod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__imod__ has not been implemented");
    };

    Tuple.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__ipow__ has not been implemented");
    };

    Tuple.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__ilshift__ has not been implemented");
    };

    Tuple.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__irshift__ has not been implemented");
    };

    Tuple.prototype.__iand__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__iand__ has not been implemented");
    };

    Tuple.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__ixor__ has not been implemented");
    };

    Tuple.prototype.__ior__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Tuple.__ior__ has not been implemented");
    };

    /**************************************************
     * Methods
     **************************************************/

    Tuple.prototype.copy = function() {
        return new Tuple(this);
    };

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
