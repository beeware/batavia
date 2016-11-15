var pytypes = require('./Type');

/*************************************************************************
 * A Python FrozenSet type, with an underlying Dict.
 *************************************************************************/

module.exports = function() {
    var types = require('./_index');
    var utils = require('../utils');

    function FrozenSet(args, kwargs) {
        pytypes.Object.call(this);

        this.data = new types.Dict();
        if (args) {
            this._update(args);
        }
    }

    FrozenSet.prototype.__class__ = new pytypes.Type('frozenset');

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
        return new types.SetIterator(this);
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
        if (utils.isinstance(other, [types.Set, types.FrozenSet])) {
            return new types.Bool(this.data.keys().length < other.data.keys().length);
        }
        throw new builtins.TypeError("unorderable types: frozenset() < " + utils.type_name(other) + "()");
    };

    FrozenSet.prototype.__le__ = function(other) {
        if (utils.isinstance(other, [types.Set, types.FrozenSet])) {
            return new types.Bool(this.data.keys().length <= other.data.keys().length);
        }
        throw new builtins.TypeError("unorderable types: frozenset() <= " + utils.type_name(other) + "()");
    };

    FrozenSet.prototype.__eq__ = function(other) {
        if (!utils.isinstance(other, [types.FrozenSet, types.Set])) {
            return new types.Bool(false);
        }
        if (this.data.keys().length != other.data.keys().length) {
            return new types.Bool(false);
        }
        var iterobj = builtins.iter([this], null);
        var equal = true;
        utils.iter_for_each(iterobj, function(val) {
            equal = equal && other.__contains__(val).valueOf();
        });

        return new types.Bool(equal);
    };

    FrozenSet.prototype.__ne__ = function(other) {
        return this.__eq__(other).__not__();
    };

    FrozenSet.prototype.__gt__ = function(other) {
        if (utils.isinstance(other, [types.Set, types.FrozenSet])) {
            return new types.Bool(this.data.keys().length > other.data.keys().length);
        }
        throw new builtins.TypeError("unorderable types: frozenset() > " + utils.type_name(other) + "()");
    };

    FrozenSet.prototype.__ge__ = function(other) {
        if (utils.isinstance(other, [types.Set, types.FrozenSet])) {
            return new types.Bool(this.data.keys().length >= other.data.keys().length);
        }
        throw new builtins.TypeError("unorderable types: frozenset() >= " + utils.type_name(other) + "()");
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
        throw new builtins.TypeError("unsupported operand type(s) for ** or pow(): 'frozenset' and '" + utils.type_name(other) + "'");
    };

    FrozenSet.prototype.__div__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for /: 'frozenset' and '" + utils.type_name(other) + "'");
    };

    FrozenSet.prototype.__floordiv__ = function(other) {
        if (utils.isinstance(other, types.Complex)) {
            throw new builtins.TypeError("can't take floor of complex number.")
        } else {
            throw new builtins.TypeError("unsupported operand type(s) for //: 'frozenset' and '" + utils.type_name(other) + "'");
        }
    };

    FrozenSet.prototype.__truediv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for /: 'frozenset' and '" + utils.type_name(other) + "'");
    };

    FrozenSet.prototype.__mul__ = function(other) {
        if (utils.isinstance(other, [
            types.Bytearray, types.Bytes, types.List,
            types.Str, types.Tuple
        ])) {
            throw new builtins.TypeError("can't multiply sequence by non-int of type 'frozenset'");
        } else {
            throw new builtins.TypeError("unsupported operand type(s) for *: 'frozenset' and '" + utils.type_name(other) + "'");
        }
    };

    FrozenSet.prototype.__mod__ = function(other) {
        if (utils.isinstance(other, types.Complex)){
            throw new builtins.TypeError("can't mod complex numbers.")
        } else {
            throw new builtins.TypeError("unsupported operand type(s) for %: 'frozenset' and '" + utils.type_name(other) + "'");
        }
    };

    FrozenSet.prototype.__add__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for +: 'frozenset' and '" + utils.type_name(other) + "'");
    };

    FrozenSet.prototype.__sub__ = function(other) {
        if (utils.isinstance(other, [types.FrozenSet, types.Set])){
            var both = [];
            var iterobj1 = builtins.iter([this], null);
            utils.iter_for_each(iterobj1, function(val) {
                if (!(other.__contains__(val).valueOf())) {
                    both.push(val);
                }
            });
            return new FrozenSet(both);
        }
        throw new builtins.TypeError("unsupported operand type(s) for -: 'frozenset' and '" + utils.type_name(other) + "'");
    };

    FrozenSet.prototype.__getitem__ = function(other) {
        if (utils.isinstance(other, [types.Bool])){
            throw new builtins.TypeError("'frozenset' object does not support indexing");
        } else if (utils.isinstance(other, [types.Int])){
            if (other.val.gt(types.Int.prototype.MAX_INT.val) || other.val.lt(types.Int.prototype.MIN_INT.val)) {
                throw new builtins.IndexError("cannot fit 'int' into an index-sized integer");
            } else {
                throw new builtins.TypeError("'frozenset' object does not support indexing");
            }
        }
        throw new builtins.TypeError("'frozenset' object is not subscriptable");
    };

    FrozenSet.prototype.__lshift__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for <<: 'frozenset' and '" + utils.type_name(other) + "'");
    };

    FrozenSet.prototype.__rshift__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for >>: 'frozenset' and '" + utils.type_name(other) + "'");
    };

    FrozenSet.prototype.__and__ = function(other) {
        if (utils.isinstance(other, [types.FrozenSet, types.Set])){
            var both = [];
            var iterobj = builtins.iter([this], null);
            utils.iter_for_each(iterobj, function(val) {
                if (other.__contains__(val).valueOf()) {
                    both.push(val);
                }
            });
            return new FrozenSet(both);
        }
        throw new builtins.TypeError("unsupported operand type(s) for &: 'frozenset' and '" + utils.type_name(other) + "'");
    };

    FrozenSet.prototype.__xor__ = function(other) {
        if (utils.isinstance(other, [types.FrozenSet, types.Set])){
            var both = [];
            var iterobj1 = builtins.iter([this], null);
            utils.iter_for_each(iterobj1, function(val) {
                if (!(other.__contains__(val).valueOf())) {
                    both.push(val);
                }
            });
            var iterobj2 = builtins.iter([other], null);
            utils.iter_for_each(iterobj2, function(val) {
                if (!(this.__contains__(val).valueOf())) {
                    both.push(val);
                }
            }.bind(this));
            return new FrozenSet(both);
        }
        throw new builtins.TypeError("unsupported operand type(s) for ^: 'frozenset' and '" + utils.type_name(other) + "'");
    };

    FrozenSet.prototype.__or__ = function(other) {
        if (utils.isinstance(other, [types.FrozenSet, types.Set])){
            var both = [];
            var iterobj1 = builtins.iter([this], null);
            utils.iter_for_each(iterobj1, function(val) {
                both.push(val);
            });
            var iterobj2 = builtins.iter([other], null);
            utils.iter_for_each(iterobj2, function(val) {
                both.push(val);
            }.bind(this));
            return new FrozenSet(both);
        }
        throw new builtins.TypeError("unsupported operand type(s) for |: 'frozenset' and '" + utils.type_name(other) + "'");
    };

    /**************************************************
     * Methods
     **************************************************/

    FrozenSet.prototype._update = function(args) {
        var new_args = utils.js2py(args);
        if (utils.isinstance(new_args, [types.FrozenSet, types.List, types.Set, types.Str, types.Tuple])) {
            var iterobj = builtins.iter([new_args], null);
            var self = this;
            utils.iter_for_each(iterobj, function(val) {
                self.data.__setitem__(val, val);
            });
        } else {
            throw new builtins.TypeError("'" + utils.type_name(new_args) + "' object is not iterable");
        }
    };

    /**************************************************/

    return FrozenSet;
}();
