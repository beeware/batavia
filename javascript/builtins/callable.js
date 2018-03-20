import * as types from '../types'

import { getattr } from '../builtins'

export default function callable(object) {
    if (getattr(object, '__call__', null)) {
        return types.pybool(true)
    } else {
        return types.pybool(false)
    }
}

callable.__name__ = 'callable'
callable.__doc__ = `callable(object) -> bool

Return whether the object is callable (i.e., some kind of function).
Note that classes are callable, as are instances of classes with a
__call__() method.`
callable.$pyargs = {
    args: ['object']
}
