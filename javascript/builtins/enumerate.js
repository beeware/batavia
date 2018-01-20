import * as types from '../types'

export default function enumerate(iterable, start) {
    return new types.PyEnumerate(iterable)
}

enumerate.__doc__ = 'enumerate(iterable[, start]) -> iterator for index, value of iterable\n\nReturn an enumerate object.  iterable must be another object that supports\niteration.  The enumerate object yields pairs containing a count (from\nstart, which defaults to zero) and a value yielded by the iterable argument.\nenumerate is useful for obtaining an indexed list:\n    (0, seq[0]), (1, seq[1]), (2, seq[2]), ...'
enumerate.$pyargs = {
    args: ['iterable'],
    default_args: ['start']
}
