var exceptions = require('../core').exceptions;


function vars(args, kwargs) {
    throw new exceptions.NotImplementedError("Builtin Batavia function 'vars' not implemented");
}
vars.__doc__ = 'vars([object]) -> dictionary\n\nWithout arguments, equivalent to locals().\nWith an argument, equivalent to object.__dict__.';

module.exports = vars;
