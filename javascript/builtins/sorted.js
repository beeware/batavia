import { NotImplementedError } from '../core/exceptions'
import { PyNone } from '../core/types'

import * as types from '../types'

export default function sorted(iterable, key = PyNone, reverse = false) {
    function preparingFunction(value) {
        return {
            'key': value,
            'value': value
        }
    }

    if (types.isinstance(iterable, [types.PyList, types.PyTuple])) {
        iterable = iterable.map(preparingFunction)
        iterable.sort(function(a, b) {
            // TODO: Replace this with a better, guaranteed stable sort.
            // Javascript's default sort has performance problems in some
            // implementations and is not guaranteed to be stable, while
            // CPython's sorted is stable and efficient. See:
            // * https://docs.python.org/3/library/functions.html#sorted
            // * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

            // Order of conditions does matter here.
            // Because if we get unorderable types, CPython gives always '<' in Exception:
            // TypeError: unorderable types: str() < int()
            if (a['key'].__lt__(b['key'])) {
                if (reverse) {
                    return 1
                } else {
                    return -1
                }
            }

            if (a['key'].__gt__(b['key'])) {
                if (reverse) {
                    return -1
                } else {
                    return 1
                }
            }
            return 0
        })

        return new types.PyList(iterable.map(function(element) {
            return element['value']
        }))
    }

    throw new NotImplementedError("Builtin Batavia function 'sorted' not implemented for objects")
}

sorted.__doc__ = `sorted(iterable, key=None, reverse=False) --> new sorted list`
sorted.$pyargs = {
    args: ['iterable'],
    default_args: ['key', 'reverse']
}
