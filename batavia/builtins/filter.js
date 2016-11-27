var exceptions = require('../core').exceptions;
var types = require('../types');


function filter(args, kwargs) {
    if (args.length != 2) {
        throw new exceptions.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError("filter() doesn't accept keyword arguments");
    }
    return new types.filter(args, kwargs);
}
filter.__doc__ = 'filter(function or None, iterable) --> filter object\n\nReturn an iterator yielding those items of iterable for which function(item)\nis true. If function is None, return the items that are true.';

module.exports = filter;
