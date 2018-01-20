export default function repr(object) {
    if (object === null) {
        return 'None'
    } else if (object.__repr__) {
        return object.__repr__()
    } else {
        return object.toString()
    }
}

repr.__doc__ = 'repr(object) -> string\n\nReturn the canonical string representation of the object.\nFor most object types, eval(repr(object)) === object.'
repr.$pyargs = {
    args: ['object']
}
