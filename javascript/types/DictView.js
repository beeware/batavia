import { create_pyclass, PyObject } from '../core/types'

/*************************************************************************
 * A Python dictview type
 *************************************************************************/

export default function DictView(args, kwargs) {
    PyObject.call(this)
}

create_pyclass(DictView, 'dictview')
