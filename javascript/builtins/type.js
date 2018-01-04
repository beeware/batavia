import { BataviaError, TypeError } from '../core/exceptions'
import { PyObject } from '../core/types'

import * as types from '../types'

export default function type(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError("type() doesn't accept keyword arguments")
    }
    if (!args || (args.length !== 1 && args.length !== 3)) {
        throw new TypeError('type() takes 1 or 3 arguments')
    }

    if (args.length === 1) {
        if (args[0] === null) {
            return types.NoneType
        } else {
            return args[0].__class__
        }
    } else {
        return (function(name, bases, dict) {
            var new_type = new types.Type(args[0], Array.from(args[1]), args[2])

            function NewType() {
                PyObject.call(this)
            }

            NewType.prototype = PyObject.create(PyObject.prototype)
            NewType.prototype.__class__ = new_type

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
