import { PyStopIteration, PyTypeError } from '../core/exceptions'
import { call_function, call_method } from '../core/callables'
import { create_pyclass, type_name, PyObject } from '../core/types'

/**************************************************
 * Callable Iterator
 **************************************************/

class PyCallableIterator extends PyObject {
    constructor(callable, sentinel) {
        super()
        this.callable = callable
        this.sentinel = sentinel
        this.exhausted = false
    }

    __next__() {
        if (this.exhausted) {
            throw new PyStopIteration()
        }

        var item = call_function(this, this.callable)
        if (item.__eq__(this.sentinel)) {
            this.exhausted = true
            throw new PyStopIteration()
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
create_pyclass(PyCallableIterator, 'callable_iterator')


export default function iter(iterable, sentinel) {
    if (sentinel !== undefined) {
        return new PyCallableIterator(iterable, sentinel)
    } else {
        try {
            return call_method(iterable, '__iter__', [])
        } catch (e) {
            throw new PyTypeError("'" + type_name(iterable) + "' object is not iterable")
        }
    }
}

iter.__name__ = 'iter'
iter.__doc__ = `iter(iterable) -> iterator
iter(callable, sentinel) -> iterator

Get an iterator from an object.  In the first form, the argument must
supply its own iterator, or be a sequence.
In the second form, the callable is called until it returns the sentinel.`
iter.$pyargs = {
    args: ['iterable'],
    default_args: ['sentinel']
}
