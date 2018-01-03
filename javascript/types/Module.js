import { create_pyclass } from '../core/types'

import JSDict from './JSDict'

/*************************************************************************
 * A Python module type
 *************************************************************************/

export default function Module(name, filename, pkg) {
    JSDict.call(this)

    this.__name__ = name
    this.__file__ = filename
    this.__package__ = pkg
}

Module.prototype = Object.create(JSDict.prototype)

create_pyclass(Module, 'module', true)
