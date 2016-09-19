
/*************************************************************************
 * A Python list type
 *************************************************************************/
batavia.types.List = function() {
    function List() {
        if (arguments.length === 0) {
            this.push.apply(this);
        } else if (arguments.length === 1) {
            // Fast-path for native Array objects.
            if (batavia.isArray(arguments[0])) {
                this.push.apply(this, arguments[0]);
            } else {
                var iterobj = batavia.builtins.iter([arguments[0]], null);
                var self = this;
                batavia.iter_for_each(iterobj, function(val) {
                    self.push(val);
                });
            }
        } else {
            throw new batavia.builtins.TypeError('list() takes at most 1 argument (' + arguments.length + ' given)');
        }
    }

    function Array_() {}

    Array_.prototype = [];

    List.prototype = Object.create(Array_.prototype);
    List.prototype.length = 0;
    List.prototype.__class__ = new batavia.types.Type('list');

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

    List.prototype.__bool__ = function() {
        return this.length > 0;
    };

    /**************************************************
     * Comparison operators
     **************************************************/

    List.prototype.__lt__ = function(other) {


        if(batavia.isinstance(other, [batavia.types.Bytes, batavia.types.Bytearray])){
            throw new batavia.builtins.TypeError("unorderable types: list() < " + batavia.type_name(other) + "()")
        }

        if (other !== null) {
            if (batavia.isinstance(other, batavia.types.List)) {
                /* update this line to get Pythonic list < list behavior */
                return this.valueOf() < other;
            } else {
                throw new batavia.builtins.TypeError("unorderable types: list() < " + batavia.type_name(other) + "()");
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: list() < NoneType()");
        }
    };

    List.prototype.__le__ = function(other) {


        if(batavia.isinstance(other, [batavia.types.Bytes, batavia.types.Bytearray])){
            throw new batavia.builtins.TypeError("unorderable types: list() <= " + batavia.type_name(other) + "()")
        }

        if (other !== null) {
            if (batavia.isinstance(other, batavia.types.List)) {
                /* update this line to get Pythonic list <= list behavior */
                return this.valueOf() <= other;
            } else {
                throw new batavia.builtins.TypeError("unorderable types: list() <= " + batavia.type_name(other) + "()");
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: list() <= NoneType()");
        }
    };

    List.prototype.__eq__ = function(other) {
        if (batavia.isinstance(other, batavia.types.List)){
            // must be a list to possibly be equal
            if(this.length !== other.length){
                // lists must have same number of items
                return false
            } else {
                for(var i=0; i<this.length; i++){
                    if(this[i] !== other[i]) {return false;}
                }
                return true;
            }

        } else {
            return false;
        }
    };

    List.prototype.__ne__ = function(other) {
        return this.valueOf() != other;
    };

    List.prototype.__gt__ = function(other) {

        if(batavia.isinstance(other, [batavia.types.Bytes, batavia.types.Bytearray])){
            throw new batavia.builtins.TypeError("unorderable types: list() > " + batavia.type_name(other) + "()")
        }

        if (other !== null) {
            if (batavia.isinstance(other, batavia.types.List)) {
                /* update this line to get Pythonic list > list behavior */
//                return this.valueOf() > other;

                // edge case where this=[]
                if(this.valueOf().length == 0){return false}

                for(var i=0; i<this.valueOf().length; i++){

                    //other ran out of items. `this` wins!
                    if(other[i] === undefined){return true}
                    if(this[i].__ne__(other[i])){return this[i].__gt__(other[i])}

                }

                //got through loop and all values were equal. Does `this` have more items?
                return this.length > other.length

            } else {
                throw new batavia.builtins.TypeError("unorderable types: list() > " + batavia.type_name(other) + "()");
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: list() > NoneType()");
        }
    };

    List.prototype.__ge__ = function(other) {

        if(batavia.isinstance(other, [batavia.types.Bytes, batavia.types.Bytearray])){
            throw new batavia.builtins.TypeError("unorderable types: list() >= " + batavia.type_name(other) + "()")
        }

        if (other !== null) {
            if (batavia.isinstance(other, batavia.types.List)) {
                /* update this line to get Pythonic list >= list behavior */
                return this.valueOf() >= other;
            } else {
                throw new batavia.builtins.TypeError("unorderable types: list() >= " + batavia.type_name(other) + "()");
            }
        } else {
            throw new batavia.builtins.TypeError("unorderable types: list() >= NoneType()");
        }
    };

    List.prototype.__contains__ = function(other) {
        return this.valueOf().index(other) !== -1;
    };

    /**************************************************
     * Unary operators
     **************************************************/

    List.prototype.__pos__ = function() {
        throw new batavia.builtins.TypeError("bad operand type for unary +: 'list'")
    };

    List.prototype.__neg__ = function() {
        throw new batavia.builtins.TypeError("bad operand type for unary -: 'list'")
    };

    List.prototype.__not__ = function() {
        return this.length == 0;
    };

    List.prototype.__invert__ = function() {
        throw new batavia.builtins.TypeError("bad operand type for unary ~: 'list'")
    };

    /**************************************************
     * Binary operators
     **************************************************/

    List.prototype.__pow__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__div__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'list' and '" + batavia.type_name(other) + "'");
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
            if(other <= 0) {
                return result;
            } else {
                for (i = 0; i < other; i++) {
                    result.extend(this);
                }
                return result;
            }
        } else if (batavia.isinstance(other, batavia.types.Bool)) {
            if (other) {
                return this.copy();
            } else {
                return new List();
            }
        } else {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type '" + batavia.type_name(other) + "'");
        }
    };

    List.prototype.__mod__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for %: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__add__ = function(other) {
        if (batavia.isinstance(other, batavia.types.List)) {
            result = new List();
                for (i=0; i < this.length; i++){
                    result.push(this[i]);
                }

                for (i=0; i < other.length; i++){
                    result.push(other[i]);
                }

                return result;
        } else {
            throw new batavia.builtins.TypeError('can only concatenate list (not "' + batavia.type_name(other) + '") to list');
        }
    };

    List.prototype.__sub__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__getitem__ = function(index) {
        if (batavia.isinstance(index, batavia.types.Int)) {
            var idx = index.int32();
            if (idx < 0) {
                if (-idx > this.length) {
                    throw new batavia.builtins.IndexError("list index out of range");
                } else {
                    return this[this.length + idx];
                }
            } else {
                if (idx >= this.length) {
                    throw new batavia.builtins.IndexError("list index out of range");
                } else {
                    return this[idx];
                }
            }
        } else if (batavia.isinstance(index, batavia.types.Slice)) {
            var start, stop, step;
            start = index.start === null ? undefined : index.start;
            stop = index.stop === null ? undefined : index.stop;
            step = index.step;

            if (step === 0) {
                throw new batavia.builtins.ValueError("slice step cannot be zero");
            }

            // clone list
            var result = Array_.prototype.slice.call(this);

            // handle step
            if (step === undefined || step === 1) {
                return new List(result.slice(start, stop));
            } else if (step > 0) {
                result = result.slice(start, stop);
            } else if (step < 0) {
                // adjust start/stop to swap inclusion/exlusion in slice
                if (start !== undefined && start !== -1) {
                    start = start + 1;
                } else if (start === -1) {
                    start = result.length;
                }
                if (stop !== undefined && stop !== -1) {
                    stop = stop + 1;
                } else if (stop === -1) {
                    stop = result.length;
                }

                result = result.slice(stop, start).reverse();
            }

            var steppedResult = [];
            for (var i = 0; i < result.length; i = i + Math.abs(step)) {
                steppedResult.push(result[i]);
            }

            result = steppedResult;

            return new List(result);
        } else {
            var msg = "list indices must be integers or slices, not ";
            if (batavia.BATAVIA_MAGIC == batavia.BATAVIA_MAGIC_34) {
                msg = "list indices must be integers, not ";
            }
            throw new batavia.builtins.TypeError(msg + batavia.type_name(index));
        }
    };

    List.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for <<: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for >>: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__and__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for &: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__xor__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ^: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__or__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for |: 'list' and '" + batavia.type_name(other) + "'");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    List.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //=: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for /=: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__iadd__ = function(other) {
        if(batavia.isinstance(other, [batavia.types.List, batavia.types.Str,
            batavia.types.Tuple])) {
            for(i=0; i< other.length; i++) {
              this.push(other[i]);
            }
            return this;
        } else {
            throw new batavia.builtins.TypeError("'" + batavia.type_name(other) + "' object is not iterable");
        }
    };

    List.prototype.__isub__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for -=: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__imul__ = function(other) {
        if(batavia.isinstance(other, batavia.types.Int)) {
            if(other <= 0) {
                return new List();
            } else {
                list_length = this.length;
                for(i=1; i < other; i++) {
                    for(j=0; j < list_length; j++) {
                        this.push(this[j]);
                    }
                }
                return this;
            }
        } else if(batavia.isinstance(other, batavia.types.Bool)) {
            return other == true ? this : new List();
        } else {
            throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type '" + batavia.type_name(other) + "'");
        }
    };

    List.prototype.__imod__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for %=: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for <<=: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for >>=: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__iand__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for &=: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for ^=: 'list' and '" + batavia.type_name(other) + "'");
    };

    List.prototype.__ior__ = function(other) {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for |=: 'list' and '" + batavia.type_name(other) + "'");
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

    List.prototype.ListIterator.prototype.__iter__ = function() {
        return this;
    };

    List.prototype.ListIterator.prototype.__next__ = function() {
        if (this.index >= this.data.length) {
            throw new batavia.builtins.StopIteration();
        }
        var retval = this.data[this.index];
        this.index++;
        return retval;
    };

    List.prototype.ListIterator.prototype.__str__ = function() {
        return "<list_iterator object at 0x99999999>";
    };

    List.prototype.ListIterator.prototype.constructor = List.prototype.ListIterator;
    List.prototype.ListIterator.prototype.__class__ = new batavia.types.Type('list_iterator');

    /**************************************************/

    return List;
}();
