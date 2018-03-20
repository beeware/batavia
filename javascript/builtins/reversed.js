import { pyNotImplementedError } from '../core/exceptions'

import * as types from '../types'

export default function reversed(sequence) {
    if (sequence.__reversed__) {
        return sequence.__reversed__()
    } else if (sequence.__len__ && sequence.__getitem__) {
        var new_sequence = sequence.slice(0)
        new_sequence.reverse()
        return types.pylist(new_sequence)
    }

    throw pyNotImplementedError("Builtin Batavia function 'reversed' not implemented for objects")
}

reversed.__name__ = 'reversed'
reversed.__doc__ = `reversed(sequence) -> reverse iterator over values of the sequence

Return a reverse iterator`
reversed.$pyargs = {
    args: ['sequence'],
    missing_args_error: (e) => `reversed expected 1 arguments, got ${e.given}`
}
