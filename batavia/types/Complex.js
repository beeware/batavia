
/*************************************************************************
 // !!!!!! This is a stub implementation it has nothing to do with Complex type !!!!
 *************************************************************************/

batavia.types.Complex = function() {
    function Complex(args, kwargs) {
        Object.call(this);
        if (args) {
            this.update(args);
        }
    }

    Complex.prototype = Object.create(Object.prototype);

    Complex.prototype.constructor = Complex;
    Complex.__name__ = 'set'

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    Complex.prototype.toString = function() {
        return this.__str__();
    };

    /**************************************************
     * Type conversions
     **************************************************/

    Complex.prototype.__bool__ = function() {
        return this.valueOf().length !== 0;
    };

    Complex.prototype.__iter__ = function() {
        return new Complex.prototype.ComplexIterator(this);
    };

    Complex.prototype.__repr__ = function() {
        return this.__str__();
    };

    Complex.prototype.__str__ = function() {
        var result = "{", values = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                values.push(batavia.builtins.repr(key));
            }
        }
        result += values.join(', ');
        result += "}";
        return result;
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    Complex.prototype.__lt__ = function(other) {
        return this.valueOf() <= other;
    };

    Complex.prototype.__le__ = function(other) {
        return this.valueOf() <= other;
    };

    Complex.prototype.__eq__ = function(other) {
        return this.valueOf() == other;
    };

    Complex.prototype.__ne__ = function(other) {
        return this.valueOf() != other;
    };

    Complex.prototype.__gt__ = function(other) {
        return this.valueOf() > other;
    };

    Complex.prototype.__ge__ = function(other) {
        return this.valueOf() >= other;
    };

    Complex.prototype.__contains__ = function(other) {
        return this.valueOf().hasOwnProperty(other);
    };


    /**************************************************
     * Unary operators
     **************************************************/

    Complex.prototype.__pos__ = function() {
        return new Complex(+this.valueOf());
    };

    Complex.prototype.__neg__ = function() {
        return new Complex(-this.valueOf());
    };

    Complex.prototype.__not__ = function() {
        return new Complex(!this.valueOf());
    };

    Complex.prototype.__invert__ = function() {
        return new Complex(~this.valueOf());
    };

    /**************************************************
     * Binary operators
     **************************************************/

    Complex.prototype.__pow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__pow__ has not been implemented");
    };

    Complex.prototype.__div__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__div__ has not been implemented");
    };

    Complex.prototype.__floordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__floordiv__ has not been implemented");
    };

    Complex.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__truediv__ has not been implemented");
    };

    Complex.prototype.__mul__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__mul__ has not been implemented");
    };

    Complex.prototype.__mod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__mod__ has not been implemented");
    };

    Complex.prototype.__add__ = function(other) {
		throw new batavia.builtins.TypeError("unsupported operand type(s) for +: 'set' and '" + batavia.type_name(other) + "'");
    };

    Complex.prototype.__sub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__sub__ has not been implemented");
    };

    Complex.prototype.__getitem__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__getitem__ has not been implemented");
    };

    Complex.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__lshift__ has not been implemented");
    };

    Complex.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__rshift__ has not been implemented");
    };

    Complex.prototype.__and__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__and__ has not been implemented");
    };

    Complex.prototype.__xor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__xor__ has not been implemented");
    };

    Complex.prototype.__or__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__or__ has not been implemented");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    Complex.prototype.__idiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__idiv__ has not been implemented");
    };

    Complex.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__ifloordiv__ has not been implemented");
    };

    Complex.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__itruediv__ has not been implemented");
    };

    Complex.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__iadd__ has not been implemented");
    };

    Complex.prototype.__isub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__isub__ has not been implemented");
    };

    Complex.prototype.__imul__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__imul__ has not been implemented");
    };

    Complex.prototype.__imod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__imod__ has not been implemented");
    };

    Complex.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__ipow__ has not been implemented");
    };

    Complex.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__ilshift__ has not been implemented");
    };

    Complex.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__irshift__ has not been implemented");
    };

    Complex.prototype.__iand__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__iand__ has not been implemented");
    };

    Complex.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__ixor__ has not been implemented");
    };

    Complex.prototype.__ior__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Complex.__ior__ has not been implemented");
    };

    /**************************************************
     * Methods
     **************************************************/

    Complex.prototype.add = function(v) {
        this[v] = null;
    };

    Complex.prototype.copy = function() {
        return new Complex(this);
    };

    Complex.prototype.remove = function(v) {
        delete this[v];
    };

    Complex.prototype.update = function(values) {
        for (var value in values) {
            if (values.hasOwnProperty(value)) {
                this[values[value]] = null;
            }
        }
    };

    /**************************************************
     * Complex Iterator
     **************************************************/

    Complex.prototype.ComplexIterator = function (data) {
        Object.call(this);
        this.index = 0;
        this.data = data;
    };

    Complex.prototype.ComplexIterator.prototype = Object.create(Object.prototype);

    Complex.prototype.ComplexIterator.prototype.__next__ = function() {
        var retval = this.data[this.index];
        if (retval === undefined) {
            throw new batavia.builtins.StopIteration();
        }
        this.index++;
        return retval;
    };

    Complex.prototype.ComplexIterator.prototype.__str__ = function() {
        return "<set_iterator object at 0x99999999>";
    };

    /**************************************************/

    return Complex;
}();
