import { pyNotImplementedError } from '../core/exceptions'
import { type_name, PyObject } from '../core/types'

export default function classmethod(fn) {
    var obj = new PyObject()
    obj.toString = function() {
        return '<classmethod object at 0xXXXXXXXX>'
    }
    obj.__str__ = obj.toString
    obj.__repr__ = obj.toString
    obj.__class__ = 'classmethod'
    if (type_name(fn) === 'function') {
        obj.__call__ = function() {
            throw pyNotImplementedError('classmethod() can\'t get the parent class')
        }
    }
    return obj
}

classmethod.__name__ = 'classmethod'
classmethod.__doc__ = `classmethod(function) -> method
Convert a function to be a class method.
A class method receives the class as implicit first argument,
just like an instance method receives the instance.
To declare a class method, use this idiom:
  class C:
      def f(cls, arg1, arg2, ...): ...
      f = classmethod(f)
      It can be called either on the class (e.g. C.f()) or on an instance
(e.g. C().f()).  The instance is ignored except for its class.
If a class method is called for a derived class, the derived class
object is passed as the implied first argument.
Class methods are different than C++ or Java static methods.
If you want those, see the staticmethod builtin.`
classmethod.$pyargs = {
    args: ['fn'],
    missing_args_error: (e) => `classmethod expected 1 arguments, got ${e.given}`
}
