import { NotImplementedError } from '../core/exceptions'

export default function memoryview(object) {
    throw new NotImplementedError("Builtin Batavia function 'memoryview' not implemented")
}

memoryview.__doc__ = 'memoryview(object)\n\nCreate a new memoryview object which references the given object.'
memoryview.$pyargs = {
    args: ['object']
}
