import * as types from '../types'

export default function isinstance(object, class_or_type_or_tuple) {
    return new types.PyBool(types.isinstance(object, class_or_type_or_tuple))
}

isinstance.__name__ = 'isinstance'
isinstance.__doc__ = `isinstance(object, class-or-type-or-tuple) -> bool

Return whether an object is an instance of a class or of a subclass thereof.
With a type as second argument, return whether that is the object's type.
The form using a tuple, isinstance(x, (A, B, ...)), is a shortcut for
isinstance(x, A) or isinstance(x, B) or ... (etc.).`
isinstance.$pyargs = {
    args: ['object', 'class_or_type_or_tuple'],
    missing_error: (e) => `isinstance expected ${e.nargs} arguments, got ${e.given}`
}
