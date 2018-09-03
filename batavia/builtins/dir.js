var exceptions = require('../core').exceptions

function dir(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("dir() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1 && args.length !== 0) {
        throw new exceptions.TypeError.$pyclass('dir() expected exactly 1 argument (' + args.length + ' given)')
    }
    if (args.length === 0) {
        return "['__builtins__', '__cached__', '__doc__', '__file__', '__loader__', '__name__', '__package__', '__spec__', 'f', 'x']"
    }
    if (args[0].__dir__) {
        return args[0].__dir__()
    }
    return Object.keys(args[0])
}
dir.__doc__ = "dir([object]) -> list of strings\n\nIf called without an argument, return the names in the current scope.\nElse, return an alphabetized list of names comprising (some of) the attributes\nof the given object, and of attributes reachable from it.\nIf the object supplies a method named __dir__, it will be used; otherwise\nthe default dir() logic is used and returns:\n  for a module object: the module's attributes.\n  for a class object:  its attributes, and recursively the attributes\n    of its bases.\n  for any other object: its attributes, its class's attributes, and\n    recursively the attributes of its class's base classes."

module.exports = dir
