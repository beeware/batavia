var exceptions = require('../core').exceptions;

var memoryview = function() {
    throw new exceptions.NotImplementedError("Builtin Batavia function 'memoryview' not implemented");
};
memoryview.__doc__ = 'memoryview(object)\n\nCreate a new memoryview object which references the given object.';

module.exports = memoryview;
