var exceptions = require('../core').exceptions;

var vars = function() {
    throw new exceptions.NotImplementedError("Builtin Batavia function 'vars' not implemented");
};
vars.__doc__ = 'vars([object]) -> dictionary\n\nWithout arguments, equivalent to locals().\nWith an argument, equivalent to object.__dict__.';

module.exports = vars;
