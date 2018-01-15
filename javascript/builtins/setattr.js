import * as native from '../core/native'

export default function setattr(object, name, value) {
    if (object.__setattr__ === undefined) {
        native.setattr(object, name, value)
    } else {
        object.__setattr__(name, value)
    }
}

setattr.__doc__ = "setattr(object, name, value)\n\nSet a named attribute on an object; setattr(x, 'y', v) is equivalent to\n``x.y = v''."
setattr.$pyargs = {
    args: ['object', 'name', 'value']
}
