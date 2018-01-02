import { BataviaError, TypeError } from '../core/exceptions'
import * as types from '../types'

export default function zip(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError.$pyclass('zip() does not take keyword arguments')
    }

    return new types.Zip(args, kwargs)
}

zip.__doc__ = 'zip(iter1 [,iter2 [...]]) --> zip object\n\nReturn a zip object whose .__next__() method returns a tuple where\nthe i-th element comes from the i-th iterable argument.  The .__next__()\nmethod continues until the shortest iterable in the argument sequence\nis exhausted and then it raises StopIteration.'
zip.$pyargs = true
