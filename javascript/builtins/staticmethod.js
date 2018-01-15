import { NotImplementedError } from '../core/exceptions'

export default function staticmethod(args, kwargs) {
    throw new NotImplementedError("Builtin Batavia function 'staticmethod' not implemented")
}

staticmethod.__doc__ = 'staticmethod(function) -> method\n\nConvert a export default function to be a static method.\n\nA static method does not receive an implicit first argument.\nTo declare a static method, use this idiom:\n\n     class C:\n     def f(arg1, arg2, ...): ...\n     f = staticmethod(f)\n\nIt can be called either on the class (e.g. C.f()) or on an instance\n(e.g. C().f()).  The instance is ignored except for its class.\n\nStatic methods in Python are similar to those found in Java or C++.\nFor a more advanced concept, see the classmethod builtin.'
staticmethod.$pyargs = true
