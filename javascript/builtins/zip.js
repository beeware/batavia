import { BataviaError, TypeError } from '../core/exceptions'
import * as types from '../types'

export default function zip(iters) {
    return new types.PyZip(...iters)
}

zip.__doc__ = 'zip(iter1 [,iter2 [...]]) --> zip object\n\nReturn a zip object whose .__next__() method returns a tuple where\nthe i-th element comes from the i-th iterable argument.  The .__next__()\nmethod continues until the shortest iterable in the argument sequence\nis exhausted and then it raises StopIteration.'
zip.$pyargs = {
    varargs: ['iters']
}
