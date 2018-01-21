import * as types from '../types'

export default function enumerate(iterable, start) {
    return new types.PyEnumerate(iterable)
}

enumerate.__doc__ = `enumerate(iterable[, start]) -> iterator for index, value of iterable

Return an enumerate object.  iterable must be another object that supports
iteration.  The enumerate object yields pairs containing a count (from
start, which defaults to zero) and a value yielded by the iterable argument.
enumerate is useful for obtaining an indexed list:
    (0, seq[0]), (1, seq[1]), (2, seq[2]), ...`
enumerate.$pyargs = {
    args: ['iterable'],
    default_args: ['start']
}
