
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
    List.__name__ = 'list';
  
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

    List.prototype.__lt__ = function(other) {
        return this.valueOf() <= other;
    };

    List.prototype.__le__ = function(other) {
        return this.valueOf() <= other;
    };

    List.prototype.__eq__ = function(other) {
        return this.valueOf() == other;
    };

    List.prototype.__ne__ = function(other) {
        return this.valueOf() != other;
    };

    List.prototype.__gt__ = function(other) {
        return this.valueOf() > other;
    };

    List.prototype.__ge__ = function(other) {
        return this.valueOf() >= other;
    };

    List.prototype.__contains__ = function(other) {
        return this.valueOf().index(other) !== -1;
    };

    /**************************************************
     * Unary operators
     **************************************************/

    List.prototype.__pos__ = function() {
        return new List(+this.valueOf());
    };

    List.prototype.__neg__ = function() {
        return new List(-this.valueOf());
    };

    List.prototype.__not__ = function() {
        return new List(!this.valueOf());
    };

    List.prototype.__invert__ = function() {
        return new List(~this.valueOf());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    List.prototype.__pow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__pow__ has not been implemented");
    };

    List.prototype.__div__ = function(other) {
        return this.__truediv__(other);
    };

    List.prototype.__floordiv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__mul__ = function(other) {
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

    List.prototype.__mod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__mod__ has not been implemented");
    };

    List.prototype.__add__ = function(other) {
        if (batavia.isinstance(other, batavia.types.List)) {
            return new Int(this.valueOf() + other.valueOf());
        } else {
            throw new batavia.builtins.TypeError('can only concatenate list (not "' + batavia.type_name(other) + '") to list');
        }
    };

    List.prototype.__sub__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__getitem__ = function(index) {
        if (batavia.isinstance(index, batavia.types.Int)) {
            if (index.valueOf() < 0) {
                if (-index.valueOf() > this.length) {
                    throw new batavia.builtins.IndexError("list index out of range");
                } else {
                    return this[this.length + index];
                }
            } else {
                if (index.valueOf() >= this.length) {
                    throw new batavia.builtins.IndexError("list index out of range");
                } else {
                    return this[index];
                }
            }
        } else if (batavia.isinstance(index, batavia.types.Slice)) {
            var start, stop, step;
            start = index.start.valueOf();

            if (index.stop === null) {
                stop = this.length;
            } else {
                stop = index.stop.valueOf();
            }

            step = index.step.valueOf();

            if (step != 1) {
                throw new batavia.builtins.NotImplementedError("List.__getitem__ with a stepped slice has not been implemented");
            }

            return new List(Array.prototype.slice.call(this, start, stop));
        } else {
            var msg = "list indices must be integers or slices, not ";
            if (batavia.BATAVIA_MAGIC == batavia.BATAVIA_MAGIC_34) {
                msg = "list indices must be integers, not ";
            }
            throw new batavia.builtins.TypeError(msg + batavia.type_name(index));
        }
    };

    List.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__lshift__ has not been implemented");
    };

    List.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__rshift__ has not been implemented");
    };

    List.prototype.__and__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__and__ has not been implemented");
    };

    List.prototype.__xor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__xor__ has not been implemented");
    };

    List.prototype.__or__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__or__ has not been implemented");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    List.prototype.__idiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__idiv__ has not been implemented");
    };

    List.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__ifloordiv__ has not been implemented");
    };

    List.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__itruediv__ has not been implemented");
    };

    List.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__iadd__ has not been implemented");
    };

    List.prototype.__isub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__isub__ has not been implemented");
    };

    List.prototype.__imul__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__imul__ has not been implemented");
    };

    List.prototype.__imod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__imod__ has not been implemented");
    };

    List.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__ipow__ has not been implemented");
    };

    List.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__ilshift__ has not been implemented");
    };

    List.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__irshift__ has not been implemented");
    };

    List.prototype.__iand__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__iand__ has not been implemented");
    };

    List.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__ixor__ has not been implemented");
    };

    List.prototype.__ior__ = function(other) {
        throw new batavia.builtins.NotImplementedError("List.__ior__ has not been implemented");
    };

    /**************************************************
     * Methods
     **************************************************/

    List.prototype.append = function(value) {
        this.push(value);
    };

    List.prototype.copy = function() {
        return new List(this);
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
