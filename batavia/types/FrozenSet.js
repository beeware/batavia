
/*************************************************************************
 * A Python FrozenSet type
 *************************************************************************/

batavia.types.FrozenSet = function() {
    function FrozenSet(args, kwargs) {
        Object.call(this);
        if (args) {
            // Fast-path for native Array objects.
            if (batavia.isArray(args)) {
                for (var i = 0; i < args.length; i++) {
                    this[args[i]] = args[i];
                }
            } else if (batavia.isinstance(args, [batavia.types.FrozenSet, batavia.types.List, batavia.types.Set, batavia.types.Str, batavia.types.Tuple])) {
                var iterobj = batavia.builtins.iter([args], null);
                var self = this;
                batavia.iter_for_each(iterobj, function(val) {
                    self[val] = val;
                });
            } else {
                throw new batavia.builtins.TypeError("'" + batavia.type_name(args) + "' object is not iterable");
            }
        }
    }

    FrozenSet.prototype = Object.create(batavia.types.Object.prototype);
    FrozenSet.prototype.__class__ = new batavia.types.Type('frozenset');

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    FrozenSet.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    FrozenSet.prototype.__bool__ = function() {
        return Object.keys(this).length > 0;
    };

    FrozenSet.prototype.__iter__ = function() {
        return new FrozenSet.prototype.SetIterator(this);
    };

    FrozenSet.prototype.__repr__ = function() {
        return this.__str__();
    };

    FrozenSet.prototype.__str__ = function() {
        if (Object.keys(this).length == 0) {
            return "frozenset()";
        }
        var result = "frozenset({", values = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                values.push(batavia.builtins.repr([this[key]], null));
            }
        }
        result += values.join(', ');
        result += "})";
        return result;
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    FrozenSet.prototype.__lt__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                        batavia.types.List, batavia.types.Int, batavia.types.Range,
                        batavia.types.Str, batavia.types.Tuple
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: frozenset() < " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() < other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: frozenset() < NoneType()");
        }
    };

    FrozenSet.prototype.__le__ = function(other) {
        if (other !== null) {
            if (batavia.isinstance(other, [
                        batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                        batavia.types.List, batavia.types.Int, batavia.types.Range,
                        batavia.types.Str, batavia.types.Tuple
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: frozenset() <= " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() <= other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: frozenset() <= NoneType()");
        }
    };

    FrozenSet.prototype.__eq__ = function(other) {
        if (!batavia.isinstance(other, [batavia.types.FrozenSet, batavia.types.Set])) {
            return new batavia.types.Bool(false);
        }
        if (Object.keys(this).length != Object.keys(other).length) {
            return new batavia.types.Bool(false);
        }
        var iterobj = batavia.builtins.iter([this], null);
        var equal = true;
        batavia.iter_for_each(iterobj, function(val) {
            equal = equal && other.__contains__(val);
        });

        return new batavia.types.Bool(equal);
    };

    FrozenSet.prototype.__ne__ = function(other) {
        return this.__eq__(other).__not__();
    };

    FrozenSet.prototype.__gt__ = function(other) {
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

    FrozenSet.prototype.__ge__ = function(other) {
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

    FrozenSet.prototype.__contains__ = function(other) {
        return this.hasOwnProperty(other) && this[other].__eq__(other);
    };


    /**************************************************
     * Unary operators
     **************************************************/

    FrozenSet.prototype.__not__ = function() {
        return this.__bool__().__not__();
    };

    /**************************************************
     * Binary operators
     **************************************************/

    FrozenSet.prototype.__pow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("FrozenSet.__pow__ has not been implemented");
    };

    FrozenSet.prototype.__div__ = function(other) {
        throw new batavia.builtins.NotImplementedError("FrozenSet.__div__ has not been implemented");
    };

    FrozenSet.prototype.__floordiv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'frozenset' and '" + batavia.type_name(other) + "'");
    };

    FrozenSet.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'frozenset' and '" + batavia.type_name(other) + "'");
    };

    FrozenSet.prototype.__mul__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'frozenset' and '" + batavia.type_name(other) + "'");
    };

    FrozenSet.prototype.__mod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("FrozenSet.__mod__ has not been implemented");
    };

    FrozenSet.prototype.__add__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'frozenset' and '" + batavia.type_name(other) + "'");
    };

    FrozenSet.prototype.__sub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("FrozenSet.__sub__ has not been implemented");
    };

    FrozenSet.prototype.__getitem__ = function(other) {
        throw new batavia.builtins.NotImplementedError("FrozenSet.__getitem__ has not been implemented");
    };

    FrozenSet.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("FrozenSet.__lshift__ has not been implemented");
    };

    FrozenSet.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("FrozenSet.__rshift__ has not been implemented");
    };

    FrozenSet.prototype.__and__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.FrozenSet, batavia.types.Set])){
            var both = [];
            var iterobj = batavia.builtins.iter([this], null);
            batavia.iter_for_each(iterobj, function(val) {
                if (other.__contains__(val)) {
                    both.push(val);
                }
            });
            return new FrozenSet(both);
        }
        throw new batavia.builtins.TypeError("unsupported operand type(s) for &: 'frozenset' and '" + batavia.type_name(other) + "'");
    };

    FrozenSet.prototype.__xor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("FrozenSet.__xor__ has not been implemented");
    };

    FrozenSet.prototype.__or__ = function(other) {
        throw new batavia.builtins.NotImplementedError("FrozenSet.__or__ has not been implemented");
    };

    /**************************************************
     * Set Iterator
     **************************************************/

    FrozenSet.prototype.SetIterator = function (data) {
        Object.call(this);
        this.index = 0;
        this.data = data;
        this.keys = Object.keys(data);
    };

    FrozenSet.prototype.SetIterator.prototype = Object.create(Object.prototype);

    FrozenSet.prototype.SetIterator.prototype.__next__ = function() {
        var key = this.keys[this.index];
        if (key === undefined) {
            throw new batavia.builtins.StopIteration();
        }
        var retval = this.data[key];
        this.index++;
        return retval;
    };

    FrozenSet.prototype.SetIterator.prototype.__str__ = function() {
        return "<set_iterator object at 0x99999999>";
    };

    /**************************************************/

    return FrozenSet;
}();
