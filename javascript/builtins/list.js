import * as types from '../types'

export default function list(args) {
    if (!args || args.length === 0) {
        return new types.List()
    }
    return new types.List(args[0])
}

list.__doc__ = "list() -> new empty list\nlist(iterable) -> new list initialized from iterable's items"
list.$pyargs = true
