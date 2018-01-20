import * as types from '../types'

export default function isinstance(object, class_or_type_or_tuple) {
    return new types.PyBool(types.isinstance(object, class_or_type_or_tuple))
}

isinstance.__doc__ = "isinstance(object, class-or-type-or-tuple) -> bool\n\nReturn whether an object is an instance of a class or of a subclass thereof.\nWith a type as second argument, return whether that is the object's type.\nThe form using a tuple, isinstance(x, (A, B, ...)), is a shortcut for\nisinstance(x, A) or isinstance(x, B) or ... (etc.)."
isinstance.$pyargs = {
    args: ['object', 'class_or_type_or_tuple']
}
