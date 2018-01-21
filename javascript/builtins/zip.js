import * as types from '../types'

export default function zip(iters) {
    return new types.PyZip(...iters)
}

zip.__name__ = 'zip'
zip.__doc__ = `zip(iter1 [,iter2 [...]]) --> zip object

Return a zip object whose .__next__() method returns a tuple where
the i-th element comes from the i-th iterable argument.  The .__next__()
method continues until the shortest iterable in the argument sequence
is exhausted and then it raises StopIteration.`
zip.$pyargs = {
    varargs: ['iters']
}
