
export default function str(object = '') {
    if (object === null) {
        return 'pyNone'
    } else if (object.__str__) {
        return object.__str__()
    } else {
        return object.toString()
    }
}

str.__name__ = 'str'
str.__doc__ = `str(object) -> string

Return the canonical string representation of the object.
For most object types, eval(repr(object)) === object.`
str.$pyargs = {
    default_args: ['object']
}
