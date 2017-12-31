var PyObject = require('../core/types/Object')
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name

function classmethod(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("classmethod() doesn't accept keyword arguments")
    }
    if (args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('classmethod expected 1 arguments, got ' + args.length)
    }
    var obj = new PyObject()
    obj.toString = function() {
        return '<classmethod object at 0xXXXXXXXX>'
    }
    obj.__str__ = obj.toString
    obj.__repr__ = obj.toString
    obj.__class__ = 'classmethod'
    if (type_name(args[0]) === 'function') {
        obj.__call__ = function() {
            throw new exceptions.NotImplementedError.$pyclass('classmethod() can\'t get the parent class')
        }
    }
    return obj
}
classmethod.__doc__ = 'classmethod(function) -> method\n\nConvert a function to be a class method.\n\nA class method receives the class as implicit first argument,\njust like an instance method receives the instance.\nTo declare a class method, use this idiom:\n\n  class C:\n      def f(cls, arg1, arg2, ...): ...\n      f = classmethod(f)\n\nIt can be called either on the class (e.g. C.f()) or on an instance\n(e.g. C().f()).  The instance is ignored except for its class.\nIf a class method is called for a derived class, the derived class\nobject is passed as the implied first argument.\n\nClass methods are different than C++ or Java static methods.\nIf you want those, see the staticmethod builtin.'

module.exports = classmethod
