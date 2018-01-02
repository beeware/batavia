import { PyObject } from '../core/types/object'
import { create_pyclass } from '../core/types/types'

/*************************************************************************
 * A Python ellipsis type
 *************************************************************************/

export default function Ellipsis(args, kwargs) {
    PyObject.call(this)
}

create_pyclass(Ellipsis, 'ellipsis')
