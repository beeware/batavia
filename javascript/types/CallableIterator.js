import { StopIteration } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

/**************************************************
 * Callable Iterator
 **************************************************/

export default function CallableIterator(callable, sentinel) {
    PyObject.call(this)
    this.callable = callable
    this.sentinel = sentinel
    this.exhausted = false
}

create_pyclass(CallableIterator, 'callable_iterator')

CallableIterator.prototype.__next__ = function() {
    if (this.exhausted) {
        throw new StopIteration.$pyclass()
    }

    var item = this.callable.__call__([])
    if (item.__eq__(this.sentinel)) {
        this.exhausted = true
        throw new StopIteration.$pyclass()
    }
    return item
}

CallableIterator.prototype.__iter__ = function() {
    return this
}

CallableIterator.prototype.__str__ = function() {
    return '<callable_iterator object at 0x99999999>'
}
