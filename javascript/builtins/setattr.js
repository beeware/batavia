import { TypeError } from '../core/exceptions'
import * as native from '../core/native'

export default function setattr(args, kwargs) {
    if (args.length !== 3) {
        throw new TypeError.$pyclass('setattr expected exactly 3 arguments, got ' + args.length)
    }

    if (args[0].__setattr__ === undefined) {
        native.setattr(args[0], args[1], args[2])
    } else {
        args[0].__setattr__(args[1], args[2])
    }
}

setattr.__doc__ = "setattr(object, name, value)\n\nSet a named attribute on an object; setattr(x, 'y', v) is equivalent to\n``x.y = v''."
setattr.$pyargs = true
