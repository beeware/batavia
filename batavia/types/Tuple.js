/*************************************************************************
 * A Python Tuple type
 *************************************************************************/
var pytypes = require('./Type');
var types = require('./_index');


module.exports = function() {
    var types = require('./_index');
    var builtins = require('../core/builtins');
    var utils = require('../utils');

    function Tuple(length){
        pytypes.Object.call(this);

        if (arguments.length === 0) {
            this.push.apply(this);
        } else if (arguments.length === 1) {
            // Fast-path for native Array objects.
            if (Array.isArray(arguments[0])) {
                this.push.apply(this, arguments[0]);
            } else {
                var iterobj = builtins.iter([arguments[0]], null);
                var self = this;
                utils.iter_for_each(iterobj, function(val) {
                    self.push(val);
                });
            }
        } else {
            throw new builtins.TypeError('tuple() takes at most 1 argument (' + arguments.length + ' given)');
        }
    }

    function Array_() {}

    Array_.prototype = [];

    Tuple.prototype = Object.create(Array_.prototype);
    Tuple.prototype.length = 0;
    Tuple.prototype.__class__ = new pytypes.Type('tuple');

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
                return builtins.repr([obj], null);
            }).join(', ') + (this.length === 1 ? ',)' : ')');
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Tuple.prototype.__lt__ = function(other) {
        if (!utils.isinstance(other, types.Tuple)) {
            throw new builtins.TypeError('unorderable types: tuple() < ' + utils.type_name(other) + '()')
        }
        if (this.length == 0 && other.length > 0) {
            return true;
        }
        for (var i = 0; i < this.length; i++) {
            if (i >= other.length) {
                return false;
            }
            if (this[i].__lt__(other[i])) {
                return true;
            } else if (this[i].__eq__(other[i])) {
                continue;
            } else {
                return false;
            }
        }
        return this.length < other.length;
    };

    Tuple.prototype.__le__ = function(other) {
        return this.__lt__(other) || this.__eq__(other);
    };

    Tuple.prototype.__eq__ = function(other) {
        if (!utils.isinstance(other, types.Tuple)) {
            return false;
        }
        if (this.length != other.length) {
            return false;
        }
        for (var i = 0; i < this.length; i++) {
            if (!this[i].__eq__(other[i])) {
                return false;
            }
        }
        return true;
    };

    Tuple.prototype.__ne__ = function(other) {
        return !this.__eq__(other);
    };

    Tuple.prototype.__gt__ = function(other) {
        if (!utils.isinstance(other, types.Tuple)) {
            throw new builtins.TypeError('unorderable types: tuple() > ' + utils.type_name(other) + '()')
        }
        if (this.length == 0 && other.length > 0) {
            return false;
        }
        for (var i = 0; i < this.length; i++) {
            if (i >= other.length) {
                return true;
            }
            if (this[i].__lt__(other[i])) {
                return false;
            } else if (this[i].__eq__(other[i])) {
                continue;
            } else {
                return true;
            }
        }
        return this.length > other.length;
    };

    Tuple.prototype.__ge__ = function(other) {
      return this.__gt__(other) || this.__eq__(other);
    };

    Tuple.prototype.__contains__ = function(other) {
        return this.valueOf().index(other) !== -1;
    };

    /**************************************************
     * Unary operators
     **************************************************/

    Tuple.prototype.__pos__ = function() {
        throw new builtins.TypeError("bad operand type for unary +: 'tuple'");
    };

    Tuple.prototype.__neg__ = function() {
        throw new builtins.TypeError("bad operand type for unary -: 'tuple'");
    };

    Tuple.prototype.__not__ = function() {
        return !this.__bool__();
    };

    Tuple.prototype.__invert__ = function() {
        throw new builtins.TypeError("bad operand type for unary ~: 'tuple'");
    };

    Tuple.prototype.__bool__ = function() {
        return this.length > 0;
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Tuple.prototype.__pow__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for ** or pow(): 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__div__ = function(other) {
        return this.__truediv__(other);
    };

    Tuple.prototype.__floordiv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for //: 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__truediv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for /: 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__mul__ = function(other) {
        if (utils.isinstance(other, types.Int)) {
            result = new List();
            for (var i = 0; i < other.valueOf(); i++) {
                result.extend(this);
            }
            return result;
        } else if (utils.isinstance(other, types.Bool)) {
            if (other.valueOf()) {
                return this.copy();
            } else {
                return new List();
            }
        } else {
            throw new builtins.TypeError("can't multiply sequence by non-int of type '" + utils.type_name(other) + "'");
        }
    };

    Tuple.prototype.__mod__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for %: 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__add__ = function(other) {
		if (!utils.isinstance(other, types.Tuple)) {
			throw new builtins.TypeError('can only concatenate tuple (not "' + utils.type_name(other) + '") to tuple')
		} else {
			result = new Tuple();
			for (var i = 0; i < this.length; i++){
				result.push(this[i]);
			}

			for (var i = 0; i < other.length; i++){
				result.push(other[i]);
			}

			return result;
		}
    };

    Tuple.prototype.__sub__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for -: 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__getitem__ = function(index) {
    		if (utils.isinstance(index, types.Int)) {
            var idx = index.int32();
            if (idx < 0) {
                if (-idx > this.length) {
                    throw new builtins.IndexError("tuple index out of range");
                } else {
                    return this[this.length + idx];
                }
            } else {
                if (idx >= this.length) {
                    throw new builtins.IndexError("tuple index out of range");
                } else {
                    return this[idx];
                }
            }
        } else if (utils.isinstance(index, types.Slice)) {
            var start, stop, step;
            start = index.start;

            if (index.stop === null) {
                stop = this.length;
            } else {
                stop = index.stop;
            }

            step = index.step;

            if (step != 1) {
                throw new builtins.NotImplementedError("Tuple.__getitem__ with a stepped slice has not been implemented");
            }

            return new Tuple(Array_.prototype.slice.call(this, start, stop));
        } else {
            var msg = "tuple indices must be integers or slices, not ";
            if (utils.BATAVIA_MAGIC == utils.BATAVIA_MAGIC_34) {
                msg = "tuple indices must be integers, not ";
            }
            throw new builtins.TypeError(msg + utils.type_name(index));
    		}
    };

    Tuple.prototype.__lshift__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__lshift__ has not been implemented");
    };

    Tuple.prototype.__rshift__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__rshift__ has not been implemented");
    };

    Tuple.prototype.__and__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for &: 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__xor__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__xor__ has not been implemented");
    };

    Tuple.prototype.__or__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__or__ has not been implemented");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    Tuple.prototype.__ifloordiv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for //=: 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__itruediv__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for /=: 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__iadd__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__iadd__ has not been implemented");
    };

    Tuple.prototype.__isub__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for -=: 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__imul__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__imul__ has not been implemented");
    };

    Tuple.prototype.__imod__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for %=: 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__ipow__ = function(other) {
        throw new builtins.TypeError("unsupported operand type(s) for ** or pow(): 'tuple' and '" + utils.type_name(other) + "'");
    };

    Tuple.prototype.__ilshift__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__ilshift__ has not been implemented");
    };

    Tuple.prototype.__irshift__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__irshift__ has not been implemented");
    };

    Tuple.prototype.__iand__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__iand__ has not been implemented");
    };

    Tuple.prototype.__ixor__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__ixor__ has not been implemented");
    };

    Tuple.prototype.__ior__ = function(other) {
        throw new builtins.NotImplementedError("Tuple.__ior__ has not been implemented");
    };

    /**************************************************
     * Methods
     **************************************************/

    Tuple.prototype.copy = function() {
        return new Tuple(this);
    };

    Tuple.prototype.count = function(value) {
        if (arguments.length !== 1) {
            throw new builtins.TypeError("count() takes exactly one argument (" + arguments.length + " given)");
        }
        var count = 0;
        for (var i = 0; i < this.length; ++i) {
            if (this[i].__eq__(value)) {
                count++;
            }
        }
        return count;
    };

    Tuple.prototype.index = function(value, start, stop) {
        if (arguments.length < 1) {
            throw new builtins.TypeError("index() takes at least 1 argument (" + arguments.length + " given)");
        } else if (arguments.length > 3) {
            throw new builtins.TypeError("index() takes at most 3 arguments (" + arguments.length + " given)");
        }
        for (var i = (start || 0); i < (stop || this.length); ++i) {
            if (this[i].__eq__(value)) {
                return i;
            }
        }
        throw new builtins.ValueError("tuple.index(x): x not in tuple");
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
            throw new builtins.StopIteration();
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
