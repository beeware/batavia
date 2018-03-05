import { PyNotImplementedError } from '../core/exceptions'

export default function memoryview(object) {
    throw new PyNotImplementedError("Builtin Batavia function 'memoryview' not implemented")
}

memoryview.__name__ = 'memoryview'
memoryview.__doc__ = `memoryview(object)

Create a new memoryview object which references the given object.`
memoryview.$pyargs = {
    args: ['object']
}
