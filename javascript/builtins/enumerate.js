import { pyargs } from '../core/callables'
import { create_pyclass, PyObject } from '../core/types'

import * as types from '../types'

/**************************************************
 * Enumerate
 **************************************************/

class PyEnumerate extends PyObject {
    @pyargs({
        args: ['iterable'],
        default_args: ['start']
    })
    __init__(iterable, start) {
        this.iterator = iterable.__iter__([])
        this.count = 0
    }

    __next__() {
        var item = this.iterator.__next__([])
        var index = new types.PyInt(this.count)
        this.count += 1

        return new types.PyTuple([index, item])
    }

    __iter__() {
        return this
    }

    __str__() {
        return '<enumerate object at 0x99999999>'
    }
}
PyEnumerate.prototype.__doc__ = `enumerate(iterable[, start]) -> iterator for index, value of iterable

Return an enumerate object.  iterable must be another object that supports
iteration.  The enumerate object yields pairs containing a count (from
start, which defaults to zero) and a value yielded by the iterable argument.
enumerate is useful for obtaining an indexed list:
    (0, seq[0]), (1, seq[1]), (2, seq[2]), ...`
create_pyclass(PyEnumerate, 'enumerate')

var enumerate = PyEnumerate.__class__

export default enumerate
