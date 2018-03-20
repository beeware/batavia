export default function repr(object) {
    if (object === null) {
        return 'None'
    }
    try {
        return object.__repr__()
    } catch (e) {
        return object.toString()
    }
}

repr.__name__ = 'repr'
repr.__doc__ = `repr(object) -> string

Return the canonical string representation of the object.
For most object types, eval(repr(object)) === object.`
repr.$pyargs = {
    args: ['object']
}
