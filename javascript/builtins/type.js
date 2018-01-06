import { BataviaError, PyTypeError } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

import * as types from '../types'

export default function type(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError("type() doesn't accept keyword arguments")
    }
    if (!args || (args.length !== 1 && args.length !== 3)) {
        throw new PyTypeError('type() takes 1 or 3 arguments')
    }

    if (args.length === 1) {
        if (args[0] === null) {
            return types.PyNoneType
        } else {
            return args[0].__class__
        }
    } else {
        return (function(name, bases, dict) {
            var new_type = new types.PyType(args[0], Array.from(args[1]), args[2])

            var NewType = class extends PyObject {
                constructor() {
                    super()
                }
            }
            create_pyclass(NewType, name)

            for (var attr in dict) {
                if (dict.hasOwnProperty(attr)) {
                    NewType.prototype[attr] = dict[attr]
                }
            }

            return new_type
        }(args[0], args[1], args[2]))
    }
}

type.__doc__ = "type(object_or_name, bases, dict)\ntype(object) -> the object's type\ntype(name, bases, dict) -> a new type"
type.$pyargs = true
