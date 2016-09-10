/**************************************************
 * Set Iterator
 **************************************************/

batavia.types.SetIterator = function (data) {
    Object.call(this);
    this.index = 0;
    this.data = data;
    this.keys = Object.keys(data);
};

batavia.types.SetIterator.prototype = Object.create(Object.prototype);

batavia.types.SetIterator.prototype.__next__ = function() {
    var key = this.keys[this.index];
    if (key === undefined) {
        throw new batavia.builtins.StopIteration();
    }
    var retval = this.data[key];
    this.index++;
    return retval;
};

batavia.types.SetIterator.prototype.__str__ = function() {
    return "<set_iterator object at 0x99999999>";
};
