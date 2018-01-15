import { StopIteration } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

/**************************************************
 * Callable Iterator
 **************************************************/

export default class CallableIterator extends PyObject {
    constructor(callable, sentinel) {
        super()
        this.callable = callable
        this.sentinel = sentinel
        this.exhausted = false
    }

    __next__() {
        if (this.exhausted) {
            throw new StopIteration()
        }

        var item = this.callable.__call__([])
        if (item.__eq__(this.sentinel)) {
            this.exhausted = true
            throw new StopIteration()
        }
        return item
    }

    __iter__() {
        return this
    }

    __str__() {
        return '<callable_iterator object at 0x99999999>'
    }
}
create_pyclass(CallableIterator, 'callable_iterator')
