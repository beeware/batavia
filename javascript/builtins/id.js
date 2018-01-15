import { PolyglotError } from '../core/exceptions'

export default function id(object) {
    throw new PolyglotError("'id' has no meaning here. See docs/internals/limitations#id")
}

id.__doc__ = 'Return the identity of an object.  This is guaranteed to be unique among simultaneously existing objects.  (Hint: it\'s the object\'s memory address.)'
id.$pyargs = {
    args: ['object']
}
