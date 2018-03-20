import { pyTypeError } from '../core/exceptions'

import { isinstance, pystr } from '../types'

export default function setattr(obj, attr, value) {
    if (!isinstance(attr, pystr)) {
        throw pyTypeError('setattr(): attribute name must be string')
    }

    obj[attr] = value
}

setattr.__name__ = 'setattr'
setattr.__doc__ = `setattr(object, name, value)

Set a named attribute on an object; setattr(x, 'y', v) is equivalent to
\`\`x.y = v''.`
setattr.$pyargs = {
    args: ['obj', 'attr', 'value'],
    missing_args_error: (e) => `setattr expected 3 arguments, got ${e.given}`
}
