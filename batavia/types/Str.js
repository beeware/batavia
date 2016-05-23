
/*************************************************************************
 * Modify String to behave like a Python String
 *************************************************************************/

String.prototype.startswith = function (str) {
    return this.slice(0, str.length) === str;
};

String.prototype.__repr__ = function(args, kwargs) {
    return "'" + this.toString() + "'";
};


String.prototype.__iter__ = function() {
    return new String.prototype.StrIterator(this);
};

batavia.types.Str = String;

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

/**************************************************/
