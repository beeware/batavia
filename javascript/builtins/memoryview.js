import { pyNotImplementedError } from '../core/exceptions'

export default function memoryview(object) {
    throw pyNotImplementedError("Builtin Batavia function 'memoryview' not implemented")
}

memoryview.__name__ = 'memoryview'
memoryview.__doc__ = `memoryview(object)

Create a new memoryview object which references the given object.`
memoryview.$pyargs = {
    args: ['object']
}
