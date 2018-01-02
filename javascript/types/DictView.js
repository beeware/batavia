import { PyObject } from '../core/types/object'
import { create_pyclass } from '../core/types/types'

/*************************************************************************
 * A Python dictview type
 *************************************************************************/

export default function DictView(args, kwargs) {
    PyObject.call(this)
}

create_pyclass(DictView, 'dictview')
