
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
    Set.prototype.__class__ = new batavia.types.Type('set');

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
        if (Object.keys(this).length == 0) {
            return "set()";
        }
        var result = "{", values = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                values.push(batavia.builtins.repr([this[key]], null));
            }
        }
        result += values.join(', ');
        result += "}";
        return result;
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Set.prototype.__lt__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                        batavia.types.List, batavia.types.Int, batavia.types.Range,
                        batavia.types.Str, batavia.types.Tuple
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: set() < " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() < other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: set() < NoneType()");
        }
    };

    Set.prototype.__le__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                        batavia.types.List, batavia.types.Int, batavia.types.Range,
                        batavia.types.Str, batavia.types.Tuple
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: set() <= " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() <= other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: set() <= NoneType()");
        }
    };

    Set.prototype.__eq__ = function(other) {
        return this.valueOf() == other;
    };

    Set.prototype.__ne__ = function(other) {
        return this.valueOf() != other;
    };

    Set.prototype.__gt__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                        batavia.types.List, batavia.types.Int, batavia.types.Range,
                        batavia.types.Str, batavia.types.Tuple
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: set() > " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() > other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: set() > NoneType()");
        }
    };

    Set.prototype.__ge__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                        batavia.types.List, batavia.types.Int, batavia.types.Range,
                        batavia.types.Str, batavia.types.Tuple
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: set() >= " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() >= other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: set() >= NoneType()");
        }
    };

    Set.prototype.__contains__ = function(other) {
        return this.valueOf().hasOwnProperty(other);
    };


    /**************************************************
     * Unary operators
     **************************************************/

    Set.prototype.__pos__ = function() {
        return new Set(+this.valueOf());
    };

    Set.prototype.__neg__ = function() {
        return new Set(-this.valueOf());
    };

    Set.prototype.__not__ = function() {
        return new Set(!this.valueOf());
    };

    Set.prototype.__invert__ = function() {
        return new Set(~this.valueOf());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Set.prototype.__pow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__pow__ has not been implemented");
    };

    Set.prototype.__div__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__div__ has not been implemented");
    };

    Set.prototype.__floordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__floordiv__ has not been implemented");
    };

    Set.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__mul__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__mod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__mod__ has not been implemented");
    };

    Set.prototype.__add__ = function(other) {
		throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__sub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__sub__ has not been implemented");
    };

    Set.prototype.__getitem__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__getitem__ has not been implemented");
    };

    Set.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__lshift__ has not been implemented");
    };

    Set.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__rshift__ has not been implemented");
    };

    Set.prototype.__and__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__and__ has not been implemented");
    };

    Set.prototype.__xor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__xor__ has not been implemented");
    };

    Set.prototype.__or__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__or__ has not been implemented");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    Set.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__ifloordiv__ has not been implemented");
    };

    Set.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__itruediv__ has not been implemented");
    };

    Set.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for +=: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__isub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__isub__ has not been implemented");
    };

    Set.prototype.__imul__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__imul__ has not been implemented");
    };

    Set.prototype.__imod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__imod__ has not been implemented");
    };

    Set.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__ipow__ has not been implemented");
    };

    Set.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__ilshift__ has not been implemented");
    };

    Set.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__irshift__ has not been implemented");
    };

    Set.prototype.__iand__ = function(other) {
        if (other === null || batavia.isinstance(other, [
                batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                batavia.types.List, batavia.types.Int, batavia.types.Range,
                batavia.types.Slice, batavia.types.Str, batavia.types.Tuple
            ])) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for &=: 'set' and '" + batavia.type_name(other) + "'");
        }
        if (batavia.isinstance(other, batavia.types.Set)) {
            var intersection = new Set();
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    if (other.hasOwnProperty(key)) {
                        intersection.add(other[key]);
                    }
                }
            }
            return intersection;
        }
        throw new batavia.builtins.NotImplementedError(
            "Set.__iand__ has not been implemented for type '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__ixor__ has not been implemented");
    };

    Set.prototype.__ior__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__ior__ has not been implemented");
    };

    /**************************************************
     * Methods
     **************************************************/

    Set.prototype.add = function(v) {
        this[v] = v;
    };

    Set.prototype.copy = function() {
        return new Set(this);
    };

    Set.prototype.remove = function(v) {
        delete this[v];
    };

    Set.prototype.update = function(values) {
        for (var value in values) {
            if (values.hasOwnProperty(value)) {
                this[values[value]] = values[value];
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
