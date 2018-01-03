import { create_pyclass } from '../core/types'
import Function from './Function'

/*************************************************************************
 * A Python method type
 *************************************************************************/

export default function Method(instance, func) {
    Function.call(
        this,
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

Method.prototype = Object.create(Function.prototype)
create_pyclass(Method, 'method', true)
