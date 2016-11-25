var exceptions = require('../core').exceptions;

var exec = function() {
    throw new exceptions.NotImplementedError("Builtin Batavia function 'exec' not implemented");
};
exec.__doc__ = 'exec(object[, globals[, locals]])\n\nRead and execute code from an object, which can be a string or a code\nobject.\nThe globals and locals are dictionaries, defaulting to the current\nglobals and locals.  If only globals is given, locals defaults to it.';

module.exports = exec;
