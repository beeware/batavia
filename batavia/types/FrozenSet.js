var PyObject = require('../core').Object;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;
var SetIterator = require('./SetIterator');

/*************************************************************************
 * A Python FrozenSet type, with an underlying Dict.
 *************************************************************************/

function FrozenSet(args, kwargs) {
    var types = require('../types');

    types.Object.call(this);

    this.data = new types.Dict();
    if (args) {
        this._update(args);
    }
}

FrozenSet.prototype = Object.create(PyObject.prototype);
FrozenSet.prototype.__class__ = new Type('frozenset');
FrozenSet.prototype.constructor = FrozenSet;

/**************************************************
 * Javascript compatibility methods
 **************************************************/

FrozenSet.prototype.toString = function() {
    return this.__str__();
}

/**************************************************
 * Type conversions
 **************************************************/

FrozenSet.prototype.__bool__ = function() {
    return this.data.__bool__();
}

FrozenSet.prototype.__iter__ = function() {
    return new SetIterator(this);
}

FrozenSet.prototype.__repr__ = function() {
    return this.__str__();
}

FrozenSet.prototype.__str__ = function() {
    var keys = this.data.keys();
    if (keys.length == 0) {
        return "frozenset()";
    }
    return "frozenset({" +
        keys.map(function(x) { return x.__repr__(); }).join(", ") +
        "})";
}

/**************************************************
 * Comparison operators
 **************************************************/

FrozenSet.prototype.__lt__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length < other.data.keys().length);
    }
    throw new exceptions.TypeError("unorderable types: frozenset() < " + type_name(other) + "()");
}

FrozenSet.prototype.__le__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length <= other.data.keys().length);
    }
    throw new exceptions.TypeError("unorderable types: frozenset() <= " + type_name(other) + "()");
}

FrozenSet.prototype.__eq__ = function(other) {
    var types = require('../types');

    if (!utils.isinstance(other, [types.FrozenSet, types.Set])) {
        return new types.Bool(false);
    }
    if (this.data.keys().length != other.data.keys().length) {
        return new types.Bool(false);
    }
    var iterobj = batavia.builtins.iter([this], null);
    var equal = true;
    utils.iter_for_each(iterobj, function(val) {
        equal = equal && other.__contains__(val).valueOf();
    });

    return new types.Bool(equal);
}

FrozenSet.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__();
}

FrozenSet.prototype.__gt__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length > other.data.keys().length);
    }
    throw new exceptions.TypeError("unorderable types: frozenset() > " + type_name(other) + "()");
}

FrozenSet.prototype.__ge__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length >= other.data.keys().length);
    }
    throw new exceptions.TypeError("unorderable types: frozenset() >= " + type_name(other) + "()");
}

FrozenSet.prototype.__contains__ = function(other) {
    return this.data.__contains__(other);
}


/**************************************************
 * Unary operators
 **************************************************/

FrozenSet.prototype.__not__ = function() {
    return this.__bool__().__not__();
}

/**************************************************
 * Binary operators
 **************************************************/

FrozenSet.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for ** or pow(): 'frozenset' and '" + type_name(other) + "'");
}

FrozenSet.prototype.__div__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for /: 'frozenset' and '" + type_name(other) + "'");
}

FrozenSet.prototype.__floordiv__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for //: 'frozenset' and '" + type_name(other) + "'");
    }
}

FrozenSet.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for /: 'frozenset' and '" + type_name(other) + "'");
}

FrozenSet.prototype.__mul__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, [
        types.Bytearray, types.Bytes, types.List,
        types.Str, types.Tuple
    ])) {
        throw new exceptions.TypeError("can't multiply sequence by non-int of type 'frozenset'");
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for *: 'frozenset' and '" + type_name(other) + "'");
    }
}

FrozenSet.prototype.__mod__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, types.Complex)){
        throw new exceptions.TypeError("can't mod complex numbers.")
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for %: 'frozenset' and '" + type_name(other) + "'");
    }
}

FrozenSet.prototype.__add__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for +: 'frozenset' and '" + type_name(other) + "'");
}

FrozenSet.prototype.__sub__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj1 = batavia.builtins.iter([this], null);
        utils.iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val);
            }
        });
        return new FrozenSet(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for -: 'frozenset' and '" + type_name(other) + "'");
}

FrozenSet.prototype.__getitem__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, [types.Bool])){
        throw new exceptions.TypeError("'frozenset' object does not support indexing");
    } else if (utils.isinstance(other, [types.Int])){
        if (other.val.gt(types.Int.prototype.MAX_INT.val) || other.val.lt(types.Int.prototype.MIN_INT.val)) {
            throw new batavia.builtins.IndexError("cannot fit 'int' into an index-sized integer");
        } else {
            throw new exceptions.TypeError("'frozenset' object does not support indexing");
        }
    }
    throw new exceptions.TypeError("'frozenset' object is not subscriptable");
}

FrozenSet.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for <<: 'frozenset' and '" + type_name(other) + "'");
}

FrozenSet.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for >>: 'frozenset' and '" + type_name(other) + "'");
}

FrozenSet.prototype.__and__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj = batavia.builtins.iter([this], null);
        utils.iter_for_each(iterobj, function(val) {
            if (other.__contains__(val).valueOf()) {
                both.push(val);
            }
        });
        return new FrozenSet(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for &: 'frozenset' and '" + type_name(other) + "'");
}

FrozenSet.prototype.__xor__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj1 = batavia.builtins.iter([this], null);
        utils.iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val);
            }
        });
        var iterobj2 = batavia.builtins.iter([other], null);
        utils.iter_for_each(iterobj2, function(val) {
            if (!(this.__contains__(val).valueOf())) {
                both.push(val);
            }
        }.bind(this));
        return new FrozenSet(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for ^: 'frozenset' and '" + type_name(other) + "'");
}

FrozenSet.prototype.__or__ = function(other) {
    var types = require('../types');

    if (utils.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj1 = batavia.builtins.iter([this], null);
        utils.iter_for_each(iterobj1, function(val) {
            both.push(val);
        });
        var iterobj2 = batavia.builtins.iter([other], null);
        utils.iter_for_each(iterobj2, function(val) {
            both.push(val);
        }.bind(this));
        return new FrozenSet(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for |: 'frozenset' and '" + type_name(other) + "'");
}

/**************************************************
 * Methods
 **************************************************/

FrozenSet.prototype._update = function(args) {
    var types = require('../types');

    var new_args = utils.js2py(args);
    if (utils.isinstance(new_args, [types.FrozenSet, types.List, types.Set, types.Str, types.Tuple])) {
        var iterobj = batavia.builtins.iter([new_args], null);
        var self = this;
        utils.iter_for_each(iterobj, function(val) {
            self.data.__setitem__(val, val);
        });
    } else {
        throw new exceptions.TypeError("'" + type_name(new_args) + "' object is not iterable");
    }
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = FrozenSet;
