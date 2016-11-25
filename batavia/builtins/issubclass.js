var exceptions = require('../core').exceptions;

var issubclass = function() {
    throw new exceptions.NotImplementedError("Builtin Batavia function 'issubclass' not implemented");
};
issubclass.__doc__ = 'issubclass(C, B) -> bool\n\nReturn whether class C is a subclass (i.e., a derived class) of class B.\nWhen using a tuple as the second argument issubclass(X, (A, B, ...)),\nis a shortcut for issubclass(X, A) or issubclass(X, B) or ... (etc.).';

module.exports = issubclass;
