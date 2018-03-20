import * as types from '../types'

export default function list(iterable) {
    if (iterable === undefined) {
        return types.pylist()
    }
    return types.pylist(iterable)
}

list.__name__ = 'list'
list.__doc__ = `list() -> new empty list

list(iterable) -> new list initialized from iterable's items`
list.$pyargs = {
    args: ['iterable']
}
