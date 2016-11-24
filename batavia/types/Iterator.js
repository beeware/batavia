
/************************
 * Working with iterables
 ************************/

// Iterate a python iterable to completion,
// calling a javascript callback on each item that it yields.
var iter_for_each = function(iterobj, callback) {
    try {
        while (true) {
            var next = utils.run_callable(iterobj, iterobj.__next__, [], null);
            callback(next);
        }
    } catch (err) {
        if (!(err instanceof exceptions.StopIteration)) {
            throw err;
        }
    }
}

module.exports = {
    'iter_for_each': iter_for_each
}
