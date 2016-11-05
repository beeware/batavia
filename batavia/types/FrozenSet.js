
/*************************************************************************
 * A Python FrozenSet type, with an underlying Dict.
 *************************************************************************/

batavia.types.FrozenSet = function() {
    function FrozenSet(args, kwargs) {
        this.data = new batavia.types.Dict();
        if (args) {
            this._update(args);
        }
    }

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
        return this.data.__bool__();
    };

    FrozenSet.prototype.__iter__ = function() {
        return new batavia.types.SetIterator(this);
    };

    FrozenSet.prototype.__repr__ = function() {
        return this.__str__();
    };

    FrozenSet.prototype.__str__ = function() {
        var keys = this.data.keys();
        if (keys.length == 0) {
            return "frozenset()";
        }
        return "frozenset({" +
            keys.map(function(x) { return x.__repr__(); }).join(", ") +
            "})";
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    FrozenSet.prototype.__lt__ = function(other) {
        if (other !== batavia.builtins.None) {
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
        if (other !== batavia.builtins.None) {
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
        if (this.data.keys().length != other.data.keys().length) {
            return new batavia.types.Bool(false);
        }
        var iterobj = batavia.builtins.iter([this], null);
        var equal = true;
        batavia.iter_for_each(iterobj, function(val) {
            equal = equal && other.__contains__(val).valueOf();
        });

        return new batavia.types.Bool(equal);
    };

    FrozenSet.prototype.__ne__ = function(other) {
        return this.__eq__(other).__not__();
    };

    FrozenSet.prototype.__gt__ = function(other) {
        if (other !== batavia.builtins.None) {
            if (batavia.isinstance(other, [
                        batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                        batavia.types.List, batavia.types.Int, batavia.types.Range,
                        batavia.types.Str, batavia.types.Tuple
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: frozenset() > " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() > other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: frozenset() > NoneType()");
        }
    };

    FrozenSet.prototype.__ge__ = function(other) {
        if (other !== batavia.builtins.None) {
            if (batavia.isinstance(other, [
                        batavia.types.Bool, batavia.types.Bytearray, batavia.types.Bytes,
                        batavia.types.Complex, batavia.types.Dict, batavia.types.Float,
                        batavia.types.NotImplementedType, batavia.types.List, batavia.types.Int,
                        batavia.types.Range, batavia.types.Slice, batavia.types.Str,
                        batavia.types.Tuple
                    ])) {
                throw new batavia.builtins.TypeError("unorderable types: frozenset() >= " + batavia.type_name(other) + "()");
            } else {
                return this.valueOf() >= other.valueOf();
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: frozenset() >= NoneType()");
        }
    };

    FrozenSet.prototype.__contains__ = function(other) {
        return this.data.__contains__(other);
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
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'frozenset' and '" + batavia.type_name(other) + "'");
    };

    FrozenSet.prototype.__floordiv__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Complex)) {
            throw new batavia.builtins.TypeError("can't take floor of complex number.")
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'frozenset' and '" + batavia.type_name(other) + "'");
        }
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
                if (other.__contains__(val).valueOf()) {
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
     * Methods
     **************************************************/

    FrozenSet.prototype._update = function(args) {
        var new_args = batavia.js2py(args);
        if (batavia.isinstance(new_args, [batavia.types.FrozenSet, batavia.types.List, batavia.types.Set, batavia.types.Str, batavia.types.Tuple])) {
            var iterobj = batavia.builtins.iter([new_args], null);
            var self = this;
            batavia.iter_for_each(iterobj, function(val) {
                self.data.__setitem__(val, val);
            });
        } else {
            throw new batavia.builtins.TypeError("'" + batavia.type_name(new_args) + "' object is not iterable");
        }
    };

    /**************************************************/

    return FrozenSet;
}();
