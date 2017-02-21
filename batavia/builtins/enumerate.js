var exceptions = require('../core').exceptions;


function enumerate(args, kwargs) {
    if (arguments.length != 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("enumerate() doesn't accept keyword arguments");
    }
    var result = [];
    var values = args[0];
    for (var i = 0; i < values.length; i++) {
        result.push([i, values[i]]);
    }
    // FIXME this should return a generator, not list
    return result;
}
enumerate.__doc__ = 'enumerate(iterable[, start]) -> iterator for index, value of iterable\n\nReturn an enumerate object.  iterable must be another object that supports\niteration.  The enumerate object yields pairs containing a count (from\nstart, which defaults to zero) and a value yielded by the iterable argument.\nenumerate is useful for obtaining an indexed list:\n    (0, seq[0]), (1, seq[1]), (2, seq[2]), ...';

module.exports = enumerate;
