
/*************************************************************************
 * Modify String to behave like a Python String
 *************************************************************************/

batavia.types.Str = String;

/**************************************************
 * Type conversions
 **************************************************/

String.prototype.__iter__ = function() {
    return new String.prototype.StrIterator(this);
};

String.prototype.__repr__ = function() {
    return "'" + this.toString() + "'";
};

String.prototype.__str__ = function() {
    return this.toString();
};

/**************************************************
 * Comparison operators
 **************************************************/

String.prototype.__lt__ = function(other) {
    return this.valueOf() < other;
};

String.prototype.__le__ = function(other) {
    return this.valueOf() <= other;
};

String.prototype.__eq__ = function(other) {
    if (other !== null) {
        if (batavia.isinstance(other, [
                    batavia.types.Bool, batavia.types.Int, batavia.types.Float,
                    batavia.types.List, batavia.types.Dict, batavia.types.Tuple
                ])) {
            return false;
        } else {
            return this.valueOf() === other.valueOf();
        }
    } else {
        return false;
    }
};

String.prototype.__ne__ = function(other) {
    if (other !== null) {
        if (batavia.isinstance(other, [
                    batavia.types.Bool, batavia.types.Int, batavia.types.Float,
                    batavia.types.List, batavia.types.Dict, batavia.types.Tuple
                ])) {
            return true;
        } else {
            return this.valueOf() !== other.valueOf();
        }
    } else {
        return true;
    }
};

String.prototype.__gt__ = function(other) {
    return this.valueOf() > other;
};

String.prototype.__ge__ = function(other) {
    return this.valueOf() >= other;
};

String.prototype.__contains__ = function(other) {
    return false;
};

/**************************************************
 * Unary operators
 **************************************************/

String.prototype.__pos__ = function() {
    throw new batavia.builtins.TypeError("bad operand type for unary +: 'str'");
};

String.prototype.__neg__ = function() {
    throw new batavia.builtins.TypeError("bad operand type for unary -: 'str'");
};

String.prototype.__not__ = function() {
    throw new batavia.builtins.TypeError("bad operand type for unary !: 'str'");
};

String.prototype.__invert__ = function() {
    throw new batavia.builtins.TypeError("bad operand type for unary ~: 'str'");
};

/**************************************************
 * Binary operators
 **************************************************/

String.prototype.__pow__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'str' and '"+ batavia.type_name(other) + "'");
};

String.prototype.__div__ = function(other) {
    return this.__truediv__(other);
};

String.prototype.__floordiv__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'str' and '" + batavia.type_name(other) + "'");
};

String.prototype.__truediv__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'str' and '" + batavia.type_name(other) + "'");
};

String.prototype.__mul__ = function(other) {
    if (batavia.isinstance(other, batavia.types.Int)) {
        var result = '';
        for (var i = 0; i < other.valueOf(); i++) {
            result += this.valueOf();
        }
        return result;
    } else if (batavia.isinstance(other, batavia.types.Bool)) {
        result = other == true ? this.valueOf() : '';
        return result;
    } else {
        throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type '" + batavia.type_name(other) + "'");
    }
};

String.prototype.__mod__ = function(other) {
    if (batavia.isinstance(other, [batavia.types.List, batavia.types.Tuple])) {
        return batavia._substitute(this, other);
    } else {
        return batavia._substitute(this, [other]);
    }
};

String.prototype.__add__ = function(other) {
    if (batavia.isinstance(other, batavia.types.Str)) {
        return this.valueOf() + other.valueOf();
    } else {
        throw new batavia.builtins.TypeError("Can't convert '" + batavia.type_name(other) + "' object to str implicitly");
    }
};

String.prototype.__sub__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'str' and '" + batavia.type_name(other) + "'");
};

String.prototype.__getitem__ = function(index) {
    if (batavia.isinstance(index, batavia.types.Int)) {
        if (index.valueOf() < 0) {
            if (-index.valueOf() > this.length) {
                throw new batavia.builtins.IndexError("string index out of range");
            } else {
                return this[this.length + index];
            }
        } else {
            if (index.valueOf() >= this.length) {
                throw new batavia.builtins.IndexError("string index out of range");
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
            throw new batavia.builtins.NotImplementedError("String.__getitem__ with a stepped slice has not been implemented");
        }

        return this.valueOf().slice.call(this, start, stop);
    } else {
        throw new batavia.builtins.TypeError("string indices must be integers");
    }
};

String.prototype.__lshift__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__lshift__ has not been implemented");
};

String.prototype.__rshift__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__rshift__ has not been implemented");
};

String.prototype.__and__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__and__ has not been implemented");
};

String.prototype.__xor__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__xor__ has not been implemented");
};

String.prototype.__or__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__or__ has not been implemented");
};

/**************************************************
 * Inplace operators
 **************************************************/

String.prototype.__idiv__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__idiv__ has not been implemented");
};

String.prototype.__ifloordiv__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__ifloordiv__ has not been implemented");
};

String.prototype.__itruediv__ = function(other) {
    if (batavia.isinstance(other, batavia.types.Bool) ) {
      throw new batavia.builtins.TypeError("unsupported operand type(s) for /=: 'str' and 'bool'");
    } 
    throw new batavia.builtins.NotImplementedError("String.__itruediv__ has not been implemented");
};

String.prototype.__iadd__ = function(other) {
    if (other == null || other == batavia.types.NoneType){
        throw new batavia.builtins.TypeError("Can't convert 'NoneType' object to str implicitly");
    } else if(batavia.isinstance(other, [
                    batavia.types.Bool, batavia.types.Tuple, batavia.types.Dict, 
                    batavia.types.Float, batavia.types.Int, batavia.types.List,
                ])) {
        throw new batavia.builtins.TypeError("Can't convert '" + batavia.type_name(other) + "' object to str implicitly");

    } else if (batavia.isinstance(other, batavia.types.Str)){
        return this.valueOf() + other.valueOf();

    } else {
        throw new batavia.builtins.NotImplementedError("String.__iadd__ has not been implemented");
    }
};

String.prototype.__isub__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__isub__ has not been implemented");
};

String.prototype.__imul__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__imul__ has not been implemented");
};

String.prototype.__imod__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__imod__ has not been implemented");
};

String.prototype.__ipow__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__ipow__ has not been implemented");
};

String.prototype.__ilshift__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__ilshift__ has not been implemented");
};

String.prototype.__irshift__ = function(other) {
    throw new batavia.builtins.NotImplementedError("String.__irshift__ has not been implemented");
};

String.prototype.__iand__ = function(other) {
    if (batavia.isinstance(other, [
            batavia.types.Bool,
            batavia.types.Dict,
            batavia.types.Float,
            batavia.types.Int,
            batavia.types.List,
            batavia.types.NoneType,
            batavia.types.Str,
            batavia.types.Tuple
        ])) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for &=: 'str' and '" + batavia.type_name(other) + "'");
    } else {
        throw new batavia.builtins.NotImplementedError("String.__iand__ has not been implemented");
    }
};

String.prototype.__ixor__ = function(other) {
    if (batavia.isinstance(other, [
            batavia.types.Bool,
            batavia.types.Dict,
            batavia.types.Float,
            batavia.types.Int,
            batavia.types.List,
            batavia.types.NoneType,
            batavia.types.Str,
            batavia.types.Tuple,
        ])) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ^=: 'str' and '" + batavia.type_name(other) + "'");
    } else {
        throw new batavia.builtins.NotImplementedError("String.__ixor__ has not been implemented");
    }
};

String.prototype.__ior__ = function(other) {
    if (batavia.isinstance(other, [
            batavia.types.Bool,
            batavia.types.Dict,
            batavia.types.Float,
            batavia.types.Int,
            batavia.types.List,
            batavia.types.NoneType,
            batavia.types.Str,
            batavia.types.Tuple
        ])) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for |=: 'str' and '" + batavia.type_name(other) + "'");
    } else {
        throw new batavia.builtins.NotImplementedError("String.__ior__ has not been implemented");
    }};

/**************************************************
 * Str Iterator
 **************************************************/

String.prototype.StrIterator = function (data) {
    Object.call(this);
    this.index = 0;
    this.data = data;
};

String.prototype.StrIterator.prototype = Object.create(Object.prototype);

String.prototype.StrIterator.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw new batavia.builtins.StopIteration();
    }
    this.index++;
    return retval;
};

String.prototype.StrIterator.prototype.__str__ = function() {
    return "<str_iterator object at 0x99999999>";
};

/**************************************************
 * Methods
 **************************************************/

String.prototype.copy = function() {
    return this.valueOf();
};

String.prototype.startswith = function (str) {
    return this.slice(0, str.length) === str;
};

String.prototype.__setattr__ = function (name, val) {
    if (this.__proto__[name] == undefined) {
        throw new batavia.builtins.AttributeError("'str' object has no attribute '" + name + "'");
    } else {
        throw new batavia.builtins.AttributeError("'str' object attribute '" + name + "' is read-only");
    }
};
