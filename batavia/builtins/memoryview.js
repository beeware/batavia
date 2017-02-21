var exceptions = require('../core').exceptions

function memoryview(args, kwargs) {
    throw new exceptions.NotImplementedError.$pyclass("Builtin Batavia function 'memoryview' not implemented")
}
memoryview.__doc__ = 'memoryview(object)\n\nCreate a new memoryview object which references the given object.'

module.exports = memoryview
