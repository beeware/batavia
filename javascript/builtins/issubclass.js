import { pyNotImplementedError } from '../core/exceptions'

export default function issubclass(C, B) {
    throw pyNotImplementedError("Builtin Batavia function 'issubclass' not implemented")
}

issubclass.__name__ = 'issubclass'
issubclass.__doc__ = `issubclass(C, B) -> bool

Return whether class C is a subclass (i.e., a derived class) of class B.
When using a tuple as the second argument issubclass(X, (A, B, ...)),
is a shortcut for issubclass(X, A) or issubclass(X, B) or ... (etc.).`
issubclass.$pyargs = {
    args: ['C', 'B']
}
