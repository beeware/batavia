import { BataviaError, TypeError } from '../core/exceptions'

export default function repr(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError.$pyclass("repr() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new TypeError.$pyclass('repr() takes exactly 1 argument (' + args.length + ' given)')
    }

    if (args[0] === null) {
        return 'None'
    } else if (args[0].__repr__) {
        return args[0].__repr__()
    } else {
        return args[0].toString()
    }
}

repr.__doc__ = 'repr(object) -> string\n\nReturn the canonical string representation of the object.\nFor most object types, eval(repr(object)) === object.'
repr.$pyargs = true
