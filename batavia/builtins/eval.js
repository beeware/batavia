var exceptions = require('../core').exceptions;


function eval_(args, kwargs) {
    throw new exceptions.NotImplementedError("Builtin Batavia function 'eval' not implemented");
}
eval_.__doc__ = 'eval(source[, globals[, locals]]) -> value\n\nEvaluate the source in the context of globals and locals.\nThe source may be a string representing a Python expression\nor a code object as returned by compile().\nThe globals must be a dictionary and locals can be any mapping,\ndefaulting to the current globals and locals.\nIf only globals is given, locals defaults to it.\n';

module.exports = eval_;
