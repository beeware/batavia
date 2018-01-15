import { NotImplementedError } from '../core/exceptions'

export default function memoryview(args, kwargs) {
    throw new NotImplementedError("Builtin Batavia function 'memoryview' not implemented")
}

memoryview.__doc__ = 'memoryview(object)\n\nCreate a new memoryview object which references the given object.'
memoryview.$pyargs = true
