import { pyargs } from '../core/callables'
import { jstype, PyObject } from '../core/types'
import pyfunction from './Function'

/*************************************************************************
 * A Python method type
 *************************************************************************/

class Method extends PyObject {
    __init__(instance, func) {
        pyfunction.$pyclass.prototype.__init__.call(
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
    }

    @pyargs({})
    __repr__() {
        if (this.__self__) {
            return `<bound method ${this.__name__} of ${this.__self__.__repr__()}>`
        } else {
            return `<${this.__class__.__name__} object at 0x99999999>`
        }
    }

}

const pymethod = jstype(Method, 'method', [pyfunction], {})
export default pymethod
