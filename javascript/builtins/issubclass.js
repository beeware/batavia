import { PyNotImplementedError } from '../core/exceptions'

export default function issubclass() {
    throw new PyNotImplementedError("Builtin Batavia function 'issubclass' not implemented")
}

issubclass.__doc__ = 'issubclass(C, B) -> bool\n\nReturn whether class C is a subclass (i.e., a derived class) of class B.\nWhen using a tuple as the second argument issubclass(X, (A, B, ...)),\nis a shortcut for issubclass(X, A) or issubclass(X, B) or ... (etc.).'
issubclass.$pyargs = true
