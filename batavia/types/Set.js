
/*************************************************************************
 * A Python Set type, with an underlying Dict.
 *************************************************************************/

batavia.types.Set = function() {
    function Set(args, kwargs) {
        this.data = new batavia.types.Dict();
        if (args) {
            this.update(args);
        }
    }

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
        return this.data.__bool__();
    };

    Set.prototype.__iter__ = function() {
        return new batavia.types.SetIterator(this);
    };

    Set.prototype.__repr__ = function() {
        return this.__str__();
    };

    Set.prototype.__str__ = function() {
        var keys = this.data.keys();
        if (keys.length == 0) {
            return "set()";
        }
        return "{" + keys.map(function(x) { return x.__repr__(); }).join(", ") + "}";
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Set.prototype.__lt__ = function(other) {
        if (other !== batavia.builtins.None) {
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
        if (other !== batavia.builtins.None) {
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

    Set.prototype.__ne__ = function(other) {
        return this.__eq__(other).__not__();
    };

    Set.prototype.__gt__ = function(other) {
        if (other !== batavia.builtins.None) {
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
        if (other !== batavia.builtins.None) {
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
        return this.data.__contains__(other);
    };


    /**************************************************
     * Unary operators
     **************************************************/

    Set.prototype.__not__ = function() {
        return this.__bool__().__not__();
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Set.prototype.__pow__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__div__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__floordiv__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Complex)) {
            throw new batavia.builtins.TypeError("can't take floor of complex number.")
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'set' and '" + batavia.type_name(other) + "'");
        }
    };

    Set.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__mul__ = function(other) {
        if (batavia.isinstance(other, [
            batavia.types.Bytearray, batavia.types.Bytes, batavia.types.List,
            batavia.types.Str, batavia.types.Tuple
        ])) {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type 'set'");
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for *: 'set' and '" + batavia.type_name(other) + "'");
        }
    };

    Set.prototype.__mod__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Complex)){
            throw new batavia.builtins.TypeError("can't mod complex numbers.")
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for %: 'set' and '" + batavia.type_name(other) + "'");
        }
    };

    Set.prototype.__add__ = function(other) {
		throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__sub__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.FrozenSet, batavia.types.Set])){
            var both = [];
            var iterobj1 = batavia.builtins.iter([this], null);
            batavia.iter_for_each(iterobj1, function(val) {
                if (!(other.__contains__(val).valueOf())) {
                    both.push(val);
                }
            });
            return new Set(both);
        }
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__getitem__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.Bool])){
            throw new batavia.builtins.TypeError("'set' object does not support indexing");
        } else if (batavia.isinstance(other, [batavia.types.Int])){
            if (other.val.gt(batavia.types.Int.prototype.MAX_INT.val) || other.val.lt(batavia.types.Int.prototype.MIN_INT.val)) {
                throw new batavia.builtins.IndexError("cannot fit 'int' into an index-sized integer");
            } else {
                throw new batavia.builtins.TypeError("'set' object does not support indexing");
            }
        }
        throw new batavia.builtins.TypeError("'set' object is not subscriptable");
    };

    Set.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__lshift__ has not been implemented");
    };

    Set.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__rshift__ has not been implemented");
    };

    Set.prototype.__and__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.FrozenSet, batavia.types.Set])){
            var both = [];
            var iterobj = batavia.builtins.iter([this], null);
            batavia.iter_for_each(iterobj, function(val) {
                if (other.__contains__(val).valueOf()) {
                    both.push(val);
                }
            });
            return new Set(both);
        }
        throw new batavia.builtins.TypeError("unsupported operand type(s) for &: 'set' and '" + batavia.type_name(other) + "'");
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
        if (batavia.isinstance(other, batavia.types.Complex)) {
            throw new batavia.builtins.TypeError("can't take floor of complex number.")
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for //=: 'set' and '" + batavia.type_name(other) + "'");
        }
    };

    Set.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /=: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for +=: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__isub__ = function(other) {
        if (batavia.isinstance(other, [batavia.types.FrozenSet, batavia.types.Set])){
            var both = [];
            var iterobj1 = batavia.builtins.iter([this], null);
            batavia.iter_for_each(iterobj1, function(val) {
                if (!(other.__contains__(val).valueOf())) {
                    both.push(val);
                }
            });
            this.update(both);
            return new Set(both);
        }
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -=: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__imul__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for *=: 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__imod__ = function(other) {
        if (batavia.isinstance(other, batavia.types.Complex)){
            throw new batavia.builtins.TypeError("can't mod complex numbers.")
        } else {
            throw new batavia.builtins.TypeError("unsupported operand type(s) for %=: 'set' and '" + batavia.type_name(other) + "'");
        }
    };

    Set.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'set' and '" + batavia.type_name(other) + "'");
    };

    Set.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__ilshift__ has not been implemented");
    };

    Set.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Set.__irshift__ has not been implemented");
    };

    Set.prototype.__iand__ = function(other) {
        if (batavia.isinstance(other, [
                batavia.types.Bool, batavia.types.Dict, batavia.types.Float,
                batavia.types.List, batavia.types.Int, batavia.types.Range,
                batavia.types.Slice, batavia.types.Str, batavia.types.Tuple,
                batavia.types.NoneType
            ])) {
            throw new batavia.builtins.TypeError(
                "unsupported operand type(s) for &=: 'set' and '" + batavia.type_name(other) + "'");
        }
        if (batavia.isinstance(other, [batavia.types.FrozenSet, batavia.types.Set])) {
            var intersection = new Set();
            var iterobj = batavia.builtins.iter([this], null);
            var self = this;
            batavia.iter_for_each(iterobj, function(val) {
                if (other.__contains__(val).valueOf()) {
                    intersection.add(val);
                }
            });
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
        this.data.__setitem__(v, v);
    };

    Set.prototype.copy = function() {
        return new Set(this);
    };

    Set.prototype.remove = function(v) {
        this.data.__delitem__(v);
    };

    Set.prototype.update = function(args) {
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

    return Set;
}();
