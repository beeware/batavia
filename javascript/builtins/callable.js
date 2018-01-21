import * as types from '../types'

export default function callable(object) {
    if ((object instanceof Function) || (object instanceof types.PyFunction) || (object instanceof types.PyType)) {
        return new types.PyBool(true)
    } else {
        return new types.PyBool(false)
    }
}

callable.__doc__ = `callable(object) -> bool

Return whether the object is callable (i.e., some kind of function).
Note that classes are callable, as are instances of classes with a
__call__() method.`
callable.$pyargs = {
    args: ['object']
}
