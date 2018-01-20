import { TypeError } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

export default function type(object_or_name, bases, dict) {
    if (object_or_name !== undefined && bases === undefined && dict === undefined) {
        return object_or_name.__class__
    } else if (object_or_name !== undefined && bases !== undefined && dict !== undefined) {
        let NewClass = class extends PyObject {}
        let new_type = create_pyclass(NewClass, object_or_name, bases, {})

        for (var attr in dict) {
            if (dict.hasOwnProperty(attr)) {
                NewClass.prototype[attr] = dict[attr]
            }
        }
        return new_type
    } else {
        throw new TypeError('type() takes 1 or 3 arguments')
    }
}

type.__doc__ = "type(object_or_name, bases, dict)\ntype(object) -> the object's type\ntype(name, bases, dict) -> a new type"
type.$pyargs = {
    args: ['object_or_name'],
    default_args: ['bases', 'dict']
}
