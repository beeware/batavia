import JSDict from '../core/JSDict'
import { jstype } from '../core/types'

/*************************************************************************
 * A Python module type
 *************************************************************************/

class Module extends JSDict {
    constructor(name, filename, pkg) {
        super()

        this.__name__ = name
        this.__file__ = filename
        this.__package__ = pkg
    }
}

export default function pymodule(name, filename, pkg) {
    return new Module(name, filename, pkg)
}
