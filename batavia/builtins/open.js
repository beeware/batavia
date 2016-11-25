var exceptions = require('../core').exceptions;

var open = function() {
    throw new exceptions.NotImplementedError("Builtin Batavia function 'open' not implemented");
};
open.__doc__ = 'open() is complicated.'; // 6575 character long docstring

module.exports = open;
