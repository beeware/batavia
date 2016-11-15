var types = require('./Type');

/**************************************************
 * Set Iterator
 **************************************************/

module.exports = function() {
    SetIterator = function (data) {
        types.Object.call(this);
        this.index = 0;
        this.data = data;
        this.keys = data.data.keys();
    };

    SetIterator.prototype = Object.create(types.Object.prototype);

    SetIterator.prototype.__next__ = function() {
        var key = this.keys[this.index];
        if (key === undefined) {
            throw new batavia.builtins.StopIteration();
        }
        this.index++;
        return key;
    };

    SetIterator.prototype.__str__ = function() {
        return "<set_iterator object at 0x99999999>";
    };

    return SetIterator
}();
