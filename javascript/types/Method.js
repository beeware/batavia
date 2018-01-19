import { create_pyclass, PyObject } from '../core/types'
import Function from './Function'

/*************************************************************************
 * A Python method type
 *************************************************************************/

export default class Method extends PyObject {
    constructor(instance, func) {
        super(
            func.__name__,
            func.__code__,
            func.__globals__,
            func.__defaults__,
            func.__closure__,
            func.$vm
        )
        this.__self__ = instance
        this.__func__ = func
        this.__class__ = instance.__class__
    }
}
create_pyclass(Method, 'method', [Function])
