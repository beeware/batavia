import { NotImplementedError } from '../core/exceptions'

export default function staticmethod(fn) {
    throw new NotImplementedError("Builtin Batavia function 'staticmethod' not implemented")
}

staticmethod.__doc__ = `staticmethod(function) -> method

Convert a export default function to be a static method.

A static method does not receive an implicit first argument.
To declare a static method, use this idiom:

     class C:
     def f(arg1, arg2, ...): ...
     f = staticmethod(f)

     It can be called either on the class (e.g. C.f()) or on an instance
(e.g. C().f()).  The instance is ignored except for its class.

Static methods in Python are similar to those found in Java or C++.
For a more advanced concept, see the classmethod builtin.`
staticmethod.$pyargs = {
    args: ['fn']
}
