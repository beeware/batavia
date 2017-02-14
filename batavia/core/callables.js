var exceptions = require('./exceptions');
var type_name = require('./types/Type').type_name;

var callables = {};

/************************
 * Working with iterables
 ************************/

// Iterate a python iterable to completion,
// calling a javascript callback on each item that it yields.
callables.iter_for_each = function(iterobj, callback) {
    try {
        while (true) {
            var next = iterobj.__next__([], null);
            callback(next);
        }
    } catch (err) {
        if (!(err instanceof exceptions.StopIteration.$pyclass)) {
            throw err;
        }
    }
}

module.exports = callables;
