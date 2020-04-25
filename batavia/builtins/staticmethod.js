var PyObject = require('../core/types/Object')
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name

function staticmethod(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("staticmethod() doesn't accept keyword arguments")
    }
    if (args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('staticmethod expected 1 arguments, got ' + args.length)
    }
    var obj = new PyObject();
    obj.toString = function() {
        return '<staticmethod object at 0xXXXXXXXX>'
    }
    obj.__str__ = obj.toString;
    obj.__repr__ = obj.toString;
    obj.__class__ = 'staticmethod';
    if (type_name(args[0]) === 'function') {
        obj.__call__ = args[0].__call__;
    }
    return obj;
}

staticmethod.__doc__ = 'staticmethod(function) -> method\n' +
'\n' +
'Convert a function to be a static method.\n' +
'\n' +
'A static method does not receive an implicit first argument.\n' +
'To declare a static method, use this idiom:\n' +
'\n' +
'     class C:\n' +
'         @staticmethod\n' +
'         def f(arg1, arg2, ...):\n' +
'             ...\n' +
'\n' +
'It can be called either on the class (e.g. C.f()) or on an instance\n' +
'(e.g. C().f()).  The instance is ignored except for its class.\n' +
'\n' +
'Static methods in Python are similar to those found in Java or C++.\n' +
'For a more advanced concept, see the classmethod builtin.\n';

module.exports = staticmethod
