import * as types from '../types'

export default function list(args) {
    if (!args || args.length === 0) {
        return new types.PyList()
    }
    return new types.PyList(args[0])
}

list.__name__ = 'list'
list.__doc__ = `list() -> new empty list

list(iterable) -> new list initialized from iterable's items`
list.$pyargs = true
