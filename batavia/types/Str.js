
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

String.prototype.__repr__ = function(args, kwargs) {
    return "'" + this.toString() + "'";
};

String.prototype.__str__ = function(args, kwargs) {
    return this.toString();
};

/**************************************************
 * Comparison operators
 **************************************************/

String.prototype.__le__ = function(args, kwargs) {
    return this.valueOf() <= args[0];
};

String.prototype.__eq__ = function(args, kwargs) {
    return this.valueOf() == args[0];
};

String.prototype.__ne__ = function(args, kwargs) {
    return this.valueOf() != args[0];
};

String.prototype.__gt__ = function(args, kwargs) {
    return this.valueOf() > args[0];
};

String.prototype.__ge__ = function(args, kwargs) {
    return this.valueOf() >= args[0];
};

String.prototype.__contains__ = function(args, kwargs) {
    return false;
};

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

String.prototype.startswith = function (str) {
    return this.slice(0, str.length) === str;
};

