import * as exceptions from '../core/exceptions'
import * as types from '../types'
import * as callables from '../core/callables'

export default function reversed(sequence) {
    if (sequence.__reversed__) {
        return callables.call_method(sequence, '__reversed__', [])
    } else if (sequence.__len__ && sequence.__getitem__) {
        var new_sequence = sequence.slice(0)
        new_sequence.reverse()
        return new types.PyList(new_sequence)
    }

    throw new exceptions.NotImplementedError("Builtin Batavia function 'reversed' not implemented for objects")
}

reversed.__doc__ = 'reversed(sequence) -> reverse iterator over values of the sequence\n\nReturn a reverse iterator'
reversed.$pyargs = {
    args: ['sequence']
}
