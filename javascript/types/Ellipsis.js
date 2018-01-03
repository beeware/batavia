import { create_pyclass, PyObject } from '../core/types'

/*************************************************************************
 * A Python ellipsis type
 *************************************************************************/

export default function Ellipsis(args, kwargs) {
    PyObject.call(this)
}

create_pyclass(Ellipsis, 'ellipsis')
